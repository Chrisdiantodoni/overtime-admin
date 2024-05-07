import React from 'react';
import { styled, Paper, Grid } from '@mui/material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'common.white',
  borderRadius: '20px',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  wordBreak: 'break-word',
  overflowY: 'auto',
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  overflowY: 'auto',
  height: '900px',
}));

export function SummaryContainer({ children }) {
  return <StyledPaper>{children}</StyledPaper>;
}

export function StaffsContainer({ children }) {
  return (
    <StyledGrid lg={12} item>
      {children}
    </StyledGrid>
  );
}
