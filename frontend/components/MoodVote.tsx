'use client';

import { useState, useEffect, useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksMainnet } from '@stacks/network';
import { useWallet } from '@/context/WalletContext';
import { POLLS, getPollResults, canUserVote, prepareVote } from '@/lib/mood-vote';
import type { PollResults } from '@/lib/mood-vote';

const network = new StacksMainnet();

interface PollState {
  results: PollResults;
  canVote: boolean;
  voted: 1 | 2 | null; // voted this session
  pending: boolean;
}

export default function MoodVote() {
  const { isConnected, userAddress, connect } = useWallet();
  const [pollStates, setPollStates] = useState<Record<number, PollState>>({});
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const entries = await Promise.all(
      POLLS.map(async (poll) => {
        const results = await getPollResults(poll.id);
        const canVote = userAddress ? await canUserVote(userAddress, poll.id) : false;
        return [poll.id, { results, canVote, voted: null, pending: false }] as const;
      })
    );
    setPollStates(Object.fromEntries(entries));
    setLoading(false);
  }, [userAddress]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function handleVote(pollId: number, option: 1 | 2) {
    if (!isConnected) return connect();
    setPollStates((prev) => ({
      ...prev,
      [pollId]: { ...prev[pollId], pending: true },
    }));
    try {
      await openContractCall({
        ...prepareVote(pollId, option),
        network,
        onFinish: () => {
          setPollStates((prev) => ({
            ...prev,
            [pollId]: {
              ...prev[pollId],
              pending: false,
              voted: option,
              canVote: false,
              results: {
                option1: prev[pollId].results.option1 + (option === 1 ? 1 : 0),
                option2: prev[pollId].results.option2 + (option === 2 ? 1 : 0),
              },
            },
          }));
        },
        onCancel: () => {
          setPollStates((prev) => ({
            ...prev,
            [pollId]: { ...prev[pollId], pending: false },
          }));
        },
      });
    } catch {
      setPollStates((prev) => ({
        ...prev,
        [pollId]: { ...prev[pollId], pending: false },
      }));
    }
  }

  return (
    <section className="mt-12">
      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black gradient-text mb-2">Daily Mood Polls</h2>
        <p className="text-gray-500 text-sm font-medium">
          Vote once per poll per day · Results update live
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {POLLS.map((poll) => (
            <div key={poll.id} className="glass rounded-3xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200/60 rounded-full w-3/4 mb-3" />
              <div className="h-10 bg-gray-200/60 rounded-2xl mb-2" />
              <div className="h-10 bg-gray-200/60 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {POLLS.map((poll) => {
            const state = pollStates[poll.id];
            const total = (state?.results.option1 ?? 0) + (state?.results.option2 ?? 0);
            const pct1 = total > 0 ? Math.round((state.results.option1 / total) * 100) : 50;
            const pct2 = total > 0 ? Math.round((state.results.option2 / total) * 100) : 50;
            const canVote = state?.canVote ?? false;
            const votedOption = state?.voted;
            const pending = state?.pending ?? false;
            const didVote = votedOption !== null || !canVote;

            return (
              <div
                key={poll.id}
                className="glass rounded-3xl p-5 shadow-md card-hover flex flex-col gap-4 animate-fade-up"
                style={{ animationDelay: `${(poll.id - 1) * 40}ms` }}
              >
                {/* Header */}
                <div className="flex items-start gap-2">
                  <span className="text-2xl flex-shrink-0">{poll.emoji}</span>
                  <p className="text-sm font-semibold text-gray-700 leading-snug">
                    {poll.question}
                  </p>
                </div>

                {/* Options */}
                <div className="flex flex-col gap-2">
                  {([
                    { label: poll.optionA, opt: 1 as const, count: state?.results.option1 ?? 0, pct: pct1 },
                    { label: poll.optionB, opt: 2 as const, count: state?.results.option2 ?? 0, pct: pct2 },
                  ]).map(({ label, opt, count, pct }) => {
                    const isVoted = votedOption === opt;
                    const isWinning = didVote && pct >= 50;
                    const isThisWinning = didVote && opt === (pct1 >= pct2 ? 1 : 2);

                    return (
                      <button
                        key={opt}
                        onClick={() => handleVote(poll.id, opt)}
                        disabled={pending || (isConnected && didVote)}
                        className={`
                          relative w-full text-left rounded-2xl px-4 py-3 text-sm font-medium
                          transition-all duration-200 overflow-hidden
                          ${isVoted
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                            : didVote
                            ? 'glass-dark text-gray-600 cursor-default'
                            : 'glass-dark text-gray-700 hover:bg-white/70 hover:shadow-sm active:scale-[0.98]'
                          }
                          ${pending ? 'opacity-60 cursor-wait' : ''}
                        `}
                      >
                        {/* Progress bar behind (shown after voting) */}
                        {didVote && (
                          <div
                            className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                              isVoted
                                ? 'bg-white/15'
                                : isThisWinning
                                ? 'bg-indigo-100/60'
                                : 'bg-gray-100/40'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        )}

                        <span className="relative flex items-center justify-between gap-2">
                          <span className="truncate">{label}</span>
                          {didVote && (
                            <span className={`flex-shrink-0 text-xs font-bold ${isVoted ? 'text-white/90' : 'text-gray-500'}`}>
                              {pct}%
                            </span>
                          )}
                          {isVoted && (
                            <span className="flex-shrink-0 text-white/80 text-xs">✓</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Footer: vote count + status */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-gray-400">
                    {total} {total === 1 ? 'vote' : 'votes'}
                  </span>
                  <span className={`text-xs font-medium ${
                    pending ? 'text-blue-400 animate-pulse' :
                    votedOption ? 'text-green-500' :
                    !canVote && isConnected ? 'text-orange-400' :
                    'text-gray-400'
                  }`}>
                    {pending
                      ? 'Signing…'
                      : votedOption
                      ? 'Voted ✓'
                      : !isConnected
                      ? 'Connect to vote'
                      : !canVote
                      ? '⏳ Tomorrow'
                      : 'Vote'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect prompt */}
      {!isConnected && (
        <div className="text-center mt-6">
          <button
            onClick={connect}
            className="btn-primary px-8 py-3 text-sm"
          >
            Connect Wallet to Vote
          </button>
        </div>
      )}
    </section>
  );
}
