const REWARDS = [
  { place: '1st', amount: '5 STX', icon: '🥇', color: 'text-yellow-600' },
  { place: '2nd', amount: '4 STX', icon: '🥈', color: 'text-gray-500' },
  { place: '3rd', amount: '3 STX', icon: '🥉', color: 'text-orange-500' },
  { place: '4th', amount: '2 STX', icon: '4️⃣', color: 'text-blue-400' },
  { place: '5th', amount: '1 STX', icon: '5️⃣', color: 'text-blue-400' },
];

export default function RewardInfo() {
  return (
    <div className="glass rounded-3xl p-6 shadow-md">
      <h3 className="font-bold text-gray-700 mb-4">🏆 Reward Structure</h3>
      <div className="space-y-2">
        {REWARDS.map((r) => (
          <div key={r.place} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/40 transition-colors">
            <div className="flex items-center gap-2">
              <span className="text-lg">{r.icon}</span>
              <span className="text-sm font-medium text-gray-600">{r.place} place</span>
            </div>
            <span className={`text-sm font-bold ${r.color}`}>{r.amount}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 text-center mt-3">
        Distributed periodically to top check-in users
      </p>
    </div>
  );
}
