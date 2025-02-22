import { createContext, useContext, useMemo, useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import idl from "../app/idl.json";
import { BN } from "@project-serum/anchor";

const TaskContext = createContext();

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [transactionPending, setTransactionPending] = useState(false);

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idl, PROGRAM_KEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    if (!transactionPending) {
      loadTasks();
    }
  }, [program, publicKey, transactionPending]);

  const createIpfs = async (data) => {
    const form_data = new FormData();

    for (const key in data) {
      form_data.append(key, data[key]);
    }

    try {
      const uploadRequest = await fetch("/api/ipfs", {
        method: "POST",
        body: form_data,
      });
      const ipfsHash = await uploadRequest.json();

      return ipfsHash.hash;
    } catch (e) {
      console.log(e);
      alert("Trouble creating Ipfs hash");
    }
  };

  const createTask = async (hash) => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const taskAccount1 = anchor.web3.Keypair.generate();

        await program.methods
          .addTask("a-random-task-id-1", hash, new BN(20000))
          .accounts({
            task: taskAccount1.publicKey,
            creator: publicKey,
          })
          .signers([taskAccount1])
          .rpc();
      } catch (error) {
        console.log(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const loadTasks = async () => {
    if (program && publicKey) {
      const allTasks = await program.account.task.fetchAll();
      setTasks(allTasks);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        createIpfs,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
