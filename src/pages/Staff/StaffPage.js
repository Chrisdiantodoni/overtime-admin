import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import {
  Grid,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Paper,
  Box,
  CssBaseline,
  Skeleton,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// components
import { StaffCard, Pagination, Button, ModalComponent, ModalAddStaff, EditStaff } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { getStaff, getOwnStaff } from '../../API';
import { useHead } from 'src/context/HeadContext';
import { getAllDepartments, getManagedDepartments } from 'src/API/departments';

// ----------------------------------------------------------------------

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function StaffPage() {
  const [search, setSearch] = useState('');
  const [addModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalOpen, setIsEditModalOpen] = useState(false);
  const { role } = useAuth();
  const { helmet, favicon } = useHead();
  const roles = role[0]?.name || '';
  const [data, setData] = useState([]);
  const size = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [options, setOptions] = useState([]);
  const [department, setDepartment] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debouncedValue = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState('');
  const handleEditModal = (item) => {
    setId(item.id);
    setIsEditModalOpen(true);
  };

  const getStaffs = useCallback(
    async (department, search, page) => {
      try {
        setIsLoading(true);
        const response =
          roles === 'admin'
            ? await getStaff(department?.id, search, size, page)
            : await getOwnStaff(department?.id, search, size, page);
        if (response?.meta.code === 200) {
          const data = response?.data;
          setData(data);
          const totalCount = response?.page_info?.last_page;
          setTotalPages(totalCount);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [roles]
  );

  const getDepartments = useCallback(async () => {
    try {
      const response = roles === 'admin' ? await getAllDepartments() : await getManagedDepartments();
      if (response.meta.code === 200) {
        const data = response?.data;
        const modifiedOptions = data.map((option) => ({
          id: option.id,
          name: option.name,
        }));
        setOptions(modifiedOptions);
      }
    } catch (error) {
      console.log(error);
    }
  }, [roles]);

  useEffect(() => {
    getStaffs(department, debouncedSearch, currentPage);
  }, [department, debouncedSearch, currentPage, getStaffs]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  useEffect(() => {
    setDebouncedSearch(debouncedValue);
    setCurrentPage(1);
  }, [debouncedValue]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChildData = () => {
    if (department || search || currentPage !== 1) {
      setDepartment(null);
      setSearch('');
      setDebouncedSearch('');
      setCurrentPage(1);
    } else {
      getStaffs(department, debouncedSearch, currentPage);
    }
  };

  const handleDepartment = (event, newValue) => {
    if (newValue !== null) {
      const selectedOption = options.find((option) => option.id === newValue?.id);
      if (selectedOption) {
        setDepartment(selectedOption);
        setCurrentPage(1);
      }
      setDepartment(newValue);
    } else {
      setCurrentPage(1);
      setDepartment(null);
    }
  };
  helmet.title = 'Staff | Overtime System';
  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>

      <ModalComponent open={addModalOpen} close={() => setIsAddModalOpen(false)} title={'Tambah Staff'}>
        <ModalAddStaff onClick={() => setIsAddModalOpen(false)} onDataAdd={handleChildData} />
      </ModalComponent>
      <ModalComponent open={editModalOpen} close={() => setIsEditModalOpen(false)} title={`Edit Staff #${id}`}>
        <EditStaff id={id} onClick={() => setIsEditModalOpen(false)} onDataUpdate={handleChildData} />
      </ModalComponent>
      <Box sx={{ display: 'flex', overflow: 'hidden', flexDirection: 'row', px: 4, py: 3 }}>
        <CssBaseline />
        <Grid container>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={department}
                onChange={handleDepartment}
                options={options}
                getOptionLabel={(department) => department.name}
                isOptionEqualToValue={(department, value) => department.id === value.id}
                fullWidth
                renderInput={(params) => <TextField {...params} label="Departemen" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={roles === 'admin' ? 6 : 8} lg={roles === 'admin' ? 7 : 9}>
              <FormControl variant="outlined" sx={{ width: '100%' }}>
                <InputLabel
                  variant="outlined"
                  sx={{
                    paddingRight: 5,
                  }}
                >
                  Cari Kode/Nama/Jabatan
                </InputLabel>
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
            {roles === 'admin' ? (
              <Grid item xs={12} sm={12} md={2} lg={2}>
                <Button
                  color="color"
                  variant="contained"
                  label="TAMBAH"
                  onClick={() => setIsAddModalOpen(true)}
                  px={8}
                  py={1}
                  fullWidth={true}
                />
              </Grid>
            ) : null}
          </Grid>

          {/* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}> */}
          <Grid container spacing={2}>
            {isLoading ? (
              Array.from({ length: 20 }, (_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      width: 'auto',
                      borderRadius: '20px',
                      backgroundColor: '#F6F5F5',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      justifyContent: 'center',
                      alignItems: 'center',
                      py: 2,
                      height: '100%',
                    }}
                  >
                    <Skeleton variant="rectangular" width={160} height={160} />
                    <Skeleton height={40} width="80%" />
                    <Skeleton height={40} width="80%" />
                    <Skeleton height={40} width="80%" />
                  </Box>
                </Grid>
              ))
            ) : data.length !== 0 ? (
              data.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <StaffCard data={item} onClick={roles === 'admin' ? () => handleEditModal(item) : null} />
                  {item.length === 1 ? <Grid item lg={3} /> : null}
                </Grid>
              ))
            ) : data.length === 0 ? (
              <Box sx={{ display: 'flex', overflow: 'hidden', flexDirection: 'row', px: 4, py: 3 }}>
                <Grid container>
                  <Grid item lg={12}>
                    <Item>
                      <Typography>Tidak ada data yang tersedia</Typography>
                    </Item>
                  </Grid>
                </Grid>
              </Box>
            ) : null}
          </Grid>

          <Box sx={{ py: 2, width: '100%' }}>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
