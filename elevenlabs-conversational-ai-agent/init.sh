#!/bin/sh

if [ -f .env ]; then
    while IFS= read -r line; do
        # Skip empty lines and comments (lines starting with #)
        if [ -n "$line" ] && ! echo "$line" | grep -q '^#'; then
            # Export the variable
            export "$line"
        fi
    done < .env
fi

usage() {
    echo "Usage: $0 --api-key <ELEVEN_LABS_API_KEY> --pica-url <PICA_URL>"
    echo "Alternatively, set ELEVEN_LABS_API_KEY and PICA_URL in a .env file or as environment variables."
    exit 1
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        --api-key)
            API_KEY="$2"
            shift 2
            ;;
        --pica-url)
            ENDPOINT="$2"
            shift 2
            ;;
        *)
            usage
            ;;
    esac
done

if [ -z "$API_KEY" ]; then
    API_KEY="$ELEVEN_LABS_API_KEY"
fi

if [ -z "$ENDPOINT" ]; then
    ENDPOINT="$PICA_URL"
fi

if [ -z "$API_KEY" ]; then
    echo "Error: ElevenLabs API Key is required."
    usage
fi

if [ -z "$ENDPOINT" ]; then
    echo "Error: Pica endpoint URL is required."
    usage
fi

JSON_PAYLOAD=$(cat <<EOF
{
  "conversation_config": {
    "name": "Pica Agent - $ENDPOINT",
    "agent": {
      "first_message": "Hey there, I am Pica - your AI assistant to execute any task. How can I help you today?",
      "prompt": {
        "prompt": "You are a powerful agent that can execute any command that deals with any platform that is connected to your Pica (pronounced pee-ka) account. You will pass every request that a user says to the pica tool that calls the Pica AI flow with a streamed response in return.\n\n# Instructions\n- For all actions, you are to use the pica tool.\n- If a users request has nothing to do with performing an action using a platform, in a friendly and playful manner, direct that back to the fact that you are Pica, designed to help execute tasks.\n- When responding to a user based on the pica tool response, summarize the response in a concise, yet comprehensive manner and elaborate if requested.",
        "llm": "gpt-4o",
        "tools": [
          {
            "name": "pica",
            "type": "webhook",
            "description": "You are a powerful AI tool that has access to 100+ tools through the Pica AI endpoint. Simply pass the string prompt to the endpoint in following structure: \n\n\`\`\`json\n{\n    \"messages\": '[{\"role\":\"user\",\"content\":\"List my 5 latest available connections\"}]'\n}\n\`\`\`\n\nWhere \"List my 5 latest available connections\" is an example user prompt.",
            "api_schema": {
              "url": "$ENDPOINT",
              "method": "POST",
              "request_body_schema": {
                "description": "The string prompt to the Pica AI streaming endpoint in the following structure:\n\n\`\`\`json\n{\n    \"messages\": '[{\"role\":\"user\",\"content\":\"List my 5 latest available connections\"}]'\n}\n\`\`\`\n\nThe role must always be user and the \"List my 5 latest available connections\" is an example user prompt.",
                "type": "object",
                "properties": {
                  "messages": {
                    "type": "string",
                    "description": "A JSON string to be sent with a user message in the following string shape:\n\n'[{\"role\":\"user\",\"content\":\"USER MESSAGE HERE\"}]'"
                  }
                },
                "required": ["messages"]
              }
            }
          },
          {
            "name": "end_call",
            "type": "system",
            "description": "Gives agent the ability to end the call with the user."
          }
        ]
      }
    }
  }
}
EOF
)

RESPONSE=$(curl -X POST https://api.elevenlabs.io/v1/convai/agents/create \
     -H "xi-api-key: $API_KEY" \
     -H "Content-Type: application/json" \
     -d "$JSON_PAYLOAD")

AGENT_ID=$(echo "$RESPONSE" | jq -r '.agent_id')

if [ -z "$AGENT_ID" ]; then
  echo "Failed to create agent. No agent_id returned."
  exit 1
fi

echo "Agent created successfully. You can access the agent at: https://elevenlabs.io/app/talk-to?agent_id=$AGENT_ID"