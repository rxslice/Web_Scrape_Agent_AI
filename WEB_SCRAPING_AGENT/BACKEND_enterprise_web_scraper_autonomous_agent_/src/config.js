const fs = require('fs').promises;
    const path = require('path');

    const loadConfig = () => {
      return {
        scrapeInterval: process.env.SCRAPE_INTERVAL || 60, // Interval in seconds to reload config
        databaseFile: process.env.DATABASE_FILE || 'scraped_data.db', // Path to SQLite database file
        logLevel: process.env.LOG_LEVEL || 'info', // Logging level (info, warn, error)
        proxyUrl: process.env.PROXY_URL || null, // Proxy URL (e.g., http://your-proxy:port)
        mongodbUri: process.env.MONGODB_URI || null, // MongoDB connection URI
        aiApiUrl: process.env.AI_API_URL || null, // URL for AI content extraction API
        aiApiKey: process.env.AI_API_KEY || null, // API key for AI content extraction
        nlpApiUrl: process.env.NLP_API_URL || null, // URL for NLP API
        nlpApiKey: process.env.NLP_API_KEY || null, // API key for NLP
        anomalyApiUrl: process.env.ANOMALY_API_URL || null, // URL for anomaly detection API
        anomalyApiKey: process.env.ANOMALY_API_KEY || null, // API key for anomaly detection
        scrapeConcurrency: parseInt(process.env.SCRAPE_CONCURRENCY || 5, 10), // Number of concurrent scraping tasks
        userAgentRotation: [ // List of user-agent strings to rotate
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15',
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        ],
        dataStorage: process.env.DATA_STORAGE || 'database', // 'database', 'file', or 'mongodb'
        fileStorageOptions: { // Options for file storage
          directory: process.env.FILE_STORAGE_DIR || 'scraped_data', // Directory to store scraped data files
          format: process.env.FILE_STORAGE_FORMAT || 'json' // Format of the file ('json' or 'csv')
        },
        tasks: [ // List of scraping tasks
          {
            name: 'Example Task 1', // Name of the task
            url: 'https://example.com', // URL to scrape
            schedule: '0 * * * *', // Cron schedule for the task
            priority: 1, // Priority of the task (lower number = higher priority)
            headers: { // Custom headers for the task
              'X-Custom-Header': 'CustomValue'
            },
            retry: { // Retry configuration for the task
              maxAttempts: 3, // Maximum number of retry attempts
              delay: 1000 // Delay in milliseconds between retries
            },
            extractionRules: { // CSS selectors for data extraction
              title: 'h1',
              description: 'p'
            },
            validationRules: { // Data validation rules
              title: 'string',
              description: 'string'
            },
            transformationRules: { // Data transformation rules
              title: {
                regex: 'Example',
                replace: 'Replaced'
              }
            },
            processingRules: { // Data processing rules
              trim: ['title', 'description']
            },
            webhookUrl: 'https://example.com/webhook', // URL for webhook notification
            apiCall: { // Configuration for API call
              url: 'https://example.com/api',
              method: 'POST',
              body: { message: 'Task completed' },
              headers: { 'Content-Type': 'application/json' }
            },
            nlpAnalysis: true, // Enable NLP analysis
            deduplicationKeys: ['title'], // Keys to use for data deduplication
            anomalyDetection: { // Configuration for anomaly detection
              fields: ['description']
            },
            aiContentExtraction: { // Configuration for AI content extraction
              keywords: ['important', 'information']
            }
          },
          {
            name: 'Example Task 2',
            url: 'https://news.ycombinator.com',
            schedule: '*/30 * * * *',
            priority: 2,
            retry: {
              maxAttempts: 2,
              delay: 2000
            },
            extractionRules: {
              titles: '.athing .titlelink',
              links: '.athing .titlelink[href]'
            },
            validationRules: {
              titles: 'array',
              links: 'array'
            },
            processingRules: {
              limit: {
                titles: 5,
                links: 5
              }
            },
            pagination: {
              nextSelector: '.nav .next a',
              maxPages: 3
            }
          },
          {
            name: 'Example Task 3',
            url: 'https://example.com/dynamic',
            schedule: '0 0 * * *',
            priority: 3,
            usePuppeteer: true,
            dependsOn: 'Example Task 1',
            extractionRules: {
              content: '#content'
            },
            validationRules: {
              content: 'string'
            },
            processingRules: {
              trim: ['content']
            },
            visualScraping: {
              imageSelector: 'img.main-image'
            }
          }
        ]
      };
    };

    const saveConfig = async (config) => {
      const configPath = path.join(__dirname, 'config.json');
      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    };

    module.exports = { loadConfig, saveConfig };
