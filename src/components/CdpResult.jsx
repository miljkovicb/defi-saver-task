import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CdpResult = () => {
  const { cdpData, loading, progress } = useSelector((state) => state.cdp);
  const collateralType = useSelector((state) => state.cdp.collateralType);
  const [collateral, setCollateral] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (collateralType) {
      setCollateral(collateralType.split("-")[0]);
    }
  }, [collateralType]);

  const handleRowClick = (id) => {
    navigate(`/cdp/${id}`);
  };

  const ratioDisplay = (ratio) => {
    if (ratio === 'N/A') {
      return (
        <span className="inline-flex justify-center bg-gray-400 border-2 border-gray-700 text-gray-700 font-semibold rounded-full px-2">
          N/A
        </span>
      )
    }

    if (ratio < 150) {
      return (
        <span className="inline-flex justify-center bg-red-400 border-2 border-red-900 text-red-800 font-semibold rounded-full px-2">
          {ratio}%
        </span>
      )
    } else if (ratio < 250) {
      return (
        <span className="inline-flex justify-center bg-orange-300 border-2 border-orange-800 text-orange-900 font-semibold rounded-full px-2">
          {ratio}%
        </span>
      )
    } else {
      return (
        <span className="inline-flex justify-center bg-green-300 border-2 border-green-700 text-green-800 font-semibold rounded-full px-2">
          {ratio}%
        </span>
      )
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center w-full">
        <p className="text-center mb-2">Loading... {progress}%</p>
        <div className="w-full bg-gray-700 h-1">
          <div
            className="h-1 bg-material-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow border border-material-secondary w-full max-w-screen-lg mx-auto">
      <div className="py-6 pl-8 rounded-tl-lg rounded-tr-lg bg-white flex items-center bg-gradient-to-r from-material-bgDark to-material-bgRed">
        <h2 className="font-semibold text-xl text-gray-100 mb-0">
          Positions
        </h2>
      </div>
      <table className="min-w-full  text-[15px]">
        <thead>
          <tr>
            <th className="py-3 px-8 border-b border-material-primary text-gray-200 text-left tracking-wider font-bold bg-material-surfaceVariant">
              ID
            </th>
            <th className="py-3 px-8 border-b border-material-primary text-gray-200 text-left tracking-wider font-bold bg-material-surfaceVariant">
              Collateral Type
            </th>
            <th className="py-3 px-8 border-b border-material-primary text-gray-200 text-right tracking-wider font-bold bg-material-surfaceVariant">
              Collateral
            </th>
            <th className="py-3 px-8 border-b border-material-primary text-gray-200 text-right tracking-wider font-bold bg-material-surfaceVariant">
              Debt
            </th>
            <th className="py-3 px-8 border-b border-material-primary text-gray-200 text-center tracking-wider font-bold bg-material-surfaceVariant">
              Ratio
            </th>
            <th className="py-3 px-8 border-b border-material-primary text-gray-200 text-left tracking-wider font-bold bg-material-surfaceVariant">
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody>
          {!cdpData || cdpData.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-4 px-8 text-center">
                No data available
              </td>
            </tr>
          ) : (
            cdpData.map((position, index) => (
              <tr
                key={position.id}
                onClick={() => handleRowClick(position.id)}
                className="group cursor-pointer border-t border-material-secondary text-material-onBackground hover:bg-material-bgRedHover hover:text-brand even:bg-material-onSurfaceVariant"
              >
                <td className="py-4 px-8 group-last:rounded-0 group-last:rounded-bl-xl">
                  <div className="flex items-center gap-4">{position.id}</div>
                </td>
                <td className="py-4 px-8 text-center">{position.collateralType}</td>
                <td className="py-4 px-8 text-right">
                  {position.collateralValue} {collateral}
                </td>
                <td className="py-4 px-8 text-right">
                  {position.debt} DAI
                </td>
                <td className="py-4 px-8 text-center">
                  {ratioDisplay(position.ratio)}
                </td>
                <td className="py-4 px-8 group-last:rounded-0 group-last:rounded-br-xl">
                  <img src="/arr-right.png" className="w-5" title="CDP details" />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CdpResult;
