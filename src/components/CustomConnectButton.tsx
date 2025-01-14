'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'

export default function CustomConnectButton() {
    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
            }) => {
                const ready = mounted
                if (!ready) return null

                return (
                    <div className="flex items-center gap-3">
                        {(() => {
                            if (!account) {
                                return (
                                    <button
                                        onClick={openConnectModal}
                                        className="px-4 py-2 bg-gradient-to-r from-[#836EF9] via-[#9c8cfa] to-[#5FEDDF] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Connect Wallet
                                    </button>
                                )
                            }

                            return (
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={openChainModal}
                                        className="px-3 py-1.5 bg-[#3d2487]/30 backdrop-blur-sm border border-[#836EF9]/10 rounded-full"
                                    >
                                        <div className="flex items-center gap-2">
                                            {chain?.hasIcon && (
                                                <div className="w-5 h-5 rounded-full overflow-hidden">
                                                    {chain.iconUrl && (
                                                        <Image
                                                            alt={chain.name ?? 'Chain icon'}
                                                            src={chain.iconUrl}
                                                            width={20}
                                                            height={20}
                                                            className="w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            <span className="text-[#ccc4fc]">
                                                {chain?.name ?? 'Unknown'}
                                            </span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={openAccountModal}
                                        className="px-3 py-1.5 bg-[#3d2487]/30 backdrop-blur-sm border border-[#836EF9]/10 rounded-full"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#836EF9] via-[#9c8cfa] to-[#5FEDDF]" />
                                            <span className="text-[#ccc4fc]">
                                                {account.displayName}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            )
                        })()}
                    </div>
                )
            }}
        </ConnectButton.Custom>
    )
} 