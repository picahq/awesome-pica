// src/mastra/tools/pica-tools.ts
import { Pica } from "@picahq/ai";

// Initializing Pica with explicit configuration to access ALL connectors
const pica = new Pica(process.env.PICA_SECRET!, {
  connectors: ["*"], // Enabling all connectors
});

// Exporting Pica tools directly for use with Mastra
// This gives agents and workflows access to ALL Pica integrations
export const picaTools = pica.oneTool;

// Exporting the Pica instance for generating system prompts and direct usage
export { pica };

// Helper function to list all available connections using the REST API
export async function listAllConnections() {
  try {
    
    const initialResponse = await fetch("https://api.picaos.com/v1/vault/connections?limit=1", {
      headers: {
        "x-pica-secret": process.env.PICA_SECRET!,
      },
    });
    
    if (!initialResponse.ok) {
      throw new Error(`HTTP error! status: ${initialResponse.status}`);
    }
    
    const initialData = await initialResponse.json();
    const totalConnections = initialData.total || 0;
    
    if (totalConnections === 0) {
      return [];
    }
    
    // Fetching all connections in one call using the exact total
    const response = await fetch(`https://api.picaos.com/v1/vault/connections?limit=${totalConnections}`, {
      headers: {
        "x-pica-secret": process.env.PICA_SECRET!,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rows || [];
  } catch (error) {
    console.error("Error listing connections:", error);
    throw error;
  }
}

// Helper function to list ALL connections with pagination support
export async function listAllConnectionsPaginated() {
  try {
    const allConnections: any[] = []; // Explicitly type the array
    let currentPage = 1;
    let totalPages = 1;
    const limit = 50; // Reasonable batch size
    
    while (currentPage <= totalPages) {
      const response = await fetch(`https://api.picaos.com/v1/vault/connections?limit=${limit}&skip=${(currentPage - 1) * limit}`, {
        headers: {
          "x-pica-secret": process.env.PICA_SECRET!,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const connections = data.rows || [];
      
      allConnections.push(...connections);
      
      // Update total pages from the response
      totalPages = data.pages || 1;
      currentPage++;
    }
    
    return allConnections;
  } catch (error) {
    console.error("Error listing connections with pagination:", error);
    throw error;
  }
}

// Helper function to get available actions for a specific platform using the REST API
export async function getAvailableActions(platform: string, limit: number = 50) {
  try {
    const response = await fetch(`https://api.picaos.com/v1/available-actions/${platform}?limit=${limit}`, {
      headers: {
        "x-pica-secret": process.env.PICA_SECRET!,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rows || [];
  } catch (error) {
    console.error(`Error getting actions for ${platform}:`, error);
    throw error;
  }
}

// Helper function to get all available connectors using the REST API
export async function getAvailableConnectors() {
  try {
    const response = await fetch("https://api.picaos.com/v1/available-connectors", {
      headers: {
        "x-pica-secret": process.env.PICA_SECRET!,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rows || [];
  } catch (error) {
    console.error("Error getting available connectors:", error);
    throw error;
  }
}

// Helper function to check if a specific connector is available
export async function checkConnectorAvailability(connectorName: string) {
  try {
    // Use the higher limit version to ensure we don't miss connections
    const connections = await listAllConnections();
    const isAvailable = connections.some((conn: any) => 
      conn.platform?.toLowerCase() === connectorName.toLowerCase() ||
      conn.name?.toLowerCase().includes(connectorName.toLowerCase())
    );
    return isAvailable;
  } catch (error) {
    console.error(`Error checking ${connectorName} availability:`, error);
    return false;
  }
}

// Helper function to execute a Pica action directly using the tools
export async function executeAction(platform: string, actionKey: string, data: any = {}) {
  try {
    // Use the Pica tools to execute the action
    // This will use the oneTool interface which is the correct way to interact with Pica
    const toolName = `${platform}_${actionKey}`;
    
    // Note: This is a simplified example - in practice, one would use the tools
    // through an agent or the tool interface directly
    console.log(`Would execute ${toolName} with data:`, data);
    
    return {
      success: true,
      message: `Action ${actionKey} prepared for platform ${platform}`,
      data: data,
    };
  } catch (error) {
    console.error(`Error executing action ${actionKey} on ${platform}:`, error);
    throw error;
  }
}
