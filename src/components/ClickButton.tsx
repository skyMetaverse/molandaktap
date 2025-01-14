'use client'

import { useAccount } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import { useState, useEffect, useRef } from 'react'
import { createWalletClient, http, createPublicClient, WalletClient, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { monad } from '@/config/wagmi'
import { getStoredWallet, generateAndStoreWallet, StoredWallet } from '@/utils/wallet'
import clsx from 'clsx'
import { parseEther } from 'viem'
import PreloadGas from './PreloadGas'
import ClickEffect from './ClickEffect'
import Image from 'next/image'


export default function ClickButton() {
    const { address } = useAccount()
    const [isAnimating, setIsAnimating] = useState(false)
    const [showPreload, setShowPreload] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    const txQueueRef = useRef<Array<{ nonce: number }>>([])
    const currentNonceRef = useRef<number | null>(null)
    const isProcessingRef = useRef(false)
    const publicClientRef = useRef(createPublicClient({
        chain: monad,
        transport: http(monad.rpcUrls.default.http[0])
    }))

    useEffect(() => {
        setIsDisabled(!address)
    }, [address])

    const processQueue = async (
        walletClient: WalletClient,
        gameWallet: StoredWallet
    ) => {
        if (isProcessingRef.current || txQueueRef.current.length === 0) return

        isProcessingRef.current = true

        try {
            if (currentNonceRef.current === null) {
                currentNonceRef.current = await publicClientRef.current.getTransactionCount({
                    address: gameWallet.address
                })
            }

            const data = encodeFunctionData({
                abi: CONTRACT_ABI,
                functionName: 'click'
            })

            const signedTx = await walletClient.signTransaction({
                account: privateKeyToAccount(gameWallet.privateKey),
                to: CONTRACT_ADDRESS,
                data,
                nonce: currentNonceRef.current || 0,
                chain: monad,
                type: 'legacy',
                gas: BigInt(50000),
                gasPrice: await publicClientRef.current.getGasPrice()
            })

            const hash = await walletClient.sendRawTransaction({ serializedTransaction: signedTx })

            await publicClientRef.current.waitForTransactionReceipt({ hash })

            currentNonceRef.current = (currentNonceRef.current || 0) + 1
            txQueueRef.current.shift()

        } catch (error: Error | unknown) {
            console.error('Transaction failed:', error)
            if (error instanceof Error && error.message?.includes('nonce too low')) {
                currentNonceRef.current = (currentNonceRef.current || 0) + 1
            }
            txQueueRef.current.shift()
        } finally {
            isProcessingRef.current = false
            if (txQueueRef.current.length > 0) {
                processQueue(walletClient, gameWallet)
            }
        }
    }

    const handleClick = async () => {
        if (!address) return

        try {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 100)

            let gameWallet = getStoredWallet()
            if (!gameWallet) {
                gameWallet = generateAndStoreWallet()
                setShowPreload(true)
                return
            }

            const balance = await publicClientRef.current.getBalance({
                address: gameWallet.address
            })

            if (balance < parseEther('0.0001')) {
                setShowPreload(true)
                return
            }

            const walletClient = createWalletClient({
                account: privateKeyToAccount(gameWallet.privateKey),
                chain: monad,
                transport: http(monad.rpcUrls.default.http[0])
            })

            txQueueRef.current.push({
                nonce: currentNonceRef.current || 0
            })

            if (!isProcessingRef.current) {
                processQueue(walletClient, gameWallet)
            }

        } catch (error) {
            console.error('Error clicking:', error)
        }
    }

    return (
        <>
            <button
                id="click-button"
                onClick={handleClick}
                disabled={isDisabled}
                className={clsx(
                    'relative w-[512px] h-[512px]',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'focus:outline-none',
                    'active:opacity-100'
                )}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/images/molandak.png"
                        alt="Click Button"
                        width={384}
                        height={384}
                        className={clsx(
                            'select-none transition-transform duration-75',
                            isAnimating && 'scale-[0.98]'
                        )}
                        draggable={false}
                        priority
                    />
                </div>
            </button>
            {showPreload && (
                <PreloadGas onClose={() => setShowPreload(false)} />
            )}
            <ClickEffect />
        </>
    )
}