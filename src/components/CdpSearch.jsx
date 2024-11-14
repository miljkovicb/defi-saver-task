import React from "react";
import CollateralSelect from "./CollateralSelect";
import CdpSearchBox from "./CdpSearchBox";
import CdpResult from "./CdpResult";
const CdpSearch = ({ web3 }) => {
  return (
    <div className="flex flex-col items-center w-screen mb-12 px-4">
      <div className="sticky top-0 flex w-full max-w-screen-lg justify-between bg-black py-6">
        <h1 className="text-4xl text-material-primary font-bold">CDP Search</h1>
        <div className="flex flex-row items-right gap-4">
          <CollateralSelect web3={web3} />
          <CdpSearchBox web3={web3} />
        </div>
      </div>
      <div className="w-full max-w-screen-lg">
        <CdpResult web3={web3} />
      </div>
    </div>
  );
};

export default CdpSearch;
