import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../../API';
import { useAuth } from '../../../context/AuthContext.js';
  
export default function LoginForm() {
  const navigate = useNavigate();
  const { fetchData } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [errors, setErrors] = useState({});
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = 'Username tidak boleh kosong';
    } else if (!/^[a-zA-Z0-9_]*$/.test(formData.username)) {
      validationErrors.username = 'Username hanya boleh mengandung huruf, angka, underscore (_) dan dot (.)';
    }

    if (!formData.password.trim()) {
      validationErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      validationErrors.password = 'Password harus memiliki panjang antara 8 dan 20 karakter';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    const body = {
      username: formData.username.toLocaleLowerCase(),
      password: formData.password,
    };

    try {
      const res = await login(body);

      if (res.meta?.code === 200) {
        const data = res.data?.user;
        localStorage.setItem('token', res?.data?.token);
        if (data.password_activated_at === null) {
          navigate('/change-password', { state: { password: formData.password } });
          await fetchData();
        } else {
          await fetchData();
          if (data?.roles[0]?.name === 'super-admin') {
            window.location.href = '/user';
          } else {
            window.location.href = '/staff';
          }
        }
      }
    } catch (error) {
      switch (error.response?.data?.meta?.error_code) {
        case 'WRONG_CREDENTIAL':
          toast.error('Username atau Password Salah');
          break;
        case 'USER_INACTIVATED':
          toast.error('Akun Anda tidak/belum Aktif');
          break;
        default:
          toast.error('Terjadi kesalahan');
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <Stack spacing={3} justifyContent={'center'} alignItems={'center'}>
          <TextField
            name="username"
            label="Username"
            sx={{ mt: 3, width: '295px' }}
            error={!!errors.username}
            helperText={errors.username}
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            name="password"
            label="Password"
            sx={{ mt: 3, width: '295px' }}
            error={!!errors.password}
            helperText={errors.password}
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <RemoveRedEye /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Stack mt={3}>
            <LoadingButton
              sx={{ width: '295px' }}
              loading={isLoading}
              role="CircularProgress"
              size="large"
              type="submit"
              variant="contained"
              onClick={handleLogin}
              color="color"
            >
              Login
            </LoadingButton>
          </Stack>
        </Stack>
      </form>
    </>
  );
}
