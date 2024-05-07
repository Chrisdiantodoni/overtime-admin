import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import defaultFavicon from '../assets/logo.png';

const HeadContext = createContext();

export function HeadProvider({ children }) {
  const location = useLocation();
  const systemTitle = ' | Overtime System';

  const [id, setId] = useState(null);

  const getPageTitle = (pathname) => {
    const routeTitleMap = {
      '/staff': `Staff ${systemTitle}`,
      '/overtime-request': 'Pengajuan Lembur' + systemTitle,
      '/overtime-request/report': 'Report Jam Lembur Staff' + systemTitle,
      '/user': 'User' + systemTitle,
      '/overtime-request/submit': 'Buat Pengajuan Lembur' + systemTitle,
      '/holiday': 'Hari Libur' + systemTitle,
      '/login': 'Login' + systemTitle,
      '/change-password': 'Change Password' + systemTitle,
      '/403': 'Forbidden 403' + systemTitle,
      '/404': '404 Not Found' + systemTitle,
    };

    routeTitleMap[`/requester/overtime-request/${id}`] = `Pengajuan Lembur` + systemTitle;
    routeTitleMap[`/approver/overtime-request/${id}`] = `Pengajuan Lembur` + systemTitle;
    routeTitleMap[`/admin/overtime-request/${id}`] = `Pengajuan Lembur` + systemTitle;
    routeTitleMap[`/staff/${id}/approved-overtime-request`] = `List Lembur` + systemTitle;

    return routeTitleMap[pathname] || 'Default Title';
  };

  const pageTitle = getPageTitle(location.pathname);

  /* eslint-disable */

  const helmetContext = useMemo(() => {
    return {
      helmet: {
        meta: [],
        title: pageTitle,
      },
      favicon: defaultFavicon,
    };
  }, [location.pathname, id]);
  /* eslint-disable */

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const contextValue = { ...helmetContext, setId };
  return (
    <HeadContext.Provider value={contextValue}>
      <HelmetProvider context={helmetContext.helmet}>{children}</HelmetProvider>
    </HeadContext.Provider>
  );
}

export function useHead() {
  return useContext(HeadContext);
}
