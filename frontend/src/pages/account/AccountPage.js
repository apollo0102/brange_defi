import { useEffect, useReducer, useState } from "react";
import CountUp from "react-countup";
import { toast } from "react-toastify";
import { utils } from "ethers";
import { useEthers } from "@usedapp/core";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { useMoralisWeb3Api } from "react-moralis";
import {
  useInitRebaseStartTime,
  useLastRebaseTime,
  useTotalSupply,
} from "hooks";
import { useSelector, useDispatch } from "react-redux";
import {
  LPAddress,
  WBNBTokenAddress,
  BrangeContractAddress,
  rewardRate,
  TreasuryReceiverAddress,
  BuybackReceiverAddress,
} from "../../contracts";
import { setBlockNumber, setHolders } from "slice/slice";
import "react-toastify/dist/ReactToastify.css";
import "./AccountPage.scss";
import AppLayout from "pages/AppLayout";

const AccountPage = () => {
  const tokenPrice = useSelector((state) => state.counter.tokenPrice);
  const { account, activate, deactivate } = useEthers();
  const Web3Api = useMoralisWeb3Api();
  const [totalEnarned, setTotalEnarned] = useState(0);
  const [totalEnarnedTokens, setTotalEnarnedTokens] = useState(0);
  const [totalEnarnedRate, setTotalEnarnedRate] = useState(0);
  const [apy, setApy] = useState(0);
  const [holdingtokens, setHoldingtokens] = useState(0);
  const [nReward, setNReward] = useState(0);
  const [nry, setNry] = useState(0);
  const [roi, setRoi] = useState(0);
  const rbStartTime = useInitRebaseStartTime();
  const rbLastTime = useLastRebaseTime();
  const totalsupply = useTotalSupply();
  useEffect(() => {
    init();
    if (account) {
      initAccount();
    }
  }, [account, rbStartTime, rbLastTime, totalsupply]);

  const initAccount = async () => {
    //console.log(tokenPrice, account);

    //Holding
    const holdingOpt = {
      chain: "bsc",
      token_addresses: BrangeContractAddress,
      address: account,
    };
    let value = await Web3Api.account.getTokenBalances(holdingOpt);
    const holdTokens = (value[0].balance / 10 ** value[0].decimals).toFixed(6);
    setHoldingtokens(holdTokens);
    //Total Earned, tokens, increase
    setTotalEnarned((holdTokens * tokenPrice).toFixed(6));
    setTotalEnarnedTokens(holdTokens);
    setTotalEnarnedRate("--");
    //Next Rewards
    const curTime = new Date().getTime();
    let deltaTime = curTime - parseInt(rbLastTime, 10) * 1000;
    //console.log(deltaTime);
    const timeFrame = 900000;
    const times = Math.floor(deltaTime / timeFrame);
    //setApy
    let deltaStrTime  =  curTime - parseInt(rbStartTime, 10) * 1000;
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
    // //console.log("---dailyRate---->", dailyRate)
    
    
    setNReward((((1+curApyStep) ** times - 1) * holdTokens * tokenPrice).toFixed(6));
    //Next Rewards Yield
    setNry((((1+curApyStep) ** times - 1) * 100).toFixed(6));

  };

  const init = async () => {
    const curTime = new Date().getTime();
    const timeFrame = 900000;
    let deltaStrTime  =  curTime - parseInt(rbStartTime, 10) * 1000;
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

    setApy(((1+dailyRate)**365).toFixed(4));
    setRoi(dailyRate)
  }

  return (
    <AppLayout>
      <div className="w-full pr-3 account-page">
        <ul className="">
          <li>
            <div className="flex flex-col justify-center my-12 text-center gap-x-7 lg:justify-between lg:flex-row">
              <ul className="bg-bg5 w-full  py-10 rounded-[10px] text-white border-[1px] border-bg3">
                <li className="mb-4 text-xl text-shadow-xl">Total Earned</li>
                <li className="mb-4 text-3xl text-shadow-xl">
                  ${totalEnarned}
                </li>
                <li className="text-xl ">
                  {totalEnarnedTokens} Tokens
                   {/* ({totalEnarnedRate}% increase) */}
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex flex-col justify-center my-10 text-left gap-x-10 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0">
              <div className="flex flex-row w-full justify-center items-center bg-bg0 rounded-[10px] pl-5 border-[1px] border-bg3">
                <ul className="w-full ">
                  <li className="mb-4 text-xl text-white text-shadow-md">
                    Standard APY
                  </li>
                  <li className="text-2xl sm:text-3xl text-orange">{apy}%</li>
                </ul>
                <ul className="bg-bg2 w-full  text-white py-12 rounded-[10px] px-5 border-[1px] border-bg3">
                  <li className="mb-4 text-xl text-shadow-md">Your Balance</li>
                  <li className="text-xl flex flex-col justify-between bg-orange rounded-[10px] px-5 py-2">
                    <span>{holdingtokens}</span>
                    <span>Token</span>
                  </li>
                </ul>
              </div>
              <ul className="flex flex-col bg-bg0 w-full text-white justify-center py-2 rounded-[10px] text-center border-[1px] border-bg3">
                <li className="mb-4 text-xl">Daily ROI</li>
                <li className="text-xl">{roi*100}%</li>
              </ul>
            </div>
          </li>
          <li>
            <div className="bg-bg7 text-white p-5 rounded-[10px] border-[1px] border-bg3 my-16">
              <ul className="rounded-[10px] border-[1px] border-bg3">
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg2 px-8 py-4 border-b-[1px] border-b-bg3 rounded-t-[10px]">
                  <span>Curent Token Price</span>
                  <span>${tokenPrice}</span>
                </li>
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg0 px-8 py-4 border-b-[1px] border-b-bg3">
                  <span>Next Reward Amount</span>
                  <span>${nReward}</span>
                </li>
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg2 px-8 py-4 rounded-b-[10px]">
                  <span>Next Reward Yield</span>
                  <span>{nry}%</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </AppLayout>
  );
};

export default AccountPage;
