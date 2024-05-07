import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import Forbidden from '../assets/403.svg';
import { useHead } from 'src/context/HeadContext';

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function Page403() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const { helmet, favicon } = useHead();

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Opss, Akses Dilarang
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda
            memerlukan bantuan.
          </Typography>

          <Box component="img" src={Forbidden} sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 6 } }} />

          <Button size="large" variant="contained" color="color" onClick={handleBackToLogin}>
            Kembali ke Login
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
