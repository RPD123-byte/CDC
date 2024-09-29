export const chatbotAPI = async (question) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      answer: `Here's a mock response to your question: "${question}". In a real app, this would come from a backend API.`
    };
  };