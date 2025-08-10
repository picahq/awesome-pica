// src/mastra/workflows/starter-workflow.ts
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { listAllConnections } from "../tools/pica-tools";

// Simple connection discovery step - no complex streaming, just basic functionality
const discoverConnectionsStep = createStep({
  id: "discover-connections",
  description: "Discover available Pica connections",
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalConnections: z.number(),
    availablePlatforms: z.array(z.string()),
    summary: z.string(),
    hasFirecrawl: z.boolean(),
    hasGitHub: z.boolean(),
    hasSlack: z.boolean(),
  }),
  execute: async () => {
    try {
      console.log("🔍 Discovering Pica connections...");
      
      const connections = await listAllConnections();
      
      const availablePlatforms = [...new Set(
        connections.map((conn: any) => conn.platform).filter(Boolean)
      )] as string[];

      const hasFirecrawl = availablePlatforms.includes("firecrawl");
      const hasGitHub = availablePlatforms.includes("github");
      const hasSlack = availablePlatforms.includes("slack");

      const summary = `Found ${connections.length} connections across ${availablePlatforms.length} platforms`;

      console.log(`✅ ${summary}`);
      
      return {
        totalConnections: connections.length,
        availablePlatforms,
        summary,
        hasFirecrawl,
        hasGitHub,
        hasSlack,
      };
    } catch (error) {
      console.error("❌ Connection discovery failed:", error);
      
      return {
        totalConnections: 0,
        availablePlatforms: [],
        summary: `Connection discovery failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        hasFirecrawl: false,
        hasGitHub: false,
        hasSlack: false,
      };
    }
  },
});

// Simple workflow - just one step to keep it stable and basic
export const starterWorkflow = createWorkflow({
  id: "mastra-pica-starter",
  description: "Simple starter template showing Mastra + Pica integration",
  inputSchema: z.object({}),
  outputSchema: z.object({
    connectionSummary: z.string(),
    totalConnections: z.number(),
    availablePlatforms: z.array(z.string()),
    recommendations: z.array(z.string()),
    success: z.boolean(),
  }),
})
  .then(discoverConnectionsStep)
  .map(async ({ getStepResult }) => {
    const result = getStepResult(discoverConnectionsStep);
    
    // Generate simple recommendations
    const recommendations: string[] = [];
    
    if (result?.totalConnections === 0) {
      recommendations.push("Add connections at https://app.picaos.com");
    } else {
      recommendations.push(`You have ${result.totalConnections} connections ready to use!`);
    }
    
    if (result?.hasFirecrawl) {
      recommendations.push("Firecrawl detected - great for web scraping");
    }
    
    if (result?.hasGitHub) {
      recommendations.push("GitHub detected - perfect for repository automation");
    }
    
    if (result?.hasSlack) {
      recommendations.push("Slack detected - ideal for notifications");
    }
    
    recommendations.push("Use picaTools in your agents to access these integrations");
    recommendations.push("Extend this workflow with your own business logic");

    return {
      connectionSummary: result?.summary || "No connection data",
      totalConnections: result?.totalConnections || 0,
      availablePlatforms: result?.availablePlatforms || [],
      recommendations,
      success: (result?.totalConnections || 0) > 0,
    };
  })
  .commit();