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
  Link,
} from '@mui/material';
import moment from 'moment';
import { Search } from '@mui/icons-material';
import {
  Button,
  ModalAddHoliday,
  ModalComponent,
  ModalEditHoliday,
  Pagination,
  LoadingComponent,
} from '../../components';
import { deleteHoliday, holidayList } from '../../API';
import { useDebounce } from 'src/hooks/useDebounce';
import { useSorting } from 'src/context/SortingContext';
import { useHead } from 'src/context/HeadContext';
import { toast } from 'react-toastify';

export default function Holiday() {
  const [id, setId] = useState('');
  const [search, setSearch] = useState('');
  const [isShowAddModal, setIsShowModal] = useState(false);
  const [isEditModalSHow, setIsEditModalShow] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const size = 10;
  const [isLoading, setIsLoading] = useState(false);
  const { sortBy, sortOrder } = useSorting();
  useEffect(() => {
    setDebouncedSearch(debouncedValue);
    setCurrentPage(1);
  }, [debouncedValue]);

  const handleEditModal = (id) => {
    setId(id);
    setIsEditModalShow(true);
  };

  const getHoliday = async (search, page, sortBy, sortOrder) => {
    try {
      setIsLoading(true);
      const response = await holidayList(search, size, page, sortBy, sortOrder);
      if (response.meta.code === 200) {
        const data = response?.data;
        setTotalPages(response?.page_info?.last_page);
        setData(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildData = () => {
    setSearch('');
    setCurrentPage(1);
  };
  useEffect(() => {
    getHoliday(debouncedSearch, currentPage, sortBy, sortOrder);
  }, [debouncedSearch, currentPage, sortBy, sortOrder]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteHoliday = async (id) => {
    try {
      await deleteHoliday(id).then((res) => {
        if (res.meta.code === 200) {
          toast.success('Hari libur berhasil di hapus');
          getHoliday(debouncedSearch, currentPage, sortBy, sortOrder);
        }
      });
    } catch (error) {
      toast.error('Hari libur gagal dihapus');
    }
  };

  const { helmet, favicon } = useHead();

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>

      <Box sx={{ overflow: 'hidden', px: 4, py: 3 }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={12} md={4} lg={6}>
                <></>
              </Grid>
              <Grid item xs={12} sm={6} md={5} lg={4}>
                <FormControl variant="outlined" sx={{ width: '100%' }}>
                  <InputLabel
                    sx={{
                      paddingRight: 5,
                    }}
                  >
                    Cari Nama
                  </InputLabel>
                  <OutlinedInput
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    endAdornment={
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    }
                    label="Cari Nama"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3} lg={2}>
                <Button
                  color="color"
                  variant="contained"
                  label="TAMBAH"
                  size="large"
                  onClick={() => setIsShowModal(true)}
                  fullWidth={true}
                  py={1}
                />
              </Grid>
            </Grid>
            <TableContainer
              component={Paper}
              sx={{
                overflowX: 'auto',
                width: '100%',
              }}
            >
              <Table sx={{ minWidth: 750, border: '1px solid #ccc' }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '5%' }}>#ID</TableCell>
                    <TableCell width={'20%'}>Tanggal</TableCell>
                    <TableCell width={'30%'}>Nama</TableCell>
                    <TableCell width={'10%'}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell colSpan={6}>
                        <LoadingComponent />
                      </TableCell>
                    </TableRow>
                  ) : data.length !== 0 ? (
                    <>
                      {data.map((item, index) => (
                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{moment(item.date).format('DD MMMM YYYY')}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <Link
                              sx={{ cursor: 'pointer', mr: 2 }}
                              underline="hover"
                              onClick={() => handleEditModal(item.id)}
                            >
                              [Lihat]
                            </Link>
                            <Link
                              sx={{ cursor: 'pointer' }}
                              underline="hover"
                              onClick={() => handleDeleteHoliday(item.id)}
                            >
                              [Hapus]
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : data.length === 0 ? (
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                        Tidak ada data yang tersedia
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid
              item
              xs={12}
              sm={12}
              container
              justifyContent="flex-end"
              sx={{
                marginTop: 2,
              }}
            >
              <Stack direction="row" justifyContent="end">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </Stack>
            </Grid>
          </Grid>
        </Grid>

        <ModalComponent open={isShowAddModal} close={() => setIsShowModal(false)} title={'Tambah Hari Libur'}>
          <ModalAddHoliday onClick={() => setIsShowModal(false)} onDataAdd={handleChildData} />
        </ModalComponent>
        <ModalComponent open={isEditModalSHow} close={() => setIsEditModalShow(false)} title={'Edit Hari Libur'}>
          <ModalEditHoliday id={id} onClick={() => setIsEditModalShow(false)} onDataUpdate={handleChildData} />
        </ModalComponent>
      </Box>
    </>
  );
}
