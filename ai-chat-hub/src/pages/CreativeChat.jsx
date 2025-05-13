import React from 'react';
import ChatInterface from './ChatInterface';

const CreativeChat = () => {
  return (
    <ChatInterface
      aiType="creative"
      personality={{
        name: "Creative",
        description: "Your creative companion for artistic endeavors",
        color: "purple",
      }}
    />
  );
};

export default CreativeChat;
