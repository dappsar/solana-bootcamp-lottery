use anchor_lang::prelude::*;

pub const WINNERS_SEED: &str = "winners_account";
pub const BINGO_ACCOUNT_SEED: &str = "bingo_account";

impl Space for Ticket {
    const INIT_SPACE: usize = 1 + 32;
}

#[account]
#[derive(InitSpace)]
pub struct Winners {
    #[max_len(25)]
    pub keys: Vec<Ticket>,
    // pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct BingoAccount {
    #[max_len(25)]
    pub tickets: Vec<Ticket>,
    pub initialized: bool,
    pub counter: i8,
    // pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Ticket {
    pub number: u8,
    pub user: Option<Pubkey>,
}
