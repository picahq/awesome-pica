import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { Pica } from "@picahq/ai";
import express, { Request, Response } from "express";
import dotenv from "dotenv"

dotenv.config();

const app = express();
app.use(express.json());

const handlePostRequest = async (req: Request, res: Response) => {
    try {
        let { messages } = req.body;

        messages = JSON.parse(messages);

        const pica = new Pica(process.env.PICA_SECRET_KEY as string);

        const systemPrompt = await pica.generateSystemPrompt();

        const stream = await streamText({
            model: openai("gpt-4o"),
            system: systemPrompt,
            tools: { ...pica.oneTool },
            messages: convertToCoreMessages(messages),
            maxSteps: 10,
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Use the `textStream` as an async iterable
        if (stream.textStream) {
            for await (const chunk of stream.textStream) {
                res.write(`data: ${chunk}\n\n`);
            }
            res.end();
        } else {
            throw new Error("Stream does not support text streaming.");
        }
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while processing your request." });
    }
};

app.post("/api", handlePostRequest);

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});