const axios = require('axios');
    const { logger } = require('./logger');

    const sendWebhook = async (url, data, taskId) => {
      try {
        await axios.post(url, data);
        logger.info(`Webhook sent to ${url}`, { taskId });
      } catch (error) {
        logger.error(`Error sending webhook to ${url}:`, error, { taskId });
      }
    };

    module.exports = { sendWebhook };
