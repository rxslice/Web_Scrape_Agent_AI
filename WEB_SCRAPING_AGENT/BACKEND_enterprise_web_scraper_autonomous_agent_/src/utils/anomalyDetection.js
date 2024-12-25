const axios = require('axios');
    const { logger } = require('./logger');

    const detectAnomalies = async (data, fields, apiUrl, apiKey, taskId) => {
      if (!apiUrl || !apiKey) {
        // Basic statistical anomaly detection if no API is provided
        if (!Array.isArray(data)) {
          return { anomalies: [] };
        }
        const anomalies = [];
        for (const field of fields) {
          const values = data.map(item => item[field]).filter(val => typeof val === 'number');
          if (values.length > 0) {
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            const threshold = mean + 2 * stdDev;
            for (const item of data) {
              if (typeof item[field] === 'number' && item[field] > threshold) {
                anomalies.push({ field, value: item[field], message: 'Value exceeds threshold' });
              }
            }
          }
        }
        return { anomalies };
      }

      try {
        const response = await axios.post(apiUrl, { data, fields }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
        logger.info(`Anomaly detection API call to ${apiUrl} successful`, { taskId });
        return response.data;
      } catch (error) {
        logger.error(`Error calling anomaly detection API ${apiUrl}:`, error, { taskId });
        return { anomalies: [] };
      }
    };

    module.exports = { detectAnomalies };
