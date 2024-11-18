use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::instructions::reset_tickets;
use crate::states::*;

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let bingo_account = &mut ctx.accounts.bingo_account;

    if bingo_account.initialized {
        return Err(ErrorCode::AlreadyInitialized.into());
    }

    reset_tickets(ctx.accounts.user.key(), bingo_account)?;

    bingo_account.initialized = true;
    bingo_account.counter = 0;

    Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init_if_needed,
        seeds = [b"bingo_account"],
        // seeds = [BINGO_ACCOUNT_SEED.as_bytes(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + BingoAccount::INIT_SPACE
    )]
    pub bingo_account: Account<'info, BingoAccount>,

    #[account(
        init_if_needed,
        seeds = [b"winners_account"],
        // seeds = [WINNERS_SEED.as_bytes(), user.key().as_ref()],
        bump,
        payer = user,
        space = 8 + Winners::INIT_SPACE
    )]
    pub winners: Account<'info, Winners>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
