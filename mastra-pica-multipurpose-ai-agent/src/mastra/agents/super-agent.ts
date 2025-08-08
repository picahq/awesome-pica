// src/mastra/agents/super-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Pica } from "@picahq/ai";

// Initialize Pica
const pica = new Pica(process.env.PICA_SECRET!, {
  connectors: ["*"]
});

// Get the system prompt from Pica
const systemPrompt = await pica.generateSystemPrompt();

export const superAgent = new Agent({
  name: 'Super Agent',
  instructions: `
    ${systemPrompt}
    
    You are a powerful assistant with access to many integrations.
    You can interact with GitHub, Google Drive, Slack, HubSpot, and more.
    Use your tools wisely to help users accomplish their tasks.
  `,
  model: openai('gpt-4o-mini'),
  tools: pica.oneTool // Use Pica's tools directly
});