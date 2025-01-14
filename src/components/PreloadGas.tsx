'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { getStoredWallet } from '@/utils/wallet'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import clsx from 'clsx'

const GAS_OPTIONS = [
    { clicks: 100_000, eth: '0.1' },
    { clicks: 200_000, eth: '0.2' },
    { clicks: 500_000, eth: '0.5' },
]

export default function PreloadGas({ onClose }: { onClose: () => void }) {
    const { address } = useAccount()
    const [selectedOption, setSelectedOption] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<'register' | 'preload'>('register')

    const { writeContractAsync } = useWriteContract()
    const { sendTransaction } = useSendTransaction()

    const handleRegisterAndPreload = async () => {
        if (!address || isLoading) return

        const gameWallet = getStoredWallet()
        if (!gameWallet) {
            console.error('No game wallet found')
            return
        }

        try {
            setIsLoading(true)

            if (step === 'register') {
                // First register the game wallet
                await writeContractAsync({
                    address: CONTRACT_ADDRESS,
                    abi: CONTRACT_ABI,
                    functionName: 'registerGameWallet',
                    args: [gameWallet.address],
                })
                setStep('preload')
                setIsLoading(false)
                return
            }

            // Then preload gas
            await sendTransaction({
                to: gameWallet.address,
                value: parseEther(GAS_OPTIONS[selectedOption].eth),
            })
            onClose()
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-[#200052]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-[#3d2487]/20 backdrop-blur-xl rounded-xl p-8 max-w-lg w-full mx-4 border border-[#836EF9]/10 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#ccc4fc]">
                        {step === 'register' ? 'Register Game Wallet' : 'Preload Gas'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#5FEDDF] hover:text-[#836EF9] transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        ✕
                    </button>
                </div>

                {step === 'register' ? (
                    <>
                        <p className="text-[#ccc4fc]/80 mb-8">
                            First, we need to register your game wallet. This is a one-time setup.
                        </p>
                        <div className="bg-[#836EF9]/10 p-4 rounded-lg mb-8 border border-[#836EF9]/20">
                            <p className="text-sm text-[#ccc4fc]/80">
                                A temporary game wallet will be registered to your account. This helps optimize gas usage for frequent clicks.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-[#ccc4fc]/80 mb-8">
                            Your molandak needs MON to run on-chain. Please preload some MON for gas fees.
                        </p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {GAS_OPTIONS.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedOption(index)}
                                    className={clsx(
                                        'p-4 rounded-lg border-2 text-center transition-all duration-200',
                                        selectedOption === index
                                            ? 'border-[#5FEDDF] bg-[#836EF9]/20'
                                            : 'border-[#836EF9]/20 hover:border-[#836EF9]/40'
                                    )}
                                >
                                    <div className="text-lg font-bold text-[#ccc4fc]">
                                        {option.clicks.toLocaleString()} Clicks
                                    </div>
                                    <div className="text-[#5FEDDF]">{option.eth} MON</div>
                                </button>
                            ))}
                        </div>

                        <div className="bg-[#836EF9]/10 p-4 rounded-lg mb-8 border border-[#836EF9]/20">
                            <p className="text-sm text-[#ccc4fc]/80">
                                MON will be stored in a locally created temporary wallet. Do not clear browser cache to avoid losing MON.
                            </p>
                        </div>
                    </>
                )}

                <button
                    onClick={handleRegisterAndPreload}
                    disabled={isLoading}
                    className={clsx(
                        'w-full py-3 rounded-lg font-bold transition-all duration-200',
                        'bg-gradient-to-r from-[#836EF9] via-[#9c8cfa] to-[#5FEDDF]',
                        'text-white hover:opacity-90 disabled:opacity-50',
                        'shadow-lg shadow-[#836EF9]/20'
                    )}
                >
                    {isLoading ? 'Processing...' : step === 'register' ? 'Register Wallet' : 'Continue'}
                </button>
            </div>
        </div>
    )
} 