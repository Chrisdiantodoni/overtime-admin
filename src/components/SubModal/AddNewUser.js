import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { toast } from 'react-toastify';
import { Grid, InputLabel, FormControl, FormHelperText, Select, MenuItem } from '@mui/material';
import { addNewAdmin, getDepartment, register } from 'src/API';
import { LoadingButton } from '@mui/lab';
import { getManagedAdminDepartment } from 'src/API/departments';

const ModalAddNewStaff = ({ onClick, onDataAdd, roles, onSuccessCallback }) => {
  const [role, setRole] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [departmentError, setDepartmentError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const status = 'Aktif';
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const getAllDepartments = async () => {
    try {
      const response = roles === 'admin' ? await getDepartment() : await getManagedAdminDepartment();
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
    const selectedDepartment = departmentList.find((find) => find.id === newValue?.id);
    if (selectedDepartment) {
      setDepartment(selectedDepartment);
    }
  };

  useEffect(() => {
    getAllDepartments();
  }, []);
  const validateUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_.]{6,20}$/;
    return usernamePattern.test(username);
  };
  const handleAddNewUser = async () => {
    setIsLoading(true);
    setUsernameError('');
    setNameError('');
    setCodeError('');
    setStatusError('');
    setDepartmentError('');

    if (!name || !code || !username || !department?.id) {
      toast.error('Terdapat inputan yang masih kosong');
      if (!name) setNameError('Nama harus diisi');
      if (!code) setCodeError('Kode harus diisi');
      if (!username) setUsernameError('Username harus diisi');
      if (!department?.id) setDepartmentError('Departmen harus dipilih');
      setIsLoading(false);
      return;
    }
    if (!validateUsername(username)) {
      setUsernameError('username harus berisi 6-20 karakter alfanumerik, underscore, atau dot, dan harus unik.');
      setIsLoading(false);
      return;
    }
    if (roles === 'admin') {
      const body = {
        username: username.toLowerCase(),
        code,
        name,
        role,
        department_id: department?.id,
        is_active: 1,
      };
      await register(body)
        .then(async (res) => {
          if (res.meta.code === 201) {
            setIsLoading(false);
            onDataAdd(body);
            onSuccessCallback(res);
            onClick();
          }
        })
        .catch((error) => {
          const errors = error.response.data.meta.errors;
          console.log(errors);
          if (errors.username) {
            toast.error('Username sudah digunakan');
          } else if (errors.code) {
            toast.error('Kode user sudah digunakan');
          }
          setIsLoading(false);
        });
    } else {
      const body = {
        username: username.toLowerCase(),
        code,
        name,
        role: 'admin',
        department_id: department?.id,
        is_active: 1,
      };
      await addNewAdmin(body)
        .then(async (res) => {
          if (res.meta.code === 201) {
            setIsLoading(false);
            onDataAdd(body);
            onSuccessCallback(res);
            onClick();
          }
        })
        .catch((error) => {
          const errors = error.response.data.meta.errors;
          console.log(errors);
          if (errors.username) {
            toast.error('Username sudah digunakan');
          } else if (errors.code) {
            toast.error('Kode user sudah digunakan');
          }
          setIsLoading(false);
        });
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6}>
        <TextField
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          id="outlined-required"
          label="Kode"
          fullWidth
          error={!!codeError}
          helperText={codeError}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          id="outlined-required"
          label="Nama"
          fullWidth
          error={!!nameError}
          helperText={nameError}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <FormControl fullWidth error={!!statusError}>
          <InputLabel required id="demo-simple-select-helper-label">
            Role
          </InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={roles === 'super-admin' ? 'admin' : role}
            label="Status"
            onChange={handleChange}
            disabled={roles === 'super-admin' ? true : false}
          >
            {roles === 'super-admin' ? <MenuItem value={'admin'}>Admin</MenuItem> : null}
            <MenuItem value={'requester'}>Requester</MenuItem>
            <MenuItem value={'approver'}>Approver</MenuItem>
          </Select>
          {statusError && <FormHelperText>{statusError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={6}>
        <FormControl fullWidth error={!!departmentError}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={departmentList}
            value={department}
            onChange={handleDepartment}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} required label="Departemen" error={!!departmentError} fullWidth />
            )}
          />
          {departmentError && <FormHelperText>{departmentError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          required
          id="outlined-required"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
          fullWidth
          error={!!usernameError}
          helperText={usernameError}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={status}
            label="Status"
            disabled
          >
            <MenuItem value={status}>Aktif</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item lg={8} />
      <Grid item xs={12} lg={4}>
        <LoadingButton
          role="CircularProgress"
          loading={isLoading}
          color="color"
          variant="contained"
          fullWidth
          size="large"
          onClick={() => handleAddNewUser()}
        >
          SIMPAN
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default ModalAddNewStaff;
