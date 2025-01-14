'use client'

import { useAccount } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/config/contract'
import { useState, useRef, useEffect, useCallback } from 'react'
import { createWalletClient, http, createPublicClient, WalletClient } from 'viem'
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
    const lastClickTimeRef = useRef(0)
    const currentNonceRef = useRef<number | null>(null)
    const publicClientRef = useRef(createPublicClient({
        chain: monad,
        transport: http(monad.rpcUrls.default.http[0])
    }))
    const walletClientRef = useRef<{
        client: WalletClient;
        address: string;
    } | null>(null)

    useEffect(() => {
        setIsDisabled(!address)
    }, [address])

    const getWalletClient = useCallback((gameWallet: StoredWallet) => {
        if (!walletClientRef.current || walletClientRef.current.address !== gameWallet.address) {
            walletClientRef.current = {
                client: createWalletClient({
                    account: privateKeyToAccount(gameWallet.privateKey),
                    chain: monad,
                    transport: http(monad.rpcUrls.default.http[0])
                }),
                address: gameWallet.address
            }
        }
        return walletClientRef.current.client
    }, [])

    const getNonce = useCallback(async (gameWallet: StoredWallet) => {
        const now = Date.now()
        const timeSinceLastClick = now - lastClickTimeRef.current

        if (currentNonceRef.current === null || timeSinceLastClick >= 1000) {
            currentNonceRef.current = await publicClientRef.current.getTransactionCount({
                address: gameWallet.address
            })
        } else {
            currentNonceRef.current++
        }

        lastClickTimeRef.current = now
        return currentNonceRef.current
    }, [])

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

            if (balance < parseEther('0.002')) {
                setShowPreload(true)
                return
            }

            const walletClient = getWalletClient(gameWallet)
            const nonce = await getNonce(gameWallet)

            await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'click',
                nonce,
                account: privateKeyToAccount(gameWallet.privateKey),
                chain: monad,
            })

        } catch (error) {
            console.error('Error clicking:', error)
            if (error instanceof Error &&
                (error.message.includes('nonce too low') ||
                    error.message.includes('nonce too high'))) {
                currentNonceRef.current = null
            }
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
                <PreloadGas
                    onClose={() => setShowPreload(false)}
                />
            )}
            <ClickEffect />
        </>
    )
}