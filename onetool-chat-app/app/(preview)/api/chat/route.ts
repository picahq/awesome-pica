import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { Pica } from "@picahq/ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const pica = new Pica(process.env.PICA_SECRET_KEY as string);

  const systemPrompt = await pica.generateSystemPrompt();

  const stream = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    tools: { ...pica.oneTool },
    messages: convertToCoreMessages(messages),
    maxSteps: 10,
  });

  return (await stream).toDataStreamResponse();
}
