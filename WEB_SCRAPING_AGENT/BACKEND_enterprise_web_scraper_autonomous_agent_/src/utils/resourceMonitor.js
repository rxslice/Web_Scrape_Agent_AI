const osUtils = require('os-utils');
    const { logger } = require('./logger');

    const monitorResources = () => {
      osUtils.cpuUsage(cpuUsage => {
        osUtils.memUsage(memUsage => {
          logger.info(`Resource Usage - CPU: ${cpuUsage.toFixed(2)}%, Memory: ${(memUsage * 100).toFixed(2)}%`);
        });
      });
    };

    module.exports = { monitorResources };
