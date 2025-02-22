import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TaskManager } from "../target/types/task_manager";
import BN from "bn.js";
import { assert } from "chai";

describe("program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  // Dummy task informations
  const taskAccount1 = anchor.web3.Keypair.generate();
  const taskId1 = 'a-random-task-id-1';

  const creator = provider.wallet as anchor.Wallet;
  const solver = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.TaskManager as Program<TaskManager>;

  it("Creates a task!", async () => {
    await program.methods
      .addTask(taskId1, 'ipfs-hash')
      .accounts({
        task: taskAccount1.publicKey, 
        creator: creator.publicKey,
      })
      .signers([taskAccount1])
      .rpc();
    
      const addedTask = await program.account.task.fetch(taskAccount1.publicKey);
      assert.ok(addedTask.taskId === taskId1);
      assert.ok(addedTask.ipfsHash === 'ipfs-hash');
  });

  it("Applies to a task!", async () => {
    const offerId = "random-offer-id";
    const offerAccount = anchor.web3.Keypair.generate();
    await program.methods
      .applyToTask(taskId1, offerId, new BN(20000))
      .accounts({
        offer: offerAccount.publicKey, 
        task: taskAccount1.publicKey,
        creator: solver.publicKey,
      })
      .signers([offerAccount])
      .rpc();
    
      const appliedOffer = await program.account.offer.fetch(offerAccount.publicKey);
      console.log(appliedOffer);
      assert.ok(appliedOffer.taskId == taskId1);
      assert.ok(appliedOffer.offerId == offerId);
      assert.ok(appliedOffer.amount.cmp(new BN(20000)) == 0);
  });
});
