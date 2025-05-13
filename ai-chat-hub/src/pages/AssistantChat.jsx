import ChatInterface from './ChatInterface';

const AssistantChat = () => {
  return (
    <ChatInterface
      aiType="assistant"
      personality={{
        name: "Assistant",
        description: "A helpful AI assistant for general tasks",
        color: "blue",
      }}
    />
  );
};

export default AssistantChat;
