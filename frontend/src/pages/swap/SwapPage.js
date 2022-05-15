import { useEffect, useReducer } from 'react';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { utils } from 'ethers';
import { useEthers } from '@usedapp/core';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import {

} from 'hooks';
import 'react-toastify/dist/ReactToastify.css';
import './SwapPage.scss';
import AppLayout from 'pages/AppLayout';

const SwapPage = () => {
  
  return (
    <AppLayout>
      <div className='swap-page'>
      SwapPage
      </div>
    </AppLayout>
  );
};

export default SwapPage;
