import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import { Button, LoadingComponent, Pagination, DatePicker } from 'src/components';
import { overtimeRequest, overtimeRequestAdmin } from 'src/API';
import { useAuth } from 'src/context/AuthContext';
import { useDebounce } from 'src/hooks/useDebounce';
import { useHead } from 'src/context/HeadContext';
import { getFormattedDate } from 'src/utils';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
// components

// ----------------------------------------------------------------------

export default function OvertimeRequest() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const timeZone = dayjs.tz.guess();
  let startDate = new Date();

  startDate.setHours(23, 59, 59);
  const [date, setDate] = useState([dayjs().subtract(1, 'day'), dayjs()]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const navigate = useNavigate();
  const { role } = useAuth();
  const roles = role[0]?.name;
  const [data, setData] = useState([]);
  const size = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('all');
  const { helmet, favicon } = useHead();
  const [isLoading, setIsLoading] = useState(false);

  const getOvertimeRequest = async (search, page, status, sort) => {
    const startDate = date && date[0] ? date[0].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
    const endDate = date && date[1] ? date[1].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
    const { start, end } = getFormattedDate(startDate, endDate);
    try {
      let overtimeStatus = status;
      if (status === 'all') {
        overtimeStatus = null;
      }

      setIsLoading(true);
      const response =
        roles === 'admin'
          ? await overtimeRequestAdmin(start, end, search, size, page, overtimeStatus, sort)
          : await overtimeRequest(start, end, search, size, page, overtimeStatus);
      if (response?.meta.code === 200) {
        setData(response?.data);
        setTotalPages(response?.page_info?.last_page || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  /* eslint-disable  */
  useEffect(() => {
    getOvertimeRequest(debouncedSearch, currentPage, status);
  }, [debouncedSearch, currentPage, status, date]);
  /* eslint-disable  */

  const handleAddOvertimeRequest = () => {
    navigate('/overtime-request/submit');
  };
  useEffect(() => {
    setDebouncedSearch(debouncedValue);
    setCurrentPage(1);
  }, [debouncedValue]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>

      <Box sx={{ display: 'row', flexDirection: 'row', overflow: 'hidden', px: 4, py: 3 }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container>
              <Grid
                container
                spacing={2}
                sx={{
                  mb: 4,
                }}
              >
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-simple-select-label">Status Pengajuan</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={status}
                      label="Status Pengajuan"
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      <MenuItem value={'rejected'}>Ditolak</MenuItem>
                      <MenuItem value={'pending'}>Pending</MenuItem>
                      <MenuItem value={'approved'}>Disetujui</MenuItem>
                      <MenuItem value={'void'}>Void</MenuItem>
                      <MenuItem value={'all'}>Semua Status</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <DatePicker
                    style={{ width: '100%', height: '100%' }}
                    value={[dayjs(date[0]), dayjs(date[1])]}
                    onChange={(dates) => {
                      if (dates) {
                        setDate(dates);
                      }
                    }}
                    disabledDate={disabledDate}
                    size="large"
                    format="DD MMM YYYY"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={roles === 'approver' ? 6 : roles === 'requester' ? 4 : 6}
                  lg={roles === 'approver' ? 6 : roles === 'requester' ? 4 : 6}
                >
                  <FormControl variant="outlined" sx={{ width: '100%' }}>
                    <InputLabel
                      sx={{
                        paddingRight: 5,
                      }}
                    >
                      Cari Kode Pengajuan
                    </InputLabel>
                    <OutlinedInput
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      endAdornment={
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      }
                      label="Cari Kode Pengajuan"
                    />
                  </FormControl>
                </Grid>
                {roles === 'requester' ? (
                  <Grid item xs={12} sm={12} md={2} lg={2} container justifyContent="flex-end">
                    <Button
                      fullWidth={true}
                      color="color"
                      variant="contained"
                      size="large"
                      label="TAMBAH"
                      onClick={handleAddOvertimeRequest}
                    />
                  </Grid>
                ) : null}
              </Grid>
            </Grid>
          </Grid>
          <TableContainer
            component={Paper}
            sx={{
              overflowX: 'auto',
            }}
          >
            <Table sx={{ minWidth: 850, border: '1px solid #ccc' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Kode Pengajuan</TableCell>
                  <TableCell>Waktu Pengajuan</TableCell>
                  <TableCell>Tanggal Lembur</TableCell>
                  <TableCell>Diajukan oleh</TableCell>
                  <TableCell>Jumlah orang</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <LoadingComponent />
                    </TableCell>
                  </TableRow>
                ) : data.length !== 0 ? (
                  data.map((item, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{dayjs.utc(item.created_at).tz(timeZone).format('DD MMM YYYY, HH:mm')}</TableCell>
                      <TableCell>{dayjs(item.start_at).format('DD MMM YYYY')}</TableCell>
                      <TableCell>{item.requester_user?.name}</TableCell>
                      <TableCell>{item.overtime_staffs_count}</TableCell>
                      <TableCell
                        sx={{
                          color:
                            item.status === 'rejected'
                              ? '#E84040'
                              : item.status === 'approved'
                              ? '#028617'
                              : item.status === 'void'
                              ? (theme) => theme.palette.grey[700]
                              : (theme) => theme.palette.grey[700],
                        }}
                      >
                        {item.status === 'rejected'
                          ? 'Ditolak'
                          : item.status === 'approved'
                          ? 'Disetujui'
                          : item.status === 'void'
                          ? 'Void'
                          : 'Pending'}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={
                            roles === 'approver'
                              ? `/approver/overtime-request/${item.id}`
                              : roles === 'requester'
                              ? `/requester/overtime-request/${item.id}`
                              : `/admin/overtime-request/${item.id}`
                          }
                          state={{ status: item.status }}
                        >
                          [Lihat]
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                      Tidak ada data yang tersedia
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid item xs={12} sm={12} container justifyContent="flex-end" mt={2}>
            <Stack direction="row" justifyContent="end">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
