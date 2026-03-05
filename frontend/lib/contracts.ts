import { DailyCheckinClient } from 'daily-checkin-sdk';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './stacks';

// Singleton SDK client
export const checkinClient = new DailyCheckinClient(
  CONTRACT_ADDRESS,
  CONTRACT_NAME,
  'mainnet'
);

export { DailyCheckinClient };
export type { UserStats, LeaderboardEntry, NftCounts } from 'daily-checkin-sdk';
