import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getAuth, logout } from 'src/API';
import { Box, CircularProgress } from '@mui/material';

const initialState = {
  authenticated: false,
  user: {},
  role: [],
  loading: true,
};

const AuthActions = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER: 'SET_USER',
  SET_ROLE: 'SET_ROLE',
  SET_LOADING: 'SET_LOADING',
  LOGOUT: 'LOGOUT',
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.SET_AUTHENTICATED:
      return { ...state, authenticated: action.payload };
    case AuthActions.SET_USER:
      return { ...state, user: action.payload };
    case AuthActions.SET_ROLE:
      return { ...state, role: action.payload };
    case AuthActions.SET_LOADING:
      return { ...state, loading: action.payload };
    case AuthActions.LOGOUT:
      return { ...initialState, loading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchData();
      } else {
        dispatch({ type: AuthActions.SET_AUTHENTICATED, payload: false });
        dispatch({ type: AuthActions.SET_LOADING, payload: false });
      }
    })();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAuth();
      if (response?.meta?.code === 200) {
        const data = response?.data;
        dispatch({ type: AuthActions.SET_AUTHENTICATED, payload: true });
        dispatch({ type: AuthActions.SET_USER, payload: data });
        dispatch({ type: AuthActions.SET_ROLE, payload: data?.roles || [] });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: AuthActions.SET_AUTHENTICATED, payload: false });
    } finally {
      dispatch({ type: AuthActions.SET_LOADING, payload: false });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.meta.code === 200) {
        dispatch({ type: AuthActions.SET_LOADING, payload: false });
        window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
    }
  };

  const authData = { ...state, handleLogout, fetchData };

  return (
    <AuthContext.Provider value={authData}>
      {state.loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height={'100%'}>
          <CircularProgress color="color" size={60} variant="indeterminate" />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
