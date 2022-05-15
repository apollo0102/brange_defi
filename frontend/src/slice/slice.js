import { createSlice } from '@reduxjs/toolkit'
//
const initialState = {
  tokenPrice:0,
  account:'',
  blockNumber:0,
  holders:[],
  hdTokens:0,
  apys:[0.02355, 0.00211, 0.00014, 0.00002],
  rebaseTimes:[35040, 52560, 245280],
  apyStep:0,
  dailyRate:0,
  isOpen:false,
  bnbPrice:0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setTokenPrice: (state, action) => {
      state.tokenPrice = action.payload
    },
    setAccount: (state, action) => {
      state.account = action.payload
    },
    setBlockNumber: (state, action) => {
      state.blockNumber = action.payload
    },
    setHolders: (state, action) => {
      state.holders = action.payload
    },
    setHdTokens: (state, action) => {
      state.hdTokens = action.payload
    },
    setApysStep: (state, action) => {
      state.apyStep = action.payload
    },
    setDailyRate: (state, action) => {
      state.dailyRate = action.payload
    },
    setIsOpen: (state, action) => {
      state.isOpen = action.payload
    },
    setBNBPrice: (state, action) => {
      state.bnbPrice = action.payload
    },
  },
})

export const {
  setTokenPrice, 
  setAccount, 
  setBlockNumber, 
  setHolders, 
  setHdTokens,
  setApysStep,
  setDailyRate,
  setIsOpen,
  setBNBPrice,
} = counterSlice.actions

export default counterSlice.reducer