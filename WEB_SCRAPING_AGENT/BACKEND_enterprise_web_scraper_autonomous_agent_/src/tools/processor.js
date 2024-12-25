const { logger } = require('../utils/logger');

    const processData = (data, rules, parentTaskData = null) => {
      const processedData = { ...data };

      if (rules.trim) {
        rules.trim.forEach(key => {
          if (processedData[key]) {
            try {
              if (Array.isArray(processedData[key])) {
                processedData[key] = processedData[key].map(item => item.trim());
              } else if (typeof processedData[key] === 'string') {
                processedData[key] = processedData[key].trim();
              }
            } catch (error) {
              logger.error(`Error trimming data for key ${key}:`, error);
            }
          }
        });
      }

      if (rules.limit) {
        for (const key in rules.limit) {
          if (rules.limit.hasOwnProperty(key) && processedData[key]) {
            try {
              processedData[key] = processedData[key].slice(0, rules.limit[key]);
            } catch (error) {
              logger.error(`Error limiting data for key ${key}:`, error);
            }
          }
        }
      }

      if (parentTaskData) {
        processedData.parentTaskData = parentTaskData;
      }

      return processedData;
    };

    module.exports = { processData };
