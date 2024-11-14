import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import CdpDetails from "./components/CdpDetails";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import { setError } from "./store/cdpSlice";
import Web3 from "web3";
import CdpSearch from "./components/CdpSearch";

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.cdp);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window.ethereum === "undefined") {
        toast.error(
          "MetaMask is not installed. Please install MetaMask and try again."
        );
        return;
      }

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        dispatch(setError("Failed to connect to MetaMask. " + err.message));
        toast.error(err.message);
      }
    };

    initWeb3();
  }, [dispatch]);

  return (
    <Router>
      <div className="relative">
        {error ? (
          <p>{error}</p>
        ) : web3 && account ? (
          <Routes>
            <Route path="/" element={<CdpSearch web3={web3} />} />
            <Route path="/cdp/:id" element={<CdpDetails web3={web3} account={account} />} />
          </Routes>
        ) : (
          <p>Loading Web3 and Account...</p>
        )}
        <ToastContainer autoClose={1500} position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
