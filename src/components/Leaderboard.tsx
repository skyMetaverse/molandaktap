import { useReadContracts, useReadContract } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import { formatAddress } from '@/utils/format'
import { useEffect, useState, useCallback, useRef } from 'react'

interface PlayerStats {
    address: `0x${string}`
    clickCount: bigint
}

const UPDATE_INTERVAL = 60 * 60 * 1000

export default function Leaderboard() {
    const [sortedPlayers, setSortedPlayers] = useState<PlayerStats[]>([])
    const lastUpdateRef = useRef(0)

    const { data: players, refetch: refetchPlayers } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAllPlayers',
        query: {
            enabled: true,
            gcTime: UPDATE_INTERVAL
        }
    })

    const { data: statsData, refetch: refetchStats } = useReadContracts({
        contracts: players?.map((player) => ({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'getUserStats',
            args: [player],
        })) ?? [],
        query: {
            enabled: true,
            gcTime: UPDATE_INTERVAL
        }
    })

    const updateLeaderboard = useCallback(async () => {
        const now = Date.now()
        if (now - lastUpdateRef.current < UPDATE_INTERVAL) return

        try {
            await refetchPlayers()
            if (players?.length) {
                await refetchStats()
            }
            lastUpdateRef.current = now
        } catch (error) {
            console.error('Error updating leaderboard:', error)
        }
    }, [refetchPlayers, refetchStats, players])

    useEffect(() => {
        updateLeaderboard()
        const interval = setInterval(updateLeaderboard, UPDATE_INTERVAL)
        return () => clearInterval(interval)
    }, [updateLeaderboard])

    useEffect(() => {
        if (!players || !statsData) return

        const stats: PlayerStats[] = players.map((address, index) => ({
            address,
            clickCount: (statsData?.[index]?.result as unknown as bigint[])?.[0] ?? BigInt(0),
        }))

        setSortedPlayers(
            stats
                .sort((a, b) => (b.clickCount > a.clickCount ? 1 : -1))
                .slice(0, 50)
        )
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
                    Last updated: {new Date(lastUpdateRef.current).toLocaleTimeString()}
                </div>
            </div>
        </div>
    )
} 