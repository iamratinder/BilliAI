const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ENDPOINTS = {
  assistant: '/chat',
  creative: '/joke',
  technical: '/chat',
  friendly: '/chat'
};

export const chatAPI = {
  sendMessage: async (message, aiType) => {
    try {
      const endpoint = ENDPOINTS[aiType] || ENDPOINTS.assistant;
      
      // Format request body based on endpoint
      const requestBody = endpoint === '/joke' 
        ? { topic: message }    // JokePrompt format
        : { text: message };    // ChatPrompt format

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      // Handle different response formats for chat and joke endpoints
      return endpoint === '/joke' ? data.joke : data.response;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  },
};
