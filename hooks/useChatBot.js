import { useState } from "react";
import axios from "axios";

const useChatBot = (apiKey, model = "gpt-4") => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (
    userMessage, 
    systemPrompt = "You are a helpful assistant.", 
    language = "english"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        model,
        messages: [
          { 
            role: "system",
            content: `${systemPrompt} Respond in ${language}.`, 
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 150,
      };

      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(result.data.choices[0].message.content.trim());
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    response,
    isLoading,
    error,
    sendMessage,
  };
};

export default useChatBot;