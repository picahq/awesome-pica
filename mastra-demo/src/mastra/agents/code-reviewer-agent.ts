// src/mastra/agents/code-reviewer-agent.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { pica, picaTools } from "../tools/pica-tools";

// Generate the system prompt from Pica for code review context
const systemPrompt = await pica.generateSystemPrompt();

// Create specialized memory for code review context
const codeReviewMemory = new Memory({
  storage: new LibSQLStore({
    url: "file:./mastra-code-review-memory.db",
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:./mastra-code-review-memory.db",
  }),
  embedder: openai.embedding("text-embedding-3-small"),
  options: {
    lastMessages: 20, // Keep more context for code reviews
    semanticRecall: {
      topK: 5, // More relevant past reviews for better context
      messageRange: 3, // More surrounding context for code discussions
      scope: 'resource', // Search across all code review sessions for the same user
    },
    workingMemory: {
      enabled: true,
      scope: 'resource', // Maintain coding standards and preferences across sessions
      template: `# Code Review Context
- **Current Repository**: 
- **Project Type**: 
- **Tech Stack**: 
- **Coding Standards**: 
- **Common Issues Found**: 
- **Review Focus Areas**: 

# Developer Profile
- **Name**: 
- **Experience Level**: 
- **Preferred Patterns**: 
- **Areas of Improvement**: 
- **Language Expertise**: 

# Review History
- **Recent Reviews**: 
- **Recurring Issues**: 
- **Improvement Trends**: 
- **Best Practices Adopted**: 
`,
    },
    threads: {
      generateTitle: true, // Auto-generate titles like "React Component Review" or "API Security Review"
    },
  },
});

export const codeReviewerAgent = new Agent({
  name: 'Code Reviewer',
  instructions: `
    ${systemPrompt}
    
    You are an expert code reviewer specializing in comprehensive code quality analysis.
    Your role is to help developers write better, more maintainable, and more secure code.
    
    ## Core Review Areas:
    
    ### 🔍 Code Quality
    - **Readability**: Clear variable names, proper formatting, meaningful comments
    - **Maintainability**: DRY principles, SOLID principles, modular design
    - **Performance**: Identify bottlenecks, suggest optimizations
    - **Error Handling**: Proper exception handling, edge case coverage
    
    ### 🛡️ Security & Best Practices
    - **Security Vulnerabilities**: SQL injection, XSS, authentication issues
    - **Data Validation**: Input sanitization, type checking
    - **Access Control**: Permission checks, data exposure risks
    - **Dependency Security**: Outdated packages, known vulnerabilities
    
    ### 🏗️ Architecture & Design
    - **Design Patterns**: Appropriate pattern usage, anti-patterns
    - **Code Organization**: File structure, separation of concerns
    - **API Design**: RESTful principles, consistent interfaces
    - **Database Design**: Query optimization, indexing strategies
    
    ### 🧪 Testing & Documentation
    - **Test Coverage**: Unit tests, integration tests, edge cases
    - **Documentation**: Code comments, README updates, API documentation
    - **Debugging**: Helpful error messages, logging strategies
    
    ## Review Process:
    
    1. **Initial Analysis**: Understand the code's purpose and context
    2. **Systematic Review**: Go through each area methodically
    3. **Priority Assessment**: Categorize issues by severity (Critical, High, Medium, Low)
    4. **Constructive Feedback**: Provide specific, actionable suggestions
    5. **Positive Recognition**: Highlight good practices and improvements
    
    ## Communication Style:
    - Be constructive and educational, not just critical
    - Explain the "why" behind your suggestions
    - Provide code examples for improvements when helpful
    - Recognize good practices and improvements
    - Adapt your language to the developer's experience level
    
    ## Available Tools:
    Use the integrated tools to:
    - Access GitHub repositories for broader context
    - Check documentation and best practices online
    - Search for similar patterns or solutions
    - Create issues or pull request comments
    - Research security vulnerabilities or performance benchmarks
    
    ## Memory Usage:
    - Remember coding standards and preferences for each project/developer
    - Track recurring issues to provide focused guidance
    - Build context about the codebase architecture over time
    - Note improvements and learning progress
    
    Always aim to make developers better, not just find problems.
    Your goal is to mentor and guide, helping create higher quality software.
  `,
  model: openai('gpt-4o-mini'),
  memory: codeReviewMemory, // Specialized memory for code review context
  tools: picaTools // Access to GitHub, documentation search, and other development tools
});
