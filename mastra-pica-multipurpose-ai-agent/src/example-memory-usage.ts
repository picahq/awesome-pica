// Example of how to use the Project Assistant Agent with Memory
import { mastra } from './mastra';

async function exampleMemoryUsage() {
  const agent = mastra.getAgent('projectAssistantAgent');
  
  // Important: Memory requires both resourceId and threadId
  const resourceId = 'user-123'; // User identifier
  const threadId = 'project-discussion-456'; // Conversation thread identifier
  
  try {
    console.log('🤖 Starting conversation with Project Assistant Agent...');
    
    // First interaction - agent will learn about the user and project
    const response1 = await agent.generate(
      "Hi, I'm John Doe, the product manager for our new mobile app project. We're building an iOS and Android app for task management and our main goal is to launch by March 2024.",
      {
        resourceId,
        threadId,
      }
    );
    console.log('Agent Response 1:', response1.text);
    
    // Second interaction - agent should remember the user and project context
    const response2 = await agent.generate(
      "What were we discussing about my project last time?",
      {
        resourceId,
        threadId,
      }
    );
    console.log('Agent Response 2:', response2.text);
    
    // Third interaction - test working memory with new information
    const response3 = await agent.generate(
      "I need to update you - we've decided to postpone the launch to May 2024 and we've added two new team members: Sarah (UI designer) and Mike (backend developer).",
      {
        resourceId,
        threadId,
      }
    );
    console.log('Agent Response 3:', response3.text);
    
    // Fourth interaction - agent should remember all updated information
    const response4 = await agent.generate(
      "Can you remind me of my project's current status and team?",
      {
        resourceId,
        threadId,
      }
    );
    console.log('Agent Response 4:', response4.text);
    
  } catch (error) {
    console.error('Error during conversation:', error);
  }
}

// To test different conversations for the same user (resource-scoped memory)
async function testResourceScopedMemory() {
  const agent = mastra.getAgent('projectAssistantAgent');
  const resourceId = 'user-123'; // Same user as above
  const newThreadId = 'different-conversation-789'; // Different conversation
  
  try {
    console.log('\n🔄 Testing resource-scoped memory in a new thread...');
    
    // This should remember user information from the previous conversation
    const response = await agent.generate(
      "Hi again! I'm starting a new conversation. Do you remember who I am and what project I'm working on?",
      {
        resourceId,
        threadId: newThreadId,
      }
    );
    console.log('New Thread Response:', response.text);
    
  } catch (error) {
    console.error('Error in new thread:', error);
  }
}

// Run the examples
if (require.main === module) {
  exampleMemoryUsage()
    .then(() => testResourceScopedMemory())
    .then(() => {
      console.log('\n✅ Memory examples completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Example failed:', error);
      process.exit(1);
    });
}

export { exampleMemoryUsage, testResourceScopedMemory };
