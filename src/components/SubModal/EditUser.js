import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, InputLabel, FormHelperText, FormControl, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  getDepartment,
  userDetail,
  updateUser,
  resetPassword,
  adminDetail,
  resetPasswordAdmin,
  updateAdmin,
  getManagedAdminDepartment,
} from 'src/API';
import { toast } from 'react-toastify';

const ModalEditUser = ({ onClick, id, onDataUpdate, roles, onSuccessCallback }) => {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const [department, setDepartment] = useState(null);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [departmentError, setDepartmentError] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingResetPassword, setLoadingResetPassword] = useState(false);
  const getUserDetail = async (id) => {
    try {
      const response = roles === 'admin' ? await userDetail(id) : await adminDetail(id);
      if (response.meta.code === 200) {
        const data = response.data;
        setDepartment(data?.department);
        setCode(data?.code);
        setUsername(data?.username);
        setName(data?.name);
        setRole(data?.roles[0].name);
        if (data?.inactive_at === null) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };
  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleEdit = async () => {
    setLoadingEdit(true);
    setUsernameError('');
    setNameError('');
    setCodeError('');
    setDepartmentError('');
    const body = {
      username: username.toLowerCase(),
      code,
      name,
      role,
      is_active: status ? 1 : 0,
      department_id: department?.id,
    };

    if (!name || !code || !username || !role || !department?.id) {
      toast.error('Terdapat inputan yang masih kosong');
      if (!name) setNameError('Nama harus diisi');
      if (!code) setCodeError('Kode harus diisi');
      if (!username) setUsernameError('Username harus diisi');
      if (!department?.id) setDepartmentError('Departmen harus dipilih');
      setLoadingEdit(false);
      return;
    }
    if (!validateUsername(username)) {
      setLoadingEdit(false);
      setUsernameError('User harus berisi 6-20 karakter huruf, underscore, atau dot, dan harus unik.');
      return;
    }
    if (roles === 'admin') {
      await updateUser(id, body)
        .then((res) => {
          if (res.meta.code === 200) {
            toast.success('User berhasil diedit');
            onDataUpdate(true);
          }
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
        });
    } else {
      await updateAdmin(id, body)
        .then((res) => {
          if (res.meta.code === 200) {
            toast.success('User berhasil diedit');
            onDataUpdate(true);
          }
          onClick();
        })
        .catch((error) => {
          const errors = error;
          console.log(error);
          setLoadingEdit(false);
          if (errors.username) {
            toast.error('Username sudah digunakan');
          } else if (errors.code) {
            toast.error('Kode user sudah digunakan');
          }
        });
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
    getAllDepartments();
  }, []);
  useEffect(() => {
    getUserDetail(id);
  }, [id]);

  const handleDepartment = async (event, newValue) => {
    const selectedOption = departmentList.find((option) => option.id === newValue?.id);
    if (selectedOption) {
      setDepartment(selectedOption);
    }
  };

  const validateUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_.]{6,20}$/;
    return usernamePattern.test(username);
  };

  const handleResetPassword = async (id) => {
    const body = {
      user_id: id,
    };
    setLoadingResetPassword(true);
    if (roles === 'admin') {
      await resetPassword(body)
        .then(async (res) => {
          if (res.meta.code === 200) {
          }
          onClick();
          onDataUpdate();
          onSuccessCallback(res);
        })
        .catch((error) => {
          setLoadingResetPassword(false);
          const errors = error;
          if (errors.user_id) {
            toast.error('Id pengguna tidak valid');
          }
        });
    } else {
      await resetPasswordAdmin(body)
        .then(async (res) => {
          if (res.meta.code === 200) {
          }
          onClick();
          onDataUpdate();
          onSuccessCallback(res);
        })
        .catch((error) => {
          setLoadingResetPassword(false);
          const errors = error;
          if (errors.user_id) {
            toast.error('Id pengguna tidak valid');
          }
        });
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} lg={6}>
        <TextField
          error={!!codeError}
          helperText={codeError}
          value={code}
          required
          id="outlined-required"
          onChange={(event) => setCode(event.target.value)}
          label="Kode"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          error={!!nameError}
          helperText={nameError}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          id="outlined-required"
          label="Nama"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={role}
            label="Status"
            onChange={handleChange}
            disabled={roles === 'super-admin' ? true : false}
          >
            {roles === 'super-admin' ? <MenuItem value={'admin'}>Admin</MenuItem> : null}
            <MenuItem value={'requester'}>Requester</MenuItem>
            <MenuItem value={'approver'}>Approver</MenuItem>
          </Select>
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
            renderInput={(params) => <TextField {...params} label="Departmen" error={!!departmentError} fullWidth />}
          />
          {departmentError && <FormHelperText>{departmentError}</FormHelperText>}
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={6}>
        <TextField
          required
          onChange={(event) => setUsername(event.target.value)}
          id="outlined"
          label="Username"
          value={username}
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
            onChange={handleChangeStatus}
          >
            <MenuItem value={true}>Aktif</MenuItem>
            <MenuItem value={false}>Tidak Aktif</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid lg={4} item />
      <Grid item xs={12} lg={4}>
        <LoadingButton
          fullWidth
          disabled={loadingEdit ? true : false}
          loading={loadingResetPassword}
          role="CircularProgress"
          size="large"
          type="submit"
          variant="outlined"
          onClick={() => handleResetPassword(id)}
          color="color"
        >
          RESET PASSWORD
        </LoadingButton>
      </Grid>
      <Grid item xs={12} lg={4}>
        <LoadingButton
          fullWidth
          disabled={loadingResetPassword ? true : false}
          loading={loadingEdit}
          role="CircularProgress"
          size="large"
          type="submit"
          variant="contained"
          onClick={() => handleEdit()}
          color="color"
        >
          SIMPAN
        </LoadingButton>
        {/* <Button color="color" variant="contained" fullWidth size="large" onClick={() => handleEdit()}>
          SIMPAN
        </Button> */}
      </Grid>
    </Grid>
  );
};

export default ModalEditUser;
