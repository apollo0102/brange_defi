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
import "./CalculatorPage.scss";
import AppLayout from "pages/AppLayout";

const CalculatorPage = () => {
  const tokenPrice = useSelector((state) => state.counter.tokenPrice);
  const apyStep = useSelector((state) => state.counter.apyStep);
  const { account, activate, deactivate } = useEthers();
  const Web3Api = useMoralisWeb3Api();
  const [holdingTokens, setHoldingTokens] = useState(0);
  //input
  const [inputAmount, setInputAmount] = useState(0);
  const [inputApy, setInputApy] = useState(0);
  const [inputPurchase, setInputPurchase] = useState(0);
  const [inputFPurchase, setInputFPurchase] = useState(0);
  const [inputDays, setInputDays] = useState(1);

  //display values
  const [investment, setInvestment] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [apy, setApy] = useState(0);
  const [reward, setReward] = useState(0);
  const [potReturn, setPotReturn] = useState(0);
  const [curRate, setCurRate] = useState(0);
  const rbStartTime = useInitRebaseStartTime();
  const rbLastTime = useLastRebaseTime();
  const totalsupply = useTotalSupply();
  useEffect(() => {
    init();
    if (account) {
      initAccount();
    }
  }, [account, rbStartTime, rbLastTime, totalsupply]);

  useEffect(() => {
    setInvestment(inputAmount * inputPurchase);
    setTotalPrice(inputAmount * tokenPrice);
    //console.log("curRate", curRate, inputAmount, inputDays)
    setReward(inputAmount * (1 + curRate) ** (96 * inputDays));
    setPotReturn(
      inputAmount * inputFPurchase * (1 + curRate) ** (96 * inputDays)
    );
  }, [inputAmount, inputApy, inputPurchase, inputFPurchase, inputDays]);

  const initAccount = async () => {
    const holdingOpt = {
      chain: "bsc",
      token_addresses: BrangeContractAddress,
      address: account,
    };
    let value = await Web3Api.account.getTokenBalances(holdingOpt);
    const holdTokens = (value[0].balance / 10 ** value[0].decimals).toFixed(6);
    setHoldingTokens(holdTokens);
    ////console.log("apyStep", apyStep);
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
    setCurRate(curApyStep)
    //console.log("---dailyRate---->", dailyRate)
    setApy(((1+dailyRate)**365).toFixed(4));
  };
  const init = async () => {
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
      dailyRate = 0.000019;
    }
    setCurRate(curApyStep)
    setApy(((1+dailyRate)**365).toFixed(4));
  }

  const setMAmount = () => {
    setInputAmount(0);
  };
  const setCurrentAPY = () => {
    setInputApy(apy);
  };
  const setPurchase = () => {
    setInputPurchase(tokenPrice);
  };
  const setFPurchase = () => {
    setInputFPurchase(tokenPrice);
  };

  return (
    <AppLayout>
      <div className="account-page w-[99%] pr-3 rounded-[10px] border-[1px] border-bg3  px-7">
        <ul className="">
          <li>
            <div className="flex flex-col justify-center text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0">
              <ul className="w-full  py-10 rounded-[10px] text-white text-left">
                <li className="mb-4 text-3xl text-orange font-bold text-shadow-xl text-center lg:text-left">
                  Calculator
                </li>
                <li className="text-lg mb-7 text-shadow-xl text-center lg:text-left">
                  Estimate your returns
                </li>
                <li>
                  <div className="flex flex-col justify-center mb-5 text-center gap-x-3 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0">
                    <ul className="bg-bg4 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3">
                      <li className="mb-4 text-2xl">Token Price</li>
                      <li className="text-3xl text-white">${tokenPrice}</li>
                    </ul>
                    <ul className="bg-bg5 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3">
                      <li className="mb-4 text-2xl">APY</li>
                      <li className="text-3xl text-white">{apy}%</li>
                    </ul>
                    <ul className="bg-bg0 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3">
                      <li className="mb-4 text-2xl">Your Token Balance</li>
                      <li className="text-3xl text-white">{holdingTokens}</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex flex-col justify-center text-center text-white gap-x-7 lg:justify-between lg:flex-row  gap-y-1 lg:gap-y-0">
              <ul className="w-full py-5 lg:py-10 ">
                <li className="mb-6 text-xl text-left text-shadow-md">
                  Token Amount
                </li>
                <li className="text-xl text-white flex flex-row justify-between rounded-[10px] border-[1px] border-bg3">
                  <input
                    type="number"
                    className="w-3/4 rounded-l-[10px] border-[1px] p-3 bg-transparent border-none"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                  />
                  <button
                    className="text-base sm:text-xl rounded-r-[10px] border-l-[1px] border-bg3 p-3 w-1/4 hover:bg-orange focus:bg-orange"
                    onClick={setMAmount}
                  >
                    Max
                  </button>
                </li>
              </ul>
              <ul className="w-full py-5 lg:py-10">
                <li className="mb-6 text-xl text-left text-shadow-md">
                  APY (%)
                </li>
                <li className="text-xl text-white flex flex-row justify-between rounded-[10px] border-[1px] border-bg3">
                  <input
                    type="number"
                    className="w-3/4 rounded-l-[10px] border-[1px] p-3 bg-transparent border-none"
                    value={inputApy}
                    onChange={(e) => setInputApy(e.target.value)}
                  />
                  <button
                    className="text-base sm:text-xl rounded-r-[10px] border-l-[1px] border-bg3 p-3 w-1/4 hover:bg-orange focus:bg-orange"
                    onClick={setCurrentAPY}
                  >
                    Current
                  </button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="flex flex-col justify-center text-center text-white gap-x-7 lg:justify-between lg:flex-row   gap-y-1 lg:gap-y-0">
              <ul className="w-full  py-5 lg:py-10 ">
                <li className="mb-6 text-xl text-left text-shadow-md">
                  Token Price at Purchase ($)
                </li>
                <li className="text-xl text-white flex flex-row justify-between rounded-[10px] border-[1px] border-bg3">
                  <input
                    type="number"
                    className="w-3/4 rounded-l-[10px] border-[1px] p-3 bg-transparent border-none"
                    value={inputPurchase}
                    onChange={(e) => setInputPurchase(e.target.value)}
                  />
                  <button
                    className="text-base sm:text-xl rounded-r-[10px] border-l-[1px] border-bg3 p-3 w-1/4 hover:bg-orange focus:bg-orange"
                    onClick={setPurchase}
                  >
                    Current
                  </button>
                </li>
              </ul>
              <ul className="w-full  py-5 lg:py-10 ">
                <li className="mb-6 text-xl text-left text-shadow-md">
                  Future Token Price ($)
                </li>
                <li className="text-xl text-white flex flex-row justify-between rounded-[10px] border-[1px] border-bg3">
                  <input
                    type="number"
                    className="w-3/4 rounded-l-[10px] border-[1px] p-3 bg-transparent border-none"
                    value={inputFPurchase}
                    onChange={(e) => setInputFPurchase(e.target.value)}
                  />
                  <button
                    className="text-base sm:text-xl rounded-r-[10px] border-l-[1px] border-bg3 p-3 w-1/4 hover:bg-orange focus:bg-orange"
                    onClick={setFPurchase}
                  >
                    Current
                  </button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div className="relative pt-1 text-white">
              <label htmlFor="customRange1" className="text-xl form-label">
                {inputDays} days
              </label>
              <input
                type="range"
                className="form-range
                        appearance-none
                        w-full
                        h-2
                        rounded
                        p-1
                        mt-3
                        mb-7
                        bg-[#337c87]
                        focus:outline-none focus:ring-0 focus:shadow-none focus:bg-sky-100
                      "
                id="customRange1"
                min="1"
                max="365"
                value={inputDays}
                onChange={(e) => setInputDays(e.target.value)}
              />
            </div>
          </li>
          <li>
            <div className="bg-bg7 text-white rounded-[10px] py-5">
              <ul className="rounded-[10px] border-[1px] border-bg3">
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg2 px-8 py-4 border-b-[1px] border-b-bg3 rounded-t-[10px]">
                  <span>Your initial investment</span>
                  <span>${investment.toFixed(6)}</span>
                </li>
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg0 px-8 py-4 border-b-[1px] border-b-bg3">
                  <span>Current wealth</span>
                  <span>${totalPrice.toFixed(6)}</span>
                </li>
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg2 px-8 py-4 rounded-b-[10px]">
                  <span>Token rewards estimation</span>
                  <span>{reward.toFixed(6)}</span>
                </li>
                <li className="flex flex-col text-center sm:flex-row justify-between bg-bg0 px-8 py-4 border-b-[1px] border-b-bg3">
                  <span>Potential return</span>
                  <span>${potReturn.toFixed(6)}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </AppLayout>
  );
};

export default CalculatorPage;
