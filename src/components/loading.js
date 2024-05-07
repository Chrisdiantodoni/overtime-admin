import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const CircularProgressComponent = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress color="color" />
    </div>
  );
};

export default CircularProgressComponent;
