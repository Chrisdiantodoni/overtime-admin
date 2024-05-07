import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, Typography, InputLabel, FormControl, FormHelperText, Select, MenuItem, Box } from '@mui/material';
import { staffDetail, editStaff, getDepartment, deleteStaff, deleteStaffImageAdmin, uploadStaffImage } from '../../API';
import PlaceholderImage from '../../assets/staff-image-placeholder.png';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const ModalEditStaff = ({ id, onClick, onDataUpdate }) => {
  const [status, setStatus] = useState('');
  const [previewImage, setPreviewImage] = React.useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [departmentError, setDepartmentError] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState('');
  const [nameError, setNameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [levelError, setLevelError] = useState('');
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState('');
  const [imageUpdated, setImageUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setImage(selectedFile);
      };
      reader.readAsDataURL(selectedFile);
      setImageUpdated(true);
    }
  };

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

  const handleDepartment = async (event, newValue) => {
    const selectedOption = departmentList.find((option) => option.id === newValue?.id);
    if (selectedOption) {
      setDepartment(selectedOption);
    }
  };

  const getStaffDetail = async () => {
    try {
      const response = await staffDetail(id);
      if (response?.meta.code === 200) {
        const data = response?.data;
        setName(data?.name);
        setCode(data?.code);
        setLevel(data?.job_position);
        setDepartment(data?.department);
        setStatus(data?.inactive_at);
        setPreviewImage(data?.staff_image?.url);
        setImageId(data?.staff_image?.id);
        if (data?.inactive_at) {
          setStatus(false);
        } else {
          setStatus(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  /* eslint-disable */
  useEffect(() => {
    getStaffDetail();
  }, []);
  /* eslint-disable */
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleEditStaff = async () => {
    setIsLoading(true);
    setNameError('');
    setCodeError('');
    setDepartmentError('');
    setLevelError('');
    const body = {
      code,
      name,
      job_position: level,
      is_active: status === true ? 1 : 0,
      department_id: department?.id,
    };
    console.log(body);
    if (!name || !code || !name || !level || !department?.id) {
      toast.error('Terdapat inputan yang masih kosong');
      if (!name) setNameError('Nama harus diisi');
      if (!code) setCodeError('Kode harus diisi');
      if (!level) setLevelError('Status harus dipilih');
      if (!department?.id) setDepartmentError('Departmen harus dipilih');
      setIsLoading(false);
      return;
    }
    if (imageUpdated) {
      if (imageId) {
        await deleteStaffImageAdmin(imageId);
      }
      const formData = new FormData();
      formData.append('staff_id', id);
      formData.append('staff_image', image);
      const uploadResponse = await uploadStaffImage(formData);
      if (uploadResponse.meta.code === 200) {
      } else {
        toast.error('Gambar gagal diupload');
      }
    }

    await editStaff(id, body)
      .then((res) => {
        if (res.meta.code === 200) {
          toast.success('User berhasil diedit');
        }

        onDataUpdate();
        onClick();
      })
      .catch((error) => {
        const errors = error;
        console.log(error);
        if (errors.username) {
          toast.error('Username sudah digunakan');
        } else if (errors.code) {
          toast.error('Kode user sudah digunakan');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDeleteStaff = async () => {
    try {
      setIsDeleteLoading(true);
      await deleteStaff(id)
        .then((res) => {
          if (res.meta.code === 200) {
            toast.success('Data dengan ' + code + 'Telah dihapus');
          }
          onClick();
          onDataUpdate(id);
        })
        .catch((err) => {
          console.log(err);
          toast.error('Gagal hapus staff');
        })
        .finally(() => {
          setIsDeleteLoading(false);
        });
    } catch (error) {
      console.log(error);
      toast.error('Gagal hapus staff');
      setIsDeleteLoading(false);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={12} md={6} lg={3}>
        <label
          htmlFor="file-upload"
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Box
            component="div"
            sx={{
              width: '100%',
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
              position: 'relative',
            }}
          >
            <Typography
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: isHovered ? 'block' : 'none',
                color: '#fff',
                fontWeight: 'bold',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                padding: '5px 10px',
                zIndex: 1,
                textAlign: 'center',
              }}
            >
              Upload Photo
            </Typography>

            {previewImage ? (
              <img
                src={`${previewImage}`}
                alt="Preview"
                style={{ width: '100%', height: '100%', aspectRatio: 1 / 1, objectFit: 'contain', borderRadius: 20 }}
              />
            ) : (
              <img
                src={PlaceholderImage}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 20 }}
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
      <Grid item xs={12} md={12} lg={6}>
        <TextField
          error={!!nameError}
          helperText={nameError}
          required
          id="outlined-required"
          value={name}
          onChange={(event) => setName(event.target.value)}
          label="Nama"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <TextField
          error={!!codeError}
          helperText={codeError}
          required
          id="outlined-required"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          label="Kode"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <FormControl fullWidth>
          <InputLabel required id="demo-simple-select-helper-label">
            Status
          </InputLabel>
          <Select
            required
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            label="Status"
            onChange={handleChangeStatus}
          >
            <MenuItem value={true}>Aktif</MenuItem>
            <MenuItem value={false}>Tidak Aktif</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <FormControl fullWidth error={!!departmentError}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={departmentList}
            value={department}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleDepartment}
            renderInput={(params) => (
              <TextField {...params} label="Departemen" required error={!!departmentError} fullWidth />
            )}
          />
          {departmentError && <FormHelperText>{departmentError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <TextField
          value={level}
          error={!!levelError}
          helperText={levelError}
          onChange={(event) => setLevel(event.target.value)}
          required
          id="outlined-required"
          label="Jabatan"
          fullWidth
        />
      </Grid>
      <Grid item xs={4} lg={4} />
      <Grid item xs={4} md={4} lg={4}>
        <LoadingButton
          color="color"
          fullWidth={true}
          loading={isDeleteLoading}
          role="CircularProgress"
          variant="outlined"
          size="large"
          onClick={handleDeleteStaff}
        >
          HAPUS
        </LoadingButton>
      </Grid>
      <Grid item xs={4} md={4} lg={4}>
        <LoadingButton
          color="color"
          fullWidth={true}
          loading={isLoading}
          role="CircularProgress"
          variant="contained"
          size="large"
          onClick={handleEditStaff}
        >
          EDIT
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default ModalEditStaff;
