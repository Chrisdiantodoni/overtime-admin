// App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { ToastContainer } from 'react-toastify';
import ThemeProvider from './theme';
import ScrollToTop from './components/scroll-to-top';
import { AuthProvider } from './context/AuthContext';
import { SortingProvider } from './context/SortingContext';
import { HeadProvider } from './context/HeadContext';
import Router from './routes';

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <AuthProvider>
            <SortingProvider>
              <HeadProvider>
                <Router />
              </HeadProvider>
            </SortingProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
      <ToastContainer />
    </LocalizationProvider>
  );
}
