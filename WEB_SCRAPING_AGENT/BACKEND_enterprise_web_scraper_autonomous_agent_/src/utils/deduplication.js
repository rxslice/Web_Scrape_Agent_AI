const deduplicateData = (data, keys) => {
      if (!keys || keys.length === 0) {
        return data;
      }

      if (Array.isArray(data)) {
        const seen = new Set();
        return data.filter(item => {
          const key = keys.map(k => item[k]).join('||');
          if (seen.has(key)) {
            return false;
          }
          seen.add(key);
          return true;
        });
      } else {
        return data;
      }
    };

    module.exports = { deduplicateData };
