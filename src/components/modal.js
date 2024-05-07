import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Modal } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalComponent({ title, children, open, close }) {
  const modalContentStyle = {
    ...style,
    maxHeight: '100vh',
    overflowY: 'auto',
  };
  return (
    <div>
      <Modal open={open} onClose={close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={modalContentStyle} borderRadius={'16px'}>
          <Grid container alignItems="center">
            <Grid item sm={8} xs={8} md={8} lg={8}>
              <Typography id="modal-modal-title" variant="h4" component="h2" sx={{ color: '#000000' }}>
                {title}
              </Typography>
            </Grid>
            <Grid item sm={4} xs={4} md={4} lg={4} container justifyContent={'flex-end'}>
              <Button onClick={close} title="Close" variant="text" color="color">
                <CloseRounded />
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 5 }}>{children}</Box>
        </Box>
      </Modal>
    </div>
  );
}
