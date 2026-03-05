# Daily Check-in dApp

A Web3 daily check-in application built on the Stacks blockchain.

## Features

- **Daily check-ins** — check in once per day to build your streak
- **Streak tracking** — on-chain streak with grace period
- **NFT badges** — claim badges at 7 and 30-day streaks
- **Leaderboard** — compete with other users
- **STX rewards** — top 5 most active users earn 5/4/3/2/1 STX

## Project Structure

```
daily-checkin/
├── contracts/          # Clarity smart contract
│   └── daily-checkin.clar
├── frontend/           # Next.js 14 frontend
└── sdk/                # TypeScript SDK (npm: daily-checkin-sdk)
```

## Smart Contract

Deploy `contracts/daily-checkin.clar` to Stacks mainnet using [Hiro Platform](https://platform.hiro.so).

After deploying, set environment variables in `frontend/.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=SP...
NEXT_PUBLIC_CONTRACT_NAME=daily-checkin
```

## SDK

```bash
npm install daily-checkin-sdk
```

See [sdk/README.md](sdk/README.md) for full documentation.

## Frontend

```bash
cd frontend
npm install
npm run dev
```
