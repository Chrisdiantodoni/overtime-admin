import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import { useHead } from 'src/context/HeadContext';
import NotFound from '../assets/404.svg';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate('/staff');
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
            Opss, Halaman Tidak Ditemukan
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Pastikan Anda telah memeriksa URL dengan benar atau
            kembali ke halaman utama.
          </Typography>

          <Box component="img" src={NotFound} sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 6 } }} />

          <Button size="large" variant="contained" color="color" onClick={handleBackToHome}>
            Go to Home
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
