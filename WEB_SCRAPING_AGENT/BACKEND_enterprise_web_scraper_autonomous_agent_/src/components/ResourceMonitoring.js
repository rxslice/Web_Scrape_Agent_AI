import React, { useState, useEffect } from 'react';
    import Typography from '@mui/material/Typography';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
    import axios from 'axios';

    function ResourceMonitoring() {
      const [cpuData, setCpuData] = useState([]);
      const [memoryData, setMemoryData] = useState([]);

      useEffect(() => {
        const fetchResourceData = async () => {
          try {
            const response = await axios.get('/api/resources');
            setCpuData(response.data.cpu);
            setMemoryData(response.data.memory);
          } catch (error) {
            console.error('Error fetching resource data:', error);
          }
        };

        fetchResourceData();
        const intervalId = setInterval(fetchResourceData, 60000);

        return () => clearInterval(intervalId);
      }, []);

      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Resource Monitoring
          </Typography>
          <Typography variant="h6">CPU Usage</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={cpuData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="usage" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <Typography variant="h6">Memory Usage</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={memoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="usage" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    export default ResourceMonitoring;
