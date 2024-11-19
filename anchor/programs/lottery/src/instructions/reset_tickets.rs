use anchor_lang::prelude::*;

use crate::state::game::*;

pub fn reset_tickets(user_key: Pubkey, bingo_account: &mut Account<BingoAccount>) -> Result<()> {
    let numbers = generate_shuffled_numbers(user_key)?;
    bingo_account.tickets = numbers
        .into_iter()
        .take(25)
        .map(|num| Ticket {
            number: num,
            user: None,
            // bump: bingo_account.bump,
        })
        .collect();
    Ok(())
}

fn generate_shuffled_numbers(user_key: Pubkey) -> Result<Vec<u8>> {
    let mut numbers: Vec<u8> = (1..=75).collect();

    let clock = Clock::get()?;
    let mut seed = (clock.unix_timestamp as u64)
        .wrapping_mul(user_key.to_bytes()[0] as u64)
        .wrapping_add(user_key.to_bytes()[1] as u64);

    for i in (1..numbers.len()).rev() {
        seed = (seed ^ (seed << 13)).wrapping_add(i as u64);
        let j = (seed as usize) % (i + 1);
        numbers.swap(i, j);
    }

    Ok(numbers)
}
