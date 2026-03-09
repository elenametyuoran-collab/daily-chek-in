import {
  uintCV,
  principalCV,
  callReadOnlyFunction,
  cvToValue,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

export const MOOD_VOTE_ADDRESS =
  process.env.NEXT_PUBLIC_MOOD_VOTE_ADDRESS ?? 'SP2ZR834WEZJ04EXNT2HMDG3S1WC7AGTB5ZNE5B2C';
export const MOOD_VOTE_NAME =
  process.env.NEXT_PUBLIC_MOOD_VOTE_NAME ?? 'mood-vote-v1';

const network = new StacksMainnet();

export interface Poll {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  emoji: string;
}

export interface PollResults {
  option1: number;
  option2: number;
}

export const POLLS: Poll[] = [
  { id: 1,  question: "What's your mood today?",        optionA: 'On fire 🔥',      optionB: 'Tired 😴',        emoji: '😊' },
  { id: 2,  question: 'Crypto market sentiment?',       optionA: 'Bullish 📈',      optionB: 'Bearish 📉',      emoji: '💹' },
  { id: 3,  question: "Today's productivity?",          optionA: 'Top day ⚡',      optionB: 'Slow day 🐢',     emoji: '⚡' },
  { id: 4,  question: 'Your drink of choice?',          optionA: 'Coffee ☕',       optionB: 'Tea 🍵',          emoji: '☕' },
  { id: 5,  question: 'Focus level right now?',         optionA: 'In the zone 🎯',  optionB: 'Distracted 🌀',   emoji: '🎯' },
  { id: 6,  question: 'Plans for tonight?',             optionA: 'Staying in 🏠',   optionB: 'Going out 🎉',    emoji: '🌙' },
  { id: 7,  question: 'Web3 activity today?',           optionA: 'Building 🛠️',    optionB: 'Watching 👀',     emoji: '🔗' },
  { id: 8,  question: 'How was your sleep?',            optionA: 'Slept well 😌',   optionB: 'Poor sleep 😵',   emoji: '💤' },
  { id: 9,  question: 'Are you a morning person?',      optionA: 'Early bird 🐦',   optionB: 'Night owl 🦉',    emoji: '🌅' },
  { id: 10, question: "Today's overall vibe?",          optionA: 'Positive ✨',     optionB: 'Chaotic 🌪️',     emoji: '🌈' },
];

export async function getPollResults(pollId: number): Promise<PollResults> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: MOOD_VOTE_ADDRESS,
      contractName: MOOD_VOTE_NAME,
      functionName: 'get-poll-results',
      functionArgs: [uintCV(pollId)],
      network,
      senderAddress: MOOD_VOTE_ADDRESS,
    });
    const val = cvToValue(result, true);
    return {
      option1: Number(val?.value?.option1?.value ?? 0),
      option2: Number(val?.value?.option2?.value ?? 0),
    };
  } catch {
    return { option1: 0, option2: 0 };
  }
}

export async function canUserVote(user: string, pollId: number): Promise<boolean> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: MOOD_VOTE_ADDRESS,
      contractName: MOOD_VOTE_NAME,
      functionName: 'can-vote',
      functionArgs: [principalCV(user), uintCV(pollId)],
      network,
      senderAddress: user,
    });
    const val = cvToValue(result, true);
    return val?.value === true || val?.value === 'true';
  } catch {
    return false;
  }
}

export function prepareVote(pollId: number, option: 1 | 2) {
  return {
    contractAddress: MOOD_VOTE_ADDRESS,
    contractName: MOOD_VOTE_NAME,
    functionName: 'vote',
    functionArgs: [uintCV(pollId), uintCV(option)],
    postConditions: [],
  };
}
