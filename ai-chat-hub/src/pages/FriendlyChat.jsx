import ChatInterface from './ChatInterface';

const FriendlyChat = () => {
  return (
    <ChatInterface
      aiType="friendly"
      personality={{
        name: "Friendly Chat",
        description: "Your casual conversation companion",
        color: "orange",
      }}
    />
  );
};

export default FriendlyChat;
