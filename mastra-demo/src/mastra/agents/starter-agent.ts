// src/mastra/agents/starter-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { pica, picaTools } from "../tools/pica-tools";
import { starterWorkflow } from "../workflows/starter-workflow";

// Generating the system prompt from Pica (same as project assistant)
const systemPrompt = await pica.generateSystemPrompt();

// Creating memory instance for the starter agent
const starterMemory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra-starter-memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:./mastra-starter-memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 10, // Keep last 10 messages in context
    semanticRecall: {
      topK: 3, // Retrieve 3 most similar messages
      messageRange: 2, // Include 2 messages before and after each match
      scope: 'resource', // Search across all threads for the same user
    },
    workingMemory: {
      enabled: true,
      scope: 'resource', // Persist memory across all user conversations
      template: `# Available Connections
- **Total Connections**: 
- **Key Platforms**: 
- **Frequently Used Tools**: 
- **Last Connection Check**: 

# User Preferences
- **Name**: 
- **Preferred Platforms**: 
- **Common Tasks**: 
- **Workflow Patterns**: 

# Recent Activities
- **Last Tasks Completed**: 
- **Tools Used**: 
- **Workflows Run**: 
- **Follow-up Needed**: 

# Learning & Patterns
- **Successful Workflows**: 
- **Preferred Integrations**: 
- **Areas of Interest**: 
`,
    },
    threads: {
      generateTitle: true, // Auto-generate thread titles
    },
  },
});

export const starterAgent = new Agent({
  name: 'Starter Agent',
  instructions: `
    ${systemPrompt}
    
    You are a starter agent demonstrating Mastra + Pica integration.
    You have access to all connected Pica integrations, a simple workflow, and persistent memory.
    
    Your capabilities:
    - Access to all connected Pica tools and services
    - Can run the starter workflow to discover available connections
    - Can perform tasks using any connected integration (GitHub, Slack, Firecrawl, etc.)
    - Remember user preferences, past conversations, and successful patterns
    
    Memory usage:
    - Remember which connections the user has and uses most often
    - Track successful workflows and task patterns
    - Maintain context about user preferences and common requests
    - Learn from past interactions to provide better suggestions
    
    Key features:
    - Use tools directly for specific tasks (search, create, update, etc.)
    - Run the starter workflow to get an overview of available connections
    - Provide helpful suggestions based on available integrations and past usage
    - Remember what worked well before and suggest similar approaches
    
    When users ask about:
    - "What connections do I have?" - Run the starter workflow and update memory
    - Specific tasks - Use appropriate Pica tools and remember successful patterns
    - Platform capabilities - Explain what's possible and recall past usage
    - Repeated requests - Reference previous successful approaches from memory
    
    Always update your working memory with:
    - Connection information discovered
    - Tools and workflows used successfully
    - User preferences and patterns observed
    - Tasks completed and their outcomes
    
    Be helpful, remember context, and suggest practical next steps based on past interactions.
  `,
  model: openai('gpt-4o-mini'),
  memory: starterMemory, // Adding memory to the agent
  tools: picaTools, // Access to ALL Pica integrations
  workflows: {
    starterWorkflow, // Access to our simple workflow
  },
});