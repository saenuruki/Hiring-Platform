use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct UserAccount {
    pub name: String,
    pub avatar: String,
    pub authority: Pubkey,
    pub last_task_id: u8,
    pub task_count: u8,
}
