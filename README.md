<img src="logo.svg" alt="Sprinkle Logo" width="80" />

# Sprinkle: Creator Tipping Platform on Aptos

## 🌱 Project Overview

Sprinkle is a decentralized creator tipping platform built on the Aptos blockchain, enabling instant, secure, and transparent support for creators.

## 🚀 Features

- Create unique creator links
- Receive tips directly to your wallet
- Transparent and secure blockchain-based transactions
- Easy wallet connection

## 🛠 Tech Stack

### Frontend
- Next.js 14
- React
- Tailwind CSS
- Aptos Wallet Adapter
- TypeScript

### Smart Contract
- Move Language
- Aptos Blockchain
- On-chain creator link registry
- Secure tip management

## 📦 Prerequisites

- Node.js (v18+)
- Aptos CLI
- Petra Wallet or other Aptos-compatible wallet
- Aptos development environment

## 🔧 Smart Contract Setup

### Contract Details
- Language: Move
- Blockchain: Aptos Devnet
- Module: `tip_jar`

### Key Contract Features
- Creator link registration
- Tip jar initialization
- Unique link validation
- Secure tip tracking

## 💻 Local Development

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/sprinkle

# Navigate to frontend
cd sprinkle/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Smart Contract Deployment
```bash
# Navigate to smart contract directory
cd smart-contract

# Build the contract
aptos move compile

# Deploy to Devnet
aptos move publish --named-addresses stream_tips_addr=<YOUR_ADDRESS>
```

## 🌐 Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_MODULE_ADDRESS`: Smart contract module address
- `NEXT_PUBLIC_APTOS_NODE_URL`: Aptos node URL
- `NEXT_PUBLIC_APTOS_EXPLORER`: Aptos blockchain explorer

## 🔒 Security

- On-chain link uniqueness validation
- Prevent self-tipping
- Link length restrictions
- Wallet-based authentication

## 🔮 Future Roadmap
- Multi-chain support
- Advanced creator analytics
- Tip streaming
- Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 💡 Powered By
- Aptos
- Next.js
- Move Language
