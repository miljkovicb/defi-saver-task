import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CdpDetails = ({ web3, account }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cdpData = useSelector((state) => state.cdp.cdpData);
  const liquidationRate = useSelector(
    (state) => state.cdp.liquidationPercentage
  );
  const currentCollateralPrice = useSelector(
    (state) => state.cdp.currentCollateralPrice
  );

  const cdp = cdpData.find((item) => item.id === id);
  const [signature, setSignature] = useState(null);
  const [isMetaMaskConnected, setMetaMaskConnected] = useState(false);

  useEffect(() => {
    if (!cdp) {
      navigate("/");
    }
  }, [cdp, navigate]);

  if (!cdp) {
    return <div>Loading...</div>;
  }

  const collateralValue = parseFloat(cdp.collateralValue);
  const debt = parseFloat(cdp.debt).toFixed(2);
  const ratio = isNaN(cdp.ratio) ? "0" : parseFloat(cdp.ratio);
  const maxCollateralWithdrawal = (
    collateralValue * currentCollateralPrice -
    debt * (liquidationRate / 100)
  ).toFixed(2);
  const maxDebtCreation = (
    (collateralValue * currentCollateralPrice) / (liquidationRate / 100) -
    debt
  ).toFixed(2);

  useEffect(() => {
    const checkMetaMask = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          setMetaMaskConnected(accounts.length > 0);
        } catch (error) {
          toast.error("MetaMask not connected:", error.message);
        }
      }
    };
    checkMetaMask();
  }, []);

  const handleSignMessage = async () => {
    if (web3 && window.ethereum && cdp) {
      const message = "This is my CDP";
      try {
        const signature = await web3.eth.personal.sign(message, account, "");
        setSignature(signature);
      } catch (error) {
        toast.error("Error signing message:", error.message);
      }
    }
  };

  const resolveColor = (ratio) => {
    if (ratio === "0") {
      return "text-gray-500";
    }

    if (ratio < 145) {
      return "text-red-500";
    } else if (ratio < 250) {
      return "text-orange-500";
    } else {
      return "text-green-500";
    }
  };

  return (
    <div class="flex flex-col items-center w-screen px-4">
      <div class="flex flex-col items-center mb-12 w-full max-w-screen-lg">
        <div className="flex flex-col gap-2 justify-between bg-black py-6 w-full">
          <h1 className="text-4xl text-material-primary font-bold">
            CDP ID: {id}
          </h1>

          <div className="flex flex-row items-right gap-4">
            <button onClick={() => history.back()}>{"<"} Back to search</button>
          </div>
        </div>
        <div className="p-8 rounded rounded-lg shadow border border-material-secondary w-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="flex gap-4 items-center text-2xl font-bold">
              <img src={`/${cdp.collateralType}.png`} className="w-10" alt="" />
              <span>{cdp.collateralType}</span>
            </h2>
            <div className="flex flex-col gap-1 items-start">
              <span className="font-bold text-material-onSurface">
                Current price: ${currentCollateralPrice}
              </span>
              <span className="font-bold text-orange-500">
                Liquidation Ratio: {liquidationRate.toFixed(2)} %
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-12">
            <div className="flex gap-12">
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 font-semibold">
                  Collateral Value
                </span>
                <span className="text-material-onBackground font-semibold text-4xl">
                  {collateralValue}
                  <span className="text-gray-600 font-normal text-xl">
                    {cdp.collateralType}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 font-semibold">Debt</span>
                <span className="text-material-onBackground font-semibold text-4xl">
                  {debt}
                  <span className="text-gray-600 font-normal text-xl">DAI</span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`font-semibold ${resolveColor(ratio)}`}>
                  Collateralization Ratio
                </span>
                <span className="text-material-onBackground font-semibold text-4xl">
                  {ratio}%
                </span>
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 font-semibold">
                  Max Collateral Withdrawal
                </span>
                <span className="text-material-onBackground font-semibold text-4xl">
                  ${maxCollateralWithdrawal}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 font-semibold">
                  Max Debt Creation
                </span>
                <span className="text-material-onBackground font-semibold text-4xl">
                  {maxDebtCreation} DAI
                </span>
              </div>
            </div>
          </div>

          {isMetaMaskConnected ? (
            <div className="mt-10 w-full flex flex-col items-center">
              {!signature ? (
                <button
                  className="bg-material-primary hover:opacity-75 text-gray-900 font-semibold py-2 px-4 rounded"
                  onClick={handleSignMessage}
                >
                  This is my CDP
                </button>
              ) : (
                <>
                  <div className="w-full bg-gray-800 text-material-primary rounded p-4 overflow-x-auto">
                    <p className="whitespace-nowrap">
                      <span className="text-white">Signature:</span> {signature}
                    </p>
                  </div>
                  <p className="text-gray-300 mt-2 w-full text-right text-sm">
                    Scroll right
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="mt-10 w-full flex justify-center items-center">
              <p className="mt-4 text-red-500">
                Connect MetaMask to sign this CDP
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CdpDetails;
