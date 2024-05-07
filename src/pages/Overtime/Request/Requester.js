import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, CircularProgress, Box } from '@mui/material';
import { overtimeRequestDetail } from 'src/API';
import { useParams, useLocation } from 'react-router-dom';
import { useHead } from 'src/context/HeadContext';
import dayjs from 'dayjs';
import { StaffCard, ModalComponent, ModalAddStaff, EditStaff } from 'src/components';
import { StaffsContainer, SummaryContainer } from 'src/components/Container/Container';

var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');

export default function Requester() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { helmet, favicon, setId } = useHead();
  const { id } = useParams();
  const location = useLocation();
  const status = location.state.status;
  const [addModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalOpen, setIsEditModalOpen] = useState(false);
  const [overtimeRequest, setOvertimeRequest] = useState({});
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getDetail = async () => {
    try {
      setId(id);
      setIsLoading(true);
      let includeOvertimeRequestVoidReason = false;
      let includeOvertimeRequestRejectedReason = false;
      if (status === 'rejected') {
        includeOvertimeRequestRejectedReason = true;
      } else if (status === 'void') {
        includeOvertimeRequestVoidReason = true;
      }
      const response = await overtimeRequestDetail(
        id,
        includeOvertimeRequestVoidReason,
        includeOvertimeRequestRejectedReason
      );
      if (response?.meta.code === 200) {
        setOvertimeRequest(response?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  /* eslint-disable */

  useEffect(() => {
    if (shouldFetchData) {
      getDetail();
      setShouldFetchData(false);
    }
  }, [shouldFetchData]);
  /* eslint-disable */

  return (
    <>
      <Helmet>
        <title>{helmet.title}</title>
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
      </Helmet>
      <Box sx={{ display: 'flex', overflow: 'hidden', px: 4, py: 3, justifyContent: 'flex-start' }}>
        {isLoading ? (
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              height: 'calc(100vh - 128px)',
            }}
          >
            <CircularProgress color="color" thickness={2} variant="indeterminate" />
          </Container>
        ) : (
          <>
            <Grid container spacing={3}>
              <Grid item lg={9}>
                <StaffsContainer>
                  <Grid container spacing={2}>
                    {overtimeRequest.staffs?.map((item, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                        <StaffCard data={item} />
                      </Grid>
                    ))}
                  </Grid>
                </StaffsContainer>
              </Grid>
              <Grid item lg={3}>
                <SummaryContainer>
                  <Grid
                    container
                    item
                    lg={12}
                    sx={{
                      borderRadius: '20px',
                      height: 'auto',
                      mt: { lg: 0, md: 0, sx: 2, sm: 2 },
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16} fontWeight={'400'}>
                          Pengaju :
                        </Typography>
                        <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} ml={0}>
                          {overtimeRequest?.requester_user?.name} ({overtimeRequest?.requester_user?.code})
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16} fontWeight={'400'}>
                          Status :
                        </Typography>
                        <Typography
                          component="p"
                          variant="p"
                          fontSize={18}
                          fontWeight={'700'}
                          ml={0}
                          color={
                            overtimeRequest?.status === 'rejected'
                              ? '#E84040'
                              : overtimeRequest?.status === 'approved'
                              ? '#028617'
                              : '#000000'
                          }
                        >
                          {overtimeRequest?.status === 'pending'
                            ? 'Pending'
                            : overtimeRequest.status === 'rejected'
                            ? 'Ditolak'
                            : overtimeRequest.status === 'approved'
                            ? 'Disetujui'
                            : 'Void'}
                        </Typography>
                        {overtimeRequest?.status === 'rejected' ? (
                          <Typography
                            component="p"
                            variant="p"
                            fontSize={18}
                            fontWeight={'700'}
                            ml={0}
                            style={{ overflow: 'hidden' }}
                          >
                            ({overtimeRequest?.overtime_request_rejected_reason?.reason})
                          </Typography>
                        ) : overtimeRequest?.status === 'void' ? (
                          <Typography
                            component="p"
                            variant="p"
                            fontSize={18}
                            fontWeight={'700'}
                            ml={0}
                            style={{ overflow: 'hidden' }}
                          >
                            ({overtimeRequest?.overtime_request_void_reason?.reason})
                          </Typography>
                        ) : null}
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16}>
                          Tanggal Lembur:
                        </Typography>
                        <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} ml={0}>
                          {dayjs(overtimeRequest?.start_at).format('DD MMMM YYYY')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16}>
                          Shift Lembur:
                        </Typography>
                        <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} ml={0}>
                          {dayjs(overtimeRequest?.start_at).format('HH:mm')} -{' '}
                          {dayjs(overtimeRequest?.finish_at).format('HH:mm')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16}>
                          Total Jam Lembur
                        </Typography>
                        <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} ml={0}>
                          {(overtimeRequest?.payable_duration / 60).toFixed(2)} Jam
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16}>
                          Keterangan
                        </Typography>
                        <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} ml={0}>
                          {overtimeRequest?.note}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} lg={12}>
                        <Typography component="p" variant="p" fontSize={16}>
                          Peserta
                        </Typography>
                        <Box overflow={'auto'} height="400px">
                          {overtimeRequest.staffs?.map((item, index) => (
                            <Typography component="p" variant="p" fontSize={18} fontWeight={'700'} key={item.id}>
                              {index + 1}. {item.name}
                            </Typography>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </SummaryContainer>
              </Grid>
            </Grid>
          </>
        )}

        <ModalComponent open={addModalOpen} close={() => setIsAddModalOpen(false)} title={'Tambah Staff'}>
          <ModalAddStaff onClick={() => setIsAddModalOpen(false)} />
        </ModalComponent>
        <ModalComponent open={editModalOpen} close={() => setIsEditModalOpen(false)} title={'Edit Staff #25'}>
          <EditStaff onClick={() => setIsEditModalOpen(false)} />
        </ModalComponent>
      </Box>
    </>
  );
}
