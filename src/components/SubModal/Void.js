import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { Button } from '..';
import { voidOvertimeRequests } from 'src/API';
import { LoadingButton } from '@mui/lab';

const VoidModal = ({ onClick, id, onUpdate }) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reasonError, setReasonError] = useState('');
  const handleVoid = async () => {
    setReasonError('');
    setIsLoading(true);
    if (!reason) {
      setIsLoading(false);
      return setReasonError('Alasan tidak boleh kosong');
    }
    try {
      const body = {
        reason,
      };
      await voidOvertimeRequests(id, body)
        .then((res) => {
          if (res.meta.code === 200) {
            toast.success('Alasan dikirim');
            setIsLoading(false);
            onUpdate(body);
            onClick();
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error('Status sudah berubah');
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <Grid container spacing={5}>
      <Grid item xs={12} lg={12}>
        <TextField
          error={!!reasonError}
          helperText={reasonError}
          id="outlined"
          type="text"
          label="Alasan"
          fullWidth
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          multiline
          InputProps={{ maxLength: 255 }}
          minRows={2}
          maxRows={3}
        />
      </Grid>
      <Grid item xs={4} lg={4} />
      <Grid item xs={4} lg={4}>
        <LoadingButton
          color="color"
          fullWidth={true}
          variant="outlined"
          size="large"
          onClick={handleVoid}
          role="CircularProgress"
          loading={isLoading}
        >
          VOID
        </LoadingButton>
      </Grid>
      <Grid item xs={4} lg={4}>
        <Button color="color" fullWidth={true} variant="contained" label="BATAL" size="large" onClick={onClick} />
      </Grid>
    </Grid>
  );
};

export default VoidModal;
