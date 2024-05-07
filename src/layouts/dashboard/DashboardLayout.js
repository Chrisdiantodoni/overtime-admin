import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
import Nav from './nav';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  overflow: 'auto',
  width: '100%',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      <Nav openNav={open} onCloseNav={() => setOpen(false)} />
      <Main open={open}>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
