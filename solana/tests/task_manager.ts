import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TaskManager } from "../target/types/task_manager";
import BN from "bn.js";
import { assert } from "chai";

describe("program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const taskAccount1 = anchor.web3.Keypair.generate();
  const taskAccount2 = anchor.web3.Keypair.generate();
  const creator = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.TaskManager as Program<TaskManager>;

  it("Creates a task!", async () => {
    await program.methods
      .addTask('a-random-task-id-1', 'ipfs-hash', new BN(20000))
      .accounts({
        task: taskAccount1.publicKey, 
        creator: creator.publicKey,
      })
      .signers([taskAccount1])
      .rpc();
    
      const allTasks = await program.account.task.fetch(taskAccount1.publicKey);
      assert.ok(allTasks.taskId === 'a-random-task-id-1');
      assert.ok(allTasks.ipfsHash === 'ipfs-hash');
      assert.ok(allTasks.cost.eq(new BN(20000)));
  });
});
