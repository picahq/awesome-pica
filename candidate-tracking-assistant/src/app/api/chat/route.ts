import { Pica } from "@picahq/ai";
import { convertToCoreMessages, Message, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { candidateTrackingPrompt } from "@/lib/prompts/candidate-tracking";
export async function POST(request: Request) {

    const { messages }: { messages: Message[] } = await request.json(); 

    const secretKey = process.env.NEXT_PUBLIC_PICA_SECRET_KEY;

    const pica = new Pica(secretKey as string, {
        connectors: ["*"]
    });

    const prompt = candidateTrackingPrompt.replace(/AIRTABLE_BASE_ID/g, process.env.AIRTABLE_BASE_ID as string).replace(/AIRTABLE_TABLE_ID/g, process.env.AIRTABLE_TABLE_ID as string);

    const system = await pica.generateSystemPrompt(prompt);

    const stream = streamText({
        model: openai("gpt-4o"),
        system,
        tools: {
            ...pica.oneTool,
        },
        messages: convertToCoreMessages(messages),
        maxSteps: 20
    })

    return (await stream).toDataStreamResponse();

}