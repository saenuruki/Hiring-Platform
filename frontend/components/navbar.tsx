"use client";

import * as React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";

export default function Navbar() {
  const { connected, select } = useWallet();
  const [connecting, setConnecting] = React.useState(false);

  const connectHandler = () => {
    setConnecting(true);
    select(PhantomWalletName);
  };

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
            <img
              src="https://avatars.githubusercontent.com/u/7525670?v=4"
              className="h-8 w-8 rounded-full"
            />
            <span>User</span>
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
