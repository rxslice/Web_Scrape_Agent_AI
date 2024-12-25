const winston = require('winston');

    const logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, taskId }) => {
          return `${timestamp} [${level.toUpperCase()}]${taskId ? ` [${taskId}]` : ''}: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });

    logger.on('data', (info) => {
      if (logger.socket) {
        logger.socket.emit('log', info);
      }
    });

    module.exports = { logger };
