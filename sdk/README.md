# daily-checkin-sdk

TypeScript SDK for the **Daily Check-in dApp** on the Stacks blockchain.

## Installation

```bash
npm install daily-checkin-sdk
```

## Quick Start

```typescript
import { DailyCheckinClient } from 'daily-checkin-sdk';

const client = new DailyCheckinClient(
  'SP1ABC...XYZ',   // contract deployer address
  'daily-checkin',  // contract name
  'mainnet'         // 'mainnet' | 'testnet'
);
```

## Read Methods

### `getUserStats(userAddress)`
Returns stats for a specific user.
```typescript
const stats = await client.getUserStats('SP1XYZ...');
// {
//   lastCheckinBlock: 123456,
//   streak: 7,
//   totalCheckins: 42,
//   nft7Claimed: true,
//   nft30Claimed: false
// }
```

### `getLeaderboard(maxEntries?)`
Fetches all users, sorted by `totalCheckins` descending.
```typescript
const top10 = await client.getLeaderboard(10);
// [{ user: 'SP1...', streak: 30, totalCheckins: 120 }, ...]
```

### `getLeaderboardEntry(index)`
Get one leaderboard slot by index (0-based).
```typescript
const entry = await client.getLeaderboardEntry(0);
// { user: 'SP1...', streak: 12, totalCheckins: 55 }
```

### `getTotalUsers()`
Total number of unique addresses that have ever checked in.
```typescript
const total = await client.getTotalUsers(); // 1042
```

### `getNftCounts()`
Number of 7-day and 30-day NFTs minted so far.
```typescript
const counts = await client.getNftCounts();
// { streak7Total: 87, streak30Total: 14 }
```

## Write TX Builders

These methods return the arguments needed for `openContractCall` from `@stacks/connect`.

### `prepareCheckIn()`
```typescript
import { openContractCall } from '@stacks/connect';

const txOptions = client.prepareCheckIn();
await openContractCall({
  ...txOptions,
  onFinish: (data) => console.log('Checked in!', data.txId),
});
```

### `prepareClaimStreak7Nft()`
Claim the 7-day streak badge NFT.

### `prepareClaimStreak30Nft()`
Claim the 30-day streak badge NFT.

## License

MIT
