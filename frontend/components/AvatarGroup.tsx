interface Props { addresses: string[]; max?: number; size?: number; }
export default function AvatarGroup({ addresses, max = 5, size = 28 }: Props) {
  const visible = addresses.slice(0, max);
  const extra   = addresses.length - max;
  return (
    <div className="flex items-center">
      {visible.map((addr, i) => {
        const hue = parseInt(addr.slice(-6), 16) % 360;
        return (
          <div key={addr} title={addr}
            style={{ width: size, height: size, background: `hsl(${hue},65%,70%)`, borderRadius: Math.floor(size*0.3), marginLeft: i ? -8 : 0, border: '2px solid white', zIndex: visible.length - i }}
            className="flex-shrink-0"
          />
        );
      })}
      {extra > 0 && (
        <div style={{ width: size, height: size, marginLeft: -8, border: '2px solid white', borderRadius: Math.floor(size*0.3), zIndex: 0 }}
          className="flex-shrink-0 bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
          +{extra}
        </div>
      )}
    </div>
  );
}