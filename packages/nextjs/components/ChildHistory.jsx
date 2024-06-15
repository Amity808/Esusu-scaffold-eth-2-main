"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth";
import { useAccount } from 'wagmi';
import { Address } from "~~/components/scaffold-eth";
import Link from 'next/link';
import ChildSaveDeposit from "~~/components/ChildSaveDeposit"

const ChildHistory = () => {

    const [historyData, setHistoryData] = useState(null)

    const { address } = useAccount()

    const { data: fetchData } = useScaffoldReadContract({
      contractName: "Esusu",
      functionName: "_childSavings",
      args: [address]
  });

  const { writeContractAsync, isPending } = useScaffoldWriteContract("Esusu")
  
  const withdraw = async () => {
    try {

      await writeContractAsync({
        functionName: "withdraw",
        args: [address],
      })
     
      console.log("Saved successfully")
    } catch (error) {
      console.log(error);

    }
  }

  const getSavings = useCallback(() => {
    if (!fetchData) return null;
  
    setHistoryData({
        childAge: fetchData[0],
        amount: Number(fetchData[1]),
        targetChild: Number(fetchData[2]),
        childAddress: fetchData[3],
        fatherAddress: fetchData[4],
        canWithdraw: Number(fetchData[5])
    })
  }, [fetchData]);
  
  useEffect(() => {
    getSavings()
  }, [getSavings])

  let timeStampNs = historyData?.canWithdraw

  let timeStampS = timeStampNs / 1e9;

  let date = new Date(timeStampS * 1000)

  let readableDate = date.toLocaleString()
  console.log("Readable date", readableDate)

  console.log(historyData?.canWithdraw)
  
  if (!historyData) return null;
  return (
    <div>
        <div className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900 m-3">
            <Address address={historyData?.childAddress} />
          <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
            Current Amount: {historyData?.amount}
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Child Target: {historyData?.childAge}
          </p>
          <div className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
            <Link target="_blank" href={'/'}> {readableDate}</Link>
            <Link target="_blank" href={`/space/`} className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
              With draw Date 
            </Link>
          </div>
          <div>
            {historyData?.targetChild >= historyData?.amount ? <>
            </> :<><p>You have not reach your target</p></>}
            <p>End Date: {readableDate}</p>
            <button className="mt-4 text-sm text-white bg-black rounded-full px-3 py-1" onClick={withdraw}>Withdraw</button>
          </div>
          <p>b</p>
          <ChildSaveDeposit address={historyData?.childAddress} />
        </div>
    </div>
  )
}

export default ChildHistory
