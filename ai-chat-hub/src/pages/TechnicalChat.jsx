import ChatInterface from './ChatInterface';

const TechnicalChat = () => {
  return (
    <ChatInterface
      aiType="technical"
      personality={{
        name: "Technical Assistant",
        description: "Expert in programming, development, and technical problem-solving",
        color: "green"
      }}
    />
  );
};

export default TechnicalChat;
