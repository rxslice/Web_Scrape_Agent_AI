const { scrapeWebsite, scrapeWebsiteWithPuppeteer } = require('./tools/scraper');
    const { extractData } = require('./tools/extractor');
    const { processData } = require('./tools/processor');
    const { scheduleTask } = require('./utils/scheduler');
    const { initDatabase, storeData } = require('./utils/database');
    const { logger } = require('./utils/logger');
    const { validateData } = require('./utils/validator');
    const { loadConfig, saveConfig } = require('./config');
    const { storeDataToFile } = require('./utils/fileStorage');
    const { transformData } = require('./utils/transformer');
    const { initMongoDB, storeDataToMongoDB } = require('./utils/mongoDB');
    const { sendWebhook } = require('./utils/webhook');
    const { apiCall } = require('./utils/api');
    const { analyzeText } = require('./utils/nlp');
    const { deduplicateData } = require('./utils/deduplication');
    const { extractTextFromImage } = require('./utils/ocr');
    const { detectAnomalies } = require('./utils/anomalyDetection');
    const { aiExtractContent } = require('./utils/aiContentExtraction');
    const { monitorResources } = require('./utils/resourceMonitor');
    const { sanitizeData } = require('./utils/dataSanitizer');

    class Agent {
      constructor(config) {
        this.config = config;
        this.db = null;
        this.mongoClient = null;
        this.isRunning = false;
        this.taskDependencies = new Map();
        this.circuitBreakers = new Map();
      }

      async start() {
        if (this.isRunning) {
          logger.warn('Agent is already running.');
          return;
        }
        this.isRunning = true;
        this.db = await initDatabase(this.config.databaseFile);
        if (this.config.dataStorage === 'mongodb') {
          this.mongoClient = await initMongoDB(this.config.mongodbUri);
        }
        logger.info('Agent started.');
        this.setupTaskDependencies();
        this.scheduleTasks();
        this.setupConfigReload();
        this.startResourceMonitoring();
      }

      setupTaskDependencies() {
        this.config.tasks.forEach(task => {
          if (task.dependsOn) {
            if (!this.taskDependencies.has(task.dependsOn)) {
              this.taskDependencies.set(task.dependsOn, []);
            }
            this.taskDependencies.get(task.dependsOn).push(task.name);
          }
          this.circuitBreakers.set(task.name, { failures: 0, threshold: 3, timeout: 60000, state: 'closed' });
        });
      }

      async executeTask(task, parentTaskData = null) {
        const taskId = `${task.name}-${Date.now()}`;
        const circuitBreaker = this.circuitBreakers.get(task.name);

        if (circuitBreaker.state === 'open') {
          logger.warn(`Task ${task.name} is skipped due to circuit breaker being open.`, { taskId });
          return;
        }

        try {
          logger.info(`Executing task: ${task.name}`, { taskId });
          let html;
          if (task.usePuppeteer) {
            html = await scrapeWebsiteWithPuppeteer(task.url, this.config.userAgentRotation, task.headers, this.config.proxyUrl, task.retry);
          } else {
            html = await scrapeWebsite(task.url, this.config.userAgentRotation, task.headers, this.config.proxyUrl, task.retry);
          }
          let extractedData = extractData(html, task.extractionRules);

          if (task.aiContentExtraction) {
            const aiExtracted = await aiExtractContent(html, task.aiContentExtraction.keywords, this.config.aiApiUrl, this.config.aiApiKey, taskId);
            extractedData = { ...extractedData, aiExtracted };
          }

          if (task.visualScraping && task.visualScraping.imageSelector) {
            const imageUrl = this.getImageUrl(html, task.visualScraping.imageSelector, task.url);
            if (imageUrl) {
              const extractedText = await extractTextFromImage(imageUrl, taskId);
              extractedData = { ...extractedData, imageText: extractedText };
            }
          }

          if (task.pagination) {
            extractedData = await this.handlePagination(task, extractedData, html, taskId);
          }

          const validatedData = validateData(extractedData, task.validationRules, taskId);
          const transformedData = transformData(validatedData, task.transformationRules, taskId);
          let processedData = processData(transformedData, task.processingRules, parentTaskData);

          processedData = sanitizeData(processedData);

          if (task.nlpAnalysis && processedData.description) {
            const nlpResults = await analyzeText(processedData.description, this.config.nlpApiUrl, this.config.nlpApiKey, taskId);
            processedData = { ...processedData, nlpResults };
          }

          processedData = deduplicateData(processedData, task.deduplicationKeys);

          if (this.config.dataStorage === 'database') {
            await storeData(this.db, processedData, task.name, taskId);
          } else if (this.config.dataStorage === 'file') {
            await storeDataToFile(processedData, task.name, this.config.fileStorageOptions, taskId);
          } else if (this.config.dataStorage === 'mongodb') {
            await storeDataToMongoDB(this.mongoClient, processedData, task.name, taskId);
          }

          if (task.webhookUrl) {
            await sendWebhook(task.webhookUrl, { taskName: task.name, data: processedData }, taskId);
          }

          if (task.apiCall) {
            await apiCall(task.apiCall.url, task.apiCall.method, task.apiCall.body, task.apiCall.headers, taskId);
          }

          if (task.anomalyDetection) {
            const anomalyResults = await detectAnomalies(processedData, task.anomalyDetection.fields, this.config.anomalyApiUrl, this.config.anomalyApiKey, taskId);
            processedData = { ...processedData, anomalyResults };
          }

          logger.info(`Task ${task.name} completed successfully.`, { taskId });
          this.resetCircuitBreaker(task.name);
          this.executeDependentTasks(task.name, processedData, taskId);
        } catch (error) {
          logger.error(`Error executing task ${task.name}:`, error, { taskId });
          this.handleCircuitBreaker(task.name);
        }
      }

      getImageUrl(html, selector, baseUrl) {
        const $ = cheerio.load(html);
        const imageUrl = $(selector).attr('src');
        if (!imageUrl) return null;
        return new URL(imageUrl, baseUrl).href;
      }

      async handlePagination(task, extractedData, html, taskId) {
        let allData = { ...extractedData };
        let currentPage = 1;
        let nextUrl = this.getNextPageUrl(html, task.pagination.nextSelector, task.url);

        while (nextUrl && currentPage <= task.pagination.maxPages) {
          logger.info(`Fetching page ${currentPage} for task ${task.name}`, { taskId });
          let nextHtml;
          if (task.usePuppeteer) {
            nextHtml = await scrapeWebsiteWithPuppeteer(nextUrl, this.config.userAgentRotation, task.headers, this.config.proxyUrl, task.retry);
          } else {
            nextHtml = await scrapeWebsite(nextUrl, this.config.userAgentRotation, task.headers, this.config.proxyUrl, task.retry);
          }
          const nextPageData = extractData(nextHtml, task.extractionRules);
          for (const key in nextPageData) {
            if (allData[key]) {
              allData[key] = allData[key].concat(nextPageData[key]);
            } else {
              allData[key] = nextPageData[key];
            }
          }
          nextUrl = this.getNextPageUrl(nextHtml, task.pagination.nextSelector, task.url);
          currentPage++;
        }
        return allData;
      }

      getNextPageUrl(html, selector, baseUrl) {
        const $ = cheerio.load(html);
        const nextLink = $(selector).attr('href');
        if (!nextLink) return null;
        return new URL(nextLink, baseUrl).href;
      }

      executeDependentTasks(parentTaskName, parentTaskData, taskId) {
        if (this.taskDependencies.has(parentTaskName)) {
          this.taskDependencies.get(parentTaskName).forEach(taskName => {
            const task = this.config.tasks.find(t => t.name === taskName);
            if (task) {
              this.executeTask(task, parentTaskData, taskId);
            }
          });
        }
      }

      scheduleTasks() {
        this.config.tasks.sort((a, b) => (a.priority || 0) - (b.priority || 0)).forEach(task => {
          scheduleTask(task.schedule, () => this.executeTask(task));
        });
      }

      setupConfigReload() {
        setInterval(async () => {
          try {
            this.config = loadConfig();
            this.setupTaskDependencies();
            logger.info('Configuration reloaded.');
          } catch (error) {
            logger.error('Error reloading configuration:', error);
          }
        }, 60000); // Reload config every 60 seconds
      }

      handleCircuitBreaker(taskName) {
        const circuitBreaker = this.circuitBreakers.get(taskName);
        circuitBreaker.failures++;
        if (circuitBreaker.failures >= circuitBreaker.threshold && circuitBreaker.state === 'closed') {
          circuitBreaker.state = 'open';
          logger.warn(`Circuit breaker opened for task ${taskName}.`, { taskName });
          setTimeout(() => {
            this.resetCircuitBreaker(taskName);
          }, circuitBreaker.timeout);
        }
      }

      resetCircuitBreaker(taskName) {
        const circuitBreaker = this.circuitBreakers.get(taskName);
        circuitBreaker.failures = 0;
        circuitBreaker.state = 'closed';
        logger.info(`Circuit breaker reset for task ${taskName}.`, { taskName });
      }

      startResourceMonitoring() {
        setInterval(() => {
          monitorResources();
        }, 60000); // Monitor every 60 seconds
      }
    }

    module.exports = { Agent };
