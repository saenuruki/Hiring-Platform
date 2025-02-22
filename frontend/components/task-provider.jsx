import { createContext, useContext, useMemo, useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import idl from "../app/idl.json";

const TaskContext = createContext();

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);

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

  const createTask = async (title, hash) => {
    if (program && publicKey) {
      try {
        setLoading(true);
        const taskAccount1 = anchor.web3.Keypair.generate();
        console.log(taskAccount1.publicKey.toBase58());

        await program.methods
          .addTask(title, hash)
          .accounts({
            task: taskAccount1.publicKey,
            creator: publicKey,
          })
          .signers([taskAccount1])
          .rpc();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadTasks = async () => {
    if (program && publicKey) {
      setLoading(true);
      try {
        const allTasks = await program.account.task.all();
        const preparedTasks = allTasks.map((task) => ({
          ...task,
          key: task.publicKey.toBase58(),
        }));
        setTasks(preparedTasks);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const loadTask = async (id) => {
    if (program && publicKey) {
      setLoading(true);
      try {
        const publicKey = new PublicKey(id);
        const solanaTask = await program.account.task.fetch(publicKey);

        solanaTask.data = await fetch(
          `https://gateway.ipfs.io/ipfs/${solanaTask.ipfsHash}`
        ).then((r) => r.json());
        console.log(solanaTask);
        setTask(solanaTask);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TaskContext.Provider
      value={{
        program,
        publicKey,
        loading,
        tasks,
        task,
        loadTask,
        loadTasks,
        createTask,
        createIpfs,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
