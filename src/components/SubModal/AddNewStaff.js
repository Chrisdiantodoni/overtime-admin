import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, Typography, InputLabel, FormControl, FormHelperText, Select, MenuItem, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { addNewStaff, uploadStaffImage, getDepartment } from 'src/API';
import PlaceholderImage from '../../assets/staff-image-placeholder.png';
import { LoadingButton } from '@mui/lab';

const ModalAddNewStaff = ({ onClick, onDataAdd }) => {
  const [status, setStatus] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [departmentError, setDepartmentError] = useState('');
  const [nameError, setNameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [levelError, setLevelError] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        toast.error('File size exceeds 1 MB limit.');
        event.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      setImage(selectedFile);
    }
  };
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleAddNewStaff = async () => {
    try {
      const body = {
        code,
        name,
        job_position: level,
        is_active: 1,
        department_id: department?.id,
      };
      console.log(body);
      setIsLoading(true);
      if (!name || !code || !level || !department?.id) {
        if (!name) setNameError('Nama harus diisi');
        if (!code) setCodeError('Kode harus diisi');
        if (!level) setLevelError('Jabatan harus diisi');
        if (!department?.id) setDepartmentError('Departmen harus dipilih');
        setIsLoading(false);
        return;
      }
      let newStaffId = null;
      const addStaffResponse = await addNewStaff(body);
      if (addStaffResponse.meta.code === 201) {
        toast.success('Staff telah ditambahkan');
        newStaffId = addStaffResponse.data.id;
        setIsLoading(true);
        onDataAdd(body, newStaffId);

        onClick();
      }
      if (previewImage) {
        const formData = new FormData();
        formData.append('staff_id', newStaffId);
        formData.append('staff_image', image);
        await uploadStaffImage(formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then((res) => {
            if (res.meta.code === 200) {
              console.log(res);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error('Gambar gagal diupload');
          });
      }
    } catch (error) {
      const errors = error;
      console.log(error);
      if (errors.department_id) {
        toast.error('Departmen tidak ada');
      } else if (errors.code) {
        toast.error('Kode user sudah digunakan');
      } else {
        toast.error('Gambar tidak boleh lebih dari 1MB');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllDepartments();
  }, []);

  const getAllDepartments = async () => {
    try {
      const response = await getDepartment();
      if (response.meta.status === 'OK') {
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
    const selectedDepartment = departmentList.find((option) => option.id === newValue?.id);
    if (selectedDepartment) {
      setDepartment(selectedDepartment);
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <Box
            component="div"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: '20px',
              backgroundColor: '#EFEDED',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 20, aspectRatio: 1 / 1 }}
              />
            ) : (
              <img
                src={PlaceholderImage}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 20, aspectRatio: 1 / 1 }}
              />
            )}
          </Box>
        </label>

        <input
          id="file-upload"
          type="file"
          accept=".jpg, .jpeg, .png"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <Typography variant="h4" component="h2" sx={{ color: '#000000', textAlign: 'left', listStyle: 'none' }}>
          Foto Profil
        </Typography>
        <ul
          style={{
            paddingLeft: 15,
          }}
        >
          <li>
            <Typography variant="body1" component="p" sx={{ color: '#000000', textAlign: 'left' }}>
              Hanya .jpg, .jpeg, dan .png
            </Typography>
          </li>
          <li>
            <Typography variant="body1" component="p" sx={{ color: '#000000', textAlign: 'left' }}>
              Maksimal 1Mb
            </Typography>
          </li>
        </ul>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6}>
        <TextField
          id="outlined"
          label="Nama"
          fullWidth
          value={name}
          error={!!nameError}
          helperText={nameError}
          onChange={(event) => setName(event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          id="outlined"
          label="Kode"
          fullWidth
          value={code}
          error={!!codeError}
          helperText={codeError}
          onChange={(event) => setCode(event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            label="Status"
            onChange={handleChange}
            disabled
          >
            <MenuItem value={status}>Aktif</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <FormControl fullWidth error={!!departmentError}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={departmentList}
            value={department}
            onChange={handleDepartment}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label="Departmen" error={!!departmentError} fullWidth />}
          />
          {departmentError && <FormHelperText>{departmentError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          id="outlined"
          label="Jabatan"
          error={!!levelError}
          helperText={levelError}
          fullWidth
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={6} lg={8} />
      <Grid item xs={12} sm={6} lg={4}>
        <LoadingButton
          color="color"
          variant="contained"
          fullWidth={true}
          loading={isLoading}
          role="CircularProgress"
          size="large"
          onClick={handleAddNewStaff}
        >
          TAMBAH
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default ModalAddNewStaff;
