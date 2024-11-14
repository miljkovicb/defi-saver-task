import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash.debounce";
import { setRoughCdpId, fetchCDPs, resetCDPs } from "../store/cdpSlice";


const CdpSearchBox = ({ web3 }) => {
  const dispatch = useDispatch();
  const roughCdpId = useSelector((state) => state.cdp.roughCdpId);
  const collateralType = useSelector((state) => state.cdp.collateralType);
  
  const handleSearch = useCallback(
    debounce((cdpId, currentCollateralType) => {
      
      dispatch(
        fetchCDPs({ cdpId, collateralType: currentCollateralType, web3 })
      );
    }, 600),
    [dispatch]
  );

  const onChange = (event) => {
    const newCdpId = event.target.value;
    if (!newCdpId) {
      dispatch(resetCDPs());
      dispatch(setRoughCdpId(""));
      return;
    }
    dispatch(setRoughCdpId(newCdpId));

    if (collateralType) {
      handleSearch(newCdpId, collateralType);
    }
  };

  return (
    <div
      className="relative"
    >
      <input
        disabled={!collateralType}
        type="number"
        value={roughCdpId}
        onChange={onChange}
        placeholder="Enter CDP ID..."
        className="w-60 h-10 border border-material-secondaryContainer bg-material-primaryContainer text-white px-2 py-2 rounded-lg pr-10 outline-none"
      />
      
      <MagnifyingGlassIcon className="absolute top-1/2 right-3 w-5 h-5 text-white transform -translate-y-1/2 pointer-events-none" />
    </div>
  );
};

export default CdpSearchBox;
