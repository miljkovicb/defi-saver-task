import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Web3 from "web3";

import contractAbi from "../../cdpContractAbi.json";

const BATCH_SIZE = 5;
const NUMBER_OF_CDPS = 20;

export const fetchCDPs = createAsyncThunk(
  "cdp/fetchCDPs",
  async ({ cdpId, collateralType, web3 }, { dispatch, getState }) => {
    if (!web3) {
      toast.error("Web3 not initialized in fetchCDPs action");
      return;
    }
    const state = getState();
    const collateralPrice = state.cdp.currentCollateralPrice;
    const interestRate = state.cdp.rate;
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(contractAbi, contractAddress);

    const halfRange = Math.floor(NUMBER_OF_CDPS / 2);
    const startId = cdpId > halfRange ? cdpId - halfRange : 1;

    const idsToFetch = Array.from(
      { length: NUMBER_OF_CDPS },
      (_, i) => startId + i
    );

    const fetchCdpData = async (id) => {
      try {
        const cdpData = await contract.methods.getCdpInfo(id).call();

        if (
          Web3.utils.hexToAscii(cdpData.ilk).replace(/\0/g, "") ===
          collateralType
        ) {
          const collateralInEther = parseFloat(
            Web3.utils.fromWei(cdpData.collateral, "ether")
          ).toFixed(2);
          const debt = parseFloat(
            Web3.utils.fromWei(cdpData.debt, "ether") * interestRate
          ).toFixed(2);

          const ratio =
            debt > 0
              ? (((collateralInEther * collateralPrice) / debt) * 100).toFixed(
                  2
                )
              : "N/A";

          return {
            id: id.toString(),
            collateralType: collateralType.toString(),
            collateralValue: collateralInEther,
            debt: debt,
            ratio,
          };
        }
        return null;
      } catch (error) {
        toast.error(`Error fetching CDP ${id}: ${error.message}`);
        return null;
      }
    };

    const cdpList = [];
    const totalBatches = Math.ceil(idsToFetch.length / BATCH_SIZE);
    for (let i = 0; i < idsToFetch.length; i += BATCH_SIZE) {
      const batch = idsToFetch.slice(i, i + BATCH_SIZE).map(fetchCdpData);
      const batchResults = await Promise.all(batch);
      const filteredResults = batchResults.filter((result) => result !== null);
      cdpList.push(...filteredResults);

      const completedBatches = Math.floor(i / BATCH_SIZE) + 1;
      const progress = Math.round((completedBatches / totalBatches) * 100);
      dispatch(setProgress(progress));
    }

    return cdpList;
  }
);

const cdpSlice = createSlice({
  name: "cdp",
  initialState: {
    account: null,
    web3: null,
    cdpData: [],
    roughCdpId: "",
    collateralType: "",
    loading: false,
    progress: 0,
    rate: 1,
    currentCollateralPrice: 0,
    liquidationPercentage: 0,
  },
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
    setWeb3(state, action) {
      state.web3 = action.payload;
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    setRoughCdpId(state, action) {
      state.roughCdpId = action.payload;
    },
    resetCDPs(state, action) {
      state.cdpData = [];
    },
    setCollateralType(state, action) {
      state.collateralType = action.payload;
    },
    setProgress(state, action) {
      state.progress = action.payload;
    },
    setRate(state, action) {
      state.rate = action.payload;
    },
    setCurrentCollateralPrice(state, action) {
      state.currentCollateralPrice = action.payload;
    },
    setLiquidationPercentage(state, action) {
      state.liquidationPercentage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCDPs.pending, (state) => {
        state.loading = true;
        state.progress = 0;
      })
      .addCase(fetchCDPs.fulfilled, (state, action) => {
        state.cdpData = action.payload;
        state.loading = false;
        state.progress = 100;
      })
      .addCase(fetchCDPs.rejected, (state) => {
        state.loading = false;
        state.progress = 0;
      });
  },
});

export const {
  setProgress,
  setWeb3,
  setAccount,
  setError,
  setRoughCdpId,
  resetCDPs,
  setCollateralType,
  setRate,
  setCurrentCollateralPrice,
  setLiquidationPercentage,
} = cdpSlice.actions;
export default cdpSlice.reducer;
