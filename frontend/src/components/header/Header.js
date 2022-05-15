import { useEffect, useReducer, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAccount, setTokenPrice } from "../../slice/slice";
import { useEthers, shortenAddress } from "@usedapp/core";
import { useMoralisWeb3Api } from "react-moralis";
import { toast } from "react-toastify";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import "react-toastify/dist/ReactToastify.css";
import "./Header.scss";
import { BrangeContractAddress } from 'contracts';
// import {getCoinGeckoPrices} from '../common/coingeckoApi'
import {
  useInitRebaseStartTime,
  useLastRebaseTime,
  useTotalSupply,
} from "hooks";
import {
  setBlockNumber,
  setHolders,
  setApysStep,
  setIsOpen,
} from "slice/slice";
import { initializeUseSelector } from "react-redux/es/hooks/useSelector";

const { REACT_APP_MORALIS_APPLICATION_ID, REACT_APP_SERVER_URL } = process.env;

const Header = () => {
  const dispatch = useDispatch();
  let apyStep = useSelector((state) => state.counter.apyStep);
  let isOpen = useSelector((state) => state.counter.isOpen);
  const { account, activate, deactivate } = useEthers();
  const Web3Api = useMoralisWeb3Api();
  const tokenPrice = useSelector((state) => state.counter.tokenPrice);
  const rebaseStartTime = useInitRebaseStartTime();

  useEffect(() => {
    if (account) {
      dispatch(setAccount(account));
    }
    init()
  }, [account, rebaseStartTime]);

  function handleClick() {
    //console.log("handleClick", isOpen);
    dispatch(setIsOpen(!isOpen));
  }

  const handleConnect = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: "Metamask",
          description: "Connect with the provider in your Browser",
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: "https://bridge.walletconnect.org",
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    };

    if (!account) {
      const web3Modal = new Web3Modal({
        providerOptions,
      });
      const provider = await web3Modal.connect();
      await activate(provider);
    }
  };

  const handleClipboard = () => {
    navigator.clipboard.writeText(account || "clipboard");
    toast.info("Wallet Address Copy.");
  };

  const init = async () => {
    //console.log("-----");
    const options = {
      address: BrangeContractAddress,
      chain: "bsc",
    };
    const price = await Web3Api.token.getTokenPrice(options);
    //console.log(price);
    // //console.log(price.usdPrice.toFixed(4));
    dispatch(setTokenPrice(price.usdPrice.toFixed(6)));

    const curTime = new Date().getTime();
    let deltaStrTime = curTime - parseInt(rebaseStartTime, 10) * 1000;
    const timeFrame = 900000;
    const strTimes = Math.floor(deltaStrTime / timeFrame);
    //console.log("strTimes--->", strTimes);
    if (parseInt(strTimes) <= 35040) {
      dispatch(setApysStep(0.02355));
    } else if (strTimes <= 52560) {
      dispatch(setApysStep(0.00211));
    } else if (strTimes <= 245280) {
      dispatch(setApysStep(0.00014));
    } else {
      dispatch(setApysStep(0.00002));
    }
    // //console.log("apyStep", apyStep)
  };

  return (
    <header className="">
      <div className="flex flex-wrap md:flex-row justify-between md:justify-end items-center w-full  py-5 bg-bg2 text-white text-xl border-l-[1px] border-b-[1px] border-bg3 mb-8 rounded-b-[20px] px-2">
        <span className="mr-5 mb-5 sm:mb-0">Token Price ${tokenPrice} USD</span>
        {!account ? (
          <button
            className="bg-[#ec6a01] px-8 py-2 rounded-lg"
            onClick={handleConnect}
          >
            Connect
          </button>
        ) : (
          <button
            className="bg-[#ec6a01] px-8 py-2 rounded-lg mr-24 lg:mr-0"
            onClick={handleClipboard}
          >
            {shortenAddress(account)}
          </button>
        )}

        {isOpen ? (
          <button
            className="flex text-4xl text-white items-center cursor-pointer fixed right-10 top-6 z-50 lg:hidden"
            onClick={handleClick}
          >
            x
          </button>
        ) : (
          <svg
            onClick={handleClick}
            className="  fixed  z-30 flex mt-7 sm:mt-0 items-center cursor-pointer right-10 top-6 lg:hidden"
            fill="white"
            viewBox="0 0 100 80"
            width="40"
            height="40"
          >
            <rect width="100" height="10"></rect>
            <rect y="30" width="100" height="10"></rect>
            <rect y="60" width="100" height="10"></rect>
          </svg>
        )}
      </div>
    </header>
  );
};

export default Header;
