import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  TableSortLabel,
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { LoadingComponent, DatePicker } from 'src/components';
import { overtimeRequestAdmin } from 'src/API';
import { useAuth } from 'src/context/AuthContext';
import { useHead } from 'src/context/HeadContext';
import { getFormattedDate } from 'src/utils';
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');

export default function StaffApprovedOvertimeRequests() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const timeZone = dayjs.tz.guess();
  const { id } = useParams();
  const { role } = useAuth();
  const roles = role[0]?.name;
  const searchParams = new URLSearchParams(window.location.search);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const [overTimeDate, setOvertimeDate] = useState([dayjs(startDate), dayjs(endDate)]);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const getOvertimeRequest = async (search, page, size, departmentId, status = 'approved') => {
    try {
      setId(id);
      setIsLoading(true);
      const staffId = id;
      const startDate = overTimeDate && overTimeDate[0] ? overTimeDate[0].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
      const endDate = overTimeDate && overTimeDate[1] ? overTimeDate[1].format('YYYY-MM-DD[T]HH:mm:ssZ') : '';
      const { start, end } = getFormattedDate(startDate, endDate);
      const response = await overtimeRequestAdmin(start, end, search, size, page, status, staffId, departmentId, sort);
      if (response?.meta.code === 200) {
        const data = response?.data;
        setData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* eslint-disable  */
  useEffect(() => {
    getOvertimeRequest();
  }, [overTimeDate, sort]);
  /* eslint-disable  */

  const totalPayable = data.reduce((accumulator, item) => {
    return accumulator + item.payable_duration;
  }, 0);

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };
  const { helmet, favicon, setId } = useHead();

  const handleSort = (columnName) => {
    if (sort === columnName) {
      setSort(`-${columnName}`);
    } else {
      setSort(columnName);
    }
  };

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>

      <Box sx={{ display: 'flex', overflow: 'hidden', px: 4, py: 3 }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <DatePicker
                  style={{ height: '100%', width: '100%' }}
                  value={[dayjs(overTimeDate[0]), dayjs(overTimeDate[1])]}
                  onChange={(dates) => {
                    if (dates) {
                      setOvertimeDate(dates);
                    }
                  }}
                  disabledDate={disabledDate}
                  size="large"
                  format="DD MMM YYYY"
                />
              </Grid>
              <Grid lg={4} md={4} sm={0} xs={0} item />
              <Grid item xs={6} sm={4} md={2} lg={2}>
                <Typography component="p" variant="p" fontSize={18}>
                  Total Jam Lembur :
                </Typography>
              </Grid>
              <Grid item xs={6} sm={2} md={2} lg={2}>
                <Typography component="h3" variant="h4">
                  {(totalPayable / 60).toFixed(2)} Jam
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item lg={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 850, border: '1px solid #ccc' }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Kode Pengajuan</TableCell>
                      <TableCell>
                        <TableSortLabel
                          onClick={() => handleSort('created_at')}
                          active={sort === 'created_at' || sort === '-created_at'}
                          direction={sort === 'created_at' ? 'asc' : 'desc'}
                        >
                          Waktu Pengajuan
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          onClick={() => handleSort('start_at')}
                          active={sort === 'start_at' || sort === '-start_at'}
                          direction={sort === 'start_at' ? 'asc' : 'desc'}
                        >
                          Tanggal Lembur
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Diajukan oleh</TableCell>
                      <TableCell>Disetujui saat</TableCell>
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
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                          Tidak ada data yang tersedia
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((item, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{dayjs.utc(item.created_at).tz(timeZone).format('DD MMM YYYY, HH:mm')}</TableCell>
                          <TableCell>{dayjs(item.start_at).format('DD MMM YYYY')}</TableCell>
                          <TableCell>{item.requester_user?.name}</TableCell>
                          <TableCell>{dayjs.utc(item.updated_at).tz(timeZone).format('DD MMM YYYY, HH:mm')}</TableCell>
                          <TableCell>{(item.payable_duration / 60).toFixed(2)}</TableCell>
                          <TableCell>
                            <Link
                              to={
                                roles === 'approver'
                                  ? `/approver/overtime-request/${item.id}`
                                  : roles === 'requester'
                                  ? `/requester/overtime-request/${item.id}`
                                  : `/admin/overtime-request/${item.id}`
                              }
                              underline="hover"
                              sx={{ cursor: 'pointer' }}
                            >
                              [Lihat]
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
