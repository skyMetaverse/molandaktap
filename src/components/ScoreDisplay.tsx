'use client'

import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import { useState, useEffect } from 'react'
import Image from 'next/image'


export default function ScoreDisplay() {
    const { address } = useAccount()
    const [score, setScore] = useState<bigint>(BigInt(0))

    const { data: userStats, refetch } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getUserStats',
        args: address ? [address] : undefined,
    })

    useEffect(() => {
        if (userStats) {
            setScore(userStats[0])
        }
    }, [userStats])

    useEffect(() => {
        if (!address) return

        const interval = setInterval(() => {
            refetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [address, refetch])

    return (
        <div className="inline-flex items-center gap-3 bg-[#3d2487]/20 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-lg border border-[#836EF9]/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#836EF9] via-[#9c8cfa] to-[#5FEDDF] rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
                    <Image
                        src="/images/monad-logo.gif"
                        alt="Monad Logo"
                        width={28}
                        height={28}
                        className="w-7 h-7"
                    />
                </div>
                <span className="text-[#ccc4fc] text-2xl font-bold">
                    {score.toString()}
                </span>
            </div>
        </div>
    )
} 