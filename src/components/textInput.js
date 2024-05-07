import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const CustomTextInput = ({ label, ...restProps }) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      fullWidth
      {...restProps}
      inputProps={{
        startAdornment: <InputAdornment position="end">kg</InputAdornment>,
      }}
    />
  );
};

export default CustomTextInput;
