const { createWorker } = require('tesseract.js');
    const { logger } = require('./logger');

    const extractTextFromImage = async (imageUrl, taskId) => {
      try {
        const worker = await createWorker();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(imageUrl);
        await worker.terminate();
        logger.info(`Text extracted from image: ${imageUrl}`, { taskId });
        return text;
      } catch (error) {
        logger.error(`Error extracting text from image ${imageUrl}:`, error, { taskId });
        return null;
      }
    };

    module.exports = { extractTextFromImage };
