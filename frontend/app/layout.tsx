import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';

export const metadata: Metadata = {
  other: {
    'talentapp:project_verification': '3406dcd8f9a797220a4c69e657ac56da51803f734f8b5be7e4fc1e453d6a612a180797bbc8ea1dc4021f6a4cc712d806d472878e227dca252d7b2317182b6ae5',
  },
  title: 'Daily Check-in | Stacks Blockchain',
  description:
    'Check in every day, build your streak, earn NFT badges and STX rewards on the Stacks blockchain.',
  openGraph: {
    title: 'Daily Check-in | Stacks Blockchain',
    description: 'Build your streak, earn NFT badges and STX rewards.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Check-in | Stacks Blockchain',
    description: 'Build your streak, earn NFT badges and STX rewards.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-glow" aria-hidden="true" />
        <WalletProvider>
          <div className="relative z-10">{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
