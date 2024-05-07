import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { HolidayDetail, updateHoliday } from '../../API';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const ModalEditHoliday = ({ onClick, id, onDataUpdate }) => {
  const [date, setDate] = useState(moment());
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState(null);

  const getDetailHoliday = useCallback(async () => {
    const response = await HolidayDetail(id);
    if (response?.meta.code === 200) {
      const data = response?.data;
      const dateMoment = moment(data?.date);
      setDate(dateMoment);
      setName(data?.name);
    }
  }, [id]);
  useEffect(() => {
    getDetailHoliday();
  }, [getDetailHoliday]);

  const handleUpdate = async () => {
    setNameError('');
    setDateError('');
    setIsLoading(true);
    const formattedDate = date.format('YYYY-MM-DD');
    const body = {
      name,
      date: formattedDate,
    };
    if (!name || name.length < 1 || name.length > 60) {
      setNameError('Nama hari libur terdiri dari 1-60 karakter');
      setIsLoading(false);
      return;
    }
    try {
      await updateHoliday(id, body).then((res) => {
        if (res.meta.code === 200) {
          toast.success('Hari libur berhasil diubah.');
          onDataUpdate();
          onClick();
        }
      });
      onClick();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 422) {
        setNameError(true);
        setDateError('Hari libur sudah ada.');
        setIsLoading(false);
        toast.error('Hari libur sudah ada.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} lg={12}>
        <DatePicker
          sx={{ width: '100%' }}
          value={date}
          onChange={(newValue) => setDate(newValue)}
          format="DD MMMM YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              error: !!dateError,
              helperText: dateError,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <TextField
          id="outlined"
          label="Nama Hari Libur"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!nameError}
          helperText={nameError}
        />
      </Grid>

      <Grid item xs={12} lg={12}>
        <LoadingButton
          color="color"
          variant="contained"
          fullWidth={true}
          size="large"
          role="CircularProgress"
          loading={isLoading}
          onClick={handleUpdate}
        >
          SIMPAN
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default ModalEditHoliday;
