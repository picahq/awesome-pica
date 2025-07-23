import { google } from "@ai-sdk/google"; // <-- NEW
import { CoreMessage, streamText } from "ai";
import { Pica } from "@picahq/ai";
import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/", async (req: Request, res: Response) => {
    try {
        const { message } = req.body;

        const messages: CoreMessage[] = [{
            role: "user",
            content: message
        }];

        const pica = new Pica(process.env.PICA_SECRET_KEY as string);
        const systemPrompt = await pica.generateSystemPrompt();

        const stream = await streamText({
            model: google("gemini-2.5-pro"), // <-- UPDATED
            system: systemPrompt,
            tools: { ...pica.oneTool },
            messages,
            maxSteps: 10,
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        if (!stream.textStream) {
            throw new Error("Stream does not support text streaming.");
        }

        for await (const chunk of stream.textStream) {
            res.write(`data: ${chunk}\n\n`);
        }
        res.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
