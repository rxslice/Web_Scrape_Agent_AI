const { logger } = require('./logger');

    const transformData = (data, rules, taskId) => {
      const transformedData = { ...data };

      if (rules) {
        for (const key in rules) {
          if (rules.hasOwnProperty(key) && transformedData.hasOwnProperty(key)) {
            const { regex, replace } = rules[key];
            try {
              if (regex && replace) {
                if (Array.isArray(transformedData[key])) {
                  transformedData[key] = transformedData[key].map(item =>
                    typeof item === 'string' ? item.replace(new RegExp(regex, 'g'), replace) : item
                  );
                } else if (typeof transformedData[key] === 'string') {
                  transformedData[key] = transformedData[key].replace(new RegExp(regex, 'g'), replace);
                }
              }
            } catch (error) {
              logger.error(`Error transforming data for key ${key}:`, error, { taskId });
            }
          }
        }
      }
      return transformedData;
    };

    module.exports = { transformData };
