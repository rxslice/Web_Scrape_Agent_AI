import React from 'react';
    import { makeStyles } from '@mui/styles';
    import AppBar from '@mui/material/AppBar';
    import Toolbar from '@mui/material/Toolbar';
    import Typography from '@mui/material/Typography';
    import Container from '@mui/material/Container';
    import Grid from '@mui/material/Grid';
    import Paper from '@mui/material/Paper';
    import Dashboard from './components/Dashboard';
    import ResourceMonitoring from './components/ResourceMonitoring';
    import TaskManager from './components/TaskManager';
    import ConfigurationSettings from './components/ConfigurationSettings';
    import RealTimeLogViewer from './components/RealTimeLogViewer';
    import UserAuthentication from './components/UserAuthentication';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import Login from './components/Login';
    import { AuthProvider } from './contexts/AuthContext';
    import PrivateRoute from './components/PrivateRoute';

    const useStyles = makeStyles((theme) => ({
      root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      },
      appBar: {
        zIndex: theme.zIndex.drawer + 1,
      },
      container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      },
      toolbar: theme.mixins.toolbar,
    }));

    function App() {
      const classes = useStyles();

      return (
        <AuthProvider>
          <Router>
            <div className={classes.root}>
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                  <Typography variant="h6" noWrap>
                    Web Scraping Agent Configuration
                  </Typography>
                  <UserAuthentication />
                </Toolbar>
              </AppBar>
              <div className={classes.toolbar} />
              <Container maxWidth="lg" className={classes.container}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <PrivateRoute>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                          <Paper className={classes.paper}>
                            <Dashboard />
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                          <Paper className={classes.paper}>
                            <ResourceMonitoring />
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper className={classes.paper}>
                            <TaskManager />
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper className={classes.paper}>
                            <ConfigurationSettings />
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper className={classes.paper}>
                            <RealTimeLogViewer />
                          </Paper>
                        </Grid>
                      </Grid>
                    </PrivateRoute>
                  } />
                </Routes>
              </Container>
            </div>
          </Router>
        </AuthProvider>
      );
    }

    export default App;
