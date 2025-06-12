// Backend code (POST function)
import { Pica } from "@picahq/ai";
import { convertToCoreMessages, Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { candidateTrackingPrompt } from "@/lib/prompts/candidate-tracking";

export async function POST(request: Request) {
    try {
        const { messages, messageId }: { messages: Message[]; messageId: string } = await request.json();



        if (!messageId) {
            return new Response("Error: messageId is required", { status: 400 });
        }
        const secretKey = process.env.PICA_SECRET_KEY;


        if (!secretKey) {
            console.error("PICA_SECRET_KEY is not configured");
            return new Response("Error: PICA_SECRET_KEY is not configured", { status: 500 });
        }

        const pica = new Pica(secretKey, {
            connectors: ["*"],

        });

        const airtableBaseId = process.env.AIRTABLE_BASE_ID;
        const airtableTableId = process.env.AIRTABLE_TABLE_ID;

        if (!airtableBaseId || !airtableTableId) {
            console.error("Airtable IDs not configured");
            return new Response("Error: Airtable IDs not configured", { status: 500 });
        }



        const prompt = candidateTrackingPrompt
            .replace(/AIRTABLE_BASE_ID/g, airtableBaseId)
            .replace(/AIRTABLE_TABLE_ID/g, airtableTableId)
            .replace(/MESSAGE_ID/g, messageId);


        const system = await pica.generateSystemPrompt(prompt);



        const stream = streamText({
            model: openai("gpt-4.1"),
            system,
            tools: {
                ...pica.oneTool,
            },
            messages: convertToCoreMessages(messages),
            maxSteps: 20
        });

        return (await stream).toDataStreamResponse();
    } catch (error) {
        console.dir(error, { depth: null });
        return new Response(
            JSON.stringify({ error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
