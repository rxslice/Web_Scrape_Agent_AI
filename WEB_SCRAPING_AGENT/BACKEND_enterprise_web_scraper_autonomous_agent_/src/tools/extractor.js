const cheerio = require('cheerio');
    const { logger } = require('../utils/logger');

    const extractData = (html, rules) => {
      const $ = cheerio.load(html);
      const extractedData = {};

      for (const key in rules) {
        if (rules.hasOwnProperty(key)) {
          const selector = rules[key];
          try {
            if (selector.includes('[href]')) {
              extractedData[key] = $(selector).map((i, el) => $(el).attr('href')).get();
            } else {
              extractedData[key] = $(selector).map((i, el) => $(el).text()).get();
            }
          } catch (error) {
            logger.error(`Error extracting data for selector ${selector}:`, error);
            extractedData[key] = null;
          }
        }
      }
      return extractedData;
    };

    module.exports = { extractData };
