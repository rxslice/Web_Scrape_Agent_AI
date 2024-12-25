import React, { useState, useContext } from 'react';
    import TextField from '@mui/material/TextField';
    import Button from '@mui/material/Button';
    import { AuthContext } from '../contexts/AuthContext';
    import { useNavigate } from 'react-router-dom';
    import { makeStyles } from '@mui/styles';
    import Paper from '@mui/material/Paper';
    import Typography from '@mui/material/Typography';

    const useStyles = makeStyles((theme) => ({
      root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      },
      paper: {
        padding: theme.spacing(3),
        maxWidth: 400,
      },
      form: {
        display: 'flex',
        flexDirection: 'column',
      },
      button: {
        marginTop: theme.spacing(2),
      },
    }));

    function Login() {
      const classes = useStyles();
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const { login } = useContext(AuthContext);
      const navigate = useNavigate();

      const handleLogin = async () => {
        if (username === 'admin' && password === 'password') {
          login({ username: 'admin', role: 'admin' });
          navigate('/');
        } else {
          alert('Invalid credentials');
        }
      };

      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            <form className={classes.form}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                className={classes.button}
              >
                Login
              </Button>
            </form>
          </Paper>
        </div>
      );
    }

    export default Login;
