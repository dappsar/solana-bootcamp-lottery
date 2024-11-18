use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The game has already been initialized.")]
    AlreadyInitialized,
    #[msg("The game is not initialized.")]
    Uninitialized,
    #[msg("The chosen number is not available.")]
    NumberNotAvailable,
    #[msg("The number is already taken.")]
    NumberAlreadyTaken,
    #[msg("You are not a winner.")]
    NotAWinner,
    #[msg("Insufficient lamports for the transaction.")]
    InsufficientLamports,
}
