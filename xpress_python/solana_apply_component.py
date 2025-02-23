from xai_components.base import InArg, OutArg, Component, xai_component
from solana.rpc.api import Client
from solders.pubkey import Pubkey
from solana.instructions import Instruction
from solana.system_program import SYS_PROGRAM_ID
from solana.transaction import Transaction
from solana.account import Account

@xai_component
class SolanaComponent(Component):
    """
    A custom component for [describe the purpose of your component].

    ##### inPorts:
    - task_id (str): Task you want to apply
    - amount (int): The money you would like to bid
    - programId: The ID of the Solana Program, that is creating the Tasks on chain.
    
    ##### outPorts:
    - key (str): key of transaction
    """
    
    # Define input ports
    task_id: InArg[str]
    amount: InArg[int]
    programId: InArg[str]  # Replace 'type' with the actual data type (e.g., str, int, list)

    # Define output ports
    key: OutArg[str]  # Replace 'type' with the actual data type

    def execute(self, ctx) -> None:
        """
        The main logic of the component goes here.
        Use the input values to perform operations and set the output values.
        """
        # Access input values
        value1 = self.programId.value
        
        program_id = Pubkey.from_string(value1)
        connection = Client("https://api.devnet.solana.com")

        # Create the offer account (new memory cell on blockchain)
        offer = Pubkey.new_unique()

        # Create the instruction
        signers=[offer]
        apply_to_task_ix = Instruction(
            program_id=program_id,
            accounts=[
                {"pubkey": offer, "is_signer": True, "is_writable": True},
                {"pubkey": task, "is_signer": False, "is_writable": True},
                {"pubkey": creator, "is_signer": False, "is_writable": True},
                {"pubkey": SYS_PROGRAM_ID, "is_signer": False, "is_writable": False},
            ],
            data=bytes([task_id, amount])  # Encode your instruction data correctly
        )

        # Create and send the transaction containing the instruction.
        tx = Transaction().add(apply_to_task_ix)
        tx_signature = client.send_transaction(tx, signer, opts=TxOpts(skip_preflight=True))

        # Set output values
        self.output.value = tx_signature
