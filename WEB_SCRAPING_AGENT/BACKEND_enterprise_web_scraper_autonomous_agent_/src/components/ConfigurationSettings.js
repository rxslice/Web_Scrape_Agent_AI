import React, { useState, useEffect } from 'react';
    import Typography from '@mui/material/Typography';
    import TextField from '@mui/material/TextField';
    import Button from '@mui/material/Button';
    import Select from '@mui/material/Select';
    import MenuItem from '@mui/material/MenuItem';
    import InputLabel from '@mui/material/InputLabel';
    import FormControl from '@mui/material/FormControl';
    import axios from 'axios';
    import JSONEditor from './JSONEditor';

    function ConfigurationSettings() {
      const [config, setConfig] = useState({
        scrapeInterval: 60,
        databaseFile: 'scraped_data.db',
        logLevel: 'info',
        proxyUrl: '',
        mongodbUri: '',
        aiApiUrl: '',
        aiApiKey: '',
        nlpApiUrl: '',
        nlpApiKey: '',
        anomalyApiUrl: '',
        anomalyApiKey: '',
        scrapeConcurrency: 5,
        dataStorage: 'database',
        fileStorageOptions: {
          directory: 'scraped_data',
          format: 'json',
        },
      });

      useEffect(() => {
        const fetchConfig = async () => {
          try {
            const response = await axios.get('/api/config');
            setConfig(response.data);
          } catch (error) {
            console.error('Error fetching configuration:', error);
          }
        };

        fetchConfig();
      }, []);

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setConfig((prevConfig) => {
          if (name.startsWith('fileStorageOptions.')) {
            const fileStorageKey = name.split('.')[1];
            return { ...prevConfig, fileStorageOptions: { ...prevConfig.fileStorageOptions, [fileStorageKey]: value } };
          }
          return { ...prevConfig, [name]: value };
        });
      };

      const handleJSONChange = (name, value) => {
        setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
      };

      const handleSubmit = async () => {
        try {
          await axios.put('/api/config', config);
          alert('Configuration updated successfully!');
        } catch (error) {
          console.error('Error updating configuration:', error);
          alert('Error updating configuration!');
        }
      };

      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Configuration Settings
          </Typography>
          <TextField
            label="Scrape Interval (seconds)"
            name="scrapeInterval"
            type="number"
            value={config.scrapeInterval}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Database File"
            name="databaseFile"
            value={config.databaseFile}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="log-level-label">Log Level</InputLabel>
            <Select
              labelId="log-level-label"
              id="logLevel"
              name="logLevel"
              value={config.logLevel}
              label="Log Level"
              onChange={handleInputChange}
            >
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warn">Warn</MenuItem>
              <MenuItem value="error">Error</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Proxy URL"
            name="proxyUrl"
            value={config.proxyUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="MongoDB URI"
            name="mongodbUri"
            value={config.mongodbUri}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="AI API URL"
            name="aiApiUrl"
            value={config.aiApiUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="AI API Key"
            name="aiApiKey"
            value={config.aiApiKey}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="NLP API URL"
            name="nlpApiUrl"
            value={config.nlpApiUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="NLP API Key"
            name="nlpApiKey"
            value={config.nlpApiKey}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Anomaly API URL"
            name="anomalyApiUrl"
            value={config.anomalyApiUrl}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Anomaly API Key"
            name="anomalyApiKey"
            value={config.anomalyApiKey}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Scrape Concurrency"
            name="scrapeConcurrency"
            type="number"
            value={config.scrapeConcurrency}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="data-storage-label">Data Storage Type</InputLabel>
            <Select
              labelId="data-storage-label"
              id="dataStorage"
              name="dataStorage"
              value={config.dataStorage}
              label="Data Storage Type"
              onChange={handleInputChange}
            >
              <MenuItem value="database">SQLite Database</MenuItem>
              <MenuItem value="file">File</MenuItem>
              <MenuItem value="mongodb">MongoDB</MenuItem>
            </Select>
          </FormControl>
          {config.dataStorage === 'file' && (
            <>
              <TextField
                label="File Storage Directory"
                name="fileStorageOptions.directory"
                value={config.fileStorageOptions.directory}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="file-format-label">File Format</InputLabel>
                <Select
                  labelId="file-format-label"
                  id="fileStorageOptions.format"
                  name="fileStorageOptions.format"
                  value={config.fileStorageOptions.format}
                  label="File Format"
                  onChange={handleInputChange}
                >
                  <MenuItem value="json">JSON</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Update Configuration
          </Button>
        </div>
      );
    }

    export default ConfigurationSettings;
