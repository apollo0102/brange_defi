import { useEffect, useReducer, useState } from "react";
import axios from "axios";
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
  useReferralEarn,
} from "hooks";
import { useSelector, useDispatch } from "react-redux";
import { BrangeContractAddress } from "../../contracts";
import "react-toastify/dist/ReactToastify.css";
import "./ReferPage.scss";
import AppLayout from "pages/AppLayout";

const ReferPage = () => {
  const { account, activate, deactivate } = useEthers();
  const [linkUrl, setLinkUrl] = useState("");
  const Web3Api = useMoralisWeb3Api();
  const [errors, setErrors] = useState("");
  const [referEarn, setReferEarn] = useState(0);
  const [referNum, setReferNum] = useState(0);
  const referTokens = useReferralEarn(account);
  
  const tokenPrice = useSelector((state) => state.counter.tokenPrice);

  useEffect(() => {
    const init = async () => {
      console.log("account", account)
      setReferEarn(parseFloat((referTokens * tokenPrice).toFixed(6)));

      const response = await axios.post(
        "http://localhost:5000/api/refer/getCount",
        {
          sender: account,
        }
      );
      console.log("-----", response.data);
      if (response.data) {
        setReferNum(response.data.count);
      }
    };
    if (account) {
      init();
    }
    // }, [referalEarn]);
  }, [account]);

  const checkValid = (e) => {
    if (e.length != 0 && !new RegExp(/0x[a-fA-F0-9]{40}$/).test(e)) {
      setErrors("Please input correct wallet address");
    } else {
      setErrors("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    if (!new RegExp(/0x[a-fA-F0-9]{40}/).test(data.get("receiver"))) {
      return;
    }

    // check validation
    if (!account) {
      toast.error("Please connect wallet", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }
    console.log(account, "<---->", data.get("receiver"));
    if (account == data.get("receiver")) {
      console.log("same");
      toast.error("Please input other wallet address.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }
    // Holding
    const holdingOpt = {
      chain: "bsc",
      token_addresses: BrangeContractAddress,
      address: account,
    };
    console.log(holdingOpt);
    let value = await Web3Api.account.getTokenBalances(holdingOpt);
    if (value.length == 0) {
      toast.error("You must be a holder.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/refer/getLink",
        {
          sender: account,
          receiver: data.get("receiver"),
        }
      );

      toast.success("success", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      console.log("-----", response.data);
      setLinkUrl(
        "https://dashboard.brange.finance/invite?link=" + response.data.link
      );
    } catch (ex) {
      console.log(ex);
      toast.error(ex.response.data, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
      return null;
    }
  };

  return (
    <AppLayout>
      <div className="account-page w-[99%] pr-3 rounded-[10px] border-[1px] border-bg3 mb-32 px-7 h-[100vh]">
        <form onSubmit={handleSubmit}>
          <ul className="">
            <li>
              <div className="flex flex-col justify-center text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0">
                <ul className="w-full  py-10 rounded-[10px] text-white text-left">
                  <li className="mb-20 text-3xl font-bold text-center text-orange text-shadow-xl lg:text-left">
                    Refer Friends
                  </li>
                  <li>
                    <div className="flex flex-col justify-center mb-5 text-center gap-x-7 lg:justify-between lg:flex-row gap-y-5 lg:gap-y-0">
                    <ul className="bg-bg4 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3">
                        <li className="mb-4 text-xl">Total Token Earned</li>
                        <li className="text-3xl">{referTokens}</li>
                      </ul>
                      <ul className="bg-bg5 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3">
                        <li className="mb-4 text-xl">Total Refer Earned</li>
                        <li className="text-3xl">${referEarn}</li>
                      </ul>
                      <ul className="bg-bg0 w-full text-white py-10 rounded-[10px] border-[1px] border-bg3">
                        <li className="mb-4 text-xl">Total Invited Account</li>
                        <li className="text-3xl">{referNum}</li>
                      </ul>
                    </div>
                  </li>
                  <li className="">
                    <div className="relative z-0 w-full mb-6 group gap-y-5">
                      <input
                        type="text"
                        name="receiver"
                        className="block w-full px-0 py-5 text-xl text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        onChange={(e) => checkValid(e.target.value)}
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="receiver"
                        className="peer-focus:font-medium absolute text-2xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Please input your friend's wallet address
                      </label>
                      {errors && <h5 className="text-red-700">{errors}</h5>}
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="text-white text-xl font-bold tracking-[.25em] w-full mt-10 mb-10 bg-blue-700 py-5 hover:bg-blue-800 focus:ring-4 focus:outline-none  focus:ring-blue-300 rounded-lg"
                      >
                        INVITE
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="flex flex-col mb-10 text-left justify-left gap-x-5 gap-y-10">
                      <span className="">Invite link</span>
                      <span className="break-all">{linkUrl}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </form>
      </div>
    </AppLayout>
  );
};

export default ReferPage;
