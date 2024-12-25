require('dotenv').config();
    const { Agent } = require('./src/agent');
    const { loadConfig } = require('./src/config');
    const { logger } = require('./src/utils/logger');
    const http = require('http');
    const { Server } = require('socket.io');
    const express = require('express');
    const cors = require('cors');

    const app = express();
    app.use(cors());
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"]
      }
    });

    const PORT = 3001;

    io.on('connection', (socket) => {
      logger.info('Client connected.');

      socket.on('disconnect', () => {
        logger.info('Client disconnected.');
      });
    });

    logger.socket = io;

    app.get('/api/dashboard', async (req, res) => {
      const config = loadConfig();
      const agent = new Agent(config);
      const status = { running: agent.isRunning, errors: 0 };
      const tasks = { active: config.tasks.length, completed: 0, pending: 0 };
      res.json({ status, tasks });
    });

    app.get('/api/resources', async (req, res) => {
      const cpu = [];
      const memory = [];
      res.json({ cpu, memory });
    });

    app.get('/api/tasks', async (req, res) => {
      const config = loadConfig();
      res.json(config.tasks);
    });

    app.post('/api/tasks', async (req, res) => {
      const config = loadConfig();
      const newTask = req.body;
      config.tasks.push(newTask);
      res.json(config.tasks);
    });

    app.put('/api/tasks/:name', async (req, res) => {
      const config = loadConfig();
      const updatedTask = req.body;
      const taskName = req.params.name;
      config.tasks = config.tasks.map(task => task.name === taskName ? updatedTask : task);
      res.json(config.tasks);
    });

    app.delete('/api/tasks/:name', async (req, res) => {
      const config = loadConfig();
      const taskName = req.params.name;
      config.tasks = config.tasks.filter(task => task.name !== taskName);
      res.json(config.tasks);
    });

    app.get('/api/config', async (req, res) => {
      const config = loadConfig();
      res.json(config);
    });

    app.put('/api/config', async (req, res) => {
      const config = loadConfig();
      const updatedConfig = req.body;
      const { saveConfig } = require('./src/config');
      await saveConfig(updatedConfig);
      res.json(updatedConfig);
    });

    async function main() {
      const config = loadConfig();
      const agent = new Agent(config);
      try {
        await agent.start();
      } catch (error) {
        logger.error('Failed to start agent:', error);
      }
    }

    server.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });

    main();
