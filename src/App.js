import React from 'react';
import {AppNavigator} from './routes/AppNavigator';
import {BrowserRouter} from 'react-router-dom';

import {ThemeProvider, createTheme} from '@mui/material';

import {Theme} from '@radix-ui/themes';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme/MaterialTheme';
import {AiProvider} from './context/AiContext';


function App() {
  return (
    <>
      <AiProvider>
            <GoogleOAuthProvider clientId="1088606169663-df95s64h0ihj8prru5mcf2e3hm2ehe3o.apps.googleusercontent.com">
              <BrowserRouter basename="/">
                <AppNavigator />
                <ToastContainer />
              </BrowserRouter>
            </GoogleOAuthProvider>
      </AiProvider>
    </>
  );
}

export default App;
