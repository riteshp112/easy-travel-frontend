import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Stack } from '@mui/joy';
import { Button, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GoogleLogin } from '@react-oauth/google';
import React, { useContext } from 'react';
import { AuthContext } from '../../../context/auth/AuthContext';
import HttpAuth from '../../../services/HttpAuthService';
import { useLogin } from '../hooks/useLogin';

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
  // const intl = useIntl();
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
        <Button
          onClick={onLogin}
          disabled={isLoginActionDisabled}
          loading={loading}
          type="submit"
          variant="contained"
          color="primary">
          Login
        </Button>
      </Box>
      <Stack gap={4}>
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
          onSuccess={async (credentialResponse) => {
            const {user,tokens} = await HttpAuth.post('/v1/auth/google-login', {
              idToken: credentialResponse.credential
            })
            const {access,refresh} = tokens;
            localStorage.setItem('access_token', JSON.stringify(access));
            localStorage.setItem('refresh_token', JSON.stringify(refresh));
            HttpAuth.access_token = access;
            HttpAuth.refresh_token = refresh;
            setAuth({user: user});
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Login;
