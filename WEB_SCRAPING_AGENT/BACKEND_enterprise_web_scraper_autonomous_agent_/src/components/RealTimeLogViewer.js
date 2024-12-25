import React, { useState, useEffect, useRef } from 'react';
    import Typography from '@mui/material/Typography';
    import TextField from '@mui/material/TextField';
    import Select from '@mui/material/Select';
    import MenuItem from '@mui/material/MenuItem';
    import InputLabel from '@mui/material/InputLabel';
    import FormControl from '@mui/material/FormControl';
    import { makeStyles } from '@mui/styles';
    import { io } from 'socket.io-client';

    const useStyles = makeStyles((theme) => ({
      logContainer: {
        height: 400,
        overflowY: 'scroll',
        border: '1px solid #ccc',
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
        whiteSpace: 'pre-wrap',
      },
    }));

    function RealTimeLogViewer() {
      const classes = useStyles();
      const [logs, setLogs] = useState([]);
      const [filterLevel, setFilterLevel] = useState('all');
      const [searchQuery, setSearchQuery] = useState('');
      const logContainerRef = useRef(null);
      const socket = useRef(null);

      useEffect(() => {
        socket.current = io('http://localhost:3001');

        socket.current.on('log', (newLog) => {
          setLogs((prevLogs) => [...prevLogs, newLog]);
        });

        return () => {
          if (socket.current) {
            socket.current.disconnect();
          }
        };
      }, []);

      useEffect(() => {
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, [logs]);

      const filteredLogs = logs.filter((log) => {
        if (filterLevel !== 'all' && log.level !== filterLevel) {
          return false;
        }
        if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      });

      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Real-Time Log Viewer
          </Typography>
          <FormControl style={{ marginBottom: '16px', marginRight: '16px' }}>
            <InputLabel id="filter-level-label">Filter Level</InputLabel>
            <Select
              labelId="filter-level-label"
              id="filterLevel"
              value={filterLevel}
              label="Filter Level"
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warn">Warn</MenuItem>
              <MenuItem value="error">Error</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Search Logs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <div className={classes.logContainer} ref={logContainerRef}>
            {filteredLogs.map((log, index) => (
              <div key={index} style={{ color: log.level === 'error' ? 'red' : log.level === 'warn' ? 'orange' : 'inherit' }}>
                {new Date(log.timestamp).toLocaleString()} [{log.level.toUpperCase()}]: {log.message}
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default RealTimeLogViewer;
