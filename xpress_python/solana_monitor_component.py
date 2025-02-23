from xai_components.base import InArg, OutArg, Component, xai_component
from solana.rpc.api import Client
from solders.pubkey import Pubkey

@xai_component
class SolanaComponent(Component):
    """
    NeuroGigX
    A Solana Component, to monitor the Solana Blockchain for Tasks to fulfill.

    ##### inPorts:
    - programId (str): The ID of the Solana Program, that is creating the Tasks on chain.

    ##### outPorts:
    - tasks (list): The Tasks that are currently open and available for application.
    """
    
    # Define input ports
    programId: InArg[str]  # Replace 'type' with the actual data type (e.g., str, int, list)

    # Define output ports
    tasks: OutArg[list]  # Replace 'type' with the actual data type

    def execute(self, ctx) -> None:
        """
        The main logic of the component goes here.
        Use the input values to perform operations and set the output values.
        """
        # Access input values
        value1 = self.programId.value
        
        program_id = Pubkey.from_string(value1)
        connection = Client("https://api.devnet.solana.com")
    
        response = connection.get_program_accounts(program_id, encoding="base64")
    
        accounts = response.value
        keys = []
    
        for account in accounts:
            keys.append(account.pubkey.to_json())

        # Set output values
        self.tasks.value = keys
