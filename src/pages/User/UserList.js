import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
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
import { toast } from 'react-toastify';
import { Button, LoadingComponent, ModalAddNewUser, ModalComponent, ModalEditUser, Pagination } from '../../components';
import { useDebounce } from 'src/hooks/useDebounce';
import { getUser, getDepartment, getSuperAdminUser, getManagedAdminDepartment } from '../../API';
import { useHead } from 'src/context/HeadContext';
import TemporaryPasswordModal from 'src/components/SubModal/TemporaryPassword';
import { useAuth } from 'src/context/AuthContext';

// components

// ----------------------------------------------------------------------

export default function UserList() {
  const { role } = useAuth();
  const roles = role[0]?.name;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [id, setId] = useState('');
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const [department, setDepartment] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [temporaryPasswordInfo, setTemporaryPasswordInfo] = useState({});
  const [showTemporaryPasswordModal, setShowTemporaryPasswordModal] = useState(false);
  const [temporaryPasswordModalHeader, setTemporaryPasswordModalHeader] = useState('');

  const handleEditModal = (id) => {
    setId(id);
    setIsEditModalOpen(true);
  };

  const handleChildData = () => {
    if (department || search || currentPage !== 1) {
      setDepartment(null);
      setSearch('');
      setDebouncedSearch('');
      setCurrentPage(1);
    } else {
      getUserList(department, debouncedSearch, size, currentPage);
    }
  };

  const getUserList = async (department, search, size, page) => {
    setIsLoading(true);
    try {
      const response =
        roles === 'admin'
          ? await getUser(department?.id, search, size, page)
          : await getSuperAdminUser(department?.id, search, size, page);
      if (response?.meta.code === 200) {
        const data = response?.data;
        setData(data);
        setTotalPages(response?.page_info?.last_page);
      }
    } catch (error) {
      console.log(error);
      toast.error('Gagal ambil data');
    } finally {
      setIsLoading(false);
    }
  };
  const getAllDepartments = async () => {
    try {
      const response = roles === 'admin' ? await getDepartment() : await getManagedAdminDepartment();
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
  useEffect(() => {
    setDebouncedSearch(debouncedValue);
    setCurrentPage(1);
  }, [debouncedValue]);

  useEffect(() => {
    getUserList(department, debouncedSearch, size, currentPage);
  }, [department, debouncedSearch, currentPage]);

  useEffect(() => {
    getAllDepartments();
  }, []);

  const handleDepartment = (event, newValue) => {
    if (newValue !== null) {
      const selectedOption = departmentList.find((option) => option.id === newValue?.id);
      if (selectedOption) {
        setCurrentPage(1);
        setDepartment(selectedOption);
      }
      setDepartment(newValue);
    } else {
      setDepartment(null);
      setCurrentPage(1);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            <Grid container>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={departmentList}
                    getOptionLabel={(department) => department.name}
                    isOptionEqualToValue={(department, value) => department.id === value.id}
                    value={department}
                    onChange={handleDepartment}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Departmen" />}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={5} lg={7}>
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
                      onChange={(e) => setSearch(e.target.value)}
                      endAdornment={
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      }
                      label="Cari Kode/Nama"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={2} justifyContent="flex-end">
                  <Button
                    color="color"
                    variant="contained"
                    label="TAMBAH"
                    size="large"
                    fullWidth={true}
                    onClick={() => setIsAddModalOpen(true)}
                    px={5}
                    py={1}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <TableContainer
          component={Paper}
          sx={{
            overflowX: 'auto',
          }}
        >
          <Table sx={{ minWidth: '100%', border: '1px solid #ccc' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#ID</TableCell>
                <TableCell>Kode</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Departmen</TableCell>
                <TableCell>Role</TableCell>
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
                <>
                  {data.map((item, index) => (
                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.department.name}</TableCell>
                      <TableCell>{item.roles[0].name}</TableCell>
                      <TableCell>{item.inactive_at === null ? 'Aktif' : 'Tidak Aktif'}</TableCell>
                      <TableCell>
                        <Link sx={{ cursor: 'pointer' }} underline="hover" onClick={() => handleEditModal(item.id)}>
                          [Lihat]
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
                    Tidak ada data yang tersedia
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid item xs={12} justifyContent="flex-end" container mt={2}>
          <Stack direction="row" justifyContent="end">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </Stack>
        </Grid>

        <ModalComponent open={isAddModalOpen} close={() => setIsAddModalOpen(false)} title={'Tambah User'}>
          <ModalAddNewUser
            roles={roles}
            onClick={() => setIsAddModalOpen(false)}
            onDataAdd={handleChildData}
            onSuccessCallback={(data) => {
              setTemporaryPasswordModalHeader('User berhasil ditambahkan');
              setShowTemporaryPasswordModal(true);
              setTemporaryPasswordInfo(data);
            }}
          />
        </ModalComponent>
        <ModalComponent open={isEditModalOpen} close={() => setIsEditModalOpen(false)} title={`Edit User #${id}`}>
          <ModalEditUser
            roles={roles}
            onClick={() => setIsEditModalOpen(false)}
            id={id}
            onDataUpdate={handleChildData}
            onSuccessCallback={(data) => {
              setTemporaryPasswordModalHeader('Reset Password Berhasil');
              setShowTemporaryPasswordModal(true);
              setTemporaryPasswordInfo(data);
            }}
          />
        </ModalComponent>
        <ModalComponent
          open={showTemporaryPasswordModal}
          close={() => setShowTemporaryPasswordModal(false)}
          title={temporaryPasswordModalHeader}
        >
          <TemporaryPasswordModal onClick={() => setShowTemporaryPasswordModal(false)} item={temporaryPasswordInfo} />
        </ModalComponent>
      </Box>
    </>
  );
}
