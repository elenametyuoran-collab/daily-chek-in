'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

interface WalletContextType {
  isConnected: boolean;
  userAddress: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  userAddress: null,
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const profile = userSession.loadUserData();
      setIsConnected(true);
      setUserAddress(profile.profile?.stxAddress?.mainnet ?? null);
    }
  }, []);

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'Daily Check-in',
        icon: window.location.origin + '/favicon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const profile = userSession.loadUserData();
        setIsConnected(true);
        setUserAddress(profile.profile?.stxAddress?.mainnet ?? null);
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut('/');
    setIsConnected(false);
    setUserAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ isConnected, userAddress, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
