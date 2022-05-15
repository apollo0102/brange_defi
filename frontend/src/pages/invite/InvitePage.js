import { useEffect, useReducer, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { toast } from "react-toastify";
import { utils } from "ethers";
import axios from 'axios'
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
import "./InvitePage.scss";
import AppLayout from "pages/AppLayout";
import { initializeConnect } from "react-redux/es/components/connect";

const InvitePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");
  const [hide, setHide] = useState(false)
  let navigate = useNavigate ();

  useEffect(() => {
    const init = async () => {
      console.log(searchParams.get("link"));
      try {
        const response = await axios.post(
          "http://localhost:5000/api/refer/save",
          {
            link: searchParams.get("link"),
          }
        );

        console.log("-----", response.data.data.sender);
        console.log("-----", response.data.data.receiver);
        setSender(response.data.data.sender)
        setReceiver(response.data.data.receiver)
      } catch (ex) {
        console.log("----", ex);
        toast.error(ex.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
        setHide(true)
      }
    };
    init();
  }, [searchParams]);

  const applyInvitation = async() => {
    try {
      const response = await axios.post("http://localhost:5000/api/refer/apply",
      {
        sender : sender,
        receiver : receiver,
      })
      console.log("response", response)
      toast.success('success', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      })
      navigate('/');
    } catch (ex) {
      console.log(ex)
      toast.error(ex.response.data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      })
      setHide(true)
  }

  
};
if (hide) {
  navigate('/404');
}
return (
  <div className="app-layout bg-[#08153c] font-sans h-[100vh]">
    <div className="flex">
    <div className="account-page w-[99%] pr-3 rounded-[10px] border-[1px] border-bg3 mb-32 px-7 h-[100vh]">
        <ul className="">
          <li>
            <div className="flex flex-col justify-center text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0">
              <ul className="w-full  py-10 rounded-[10px] text-white text-left">
                <li className="mb-20 text-3xl font-bold text-center text-orange text-shadow-xl lg:text-left">
                  Welcome to Brange Finance Site!
                </li>
                <li className=""> 
                  <ul className="flex flex-row text-2xl">
                    <li className="text-orange">Inviter: </li>
                    <li>{sender}</li>
                  </ul>
                </li>
                <li className="">
                  
                  <div className="text-center">

                  <button
                    className="text-white text-xl font-bold tracking-[.25em] w-full mt-10 mb-10 bg-blue-700 py-5 hover:bg-blue-800 focus:ring-4 focus:outline-none  focus:ring-blue-300 rounded-lg"
                    onClick={applyInvitation}
                  >
                    Join
                  </button>
                    </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
    </div>
    </div>
  </div>
);
}

export default InvitePage;
