// src/mastra/agents/project-assistant-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { pica, picaTools } from "../tools/pica-tools";

// Generate the system prompt from Pica
const systemPrompt = await pica.generateSystemPrompt();

// Create memory instance with working memory and semantic recall
const memory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra-memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:./mastra-memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 15, // Keep last 15 messages in context
    semanticRecall: {
      topK: 3, // Retrieve 3 most similar messages
      messageRange: 2, // Include 2 messages before and after each match
      scope: 'resource', // Search across all threads for the same user
    },
    workingMemory: {
      enabled: true,
      scope: 'resource', // Persist memory across all user conversations
      template: `# Project Context
- **Current Project**: 
- **Project Goals**: 
- **Active Tasks**: 
- **Team Members**: 
- **Important Deadlines**: 

# User Profile
- **Name**: 
- **Role**: 
- **Preferences**: 
- **Communication Style**: 

# Recent Interactions
- **Last Action Taken**: 
- **Follow-up Needed**: 
- **Key Decisions Made**: 
`,
    },
    threads: {
      generateTitle: true, // Auto-generate thread titles
    },
  },
});

export const projectAssistantAgent = new Agent({
  name: 'Project Assistant',
  instructions: `
    ${systemPrompt}
    
    You are a helpful project assistant that can interact with various tools and services.
    You have access to GitHub, Google Drive, Slack, and many other integrations.
    
    Use your memory to maintain context about:
    - The user's current projects and goals
    - Previously completed tasks and decisions
    - Team member information and communication preferences
    - Important deadlines and project milestones
    
    When asked to find information, use the appropriate search tools.
    When asked to create tasks or issues, use the relevant creation tools.
    Always provide clear summaries of actions taken and suggest next steps.
    
    Update your working memory with relevant project information, user preferences, and context that will be useful in future conversations.
  `,
  model: openai('gpt-4o-mini'),
  memory, // Add memory to the agent
  tools: picaTools // Use all Pica tools directly
});
