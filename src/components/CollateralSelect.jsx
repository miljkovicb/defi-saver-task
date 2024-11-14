import { useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  setCollateralType,
  setCurrentCollateralPrice,
  fetchCDPs,
  setRate,
  setLiquidationPercentage,
} from "../store/cdpSlice";
import ilkContractAbi from "../../ilkContractAbi.json";
import { toast } from "react-toastify";
import Web3 from "web3";
import { Tooltip } from "react-tooltip";
import { useState } from "react";

const collateralTypes = [
  { value: "ETH-A", label: "ETH-A", price: 3198, liquidation: 145 },
  { value: "WBTC-A", label: "WBTC-A", price: 90612, liquidation: 145 },
  { value: "USDC-A", label: "USDC-A", price: 1, liquidation: 101 },
];

const CollateralSelect = ({ web3 }) => {
  const dispatch = useDispatch();
  const cdpId = useSelector((state) => state.cdp.roughCdpId);
  const optionSelected = useSelector((state) => state.cdp.collateralType);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    if (!optionSelected) {
      setTooltipOpen(true);
    } else {
      setTooltipOpen(false);
    }
  }, [optionSelected]);


  const ilkContractAddress = import.meta.env.VITE_ILK_CONTRACT_ADDRESS;
  const ilkContract = new web3.eth.Contract(ilkContractAbi, ilkContractAddress);

  const handleChange = async (event) => {
    const selectedCollateralType = event.value;
    dispatch(setCurrentCollateralPrice(event.price));
    dispatch(setLiquidationPercentage(event.liquidation));
    const collateralTypeBytes = Web3.utils.padRight(
      Web3.utils.asciiToHex(selectedCollateralType),
      64
    );
    let rate = 1;

    try {
      const ilks = await ilkContract.methods.ilks(collateralTypeBytes).call();

      if (!ilks) {
        toast.error(`No data found for ${selectedCollateralType}`);
        return;
      } else {
        rate = parseFloat(Web3.utils.fromWei(ilks.rate, "wei") / 1e27).toFixed(
          4
        );
        dispatch(setRate(rate));
      }
    } catch (error) {
      toast.error(`Error fetching ilk data:: ${error.message}`);
      return;
    }

    dispatch(setCollateralType(selectedCollateralType));
    if (cdpId) {
      dispatch(
        fetchCDPs({ cdpId, collateralType: selectedCollateralType, web3 })
      );
    }
  };

  return (
    <div
      className="relative"
      data-tooltip-content="Please select a collateral type first"
      data-tooltip-id="search-disabled"
    >
      <Select
        options={collateralTypes}
        onChange={handleChange}
        placeholder="Choose collateral type..."
        value={collateralTypes.find(
          (option) => option.value === optionSelected
        )}
        classNames={{
          control: ({ isDisabled, isFocused }) =>
            `w-60 px-2 !h-10 text-material-onSurface bg-material-primaryContainer border border-material-secondaryContainer rounded-lg outline-none ${
              isFocused ? "!border-material-primary" : ""
            }`,
          option: ({ isDisabled, isFocused, isSelected }) =>
            `bg-material-primaryContainer p-2 first:mt-1 text-material-onSurface hover:bg-black hover:cursor-pointer ${
              isFocused ? "bg-purple-800" : ""
            }`,
        }}
        unstyled={true}
        isSearchable={false}
      />
      <Tooltip
        id="search-disabled"
        isOpen={tooltipOpen}
        style={{ backgroundColor: "#CC7B74", color: "#fff" }}
      />
    </div>
  );
};

export default CollateralSelect;
