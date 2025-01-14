export const CONTRACT_ADDRESS = '0x9B4a2F6C29a65c952668037772B0A61B5453450b' as `0x${string}`

export const CONTRACT_ABI = [
    { "type": "function", "name": "click", "inputs": [], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "gameWalletToUser", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    { "type": "function", "name": "getAllPlayers", "inputs": [], "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }], "stateMutability": "view" },
    { "type": "function", "name": "getGameWallets", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "address[]", "internalType": "address[]" }], "stateMutability": "view" },
    { "type": "function", "name": "getTotalPlayers", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "getUserStats", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "clickCount", "type": "uint256", "internalType": "uint256" }, { "name": "gameWalletCount", "type": "uint256", "internalType": "uint256" }, { "name": "lastClickTime_", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "isPlayer", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" },
    { "type": "function", "name": "lastClickTime", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "players", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" },
    { "type": "function", "name": "registerGameWallet", "inputs": [{ "name": "gameWallet", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" },
    { "type": "function", "name": "userClicks", "inputs": [{ "name": "", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" },
    { "type": "function", "name": "userToGameWallets", "inputs": [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }
] as const