const axios = require('axios');
    const { logger } = require('./logger');

    const apiCall = async (url, method = 'GET', body = null, headers = {}, taskId) => {
      try {
        const response = await axios({
          method: method,
          url: url,
          data: body,
          headers: headers
        });
        logger.info(`API call to ${url} successful`, { taskId });
        return response.data;
      } catch (error) {
        logger.error(`Error calling API ${url}:`, error, { taskId });
        throw error;
      }
    };

    module.exports = { apiCall };
