import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PlaceholderImage from '../assets/staff-image-placeholder.png';

export default function StaffCard({ data, add, onClick, selected, length }) {
  const theme = useTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <Card
      sx={{
        position: 'relative',
        flexDirection: 'column',
        borderRadius: '20px',
        backgroundColor: 'common.white',
        cursor: onClick ? 'pointer' : 'auto',
        transition: 'transform 0.2s ease',
        transform: onClick && hovered ? 'translateY(-10px)' : 'none',
        [theme.breakpoints.up('sm')]: {
          minWidth: 'calc(100% - 20px)',
        },
        [theme.breakpoints.up('md')]: {
          minWidth: 'calc(90% - 20px)',
        },
        [theme.breakpoints.up('lg')]: {
          minWidth: 'calc(100% - 20px)',
        },
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      variant="elevation"
    >
      {add ? (
        <Checkbox
          sx={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1,
            '& .MuiSvgIcon-root': {
              color: selected ? (theme) => theme.palette.success.dark : (theme) => theme.palette.grey[900],
              fontSize: '30px',
            },
          }}
          icon={<RadioButtonUnchecked />}
          checkedIcon={<CheckCircle />}
          checked={selected}
          onChange={onClick}
        />
      ) : null}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, mx: 3 }}>
        <CardMedia
          component="img"
          alt="profile-img"
          image={data?.staff_image?.url ?? PlaceholderImage}
          sx={{
            objectFit: 'contain',
            aspectRatio: 1 / 1,
            width: '100%',
            maxWidth: '100%',
            borderRadius: '20px',
          }}
        />
      </Box>
      <CardContent>
        <Typography
          variant="p"
          component="div"
          textAlign={'center'}
          color={(theme) => theme.palette.text}
          fontSize={14}
          fontWeight={'400'}
          sx={{ mb: 1 }}
        >
          {data?.code}
        </Typography>
        <Typography
          variant="p"
          component="div"
          noWrap
          textAlign={'center'}
          color={(theme) => theme.palette.text}
          fontSize={18}
          fontWeight={'600'}
          sx={{
            wordBreak: 'break-all',
            wordWrap: 'break-word',
          }}
        >
          {data?.name}
        </Typography>
        <Typography
          variant="p"
          component="div"
          textAlign={'center'}
          color={(theme) => theme.palette.text}
          fontSize={14}
          fontWeight={'400'}
        >
          {data?.job_position}
        </Typography>
      </CardContent>
    </Card>
  );
}
