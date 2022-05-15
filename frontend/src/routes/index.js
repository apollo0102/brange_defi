import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Mainnet, Rinkeby, BSC, DAppProvider } from '@usedapp/core';

const MintPage = lazy(() => import('../pages/mint'));
const HomePage = lazy(() => import('../pages/home'));
const AccountPage = lazy(() => import('../pages/account'));
const CalculatorPage = lazy(() => import('../pages/calculator'));
const SwapPage = lazy(() => import('../pages/swap'));
const ReferPage = lazy(() => import('../pages/refer'));
const InvitePage = lazy(() => import('../pages/invite'));
const ErrorPage = lazy(() => import('../pages/error'));

const config = {
  readOnlyChainId: 56,
  readOnlyUrls: {
    [BSC.chainId]: `https://bsc-dataseed1.ninicoin.io`,
  },
};

const AppRoutes = () => {
  return (
    <DAppProvider config={config}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/account' element={<AccountPage />} />
        <Route path='/calculator' element={<CalculatorPage />} />
        <Route path='/swap' element={<SwapPage />} />
        <Route path='/mint' element={<MintPage />} />
        <Route path='/refer' element={<ReferPage />} />
        <Route path='/invite' element={<InvitePage />} />
        <Route path="/404" component={ErrorPage} />
        <Route component={ErrorPage} />
      </Routes>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        autoDismiss={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        icon={true}
        theme={'colored'}
        pauseOnHover={false}
        rtl={false}
      />
    </DAppProvider>
  );
};

export default AppRoutes;
