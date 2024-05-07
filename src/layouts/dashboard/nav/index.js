import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation, useParams, NavLink } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Group, Assignment, Summarize, AccountCircle, Event } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: '#BC251A',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#BC251A',
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 1px 0 rgba(0,0,0,0.1)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 1px 0 rgba(0,0,0,0.1)',
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
    '& .MuiListItemButton-root': {
      paddingLeft: 16,
      paddingRight: 16,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: 16,
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
    '& .MuiListItemButton-root': {
      paddingRight: 24,
    },
  }),
}));

const appBarTheme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default function Dashboard() {
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const { user, role, handleLogout } = useAuth();
  const userRole = role[0]?.name;
  const { id } = useParams();
  const [savedTitle, setSavedTitle] = useState('');

  /* eslint-disable */

  useEffect(() => {
    const routeTitleMap = {
      '/staff': 'Staff',
      '/overtime-request': 'Pengajuan Lembur',
      '/overtime-request/report': 'Report Jam Lembur Staff',
      '/user': 'User',
      '/overtime-request/submit': 'Buat Pengajuan Lembur',
      '/holiday': 'Hari Libur',
    };
    routeTitleMap[`/requester/overtime-request/${id}`] = `Pengajuan Lembur #${id}`;
    routeTitleMap[`/approver/overtime-request/${id}`] = `Pengajuan Lembur #${id}`;
    routeTitleMap[`/admin/overtime-request/${id}`] = `Pengajuan Lembur #${id}`;
    routeTitleMap[`/staff/${id}/approved-overtime-request`] = `Pengajuan Lembur dari Staff #${id}`;
    const path = location.pathname;
    const newTitle = routeTitleMap[path] || 'Default Title';
    setSavedTitle(newTitle);
  }, [location.pathname]);
  /* eslint-disable */

  const adminNavItems = (
    <>
      <NavLink to="/staff" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton sx={{ fontSize: 18, fontWeight: '600' }}>
          <ListItemIcon>
            <Group sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Staff" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/overtime-request" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Assignment sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Pengajuan Lembur" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/overtime-request/report" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Summarize sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Report Jam Lembur" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/user" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <AccountCircle sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="User" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/holiday" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Event sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Hari Libur" />
        </ListItemButton>
      </NavLink>
    </>
  );

  const approverNavItems = (
    <>
      <NavLink to="/staff" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Group sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Staff" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/overtime-request" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Assignment sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Pengajuan Lembur" />
        </ListItemButton>
      </NavLink>
    </>
  );
  const requesterNavItems = (
    <>
      <NavLink to="/staff" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Group sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Staff" />
        </ListItemButton>
      </NavLink>
      <NavLink to="/overtime-request" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <Assignment sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="Pengajuan Lembur" />
        </ListItemButton>
      </NavLink>
    </>
  );
  const superAdminNavItems = (
    <>
      <NavLink to="/user" style={{ textDecoration: 'none', color: '#fff' }}>
        <ListItemButton>
          <ListItemIcon>
            <AccountCircle sx={{ color: '#ffffff' }} />
          </ListItemIcon>
          <ListItemText primary="User" />
        </ListItemButton>
      </NavLink>
    </>
  );

  const renderNavItems = () => {
    switch (userRole) {
      case 'admin':
        return adminNavItems;
      case 'approver':
        return approverNavItems;
      case 'requester':
        return requesterNavItems;
      case 'super-admin':
        return superAdminNavItems;
      default:
        return null;
    }
  };

  const logout = async () => {
    await handleLogout();
    localStorage.removeItem('token');
  };

  return (
    <ThemeProvider theme={appBarTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              edge="start"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color={(theme) => theme.palette.text.primary}
              fontWeight={'500'}
              fontSize={22}
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {savedTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Box
            flexDirection={'row'}
            component={'div'}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              px: [2],
              py: [1],
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                flexDirection: 'column',
                alignItems: 'start',
                py: [1],
              }}
            >
              {open ? (
                <Box
                  maxWidth="200px"
                  sx={{
                    display: 'inline-block',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                  }}
                >
                  <Typography component="p" color="#FFFFFF" fontSize={18} fontWeight={'600'}>
                    {user?.name}
                  </Typography>
                </Box>
              ) : null}

              {open ? (
                <Typography component="p" variant="h6" color="#FFFFFF" fontSize={14} fontWeight={'400'}>
                  {userRole}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon sx={{ color: '#ffffff' }} />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <List component="nav" style={{ maxHeight: '200px' }}>
            {renderNavItems()}
          </List>
          <Box
            sx={{
              position: 'absolute',
              bottom: '16px',
              left: '2px',
              width: 235,
              overflow: 'hidden',
            }}
          >
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon sx={{ color: '#ffffff' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#ffffff' }} />
            </ListItemButton>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
