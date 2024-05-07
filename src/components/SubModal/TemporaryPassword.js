import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Button } from '..';
import 'react-toastify/dist/ReactToastify.css';
import copy from 'clipboard-copy';

const TemporaryPasswordModal = ({ onClick, item }) => {
  const handleCopyClipboard = async () => {
    await copy(
      `Name : ${item.data.user?.name}\nUsername : ${item.data.user?.username}\nPassword Sementara : ${item?.data.password}`
    );
  };
  return (
    <Grid container spacing={2} sx={{ maxWidth: '550px', justifyContent: 'center', alignItems: 'center' }}>
      <Grid item xs={12} lg={12}>
        <Typography variant="p" component="p" color={(theme) => theme.palette.text} fontSize={14} fontWeight={'400'}>
          Nama
        </Typography>
        <Typography variant="p" component="p" color={(theme) => theme.palette.text} fontSize={16} fontWeight={'700'}>
          {item.data.user?.name}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Typography variant="p" component="p" color={(theme) => theme.palette.text} fontSize={14} fontWeight={'400'}>
          Username
        </Typography>
        <Typography
          variant="p"
          component="p"
          color={(theme) => theme.palette.text}
          fontSize={16}
          fontWeight={'700'}
          textTransform={'lowercase'}
        >
          {item.data.user?.username}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Typography variant="p" component="p" color={(theme) => theme.palette.text} fontSize={14} fontWeight={'400'}>
          Password Sementara
        </Typography>
        <Typography variant="p" component="p" color={(theme) => theme.palette.text} fontSize={16} fontWeight={'700'}>
          {item?.data.password}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Typography
          variant="p"
          component="p"
          color={(theme) => theme.palette.error.main}
          fontSize={14}
          fontWeight={'400'}
        >
          PERHATIAN : INFORMASI TERKAIT PASSWORD SEMENTARA DARI USER TERKAIT{' '}
          <b>HANYA BISA DILIHAT SATU KALI INI SAJA.</b> PASTIKAN ANDA SUDAH MENYIMPAN INFORMASI TERSEBUT SEBELUM MENUTUP
          PESAN INI
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12}>
        <Button
          color="color"
          variant="contained"
          label="COPY KE CLIPBOARD"
          fullWidth={true}
          size="large"
          onClick={handleCopyClipboard}
        />
      </Grid>
    </Grid>
  );
};

export default TemporaryPasswordModal;
