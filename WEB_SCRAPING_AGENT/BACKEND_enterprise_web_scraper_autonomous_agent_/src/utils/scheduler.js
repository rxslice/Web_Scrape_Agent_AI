const cron = require('node-cron');
    const { logger } = require('./logger');

    const scheduleTask = (schedule, task) => {
      try {
        cron.schedule(schedule, task);
        logger.info(`Task scheduled with cron: ${schedule}`);
      } catch (error) {
        logger.error(`Error scheduling task with cron: ${schedule}`, error);
      }
    };

    module.exports = { scheduleTask };
