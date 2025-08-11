// src/mastra/index.ts
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

// Importing existing agents
import { projectAssistantAgent } from './agents/project-assistant-agent';
import { codeReviewerAgent } from './agents/code-reviewer-agent';
import { superAgent } from './agents/super-agent';
import { starterAgent } from './agents/starter-agent';

// Importing workflows
import { starterWorkflow } from './workflows/starter-workflow';

export const mastra = new Mastra({
  // Including all agents
  agents: { 
    projectAssistantAgent, 
    codeReviewerAgent, 
    superAgent,
    starterAgent, 
  },
  
  // Including workflows
  workflows: {
    starterWorkflow, // Simple, stable workflow
  },
  
  // Persistent storage for telemetry, evals, agent memory, and workflow state
  storage: new LibSQLStore({
    url: "file:./mastra.db", // Using persistent file storage
  }),
  
  // Structured logging
  logger: new PinoLogger({
    name: 'Mastra-Pica-App',
    level: 'info',
  }),
});