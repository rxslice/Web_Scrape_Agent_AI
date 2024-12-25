const axios = require('axios');
    const { logger } = require('./logger');

    const analyzeText = async (text, apiUrl, apiKey, taskId) => {
      if (!apiUrl || !apiKey) {
        // Basic sentiment analysis if no API is provided
        const sentiment = text.includes('good') || text.includes('great') ? 'positive' :
          text.includes('bad') || text.includes('terrible') ? 'negative' : 'neutral';
        return { sentiment, keywords: [] };
      }

      try {
        const response = await axios.post(apiUrl, { text }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
        logger.info(`NLP API call to ${apiUrl} successful`, { taskId });
        return response.data;
      } catch (error) {
        logger.error(`Error calling NLP API ${apiUrl}:`, error, { taskId });
        return { sentiment: 'neutral', keywords: [] };
      }
    };

    module.exports = { analyzeText };
