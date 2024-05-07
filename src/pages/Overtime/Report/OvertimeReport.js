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
  Autocomplete,
  TextField,
  Link,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import { useDebounce } from 'src/hooks/useDebounce';
import { Button, LoadingComponent, Pagination, DatePicker } from 'src/components';
import { getFormattedDate } from 'src/utils';
import { overTimeStaffs, exportOvertimeStaff, getDepartment } from 'src/API';
import 'moment/locale/id';
import { toast } from 'react-toastify';
import fileDownload from 'js-file-download';
import { useHead } from 'src/context/HeadContext';
import dayjs from 'dayjs';

// components

// ----------------------------------------------------------------------

export default function OvertimeRequestReport() {
  let startDate = new Date();
  startDate.setHours(23, 59, 59);

  const [dateReport, setDateReport] = useState([dayjs().subtract(1, 'day'), dayjs()]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);
  const size = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);

  const getOvertimeStaffs = async (department, search, page) => {
    try {
      setIsLoading(true);
      const startDate = dateReport && dateReport[0] ? dateReport[0].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
      const endDate = dateReport && dateReport[1] ? dateReport[1].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
      const { start, end } = getFormattedDate(startDate, endDate);
      const response = await overTimeStaffs(department?.id, start, end, search, size, page);
      if (response?.meta.code === 200) {
        setData(response?.data);
        setTotalPages(response?.page_info?.last_page || 0);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response.data.meta.errors['filter.date_range.end_at'][0] ===
        'filter.date_range.end_at cant be greater than current time'
      ) {
        toast.error('Tidak bisa memilih tanggal di atas hari ini');
      } else {
        toast.error('Terjadi kesalahan saat mengambil data.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  /* eslint-disable  */
  useEffect(() => {
    getOvertimeStaffs(department, debouncedSearch, currentPage);
  }, [department, debouncedSearch, currentPage, dateReport]);
  /* eslint-disable  */

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
    setCurrentPage(1);
  }, [debouncedValue]);

  useEffect(() => {
    getAllDepartments();
  }, []);

  const getAllDepartments = async () => {
    try {
      const response = await getDepartment();
      if (response.meta.code === 200) {
        const data = response?.data;
        const modifiedOptions = data.map((option) => ({
          id: option.id,
          name: option.name,
        }));
        setDepartmentList(modifiedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDepartment = (event, newValue) => {
    if (newValue !== null) {
      const selectedDepartment = departmentList.find((option) => option.id === newValue?.id);
      if (selectedDepartment) {
        setDepartment(selectedDepartment);
        setCurrentPage(1);
      }
      setDepartment(newValue);
    } else {
      setCurrentPage(1);
      setDepartment(null);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const exportReport = async () => {
    try {
      const startDate = dateReport && dateReport[0] ? dateReport[0].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
      const endDate = dateReport && dateReport[1] ? dateReport[1].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
      const { start, end } = getFormattedDate(startDate, endDate);
      const { data } = await exportOvertimeStaff(department?.id, start, end, search);
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fileDownload(blob, `overtime-staff-report ${start} - ${end}.xlsx`);
    } catch (error) {
      console.log(error);
    }
  };

  const { helmet, favicon } = useHead();
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

      <Box sx={{ display: 'flex', overflow: 'hidden', flexDirection: 'row', px: 4, py: 3 }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={12} md={6} lg={2.5}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={departmentList}
                  value={department}
                  onChange={handleDepartment}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  sx={{ width: '100%' }}
                  renderInput={(params) => <TextField {...params} label="Departemen" />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3.5}>
                <DatePicker
                  style={{ width: '100%', height: '100%' }}
                  value={[dayjs(dateReport[0]), dayjs(dateReport[1])]}
                  onChange={(dateReport) => {
                    if (dateReport) {
                      setDateReport(dateReport);
                    }
                  }}
                  disabledDate={disabledDate}
                  size="large"
                  format="DD MMM YYYY"
                  picker="date"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <FormControl variant="outlined" sx={{ width: '100%' }}>
                  <InputLabel
                    sx={{
                      paddingRight: 5,
                    }}
                  >
                    Cari Kode/Nama
                  </InputLabel>
                  <OutlinedInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    endAdornment={
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    }
                    label="Cari Kode/Nama"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={2}>
                <Button
                  color="color"
                  variant="contained"
                  label="EXPORT"
                  size="large"
                  onClick={exportReport}
                  fullWidth={true}
                  py={1}
                />
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
                  <TableCell>Kode Karyawan</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Departmen</TableCell>
                  <TableCell>Jabatan</TableCell>
                  <TableCell>Lembur (jam)</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LoadingComponent />
                    </TableCell>
                  </TableRow>
                ) : data.length !== 0 ? (
                  data.map((item, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.department.name}</TableCell>
                      <TableCell>{item.job_position}</TableCell>
                      <TableCell>{(item.approved_overtime_requests_sum_payable_duration / 60).toFixed(2)}</TableCell>
                      <TableCell>
                        <Link
                          href={`/staff/${item.id}/approved-overtime-request?startDate=${dateReport[0].format(
                            'YYYY-MM-DD'
                          )}&endDate=${dateReport[1].format('YYYY-MM-DD')}`}
                          target="_blank"
                          underline="hover"
                          sx={{ cursor: 'pointer' }}
                        >
                          [Lihat Rincian]
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
