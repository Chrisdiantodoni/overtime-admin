import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import { LoginForm } from '../../sections/auth/login';
import Image from '../../assets/logo.png';
import { useHead } from 'src/context/HeadContext';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
  overflow: 'hidden',
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function LoginPage() {
  const { helmet, favicon } = useHead();
  helmet.title = 'Login | PT. Super Andalas Steel';

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>
      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <img
              src={Image}
              alt="login"
              style={{ width: '186px', height: '186px', marginBottom: '45px', alignSelf: 'center' }}
            />
            <Typography variant="h4" gutterBottom align="center" color={'#000'}>
              PT. Super Andalas Steel
            </Typography>
            <Typography variant="h5" gutterBottom align="center" color={'#000'}>
              Sistem Pengajuan Lembur
            </Typography>
            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
