use anchor_lang::{prelude::*, solana_program::clock};

declare_id!("G23R2nqZGHGZnbSQ54QDSBhXVQtKD45VxWXhheEEF9xa");

#[program]
pub mod task_manager {
    use super::*;

    pub fn add_task(ctx: Context<AddTask>, task_id: String, ipfs_hash: String) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.solver = None; // No solver yet
        task.task_id = task_id;
        task.ipfs_hash = ipfs_hash;
        task.accepted_offer_id = None; // No accepted offer yet
        task.cost = None; // No cost yet
        task.created_by = *ctx.accounts.creator.key;
        task.created_at = clock::Clock::get()?.unix_timestamp.to_string();
        task.status = TaskStatus::Open;
        Ok(())
    }

    pub fn apply_to_task(
        ctx: Context<ApplyToTask>,
        task_id: String,
        offer_id: String,
        amount: u64,
    ) -> Result<()> {
        let offer = &mut ctx.accounts.offer;
        let task = &mut ctx.accounts.task;
        require!(task.status == TaskStatus::Open, TaskError::TaskNotOpen);
        offer.offer_id = offer_id;
        offer.task_id = task_id;
        offer.amount = amount;
        offer.created_by = *ctx.accounts.creator.key;
        Ok(())
    }

    // TODO: rethink
    pub fn accept_task(ctx: Context<AcceptTask>, task_id: u64) -> Result<()> {
        let task = &mut ctx.accounts.task;
        require!(task.status == TaskStatus::Open, TaskError::TaskNotOpen);
        task.solver = Some(*ctx.accounts.solver.key);
        task.status = TaskStatus::InProgress;
        Ok(())
    }

    pub fn complete_task(ctx: Context<CompleteTask>, task_id: u64) -> Result<()> {
        let task = &mut ctx.accounts.task;
        require!(
            task.status == TaskStatus::InProgress,
            TaskError::InvalidTaskStatus
        );
        require!(
            task.solver.unwrap() == *ctx.accounts.solver.key,
            TaskError::NotTaskSolver
        );
        require!(task.cost.is_some(), TaskError::NoCostSet);
        let cost = task.cost.unwrap();

        task.status = TaskStatus::Completed;

        // Transfer payment from task creator to solver
        **ctx
            .accounts
            .solver
            .to_account_info()
            .try_borrow_mut_lamports()? += cost;
        **ctx
            .accounts
            .creator
            .to_account_info()
            .try_borrow_mut_lamports()? -= cost;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddTask<'info> {
    #[account(init, payer = creator, space = 128)]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApplyToTask<'info> {
    #[account(init, payer = creator, space = 128)]
    pub offer: Account<'info, Offer>,
    #[account(mut)]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptTask<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    pub solver: Signer<'info>,
}

#[derive(Accounts)]
pub struct CompleteTask<'info> {
    #[account(mut)]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub solver: Signer<'info>,
    #[account(mut)]
    pub creator: Signer<'info>,
}

#[account]
pub struct Task {
    pub solver: Option<Pubkey>,
    pub task_id: String,
    pub accepted_offer_id: Option<String>, // Stores the accepted offer id
    pub ipfs_hash: String,                 // Stores IPFS hash for task details
    pub cost: Option<u64>,
    pub status: TaskStatus,
    pub created_by: Pubkey,
    pub created_at: String,
}

#[account]
pub struct Offer {
    pub offer_id: String,
    pub task_id: String,
    pub amount: u64,
    pub created_by: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TaskStatus {
    Open,
    InProgress,
    Completed,
}

#[error_code]
pub enum TaskError {
    #[msg("Task is not open for accepting.")]
    TaskNotOpen,
    #[msg("Task is not in progress.")]
    InvalidTaskStatus,
    #[msg("You are not the assigned solver.")]
    NotTaskSolver,
    #[msg("The task's cost must be set")]
    NoCostSet,
}
