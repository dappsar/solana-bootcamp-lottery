use anchor_lang::prelude::*;

use crate::errors::ErrorCode;

pub fn transfer_sol<'info>(
    system_program: &Program<'info, System>,
    from: &AccountInfo<'info>,
    to: &AccountInfo<'info>,
    amount: u64,
    transfer_type: &str,
) -> Result<()> {
    if **from.try_borrow_lamports()? < amount {
        return Err(ErrorCode::InsufficientLamports.into());
    }
    if transfer_type == "system_program" {
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: from.clone(),
            to: to.clone(),
        };
        let cpi_context = CpiContext::new(system_program.to_account_info(), cpi_accounts);
        anchor_lang::system_program::transfer(cpi_context, amount)?;
    } else {
        **from.to_account_info().try_borrow_mut_lamports()? -= amount;
        **to.to_account_info().try_borrow_mut_lamports()? += amount;
    }

    Ok(())
}
