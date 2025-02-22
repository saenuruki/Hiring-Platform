use anchor_lang::{prelude::*, solana_program::clock};
use std::convert::TryInto;

declare_id!("G23R2nqZGHGZnbSQ54QDSBhXVQtKD45VxWXhheEEF9xa");

#[program]
pub mod task_manager {
    use super::*;

    pub fn add_task(
        ctx: Context<AddTask>,
        task_id: String,
        ipfs_hash: String,
        cost: u64,
    ) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.creator = *ctx.accounts.creator.key;
        task.solver = None; // No solver yet
        task.task_id = task_id;
        task.ipfs_hash = ipfs_hash;
        task.cost = cost;
        task.created_at = clock::Clock::get()?.unix_timestamp.to_string();
        task.status = TaskStatus::Open;
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

        task.status = TaskStatus::Completed;

        // Transfer payment from task creator to solver
        **ctx
            .accounts
            .solver
            .to_account_info()
            .try_borrow_mut_lamports()? += task.cost;
        **ctx
            .accounts
            .creator
            .to_account_info()
            .try_borrow_mut_lamports()? -= task.cost;

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
    pub creator: Pubkey,
    pub solver: Option<Pubkey>,
    pub task_id: String,
    pub ipfs_hash: String, // Stores IPFS hash for task details
    pub cost: u64,
    pub status: TaskStatus,
    pub created_at: String,
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
}
