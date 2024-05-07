import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Box,
  Typography,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers';
// components
import moment from 'moment';
import { StaffCard } from 'src/components';
import { overtimeShifts, getOwnStaff, submitOvertimeRequest, getHolidayRequester } from 'src/API';
import { useDebounce } from 'src/hooks/useDebounce';
import { toast } from 'react-toastify';
import { useHead } from 'src/context/HeadContext';
import { SummaryContainer, StaffsContainer } from 'src/components/Container/Container';

// ----------------------------------------------------------------------

export default function SubmitOvertimeRequest() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCards, setSelectedCards] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(moment());
  const size = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOvertimeShift, setSelectedOvertimeShift] = useState('');
  const [holidayList, setHolidayList] = useState([]);
  const [overtimeList, setOvertimeList] = useState([]);
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCardSelect = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };
  useEffect(() => {
    setDebouncedSearch(debouncedValue);
  }, [debouncedValue]);

  const getStaffList = async (departmentId, search, page) => {
    try {
      setIsLoading(true);
      const response = await getOwnStaff(search, departmentId, size, page);
      if (response?.meta?.code === 200) {
        setData(response?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getStaffList(debouncedSearch);
  }, [debouncedSearch]);

  const getHoliday = async () => {
    try {
      const start = moment(minDate).format('YYYY-MM-DD');
      const end = moment().format('YYYY-MM-DD');
      const response = await getHolidayRequester(start, end);
      if (response?.meta?.code === 200) {
        setHolidayList(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /* eslint-disable  */
  useEffect(() => {
    getHoliday();
  }, []);
  /* eslint-disable  */
  const getOvertimeShift = async () => {
    try {
      const response = await overtimeShifts();
      if (response?.meta.code === 200) {
        const data = response?.data;
        setOvertimeList(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOvertimeShift();
  }, []);
  const handleDate = (date) => {
    setDate(date);
    setSelectedOvertimeShift('');
  };

  const findHoliday = holidayList.find((find) => find.date === moment(date).format('YYYY-MM-DD'));

  const filterShift = findHoliday?.name
    ? overtimeList.filter((filter) => filter.day === 0)
    : overtimeList.filter((filter) => filter.day === moment(date).day());

  const minDate = moment().subtract(1, 'weeks').toDate();
  const { helmet, favicon } = useHead();

  const handleSubmitOvertimeRequest = async () => {
    if (selectedCards.length === 0) {
      return toast.warn('Staff belum dipilih');
    } else if (!selectedOvertimeShift) {
      return toast.warn('Shift belum dipilih');
    } else if (!note) {
      setNoteError('Keterangan belum diisi');
      toast.warn('Keterangan belum diisi');
      return;
    }
    try {
      setLoading(true);
      const body = {
        date: findHoliday?.date || moment(date).format('YYYY-MM-DD'),
        overtime_shift_id: selectedOvertimeShift?.id,
        staff_ids: selectedCards,
        note: note,
      };
      await submitOvertimeRequest(body)
        .then((res) => {
          if (res.meta.code === 201) {
            toast.success('Lembur diajukan');
            navigate('/overtime-request');
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>

      <Box sx={{ overflow: 'hidden', px: 4, py: 3, justifyContent: 'flex-start' }}>
        <Grid container spacing={2}>
          <Grid item lg={9}>
            <Grid container>
              <Grid item lg={12}>
                <Grid container spacing={3}>
                  <Grid item lg={6} md={6}>
                    <></>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} sx={{ mb: 3 }}>
                    <FormControl variant="outlined" sx={{ width: '100%' }}>
                      <InputLabel htmlFor="outlined-adornment-password">Cari Kode/Nama/Jabatan</InputLabel>
                      <OutlinedInput
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        id="outlined-adornment-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        }
                        label="Cari Kode/Nama/Jabatan"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={12}>
                    {isLoading ? (
                      <Grid
                        container
                        width={'auto'}
                        overflow={'auto'}
                        height={'450px'}
                        spacing={2}
                        justifyContent={'center'}
                        alignItems={'center'}
                      >
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                          <CircularProgress color="color" />
                        </Grid>
                      </Grid>
                    ) : (
                      <>
                        <Grid container spacing={3}>
                          <Grid item lg={12}>
                            <StaffsContainer>
                              <Grid container spacing={3}>
                                {data.map((item, index) => (
                                  <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                                    <StaffCard
                                      data={item}
                                      add
                                      selected={selectedCards.includes(item.id)}
                                      onClick={() => handleCardSelect(item.id)}
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            </StaffsContainer>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={3}>
            <Grid container>
              <Grid item lg={12}>
                <SummaryContainer>
                  <Grid
                    container
                    sx={{
                      borderRadius: '20px',
                      height: 'auto',
                      mt: { lg: 0, md: 0, sx: 2, sm: 2 },
                    }}
                  >
                    <SummaryContainer>
                      <Grid container spacing={2}>
                        <Grid item xs={12} lg={12}>
                          <Typography component="p" variant="p" fontSize={16}>
                            Tanggal Lembur
                          </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <DatePicker
                            sx={{ width: '100%', borderRadius: 1, fontSize: 18 }}
                            variant="outlined"
                            value={date}
                            onChange={handleDate}
                            minDate={moment(minDate)}
                            maxDate={moment()}
                            format="DD MMMM YYYY"
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                        </Grid>
                        {findHoliday?.name ? (
                          <Grid item xs={12} sm={12} md={12} lg={12} display={'flex'}>
                            <Typography component="p" variant="p" fontSize={18}>
                              *NB :
                            </Typography>
                            <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} ml={1}>
                              {findHoliday?.name}
                            </Typography>
                          </Grid>
                        ) : null}
                        <Grid item xs={12} lg={12}>
                          <Typography component="p" variant="p" fontSize={16}>
                            Shift Lembur
                          </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <FormControl fullWidth>
                            <Select
                              variant="outlined"
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              value={selectedOvertimeShift}
                              onChange={(event) => setSelectedOvertimeShift(event.target.value)}
                            >
                              {filterShift.map((item) => (
                                <MenuItem key={item.id} value={item}>
                                  {item.start_at.slice(0, -3)} - {item.finish_at.slice(0, -3)}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        {selectedOvertimeShift && (
                          <Grid item xs={12} sm={12} md={12} lg={12} display={'flex'}>
                            <Typography component="p" variant="p" fontSize={14} mx={0}>
                              Total Jam Lembur:
                            </Typography>
                            <Typography component="p" variant="p" fontSize={14} fontWeight={'700'} ml={1}>
                              {selectedOvertimeShift.payable_duration / 60} Jam
                            </Typography>
                          </Grid>
                        )}
                        <Grid item xs={12} lg={12}>
                          <Typography component="p" variant="p" fontSize={16}>
                            Keterangan
                          </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <TextField
                            id="outlined"
                            placeholder="Tuliskan keterangan kegiatan"
                            type="text"
                            fullWidth
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            error={!!noteError}
                            helperText={noteError}
                            multiline
                            inputProps={{
                              maxLength: 255,
                            }}
                            minRows={2}
                            maxRows={3}
                          />
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <Typography variant="h6" component="h4" sx={{ textAlign: 'left', listStyle: 'none' }}>
                            Peserta :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <Typography
                            component="p"
                            variant="p"
                            fontSize={20}
                            sx={{ textAlign: 'left', listStyle: 'none' }}
                          >
                            {selectedCards.map((cardId, index) => {
                              const selectedCard = data.find((item) => item.id === cardId);
                              return selectedCard ? (
                                <Typography
                                  component="p"
                                  variant="p"
                                  fontSize={18}
                                  fontWeight={'400'}
                                  key={selectedCard.id}
                                >
                                  {index + 1}. {selectedCard.name}
                                </Typography>
                              ) : null;
                            })}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} lg={12}>
                          <LoadingButton
                            fullWidth
                            loading={loading}
                            role="CircularProgress"
                            size="large"
                            type="submit"
                            variant="contained"
                            onClick={handleSubmitOvertimeRequest}
                            color="color"
                          >
                            AJUKAN
                          </LoadingButton>
                          {/* <Button
                            color="color"
                            variant="contained"
                            label="AJUKAN"
                            size="large"
                            fullWidth={true}
                            onClick={handleSubmitOvertimeRequest}
                          /> */}
                        </Grid>
                      </Grid>
                    </SummaryContainer>
                  </Grid>
                </SummaryContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
