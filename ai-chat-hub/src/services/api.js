const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const chatAPI = {
  sendMessage: async (message) => {
    try {
      console.log('API Base URL:', API_BASE_URL); // Debug log

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.answer) return data.answer;
      if (data.response) return data.response;
      if (data.message) return data.message;
      if (data.error) throw new Error(data.error);

      console.error('Unexpected response structure:', data);
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('API Error:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }
      throw new Error(error.message || 'Failed to get response from assistant');
    }
  }
};
