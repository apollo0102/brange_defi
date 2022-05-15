import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { ReactComponent as IconDashboard } from "../../assets/icons/icon-dashboard.svg";
import { ReactComponent as IconAccount } from "../../assets/icons/icon-account.svg";
import { ReactComponent as IconCalculator } from "../../assets/icons/icon-calculator.svg";
import { ReactComponent as IconSwap } from "../../assets/icons/icon-swap.svg";
import { ReactComponent as IconDoc } from "../../assets/icons/icon-doc.svg";
import { ReactComponent as IconReffer } from "../../assets/icons/icon-reffer.svg";
import { ReactComponent as IconDiscord } from "../../assets/icons/icon-discord.svg";
import { ReactComponent as IconTwitter } from "../../assets/icons/icon-twitter.svg";
import { ReactComponent as IconTelegram } from "../../assets/icons/icon-telegram.svg";
import { ReactComponent as IconReddit } from "../../assets/icons/icon-reddit.svg";
import {
  setIsOpen,
} from "slice/slice";
import { useSelector, useDispatch } from "react-redux";
import { BrangeContractAddress } from 'contracts';
const Sidebar = () => {
  const dispatch = useDispatch();
  let isOpen = useSelector((state) => state.counter.isOpen);
  isOpen = useSelector((state) => state.counter.isOpen);
  const handleClickTop = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  const handleClick = url => {
    // 👇️ setting target to _blank with window.open
    if(url !== ""){
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    //console.log("handleClick", isOpen);
    dispatch(setIsOpen(!isOpen));
  };


  return (
    <div>
      <aside
        className="w-auto bg-bg2 border-r-[1px] border-r-bg3 hidden lg:flex h-full justify-center"
        aria-label="Sidebar"
      >
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 text-center">
            <li>
              <h2 className="text-3xl text-orange">Brange</h2>
            </li>
            <li>
              <Link
                to="/"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
              >
                <IconDashboard/>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
              >
                <IconAccount/>
                <span className="ml-3">Account</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calculator"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
              >
                <IconCalculator/>
                <span className="ml-3">Caculator</span>
              </Link>
            </li>
            <li>
              {/* <a href="https://app.rubic.exchange/?fromChain=BSC&toChain=AVALANCHE&from=BNB&to=0xc8a251142722CeB4a524876b89CC4c0709585818&amount=1&hideSelectionTo=true&slippageCcr=30&slippageIt=40&theme=dark" className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01]"> */}
              <button
                onClick={() => handleClickTop(`https://pancakeswap.finance/swap?outputCurrency=${BrangeContractAddress}`)}
                className="flex items-center w-[91%] ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01]"
                
              >
                <IconSwap/>
                <span className="ml-3">Swap</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleClickTop('https://docs.brange.finance')}
                className="flex items-center w-[91%] ml-5 w-full px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01]"
              >
                <IconDoc/>
                <span className="ml-3">Doc</span>
              </button>
            </li>
            <li>
               <Link
                to="/refer"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
              >
                <IconReffer/>
                <span className="ml-3">Refer</span>
              </Link>
            </li>
            <li>
              <ul className="flex items-center mx-2 gap-x-3">
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]" onClick={() => handleClick(`https://twitter.com/brangecompany`)}>
                <IconTwitter />
                </li>
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]" onClick={() => handleClick(`https://discord.com/invite/HBNEh7Px9m`)}>
                  <IconDiscord />
                </li>
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]" onClick={() => handleClick(`https://www.reddit.com/r/Brange`)}>
                  <IconReddit />
                </li>
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]" onClick={() => handleClick(`https://t.me/brangefinance`)}>
                  <IconTelegram />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>

      <aside
        className={`mobile w-auto bg-bg2 border-r-[1px] border-r-bg3  text-white fixed h-full z-40 ease-in-out duration-300 justify-center ${
          isOpen ? "translate-x-0 " : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 text-center">
            <li>
              <h2 className="text-3xl text-orange">Brange</h2>
            </li>
            <li>
              <Link
                to="/"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
                onClick={() => handleClick('') }
              >
                <IconDashboard/>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
                onClick={() => handleClick('') }
              >
                <IconAccount/>
                <span className="ml-3">Account</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calculator"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
                onClick={() => handleClick('') }
              >
                <IconCalculator/>
                <span className="ml-3">Calculator</span>
              </Link>
            </li>
            <li>
              {/* <a href="https://app.rubic.exchange/?fromChain=BSC&toChain=AVALANCHE&from=BNB&to=0xc8a251142722CeB4a524876b89CC4c0709585818&amount=1&hideSelectionTo=true&slippageCcr=30&slippageIt=40&theme=dark" className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01]"> */}
              <button
                className="flex w-[91%] items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01]"
                onClick={() => handleClickTop(`https://pancakeswap.finance/swap?outputCurrency=${BrangeContractAddress}`)}
              >
                
                <IconSwap/>
                <span className="ml-3">Swap</span>
              </button>
            </li>
            <li>
              <button
                className="flex w-[91%] items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01]"
                 onClick={() => handleClick('https://docs.brange.finance') }
              >
                <IconDoc/>
                <span className="ml-3">Doc</span>
              </button>
            </li>
            <li>
               <Link
                to="/refer"
                className="flex items-center ml-5 px-5 py-4 text-center  text-lg font-normal text-white rounded-l-lg dark:text-white hover:bg-[#ec6a01] focus:bg-[#ec6a01]"
                onClick={() => handleClick('') }
              >
                <IconReffer/>
                <span className="ml-3">Refer</span>
              </Link>
            </li>
            <li>
              <ul className="flex items-center mx-2 gap-x-3">
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]" onClick={() => handleClick(`https://twitter.com/brangecompany`)}>
                <IconTwitter />
                </li>
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]"  onClick={() => handleClick(`https://discord.com/invite/HBNEh7Px9m`)}>
                <IconDiscord/>
                </li>
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]"  onClick={() => handleClick(`https://www.reddit.com/r/Brange`)}>
                <IconReddit />
                </li>
                <li className="bg-[#08153c] rounded-full p-3 hover:bg-[#ec6a01]"  onClick={() => handleClick(`https://t.me/brangefinance`)}>
                <IconTelegram />
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
