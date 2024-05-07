import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import { changePassword } from '../../../API';
import { useAuth } from 'src/context/AuthContext';

// ----------------------------------------------------------------------
export default function ChangePasswordForm() {
  const { fetchData } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const location = useLocation();
  const password = location.state?.password;
  const [formData, setFormData] = useState({
    newPassword: '',
    reTypeNewPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    setIsLoading(true);

    if (formData.newPassword !== formData.reTypeNewPassword) {
      toast.error('Password tidak sama');
      validationErrors.newPassword = 'Password tidak sama';
    }

    if (formData.newPassword.length < 8 || formData.newPassword.length > 20) {
      toast.error('Password harus memiliki panjang antara 8 dan 20 karakter');
      validationErrors.newPassword = 'Password harus memiliki panjang antara 8 dan 20 karakter';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
    } else {
      const body = {
        old_password: password,
        new_password: formData.newPassword,
        new_password_confirmation: formData.reTypeNewPassword,
      };
      await changePassword(body)
        .then(async (res) => {
          if (res.meta.code === 200) {
            localStorage.setItem('token', res?.data?.token);
            toast.success('Berhasil reset password');
            await fetchData();
            window.location.href = '/staff';
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error('Password gagal diubah');
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <form onSubmit={handleClick}>
        <Stack spacing={3} justifyContent={'center'} alignItems={'center'}>
          <TextField
            name="newPassword"
            label="Password Baru"
            error={!!errors.newPassword}
            value={formData.newPassword}
            onChange={handleChange}
            sx={{ mt: 3, width: '295px' }}
            type={showSecondPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSecondPassword(!showSecondPassword)} edge="end">
                    {showSecondPassword ? <RemoveRedEye /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="reTypeNewPassword"
            label="Ulangi Password Baru"
            type={showPassword ? 'text' : 'password'}
            value={formData.reTypeNewPassword}
            error={!!errors.newPassword}
            sx={{ mt: 3, width: '295px' }}
            helperText={errors.newPassword}
            onChange={handleChange}
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
              fullWidth
              size="large"
              type="submit"
              loading={isLoading}
              role="CircularProgress"
              variant="contained"
              onClick={handleClick}
              color="color"
              sx={{ width: '295px' }}
            >
              KIRIM
            </LoadingButton>
          </Stack>
        </Stack>
      </form>
    </>
  );
}
