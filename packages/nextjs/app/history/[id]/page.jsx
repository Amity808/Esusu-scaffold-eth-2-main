'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth";
import { Address } from "~~/components/scaffold-eth";
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
// import Deposit from "../../"
import CustomInput from "~~/components/ui/CustomeInput";
import { parseEther } from "viem";

const Deatails = () => {

  const { address } = useAccount()
  const [Amount, setAmount] = useState("");
  const [historyData, setHistoryData] = useState(null)

  const { data: fetchData } = useScaffoldReadContract({
    contractName: "Esusu",
    functionName: "getSavings",
    args: [id, address]
});

const handleClear = () => {
  setAmount("");
};

const { writeContractAsync, isPending } = useScaffoldWriteContract("Esusu")

const initialSave = async (e) => {
  e.preventDefault();
  try {
    await writeContractAsync({
      functionName: "depositSave",
      args: [id],
      value: parseEther(Amount),
    });
    handleClear();
  } catch (error) {
    handleClear();
    console.log(error);
  }
};

const handleWithdraw = async () => {
  try {
    await writeContractAsync({
      functionName: "targetReach",
        args: [id],
    })
  } catch (error) {
    console.log(error)
  }
}
console.log(id, "id")

console.log(fetchData)

const getSavings = useCallback(() => {
  if (!fetchData) return null;

  setHistoryData({
    owner: fetchData[0],
    savingsAmount: fetchData[1],
    target: Number(fetchData[2]),
    purpose: fetchData[3],
    isInitiated: Boolean(fetchData[4]),
    forceWithdraw: fetchData[5],
    inSaving: Boolean(fetchData[6]),
    SavingsStatus: fetchData[7],
    // nonce: Number(fetchData[10]),
  })
}, [fetchData]);

useEffect(() => {
  getSavings()
}, [getSavings])

const currentAmount = historyData?.savingsAmount ? formatEther(historyData?.savingsAmount.toString()) : 0;
const target = historyData?.target ? formatEther(historyData?.target.toString()) : 0;
let timeStampNs = historyData?.isTime

  let timeStampS = timeStampNs / 1e9;

  let date = new Date(timeStampS * 1000)

  let readableDate = date.toLocaleString()
  console.log("Readable date", readableDate)

  console.log(historyData?.SavingsStatus, "status")




console.log(historyData?.SavingsStatus)
if (!historyData) return null;

if (address !== historyData?.owner) return null;
  return (
    <div>
      Details
    </div>
  )
}

export default Deatails
