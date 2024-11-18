import { PublicKey } from '@solana/web3.js'

export const findProgramAddresses = async (programId: PublicKey) => {

  const bingo = PublicKey.findProgramAddressSync(
    [Buffer.from('bingo_account')],
    programId,
  )
  const winners = PublicKey.findProgramAddressSync(
    [Buffer.from('winners_account')],
    programId,
  )
  return { bingo, winners }
}
