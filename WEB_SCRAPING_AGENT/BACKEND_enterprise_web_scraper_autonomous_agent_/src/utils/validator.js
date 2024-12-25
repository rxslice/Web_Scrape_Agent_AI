const { logger } = require('./logger');

    const validateData = (data, rules, taskId) => {
      const validatedData = { ...data };

      for (const key in rules) {
        if (rules.hasOwnProperty(key) && validatedData.hasOwnProperty(key)) {
          const expectedType = rules[key];
          const actualValue = validatedData[key];

          try {
            if (expectedType === 'string' && typeof actualValue !== 'string' && !Array.isArray(actualValue)) {
              validatedData[key] = String(actualValue);
            } else if (expectedType === 'array' && !Array.isArray(actualValue)) {
              validatedData[key] = [actualValue];
            }
          } catch (error) {
            logger.error(`Validation error for key ${key}:`, error, { taskId });
            validatedData[key] = null;
          }
        }
      }
      return validatedData;
    };

    module.exports = { validateData };
