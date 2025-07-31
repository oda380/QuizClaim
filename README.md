# Crypto Quests DApp

Welcome to **Crypto Quests**, a decentralized application (DApp) on the Base network where you can test your knowledge and claim an exclusive NFT reward. This DApp guides users through a quiz, verifies their answers on-chain, and rewards successful participants with a unique digital collectible.

---

## 🌿 Test of Knowledge: Claim Your NFT Reward!

---

## 🚀 Features

- **Wallet Connection:** Seamlessly connect your Ethereum-compatible wallet (via RainbowKit).  
- **On-Chain Quiz:** Get an assigned question directly from the smart contract (or identify if you’ve already claimed).  
- **NFT Claiming:** Submit your answer on-chain to claim your unique reward NFT.  
- **Transaction Status Tracking:** Real-time feedback on your transaction status (submitting, pending, confirming, success, error).  
- **Claim Progress Bar:** See how many NFTs have been claimed out of the total available supply.  
- **Claimed NFT Display:** View the metadata and image of your claimed NFT directly within the DApp.  
- **Responsive Design:** Optimized for various screen sizes using Tailwind CSS.  
- **Modular Architecture:** Clean, maintainable, and scalable codebase using React Hooks and component-based design.

---

## 🛠️ Technologies Used

- **React** – Frontend library for building user interfaces  
- **Vite** – Fast development build tool for React projects  
- **Tailwind CSS** – Utility-first CSS framework for rapid styling  
- **Wagmi** – React Hooks for Ethereum, making it easy to interact with smart contracts  
- **RainbowKit** – Wallet connection library, providing a beautiful and easy-to-use connect button and modal  
- **Ethers.js / Viem** – Under the hood of Wagmi, for interacting with the Ethereum blockchain  
- **IPFS** – Decentralized storage of NFT metadata

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** v18.x or higher  
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crypto-quests.git
cd crypto-quests
```

### 2. Install Dependencies

```bash
npm install
# OR
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
VITE_PUBLIC_CONTRACT_ADDRESS="YOUR_QUIZ_CLAIM_CONTRACT_ADDRESS"
```

Replace `YOUR_QUIZ_CLAIM_CONTRACT_ADDRESS` with the deployed address of your `QuizClaim` smart contract on the Base network.

### 4. Smart Contract Setup

Ensure your contract ABI (`QuizClaim.json`) is located in `src/abi/`.  
Key contract functions:

- `hasClaimed(address)` (view)  
- `getAssignedQuestion(address)` (view)  
- `totalClaims()` (view)  
- `claim(string _answer)` (write)  

If you haven’t deployed the contract yet, deploy it to Base or Base Sepolia, then update the `.env` address accordingly.

### 5. Run the DApp

```bash
npm run dev
# OR
yarn dev
```

Open your browser at [http://localhost:5173](http://localhost:5173) (or the port displayed in your terminal).

---

## 📂 Project Structure

```
src/
├── App.jsx                     # Main application orchestrator
├── main.jsx                    # React entry point
├── abi/
│   └── QuizClaim.json          # Smart contract ABI
├── components/                 # Reusable UI components
│   ├── ConnectWalletSection.jsx
│   ├── ClaimSuccessDisplay.jsx
│   ├── ProgressBar.jsx
│   ├── QuizGame.jsx
│   └── Footer.jsx
├── hooks/                      # Custom React Hooks for blockchain interactions
│   ├── useQuizContractReads.js
│   └── useQuizContractWrites.js
├── constants/
│   └── index.js                # Global constants (e.g., total tokens, IPFS URI)
├── questions.json              # Quiz questions data
└── index.css                   # Global styles, Tailwind imports
```

---

## 🧠 How It Works

1. **Connect Wallet:** User connects via RainbowKit.  
2. **Check Claim Status:** DApp queries `hasClaimed` to see if the address has already claimed.  
3. **Get Assigned Question:** If not claimed, fetches question via `getAssignedQuestion`.  
4. **Answer & Claim:** User submits answer; contract verifies on-chain.  
5. **NFT Minting:** Correct answers trigger minting of the reward NFT.  
6. **Display Reward:** Fetches and displays NFT metadata and image from IPFS.  
7. **Progress Tracking:** Monitors `totalClaims()` for real-time distribution progress.

---

## 🤝 Contributing

1. Fork the repository  
2. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```  
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```  
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```  
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

Built with **Base**  
Powered by **Wagmi** & **RainbowKit**  
Designed with **Tailwind CSS**  
Special thanks to the open-source community!

---

**Developed by:** ktlimdev.base.eth  
**Follow on:**  
- [Telegram](https://t.me/your-telegram-handle)  
- [X (Twitter)](https://twitter.com/your-twitter-handle)
