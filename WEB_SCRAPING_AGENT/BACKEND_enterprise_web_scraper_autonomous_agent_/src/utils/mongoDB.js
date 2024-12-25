const { MongoClient } = require('mongodb');
    const { logger } = require('./logger');

    let mongoClient = null;

    const initMongoDB = async (uri) => {
      try {
        mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        logger.info('Connected to MongoDB');
        return mongoClient;
      } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        throw error;
      }
    };

    const storeDataToMongoDB = async (client, data, taskName, taskId) => {
      try {
        const db = client.db();
        const collection = db.collection('scraped_data');
        await collection.insertOne({ taskName, data, timestamp: new Date() });
        logger.info(`Data stored to MongoDB for task: ${taskName}`, { taskId });
      } catch (error) {
        logger.error(`Error storing data to MongoDB for task ${taskName}:`, error, { taskId });
      }
    };

    module.exports = { initMongoDB, storeDataToMongoDB };
