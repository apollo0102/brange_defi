import { React, useEffect, useReducer, useState } from 'react';
import CountUp from 'react-countup';
import { toast } from 'react-toastify';
import { utils, ethers } from 'ethers';
import { useEthers } from '@usedapp/core';
import axios from 'axios'
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import {
  useMoralisWeb3Api,
} from 'react-moralis'
import { useSelector, useDispatch } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.scss';
import AppLayout from 'pages/AppLayout';
import { LPAddress, WBNBTokenAddress, BrangeContractAddress, rewardRate, TreasuryReceiverAddress, BuybackReceiverAddress } from '../../contracts';
import { CountDownTimer } from './countDownTimer'
// import {getCoinGeckoPrices} from '../../components/common/coingeckoApi'
import {
  useInitRebaseStartTime,
  useLastRebaseTime,
  useTotalSupply,
  useTotalHolders,
} from 'hooks';
import { setBlockNumber, setHolders, setApysStep, setDailyRate, setBNBPrice } from 'slice/slice';

const HomePage = () => {
  const tokenPrice = useSelector((state) => state.counter.tokenPrice)
  const bnbPriceByRedux = useSelector((state) => state.counter.bnbPrice)
  let blockNumber = useSelector((state) => state.counter.blockNumber)
  let holders = useSelector((state) => state.counter.holders)
  let apyStep = useSelector((state) => state.counter.apyStep)
  const dispatch = useDispatch()

  const { account, activate, deactivate } = useEthers();
  const Web3Api = useMoralisWeb3Api()
  const [holding, setHolding] = useState(0);
  const [dailyEarning, setDailyEarning] = useState(0);
  const [totalBurned, setTotalBurned] = useState(0);
  const [nRebase, setNRebase] = useState(0);
  const [marketcap, setMarketcap] = useState(0);
  const [dailyRoi, setDailyRoi] = useState(0);
  const [nReward, setNReward] = useState(0);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [totalWallets, setTotalWallets] = useState(0);
  const [minutes, setMintues] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [[mins, secs], setTime] = useState([minutes, seconds]);
  const rbStartTime = useInitRebaseStartTime();
  const rbLastTime = useLastRebaseTime();
  const totalsupply = useTotalSupply();
  const totalHolders = useTotalHolders();

  const tick = () => {
    if (mins === 0 && secs === 0) {
      setTime([14, 59]);
    } else {
      if (secs === 0) {
        setTime([mins - 1, 59]);
      } else {
        setTime([mins, secs - 1]);
      }
    }
  };
  const getBNBPrice = ()=>{
     return axios
    .get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd', {})
  }
  useEffect(() => {
    const initAccount = async () => {
      //console.log(tokenPrice, account);
      //Holding
      const holdingOpt = {
        chain: "bsc",
        token_addresses: BrangeContractAddress,
        address: account,
      };
      let value = await Web3Api.account.getTokenBalances(holdingOpt);
      let holdTokens = 0;
      if(value.length != 0){
        holdTokens = (value[0].balance / (10 ** value[0].decimals)).toFixed(6);
        //console.log("holding---->", holdTokens);
        setHolding(parseFloat((holdTokens * tokenPrice).toFixed(6)));
      }else{
        setHolding(0)
      }
      //get rebaseStartTime
      const curTime = new Date().getTime();
      //console.log("...rbStartTime...", parseInt(rbStartTime, 10) * 1000)
      //console.log("..rbLastTime..", parseInt(rbLastTime, 10) * 1000)
      let deltaTime = curTime - parseInt(rbLastTime, 10) * 1000;
      let deltaStrTime  =  curTime - parseInt(rbStartTime, 10) * 1000;
      const timeFrame = 900000;
      const strTimes = Math.floor(deltaStrTime / timeFrame);
      let curApyStep = 0;
      let dailyRate = 0;
      //dailyRate formula : ((1+ curApyStep / 100)**(60/15*24)-1)
      if(strTimes <= 35040){
        curApyStep = 0.0002355;
        dailyRate = 0.0229;
      }else if (strTimes <=52560){
        curApyStep = 0.0000211;
        dailyRate = 0.0029;
      }else if (strTimes <= 245280) {
        curApyStep = 0.0000014;
        dailyRate = 0.00013;
      }else{
        curApyStep = 0.0000002;
        dailyRate = 0.000019;
      }
      dispatch(setApysStep(curApyStep));
      dispatch(setDailyRate(dailyRate))

      //console.log(".dddd...", deltaTime)
      //apyStep
      //Daily Earning  --> now bug
      setDailyEarning((tokenPrice * holdTokens * dailyRate).toFixed(6));
      
      
      //Next Reward
      const times = Math.floor(deltaTime / timeFrame);
      // //console.log("deltatTimes-->", deltaTime)
      //console.log("times-->", times, 1+curApyStep)
      setNReward((((1+curApyStep) ** times - 1) * holdTokens * tokenPrice).toFixed(6));
    }
    const init = async () => {
      const curTime = new Date().getTime();
      //console.log("...rbStartTime...", parseInt(rbStartTime, 10) * 1000)
      //console.log("..rbLastTime..", parseInt(rbLastTime, 10) * 1000)
      let deltaTime = curTime - parseInt(rbLastTime, 10) * 1000;
      let deltaStrTime  =  curTime - parseInt(rbStartTime, 10) * 1000;
      const timeFrame = 900000;
      const strTimes = Math.floor(deltaStrTime / timeFrame);
      let curApyStep = 0;
      let dailyRate = 0;
      //dailyRate formula : ((1+ curApyStep / 100)**(60/15*24)-1)
      if(strTimes <= 35040){
        curApyStep = 0.0002355;
        dailyRate = 0.0229;
      }else if (strTimes <=52560){
        curApyStep = 0.0000211;
        dailyRate = 0.0029;
      }else if (strTimes <= 245280) {
        curApyStep = 0.0000014;
        dailyRate = 0.00013;
      }else{
        curApyStep = 0.0000002;
        dailyRate = 0.000019;
      }
      //setTime
      const restTime = deltaTime % timeFrame;
      let min = Math.floor(15 - (restTime) / 60000);
      let sec = Math.floor(60 - ((restTime) % 60000) / 1000);
      setTime([min, sec]);
      //Market Cap
      //console.log("Total tokens---->", totalsupply, parseInt(totalsupply, 10)/10**5);
      setMarketcap((parseInt(totalsupply, 10)/10**5 * tokenPrice).toFixed(6));
      //Dail Roi
      // //console.log("Dail Roi", rewardRate);
      // setDailyRoi((((1+rewardRate%)) ** 96).toFixed(6)); // valuse is 1.0229 when rewardRate is 0.02355%
      setDailyRoi(dailyRate*100);

      //Treasury Blance
      const treasuryOpt = {
        chain: "bsc",
        address: TreasuryReceiverAddress,
      };
      let value = await Web3Api.account.getNativeBalance(treasuryOpt);
      //console.log("value-->", value)
      if (value.length !== 0) {
        const treasuryTokens = (value.balance / (10 ** 18)).toFixed(6);
        //console.log("treasuryTokens---->", treasuryTokens);
        let bnbPrice = await getBNBPrice();
        bnbPrice = bnbPrice.data["binancecoin"]["usd"]
        setTreasuryBalance((treasuryTokens * bnbPrice).toFixed(6)); // change tokenPrice to bsc price using coingecko
      } else {
        //console.log("treasuryTokens---->", 0);
        setTreasuryBalance(0);
      }
  
      setTotalWallets(parseInt(totalHolders, 10));
      
      //setTotalWallets()
      //Total buruned
      const burnedOpt = {
        chain: "bsc",
        address: BuybackReceiverAddress,
      };
      
      value = await Web3Api.account.getNativeBalance(burnedOpt);
      //console.log("value-->", value)
      if (value.length != 0) {
        const burnedTokens = (value.balance / (10 ** 18)).toFixed(6);
        let bnbPrice = await getBNBPrice();
        bnbPrice = bnbPrice.data["binancecoin"]["usd"]
        setTotalBurned((burnedTokens * bnbPrice).toFixed(6));
      } else {
        setTotalBurned(0);
      }
    }
    init()
    if(account){
      initAccount()
    }
  }, [account, tokenPrice, rbStartTime, rbLastTime, totalHolders])

  const handleClick = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  useEffect(() => {
    const timerId = setInterval(() => tick(), 1000);
    return () => clearInterval(timerId);
  });

  

  return (
    <AppLayout>
      <div className='w-full pr-3 home-page'>
        <ul className=''>
          <li>
            <div className='flex flex-col justify-center mb-5 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0'>
              <ul className='bg-bg4 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl'>Holdings</li>
                <li className='text-3xl'>${holding}</li>
              </ul>
              <ul className='bg-bg5 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl'>Daily Earnings</li>
                <li className='text-3xl'>${dailyEarning}</li>
              </ul>
              <ul className='bg-bg0 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl'>Next Rebase</li>
                <li className='text-3xl'>
                  {`${mins
                    .toString()
                    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
                </li>
              </ul>
            </div>
          </li>
         
         

         <li>
            <div className='flex flex-col justify-center mb-5 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0'>
              <ul className='bg-bg10 w-full  py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-3xl text-orange'>Token Price</li>
                <li className='text-xl text-white'>${tokenPrice}</li>
              </ul>
              <ul className='bg-bg0 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-3xl text-orange'>Marketcap</li>
                <li className='text-xl text-white'>${marketcap}</li>
              </ul>
            </div>
          </li>
          


          <li>
            <div className='flex flex-col justify-center mb-10 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0'>
              <ul className='bg-bg0 w-full  py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-3xl text-orange text-shadow-xl'>Daily Roi</li>
                <li className='text-xl text-white'>{dailyRoi}%</li>
              </ul>
              <ul className='bg-bg10 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-3xl text-orange'>Next Reward</li>
                <li className='text-xl text-white'>${nReward}</li>
              </ul>
            </div>
          </li>
          <li>
          <button
          onClick={() => handleClick(`https://dexscreener.com/bsc/${LPAddress}`)}
          className="flex justify-center align-middle w-full bg-bg2 text-white text-center rounded-[10px] border-[1px] border-bg3 py-3 px-10 hover:bg-orange foucs:bg-orange">
                    View Chart
          </button>
          </li>

<li>
            <div className='flex flex-col justify-center mt-10 mb-5 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0'>
              <ul className='bg-bg4 w-full  py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-2xl text-white'>Buy Tax</li>
                <li className='text-3xl text-white'>14%</li>
              </ul>
              <ul className='bg-bg5 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-2xl text-white'>Sell Tax</li>
                <li className='text-3xl text-white'>20%</li>
              </ul>
              {/* <ul className='bg-bg0 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-2xl text-white'>Transfer Tax</li>
                <li className='text-3xl text-white'>13%</li>
              </ul> */}
            </div>
          </li>
          {/* <li>
            <div className='flex flex-col justify-center mb-5 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0'>
              <ul className='bg-bg0 w-full  py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl text-orange'>Treasury Balance</li>
                <li className='text-3xl text-white'>${treasuryBalance}</li>
              </ul>
              <ul className='bg-bg2 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl text-orange'>Today's Treasury Gains</li>
                <li className='text-3xl text-white'>$692,304.73</li>
              </ul> 
              <ul className='bg-bg10 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl text-orange'>Total Wallets</li>
                <li className='text-3xl text-white'>{totalWallets}</li>
              </ul>
              <ul className='bg-bg2 w-full py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-xl text-orange'>Dyson Index</li>
                <li className='text-3xl text-white'>1.7108x</li>
              </ul> 
            </div>
          </li> */}
          {/* <li>
            <div className='flex flex-col justify-center mb-5 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0'>
              <ul className='bg-bg0 w-full  py-10 rounded-[10px] border-[1px] border-bg3'>
                <li className='mb-4 text-3xl text-orange text-shadow-xl'>🔥 TOTAL BURNED TO DATE 🔥</li>
                <li className='text-2xl text-white'>${totalBurned}</li>
              </ul>
            </div>
          </li> */}

        </ul>
      </div>
    </AppLayout>
  );
};

export default HomePage;
