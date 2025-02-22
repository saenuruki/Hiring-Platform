"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useTaskContext } from "./task-provider";

export default function Navbar() {
  const { connected, select } = useWallet();
  const [connecting, setConnecting] = useState(false);

  const { user, initialized, initUser } = useTaskContext();

  const connectHandler = () => {
    setConnecting(true);
    select(PhantomWalletName);
  };

  useEffect(() => {
    if (user) {
      setConnecting(false);
    }
  }, [user]);

  return (
    <nav className="container mx-auto px-4 py-8">
    </nav>
  );
}
