import React, { useContext } from 'react';
    import Button from '@mui/material/Button';
    import { AuthContext } from '../contexts/AuthContext';
    import { useNavigate } from 'react-router-dom';

    function UserAuthentication() {
      const { user, logout } = useContext(AuthContext);
      const navigate = useNavigate();

      const handleLogout = () => {
        logout();
        navigate('/login');
      };

      return (
        <div>
          {user ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      );
    }

    export default UserAuthentication;
