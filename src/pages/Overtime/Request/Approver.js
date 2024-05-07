import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Grid, Container, Typography, Box, CircularProgress, Button } from '@mui/material';
import { overtimeRequestDetail, approveOvertimeRequest } from 'src/API';
import { LoadingButton } from '@mui/lab';
import { StaffsContainer, SummaryContainer } from 'src/components/Container/Container';
import { toast } from 'react-toastify';
import { useHead } from 'src/context/HeadContext';
import dayjs from 'dayjs';
import { StaffCard, ModalComponent, ModalComment } from 'src/components';

var utc = require('dayjs/plugin/utc');
var timezone = require('dayjs/plugin/timezone');
// ----------------------------------------------------------------------

export default function Approver() {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { helmet, favicon, setId } = useHead();
  const navigate = useNavigate();
  const location = useLocation();
  const status = location.state.status;
  const { id } = useParams();
  const [isShowModal, setIsShowModal] = useState(false);
  const [overtimeRequest, setOvertimeRequest] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

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
  const handleApprove = async () => {
    setLoadingApprove(true);
    await approveOvertimeRequest(id)
      .then((res) => {
        if (res?.meta.code === 200) {
          toast.success('Pengajuan Lembur telah disetujui');
          getDetail();
          navigate('/overtime-request');
        }
      })
      .catch((error) => {
        setLoadingApprove(false);
        toast.error('Pengajuan Lembur tidak dapat disetujui');
      });
  };
  const handleChildData = () => {
    setShouldFetchData(true);
  };

  const handleRejectModal = () => {
    setIsShowModal(true);
  };

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
                              : (theme) => theme.palette.grey[700]
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

                        {overtimeRequest.staffs?.map((item, index) => {
                          return (
                            <Typography component="p" variant="p" fontSize={18} fontWeight={'400'} key={item.id}>
                              {index + 1}. {item.name}
                            </Typography>
                          );
                        })}
                      </Grid>
                      {overtimeRequest.status !== 'pending' ? null : (
                        <>
                          <Grid item xs={5} lg={12}>
                            <LoadingButton
                              color="color"
                              variant="contained"
                              role="CircularProgress"
                              loading={loadingApprove}
                              fullWidth={true}
                              size="large"
                              onClick={handleApprove}
                            >
                              MENYETUJUI
                            </LoadingButton>
                          </Grid>
                          <Grid item xs={5} lg={12}>
                            <Button
                              color="color"
                              px={8}
                              py={2}
                              variant="outlined"
                              onClick={handleRejectModal}
                              size="large"
                              fullWidth
                            >
                              TOLAK
                            </Button>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </SummaryContainer>
              </Grid>
            </Grid>
          </>
        )}
        <ModalComponent open={isShowModal} close={() => setIsShowModal(false)} title={`Menolak Lembur #${id}`}>
          <ModalComment onClick={() => setIsShowModal(false)} onUpdate={handleChildData} id={id} />
        </ModalComponent>
      </Box>
    </>
  );
}
