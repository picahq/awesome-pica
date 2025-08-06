// src/mastra/tools/pica-tools.ts
import { Pica } from "@picahq/ai";

// Initialize Pica
const pica = new Pica(process.env.PICA_SECRET!, {
  connectors: ["*"], // Enable all connectors
});

// Export Pica tools directly for use with Mastra
export const picaTools = pica.oneTool;

// Export the Pica instance for generating system prompts
export { pica };