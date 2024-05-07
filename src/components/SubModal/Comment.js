import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { Button } from '..';
import 'react-toastify/dist/ReactToastify.css';
import { rejectOvertimeRequest } from 'src/API';
import { LoadingButton } from '@mui/lab';

const ModalComment = ({ onClick, id, onUpdate }) => {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRejectOvertime = async () => {
    if (!reason) {
      setReasonError('Alasan tidak boleh kosong.');
      return;
    }
    const body = {
      reason,
    };
    setIsLoading(true);
    await rejectOvertimeRequest(id, body)
      .then((res) => {
        if (res.meta.code === 200) {
          toast.success('Pengajuan lembur ditolak');
        }
        setIsLoading(false);
        onClick();
        onUpdate(body);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} lg={12}>
        <TextField
          id="outlined"
          label="Alasan"
          type="text"
          fullWidth
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          error={!!reasonError}
          helperText={reasonError}
          multiline
          inputProps={{
            maxLength: 255,
          }}
          minRows={2}
          maxRows={3}
        />
      </Grid>
      <Grid item xs={4} lg={4} />
      <Grid item xs={4} lg={4}>
        <LoadingButton
          color="color"
          variant="outlined"
          role="CircularProgress"
          loading={isLoading}
          fullWidth={true}
          size="large"
          onClick={handleRejectOvertime}
        >
          TOLAK
        </LoadingButton>
      </Grid>
      <Grid item xs={4} lg={4}>
        <Button color="color" variant="contained" label="BATAL" fullWidth={true} size="large" onClick={onClick} />
      </Grid>
    </Grid>
  );
};

export default ModalComment;
