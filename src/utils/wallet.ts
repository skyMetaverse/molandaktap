import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const WALLET_KEY = 'game_wallet'

export interface StoredWallet {
    address: `0x${string}`
    privateKey: `0x${string}`
}

export function getStoredWallet(): StoredWallet | null {
    const stored = localStorage.getItem(WALLET_KEY)
    if (!stored) return null
    return JSON.parse(stored)
}

export function generateAndStoreWallet(): StoredWallet {
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)

    const wallet: StoredWallet = {
        address: account.address,
        privateKey: privateKey
    }

    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet))
    return wallet
} 