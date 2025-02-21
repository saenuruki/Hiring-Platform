"use client";

import { useMemo } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

export function Providers({ children }) {
  const endpoint =
    "https://aged-responsive-theorem.solana-devnet.quiknode.pro/8cf232acb691bbaba7317204fddf7aff02715f3a";

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  return (
    // <ThemeProvider>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
    // </ThemeProvider>
  );
}
