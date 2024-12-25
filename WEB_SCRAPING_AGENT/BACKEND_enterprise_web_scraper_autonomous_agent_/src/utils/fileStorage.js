const fs = require('fs').promises;
    const path = require('path');
    const { logger } = require('./logger');
    const { Parser } = require('json2csv');

    const storeDataToFile = async (data, taskName, options, taskId) => {
      const { directory, format } = options;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${taskName}-${timestamp}.${format}`;
      const filePath = path.join(directory, filename);

      try {
        await fs.mkdir(directory, { recursive: true });
        let fileContent;

        if (format === 'json') {
          fileContent = JSON.stringify(data, null, 2);
        } else if (format === 'csv') {
          const parser = new Parser();
          fileContent = parser.parse(data);
        } else {
          logger.error(`Unsupported file format: ${format}`, { taskId });
          return;
        }

        await fs.writeFile(filePath, fileContent);
        logger.info(`Data stored to file: ${filePath}`, { taskId });
      } catch (error) {
        logger.error(`Error storing data to file: ${filePath}`, error, { taskId });
      }
    };

    module.exports = { storeDataToFile };
