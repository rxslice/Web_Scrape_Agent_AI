const axios = require('axios');
    const { logger } = require('../utils/logger');
    const Bottleneck = require('bottleneck');
    const puppeteer = require('puppeteer');
    const { loadConfig } = require('../config');

    const limiter = new Bottleneck({
      maxConcurrent: () => loadConfig().scrapeConcurrency,
      minTime: 200
    });

    const scrapeWebsite = async (url, userAgentRotation, customHeaders = {}, proxyUrl = null, retryConfig = { maxAttempts: 1, delay: 0 }) => {
      const randomUserAgent = userAgentRotation[Math.floor(Math.random() * userAgentRotation.length)];
      const headers = { 'User-Agent': randomUserAgent, ...customHeaders };
      const proxy = proxyUrl ? { http: proxyUrl, https: proxyUrl } : null;
      let attempts = 0;

      async function makeRequest() {
        try {
          const response = await limiter.schedule(() => axios.get(url, { headers, proxy }));
          if (response.status !== 200) {
            logger.warn(`Failed to scrape ${url}, status code: ${response.status}`);
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.data;
        } catch (error) {
          attempts++;
          logger.error(`Error scraping ${url}, attempt ${attempts}:`, error);
          if (attempts <= retryConfig.maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, retryConfig.delay));
            return makeRequest();
          }
          throw error;
        }
      }

      return makeRequest();
    };

    const scrapeWebsiteWithPuppeteer = async (url, userAgentRotation, customHeaders = {}, proxyUrl = null, retryConfig = { maxAttempts: 1, delay: 0 }) => {
      const randomUserAgent = userAgentRotation[Math.floor(Math.random() * userAgentRotation.length)];
      let browser;
      let attempts = 0;

      async function makeRequest() {
        try {
          browser = await puppeteer.launch({
            headless: 'new',
            args: proxyUrl ? [`--proxy-server=${proxyUrl}`] : [],
          });
          const page = await browser.newPage();
          await page.setUserAgent(randomUserAgent);
          await page.setExtraHTTPHeaders(customHeaders);
          const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
          if (response.status() !== 200) {
            logger.warn(`Failed to scrape ${url} with Puppeteer, status code: ${response.status()}`);
            throw new Error(`HTTP error! status: ${response.status()}`);
          }
          const html = await page.content();
          await browser.close();
          return html;
        } catch (error) {
          attempts++;
          logger.error(`Error scraping ${url} with Puppeteer, attempt ${attempts}:`, error);
          if (attempts <= retryConfig.maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, retryConfig.delay));
            return makeRequest();
          }
          if (browser) {
            await browser.close();
          }
          throw error;
        }
      }

      return makeRequest();
    };

    module.exports = { scrapeWebsite, scrapeWebsiteWithPuppeteer };
