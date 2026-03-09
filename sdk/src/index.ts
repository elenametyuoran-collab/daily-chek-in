// sdk-rev: 1
import {
  callReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  ClarityValue,
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

export type NetworkType = 'mainnet' | 'testnet';

export interface UserStats {
  lastCheckinBlock: number;
  streak: number;
  totalCheckins: number;
  nft7Claimed: boolean;
  nft30Claimed: boolean;
}

export interface LeaderboardEntry {
  user: string;
  streak: number;
  totalCheckins: number;
}

export interface NftCounts {
  streak7Total: number;
  streak30Total: number;
}

export interface CheckInTxOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
}

/**
 * DailyCheckinClient — SDK for interacting with the Daily Check-in dApp
 * on the Stacks blockchain.
 *
 * @example
 * const client = new DailyCheckinClient('SP1ABC...', 'daily-checkin');
 * const stats = await client.getUserStats('SP1XYZ...');
 * console.log(stats.streak); // 7
 */
/** Current SDK version */
export const SDK_VERSION = '1.0.3';

export class DailyCheckinClient {
  private contractAddress: string;
  private contractName: string;
  private network: StacksMainnet | StacksTestnet;

  constructor(
    contractAddress: string,
    contractName: string,
    networkType: NetworkType = 'mainnet'
  ) {
    this.contractAddress = contractAddress;
    this.contractName = contractName;
    this.network =
      networkType === 'testnet' ? new StacksTestnet() : new StacksMainnet();
  }

  // ──────────────────────────────────────────
  // READ-ONLY METHODS
  // ──────────────────────────────────────────

  /**
   * Get stats for a specific user.
   */
  async getUserStats(userAddress: string): Promise<UserStats> {
    const result = await callReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'get-user-stats',
      functionArgs: [standardPrincipalCV(userAddress)],
      network: this.network,
      senderAddress: userAddress,
    });

    const json = cvToJSON(result);
    const value = json.value?.value ?? json.value ?? {};

    return {
      lastCheckinBlock: parseInt(value['last-checkin-block']?.value ?? '0'),
      streak: parseInt(value['streak']?.value ?? '0'),
      totalCheckins: parseInt(value['total-checkins']?.value ?? '0'),
      nft7Claimed: value['nft-7-claimed']?.value === true,
      nft30Claimed: value['nft-30-claimed']?.value === true,
    };
  }

  /**
   * Get a single leaderboard entry by index.
   */
  async getLeaderboardEntry(
    index: number
  ): Promise<LeaderboardEntry | null> {
    const result = await callReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'get-leaderboard-entry',
      functionArgs: [uintCV(index)],
      network: this.network,
      senderAddress: this.contractAddress,
    });

    // Response shape: (ok (some (tuple ...))) or (ok none)
    // cvToJSON: { value: { type:"some"|"none", value: { type:"tuple", value: {fields} } } }
    const json = cvToJSON(result);
    const optionalCV = json.value;                     // SomeCV or NoneCV
    if (!optionalCV || optionalCV.type === 'none') return null;

    const tupleFields = optionalCV.value?.value;       // the actual tuple fields
    if (!tupleFields) return null;

    return {
      user: tupleFields['user']?.value ?? '',
      streak: parseInt(tupleFields['streak']?.value ?? '0'),
      totalCheckins: parseInt(tupleFields['total-checkins']?.value ?? '0'),
    };
  }

  /**
   * Get the total number of unique users.
   */
  /**
   * Get total number of unique users who have ever checked in.
   * @returns {Promise<number>} Total user count
   */
  async getTotalUsers(): Promise<number> {
    const result = await callReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'get-total-users',
      functionArgs: [],
      network: this.network,
      senderAddress: this.contractAddress,
    });

    const json = cvToJSON(result);
    return parseInt(json.value?.value ?? json.value ?? '0');
  }

  /**
   * Get NFT minting statistics.
   */
  /**
   * Get total counts of minted NFT badges.
   * @returns {Promise<NftCounts>} { streak7Total, streak30Total }
   */
  async getNftCounts(): Promise<NftCounts> {
    const result = await callReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'get-nft-counts',
      functionArgs: [],
      network: this.network,
      senderAddress: this.contractAddress,
    });

    const json = cvToJSON(result);
    const value = json.value?.value ?? json.value ?? {};

    return {
      streak7Total: parseInt(value['streak-7-total']?.value ?? '0'),
      streak30Total: parseInt(value['streak-30-total']?.value ?? '0'),
    };
  }

  /**
   * Fetch and sort full leaderboard (sorted by total-checkins descending).
   */
  /** Fetch top N users by streak from the leaderboard map. */
  async getLeaderboard(maxEntries = 50): Promise<LeaderboardEntry[]> {
    const total = await this.getTotalUsers();
    const count = Math.min(total, maxEntries);

    const entries = await Promise.all(
      Array.from({ length: count }, (_, i) => this.getLeaderboardEntry(i))
    );

    return (entries.filter(Boolean) as LeaderboardEntry[]).sort(
      (a, b) => b.totalCheckins - a.totalCheckins
    );
  }

  // ──────────────────────────────────────────
  // WRITE TX ARGUMENT BUILDERS
  // (Pass result to @stacks/connect openContractCall)
  // ──────────────────────────────────────────

  /** Prepare args for check-in transaction. */
  /** Prepare contract call options for the check-in transaction. Pass the result to openContractCall. */
  prepareCheckIn(): CheckInTxOptions {
    return {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'check-in',
      functionArgs: [],
    };
  }

  /** Prepare args for claiming the 7-day streak NFT. */
  prepareClaimStreak7Nft(): CheckInTxOptions {
    return {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'claim-streak-7-nft',
      functionArgs: [],
    };
  }

  /** Prepare args for claiming the 30-day streak NFT. */
  prepareClaimStreak30Nft(): CheckInTxOptions {
    return {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName: 'claim-streak-30-nft',
      functionArgs: [],
    };
  }
}

export default DailyCheckinClient;

// re-export for convenience
export type { NetworkType };
