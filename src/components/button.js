import React from 'react';
import Button from '@mui/material/Button';

const MaterialUIButton = ({ color, variant, label, onClick, px, py, fullWidth }) => {
  return (
    <Button
      color={color}
      variant={variant}
      onClick={onClick}
      sx={{
        height: '100%',
        px: px,
        py: py,
      }}
      fullWidth={fullWidth}
      size={'large'}
    >
      {label}
    </Button>
  );
};

export default MaterialUIButton;
