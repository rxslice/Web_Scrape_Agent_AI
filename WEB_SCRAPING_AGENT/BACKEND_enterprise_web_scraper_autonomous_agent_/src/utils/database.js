const sqlite3 = require('sqlite3').verbose();
    const { open } = require('sqlite');
    const { logger } = require('./logger');

    const initDatabase = async (dbFile) => {
      try {
        const db = await open({
          filename: dbFile,
          driver: sqlite3.Database
        });

        await db.run(`
          CREATE TABLE IF NOT EXISTS scraped_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_name TEXT,
            data TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
        logger.info('Database initialized.');
        return db;
      } catch (error) {
        logger.error('Error initializing database:', error);
        throw error;
      }
    };

    const storeData = async (db, data, taskName, taskId) => {
      try {
        const dataString = JSON.stringify(data);
        await db.run('INSERT INTO scraped_data (task_name, data) VALUES (?, ?)', [taskName, dataString]);
        logger.info(`Data stored for task: ${taskName}`, { taskId });
      } catch (error) {
        logger.error(`Error storing data for task ${taskName}:`, error, { taskId });
      }
    };

    module.exports = { initDatabase, storeData };
