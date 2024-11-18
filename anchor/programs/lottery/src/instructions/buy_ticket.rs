use anchor_lang::prelude::*;

use crate::errors::ErrorCode;
use crate::instructions::reset_tickets;
use crate::states::*;
use crate::utils::transfer_sol;

pub fn buy_ticket(ctx: Context<BuyTicket>, chosen_number: u8) -> Result<()> {
    let bingo_account = &mut ctx.accounts.bingo_account;
    let user = &ctx.accounts.user;

    if !bingo_account.initialized {
        return Err(ErrorCode::Uninitialized.into());
    }

    if let Some(ticket) = bingo_account
        .tickets
        .iter_mut()
        .find(|t| t.number == chosen_number)
    {
        if ticket.user.is_none() {
            ticket.user = Some(user.key().clone());

            transfer_sol(
                &ctx.accounts.system_program,
                &user.to_account_info(),
                &bingo_account.to_account_info(),
                1_000_000_00,
                "system_program",
            )?;

            bingo_account.counter += 1;
            if bingo_account.counter == 25 {
                select_winner(ctx)?;
            }
            Ok(())
        } else {
            Err(ErrorCode::NumberAlreadyTaken.into())
        }
    } else {
        Err(ErrorCode::NumberNotAvailable.into())
    }
}

fn select_winner(ctx: Context<BuyTicket>) -> Result<()> {
    let bingo_account = &mut ctx.accounts.bingo_account;
    let winners = &mut ctx.accounts.winners;
    let user = &ctx.accounts.user;

    let clock = Clock::get()?;
    let user_key = user.key();

    // Generate a seed based on the timestamp and user's public key
    let seed = (clock.unix_timestamp as u64)
        .wrapping_mul(user_key.to_bytes()[0] as u64)
        .wrapping_add(user_key.to_bytes()[1] as u64);

    // Generate a random index to select a winner
    let random_index = (seed ^ (seed << 13)).wrapping_add(bingo_account.tickets.len() as u64)
        as usize
        % bingo_account.tickets.len();
    let winner_ticket = bingo_account.tickets[random_index].clone();

    // Add the winner to the list
    winners.keys.push(winner_ticket);

    bingo_account.counter = 0;
    // Reset tickets for the next round
    reset_tickets(user_key, bingo_account)?;

    Ok(())
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub bingo_account: Account<'info, BingoAccount>,
    #[account(mut)]
    pub winners: Account<'info, Winners>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
