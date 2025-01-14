import { useReadContracts } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import { formatAddress } from '@/utils/format'
import { useEffect, useState } from 'react'

interface PlayerStats {
    address: string
    clickCount: bigint
}

type GetAllPlayersResult = readonly `0x${string}`[]

export default function Leaderboard() {
    const [sortedPlayers, setSortedPlayers] = useState<PlayerStats[]>([])

    const { data: playersData } = useReadContracts({
        contracts: [
            {
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'getAllPlayers',
            } as const
        ]
    })

    const players = playersData?.[0]?.result as GetAllPlayersResult | undefined

    const { data: statsData } = useReadContracts({
        contracts: players?.map((address) => ({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getUserStats',
            args: [address],
        } as const)) || []
    })

    useEffect(() => {
        if (!players || !statsData) return

        const playerStats: PlayerStats[] = players.map((address, index) => ({
            address: address,
            clickCount: statsData[index]?.result?.[0] || BigInt(0)
        }))

        const sorted = [...playerStats]
            .sort((a, b) => (b.clickCount > a.clickCount ? 1 : -1))
            .slice(0, 50)

        setSortedPlayers(sorted)
    }, [players, statsData])

    return (
        <div className="bg-[#3d2487]/20 backdrop-blur-xl rounded-xl shadow-lg border border-[#836EF9]/10">
            <div className="bg-gradient-to-r from-[#836EF9] via-[#9c8cfa] to-[#5FEDDF] p-4 rounded-t-xl">
                <h2 className="text-xl font-bold text-[#200052] text-center">Leaderboard</h2>
            </div>
            <div className="p-4">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-[#836EF9]/20">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#5FEDDF]">Rank</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-[#5FEDDF]">Wallet</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-[#5FEDDF]">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#836EF9]/20">
                        {sortedPlayers.map((player, index) => (
                            <tr key={player.address} className="hover:bg-[#3d2487]/20">
                                <td className="px-4 py-3 text-sm text-[#ccc4fc]">
                                    #{index + 1}
                                </td>
                                <td className="px-4 py-3 text-sm text-[#ccc4fc]">
                                    {formatAddress(player.address)}
                                </td>
                                <td className="px-4 py-3 text-sm text-[#ccc4fc] text-right">
                                    {player.clickCount.toString()}
                                </td>
                            </tr>
                        ))}
                        {!sortedPlayers.length && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-[#ccc4fc]">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="text-center text-sm text-[#9c8cfa] mt-4">
                    The leaderboard updates every hour.
                </div>
            </div>
        </div>
    )
} 