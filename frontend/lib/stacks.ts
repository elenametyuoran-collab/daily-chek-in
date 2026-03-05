import { StacksMainnet } from '@stacks/network';

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'SP_CONTRACT_ADDRESS_HERE';
export const CONTRACT_NAME =
  process.env.NEXT_PUBLIC_CONTRACT_NAME ?? 'daily-checkin';

export const STACKS_NETWORK = new StacksMainnet();

// Human-readable blocks → days conversion (~144 blocks/day on Stacks mainnet)
export const BLOCKS_PER_DAY = 144;

export function blocksToRelativeTime(lastBlock: number, currentBlock: number): string {
  if (lastBlock === 0) return 'Never';
  const diff = currentBlock - lastBlock;
  const days = Math.floor(diff / BLOCKS_PER_DAY);
  const hours = Math.floor((diff % BLOCKS_PER_DAY) / 6);
  if (days === 0) return hours <= 1 ? 'Just now' : `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export function canCheckIn(lastBlock: number, currentBlock: number): boolean {
  if (lastBlock === 0) return true;
  return currentBlock - lastBlock >= BLOCKS_PER_DAY;
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
