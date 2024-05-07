import React from 'react';
import { Pagination, PaginationItem } from '@mui/material';

const CustomPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      sx={{
        width: '100%',
      }}
      onChange={handleChange}
      shape="rounded"
      size="large"
      color="color"
      renderItem={(item) => (
        <PaginationItem
          component="a"
          {...item}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(item.page);
          }}
        />
      )}
    />
  );
};

export default CustomPagination;
