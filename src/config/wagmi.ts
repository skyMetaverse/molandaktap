import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import { defineChain } from 'viem'

export const monad = defineChain({
    id: 20143,
    name: 'Monad Devnet',
    network: 'monad-devnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Devnet MON',
        symbol: 'DMON',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'],
        },
        public: {
            http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'],
        },
    },
})

export const config = getDefaultConfig({
    appName: 'MolandakTap Game',
    projectId: '81a8ca0f5678b6da3cc156b0638db703',
    chains: [monad],
    transports: {
        [monad.id]: http(monad.rpcUrls.default.http[0])
    }
}) 