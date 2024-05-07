import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/Auth/LoginPage';
import Page404 from './pages/Page404';
import UserList from './pages/User/UserList';
import Holiday from './pages/Holiday/Holiday';
import StaffPage from './pages/Staff/StaffPage';
import ChangePasswordPage from './pages/Auth/ChangePasswordPage';
import Page403 from './pages/Page403';
import { useAuth } from './context/AuthContext';
import OvertimeRequestReport from './pages/Overtime/Report/OvertimeReport';
import Admin from './pages/Overtime/Request/Admin';
import OvertimeRequest from './pages/Overtime/Request/OvertimeRequest';
import Approver from './pages/Overtime/Request/Approver';
import Requester from './pages/Overtime/Request/Requester';
import StaffApprovedOvertimeRequests from './pages/Overtime/Request/StaffApprovedOvertimeRequests';
import SubmitOvertimeRequest from './pages/Overtime/Request/SubmitOvertimeRequest';

function PrivateRoute({ element, allowedRoles }) {
  const { authenticated, role } = useAuth();
  const userRole = role[0]?.name;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/403" replace />;
  }

  return element;
}

export default function Router() {
  const routes = useRoutes([
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/change-password',
      element: <ChangePasswordPage />,
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/staff" />, index: true },
        {
          path: 'staff',
          element: (
            <PrivateRoute path="/staff" element={<StaffPage />} allowedRoles={['requester', 'approver', 'admin']} />
          ),
        },
        {
          path: 'overtime-request',
          element: (
            <PrivateRoute
              path="/overtime-request"
              element={<OvertimeRequest />}
              allowedRoles={['requester', 'approver', 'admin']}
            />
          ),
        },
        {
          path: 'overtime-request/submit',
          element: (
            <PrivateRoute
              path="/overtime-request/submit"
              element={<SubmitOvertimeRequest />}
              allowedRoles={['requester']}
            />
          ),
        },
        {
          path: 'approver/overtime-request/:id',
          element: (
            <PrivateRoute path="/approver/overtime-request/:id" element={<Approver />} allowedRoles={['approver']} />
          ),
        },
        {
          path: 'requester/overtime-request/:id',
          element: (
            <PrivateRoute path="/requester/overtime-request/:id" element={<Requester />} allowedRoles={['requester']} />
          ),
        },
        {
          path: 'admin/overtime-request/:id',
          element: <PrivateRoute path="/admin/overtime-request/:id" element={<Admin />} allowedRoles={['admin']} />,
        },
        {
          path: '/overtime-request/report',
          element: (
            <PrivateRoute
              path="/overtime-request/report"
              element={<OvertimeRequestReport />}
              allowedRoles={['admin']}
            />
          ),
        },
        {
          path: 'user',
          element: <PrivateRoute path="/user" element={<UserList />} allowedRoles={['admin', 'super-admin']} />,
        },
        {
          path: 'holiday',
          element: <PrivateRoute path="/holiday" element={<Holiday />} allowedRoles={['admin']} />,
        },
        {
          path: 'staff/:id/approved-overtime-request',
          element: (
            <PrivateRoute
              path="staff/:id/approved-overtime-request"
              element={<StaffApprovedOvertimeRequests />}
              allowedRoles={['admin']}
            />
          ),
        },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
