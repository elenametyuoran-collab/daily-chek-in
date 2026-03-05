interface Props {
  address: string;
  size?: number;
}

export default function Avatar({ address, size = 32 }: Props) {
  const hue = parseInt(address.slice(-6), 16) % 360;
  const style = {
    width: size,
    height: size,
    background: `linear-gradient(135deg, hsl(${hue},65%,70%), hsl(${(hue+40)%360},65%,60%))`,
    borderRadius: Math.floor(size * 0.3),
  };
  return <div style={style} aria-hidden="true" />;
}
