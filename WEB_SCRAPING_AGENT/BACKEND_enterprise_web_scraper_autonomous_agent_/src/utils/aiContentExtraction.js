const axios = require('axios');
    const { logger } = require('./logger');

    const aiExtractContent = async (html, keywords, apiUrl, apiKey, taskId) => {
      if (!apiUrl || !apiKey) {
        // Basic keyword-based extraction if no API is provided
        const extractedContent = {};
        if (keywords && keywords.length > 0) {
          const lowerCaseHtml = html.toLowerCase();
          for (const keyword of keywords) {
            if (lowerCaseHtml.includes(keyword.toLowerCase())) {
              extractedContent[keyword] = true;
            }
          }
        }
        return extractedContent;
      }

      try {
        const response = await axios.post(apiUrl, { html, keywords }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
        logger.info(`AI content extraction API call to ${apiUrl} successful`, { taskId });
        return response.data;
      } catch (error) {
        logger.error(`Error calling AI content extraction API ${apiUrl}:`, error, { taskId });
        return {};
      }
    };

    module.exports = { aiExtractContent };
