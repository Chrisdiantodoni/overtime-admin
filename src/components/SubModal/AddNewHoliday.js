import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Grid, FormControl } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { addNewHoliday } from '../../API';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const ModalAddHoliday = ({ onClick, onDataAdd }) => {
  const [date, setDate] = useState(moment());
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [dateError, setDateError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
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
    await addNewHoliday(body)
      .then((res) => {
        if (res.meta.code === 201) {
          toast.success('Hari libur berhasil ditambahkan.');
          setIsLoading(false);
          onDataAdd();
          onClick();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 422) {
          setDateError('Hari libur sudah ada');
          toast.error('Hari libur sudah ada.');
        }
        setIsLoading(false);
      });
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} lg={12}>
        <FormControl fullWidth error={!!dateError}>
          <DatePicker
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
        </FormControl>
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
          loading={isLoading}
          role="CircularProgress"
          color="color"
          variant="contained"
          fullWidth
          size="large"
          onClick={handleAdd}
        >
          TAMBAH
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default ModalAddHoliday;
