![npm](https://img.shields.io/npm/v/daily-checkin-sdk?color=blueviolet) ![license](https://img.shields.io/badge/license-MIT-blue)

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


## FAQ

**Q: How often can I check in?**
Once per day (~144 Stacks blocks).

**Q: What happens if I miss a day?**
You have a 2-day grace period. Missing 2+ days resets your streak to 1.

**Q: Are NFTs transferable?**
Yes — they are standard Stacks NFTs (SIP-009).

**Q: How are STX rewards distributed?**
The contract owner periodically calls `distribute-rewards` with the top 5 addresses.
<!-- tech-note: Frontend deployed on Vercel with automatic CI/CD from GitHub. -->