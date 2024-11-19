use anchor_lang::prelude::*;

use crate::instructions::*;

pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

declare_id!("Cir3otRBVbM5UPikSJM5mGrFP44hWyvuG1cr7dzQggvW");

#[program]
pub mod lottery {
    use super::*;

    pub fn lottery_initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize(ctx)
    }

    pub fn lottery_buy_ticket(ctx: Context<BuyTicket>, chosen_number: u8) -> Result<()> {
        buy_ticket(ctx, chosen_number)
    }

    pub fn lottery_claim_reward(ctx: Context<ClaimReward>, ticket_number: u8) -> Result<()> {
        claim_reward(ctx, ticket_number)
    }
}
