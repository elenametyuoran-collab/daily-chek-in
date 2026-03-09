import { StacksMainnet } from '@stacks/network';

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? 'SP2ZR834WEZJ04EXNT2HMDG3S1WC7AGTB5ZNE5B2C';
export const CONTRACT_NAME =
  process.env.NEXT_PUBLIC_CONTRACT_NAME ?? 'daily-checkin-v2';

export const STACKS_NETWORK = new StacksMainnet();

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

export async function fetchCurrentBlock(): Promise<number> {
  try {
    const res = await fetch('https://api.mainnet.hiro.so/v2/info');
    const data = await res.json();
    return data.stacks_tip_height ?? 0;
  } catch {
    return 0;
  }
}

export function streakMilestone(streak: number): string {
  if (streak >= 30) return 'Legend 👑';
  if (streak >= 14) return 'Unstoppable ⚡';
  if (streak >= 7)  return 'On Fire 🔥';
  if (streak >= 3)  return 'Getting Started 💧';
  return 'New 🌱';
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function getRankLabel(rank: number): string {
  if (rank === 1) return '1st 🥇';
  if (rank === 2) return '2nd 🥈';
  if (rank === 3) return '3rd 🥉';
  return `${rank}th`;
}

export function formatSTX(microStx: number): string {
  return (microStx / 1_000_000).toFixed(2) + ' STX';
}

export function isNftEligible(streak: number, claimed: boolean, threshold: number): boolean {
  return streak >= threshold && !claimed;
}

export function blockToApproxDate(block: number): string {
  if (block === 0) return 'Never';
  const approxMs = Date.now() - (block * 10 * 60 * 1000);
  return new Date(approxMs).toLocaleDateString();
}

export function isValidStacksAddress(addr: string): boolean {
  return /^S[MP][A-Z0-9]{38,39}$/.test(addr);
}

export function truncateText(text: string, maxLen: number): string {
  return text.length <= maxLen ? text : text.slice(0, maxLen - 1) + '…';
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}
