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
    <nav>
      <ul className="flex space-x-4 items-center justify-end">
        <li>
          <a href="/">Home</a>
        </li>
        <li className="ml-auto">
          <a href="/create">Create Job</a>
        </li>
        {connected && (
          <li className="flex items-center space-x-2">
            <img src={user?.avatar} className="h-8 w-8 rounded-full" />
            <span>{user?.name}</span>
            {!initialized && (
              <button
                className="ml-3 mr-2"
                onClick={() => {
                  initUser();
                }}
              >
                Initialize User
              </button>
            )}
          </li>
        )}
        {!connected && (
          <li>
            <button onClick={connectHandler}>Connect</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
