import React, { useState, useEffect } from 'react';
    import Typography from '@mui/material/Typography';
    import Grid from '@mui/material/Grid';
    import Paper from '@mui/material/Paper';
    import { makeStyles } from '@mui/styles';
    import axios from 'axios';

    const useStyles = makeStyles((theme) => ({
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
      },
    }));

    function Dashboard() {
      const classes = useStyles();
      const [status, setStatus] = useState({ running: false, errors: 0 });
      const [tasks, setTasks] = useState({ active: 0, completed: 0, pending: 0 });

      useEffect(() => {
        const fetchDashboardData = async () => {
          try {
            const response = await axios.get('/api/dashboard');
            setStatus(response.data.status);
            setTasks(response.data.tasks);
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          }
        };

        fetchDashboardData();
      }, []);

      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Status</Typography>
                <Typography variant="body1">
                  {status.running ? 'Running' : 'Stopped'}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Errors</Typography>
                <Typography variant="body1">{status.errors}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Active Tasks</Typography>
                <Typography variant="body1">{tasks.active}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Completed Tasks</Typography>
                <Typography variant="body1">{tasks.completed}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper className={classes.paper}>
                <Typography variant="h6">Pending Tasks</Typography>
                <Typography variant="body1">{tasks.pending}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      );
    }

    export default Dashboard;
