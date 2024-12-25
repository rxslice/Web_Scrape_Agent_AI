const sanitizeData = (data) => {
      if (typeof data === 'string') {
        return data.replace(/<[^>]*>?/gm, ''); // Remove HTML tags
      } else if (Array.isArray(data)) {
        return data.map(item => sanitizeData(item));
      } else if (typeof data === 'object' && data !== null) {
        const sanitized = {};
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            sanitized[key] = sanitizeData(data[key]);
          }
        }
        return sanitized;
      }
      return data;
    };

    module.exports = { sanitizeData };
