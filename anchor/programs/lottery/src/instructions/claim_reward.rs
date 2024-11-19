use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::state::game::*;
use crate::utils::transfer_sol;

pub fn claim_reward(ctx: Context<ClaimReward>, ticket_number: u8) -> Result<()> {
    let winners = &mut ctx.accounts.winners;
    let user = &ctx.accounts.user;

    if let Some(_ticket) = winners
        .keys
        .iter()
        .find(|&t| t.user == Some(user.key().clone()))
    {
        transfer_sol(
            &ctx.accounts.system_program,
            &ctx.accounts.bingo_account.to_account_info(),
            &user.to_account_info(),
            25_000_000_00,
            "borrow_lamports",
        )?;

        winners
            .keys
            .retain(|t| !(t.user == Some(user.key().clone()) && t.number == ticket_number));

        Ok(())
    } else {
        Err(ErrorCode::NotAWinner.into())
    }
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub bingo_account: Account<'info, BingoAccount>,
    #[account(mut)]
    pub winners: Account<'info, Winners>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
