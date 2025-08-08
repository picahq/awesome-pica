
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { projectAssistantAgent } from './agents/project-assistant-agent';
import { codeReviewerAgent } from './agents/code-reviewer-agent';
import { superAgent } from './agents/super-agent';

export const mastra = new Mastra({
  agents: { projectAssistantAgent, codeReviewerAgent, superAgent },
  storage: new LibSQLStore({
    // Use persistent file storage for telemetry, evals, and agent memory
    url: "file:./mastra.db",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
