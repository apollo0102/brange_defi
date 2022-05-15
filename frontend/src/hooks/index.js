import { ethers } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { useContractCall, useContractFunction } from '@usedapp/core';
import BrangeContractABI from '../abi/BrangeContractABI.json';
import {BrangeContractAddress} from '../contracts';

const BrangeContractInterface = new ethers.utils.Interface(BrangeContractABI);
const BrangeContract = new Contract(
  BrangeContractAddress,
  BrangeContractInterface
);

export const useInitRebaseStartTime = () => {
  const [rebaseStartTime] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: '_initRebaseStartTime',
      args: [],
    }) ?? [];
  return rebaseStartTime;
};

export const useLastRebaseTime = () => {
  const [lastRebaseTime] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: '_lastRebasedTime',
      args: [],
    }) ?? [];

  return lastRebaseTime;
};

export const useTotalSupply = () => {
  const [totalSupply] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'totalSupply',
      args: [],
    }) ?? [];

  return totalSupply;
};

export const useReferralEarn = (account) => {
  const [totalSupply] =
    useContractCall(
      {
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'referalEarn',
      args: [account],
    }) ?? [];

  return totalSupply;
};

export const useTotalHolders = () => {
  const [totalHolders] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'totalHolders',
      args: [],
    }) ?? [];
    
  return totalHolders;
};

const NFTContract = new Contract(BrangeContractAddress, BrangeContractInterface);

export const useMaxSupply = () => {
  const [maxSupply] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'maxSupply',
      args: [],
    }) ?? [];

  return maxSupply;
};

export const useMaxMintAmountPerTx = () => {
  const [maxMintAmountPerTx] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'maxMintAmountPerTx',
      args: [],
    }) ?? [];

  return maxMintAmountPerTx;
};

export const useCost = () => {
  const [cost] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'cost',
      args: [],
    }) ?? [];

  return cost;
};

export const usePaused = () => {
  const [paused] =
    useContractCall({
      abi: BrangeContractInterface,
      address: BrangeContractAddress,
      method: 'paused',
      args: [],
    }) ?? [];

  return paused;
};


export const useMint = () => {
  const { state, send, event } = useContractFunction(NFTContract, 'mint', {});

  return { state, send, event };
};
