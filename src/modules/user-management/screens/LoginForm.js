import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {Box, Stack} from '@mui/joy';
import {Button, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import {GoogleLogin} from '@react-oauth/google';
import React, {useContext} from 'react';
import {AuthContext} from '../../../context/auth/AuthContext';
import HttpAuth from '../../../services/HttpAuthService';
import {useLogin} from '../hooks/useLogin';
import backgroundImage from '../../../assets/loginImage.jpg';
import {showError} from '../../../hooks/showError';

const useStyles = makeStyles(theme => {
  return {
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
      alignItems: 'center',
      gap: 8,
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
      borderRadius: '50%',
      padding: theme.spacing(1),
    },
    lockIcon: {
      color: theme.palette.background.paper,
    },
  };
});

const Login = props => {
  const {navigation = {}} = props || {};

  const afterSucess = () => {
    navigation.navigate('/itineraries');
  };
  const {formValues, setFormValues, onLogin, loading} = useLogin();
  const {email, password} = formValues;
  const handleChange = e => {
    const {name, value} = e.target;
    setFormValues(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const classes = useStyles();
  const isLoginActionDisabled = !email?.trim() || !password?.trim() || loading;
  const {setAuth} = useContext(AuthContext);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: 'auto',
        }}>
        <Stack className={classes.container}>
          <Box className={classes.avatar}>
            <LockOutlinedIcon className={classes.lockIcon} />
          </Box>
          <Box>Login</Box>
          <Box>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>
          <Stack gap={1}>
            <Button
              onClick={async props => {
                await onLogin();
                afterSucess && afterSucess();
              }}
              disabled={isLoginActionDisabled}
              loading={loading}
              type="submit"
              variant="contained"
              color="primary">
              Login
            </Button>
            <Button
              variant="contained"
              color="newVariant"
              onClick={() => {
                navigation.navigate('register');
              }}>
              Register Now
            </Button>
            {/* <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigation.navigate('forgot-password');
          }}>
          Forgot Password
        </Button> */}
            <GoogleLogin
              onSuccess={async credentialResponse => {
                try {
                  const {user, tokens} = await HttpAuth.post(
                    '/v1/auth/google-login',
                    {
                      idToken: credentialResponse.credential,
                    },
                  );

                  const {access, refresh} = tokens;
                  localStorage.setItem('access_token', JSON.stringify(access));
                  localStorage.setItem(
                    'refresh_token',
                    JSON.stringify(refresh),
                  );
                  HttpAuth.access_token = access;
                  HttpAuth.refresh_token = refresh;
                  setAuth({user: user});
                  afterSucess && afterSucess();
                } catch (err) {
                  showError(err);
                }
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default Login;
