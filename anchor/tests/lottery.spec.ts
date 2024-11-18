import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Lottery } from "../target/types/lottery";
import { PublicKey } from '@solana/web3.js';
import { assert } from "chai";

// ------------------------------------------------------------------------------------------------

const BINGO_ACCOUNT_SEED = "bingo_account";
const WINNERS_SEED = "winners_account";

describe('lottery-basic', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Lottery as Program<Lottery>;

  const user = anchor.web3.Keypair.generate();
  const [bingoAccountPda, _bingo_account_bump] = getBingoAddress(user.publicKey, program.programId);
  const [winnersAccountPda, _winners_account_bump] = getWinnersAddress(user.publicKey, program.programId);

  it("Initialize Bingo Account!", async () => {
    await airdrop(provider.connection, user.publicKey);

    await program.methods
    .lotteryInitialize()
    .accounts({
      user: user.publicKey,
      //@ts-ignore
      bingoAccount: bingoAccountPda,
      winners: winnersAccountPda,    
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([user]).rpc({ commitment: "confirmed" });

    const bingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    assert.ok(bingoAccountData.initialized, "Bingo account should be initialized");
    assert.equal(bingoAccountData.counter.toString(), "0", "Counter should be 0 after initialization");
    assert.equal(bingoAccountData.tickets.length, 25, "Should initialize 25 tickets");
  
    const winnersData = await program.account.winners.fetch(winnersAccountPda);
    assert.ok(winnersData, "Winners account should exist");
    assert.equal(winnersData.keys.length, 0, "Winners should be empty initially");
  });
  

  it("Buy a ticket!", async () => {
    await airdrop(provider.connection, user.publicKey);

    // Fetch the initialized tickets to pick a valid number
    const bingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    const availableNumbers = bingoAccountData.tickets.map((t: any) => t.number);
    assert.ok(availableNumbers.length > 0, "There should be available tickets to buy");

    // Choose a number from the available tickets
    const chosenNumber = availableNumbers[0];
  
    await program.methods
      .lotteryBuyTicket(chosenNumber)
      .accounts({
        user: user.publicKey,
        bingoAccount: bingoAccountPda,
        winners: winnersAccountPda,
        //@ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc({ commitment: "confirmed" });
  
    const updatedBingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    const ticket = updatedBingoAccountData.tickets.find((t: any) => t.number === chosenNumber);
  
    assert.ok(ticket, "Ticket with the chosen number should exist");
    assert.equal(ticket.user!.toBase58(), user.publicKey.toBase58(), "The ticket should belong to Bob");
    assert.equal(updatedBingoAccountData.counter, 1, "The counter should increment after buying a ticket");
  });


  it("Buy a ticket with an unavailable number", async () => {
    await airdrop(provider.connection, user.publicKey);
    const chosenNumber = 100; // This number is not available
  
    try {
      await program.methods
        .lotteryBuyTicket(chosenNumber)
        .accounts({
          user: user.publicKey,
          bingoAccount: bingoAccountPda,
          winners: winnersAccountPda,
          //@ts-ignore
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc({ commitment: "confirmed" });
      assert.fail("Expected error when choosing an unavailable number");
    } catch (error) {
      assert.include(error.message, "NumberNotAvailable", "Error should be 'NumberNotAvailable'");
    }
  });
  

  it("Attempt to buy an already taken ticket", async () => {
    await airdrop(provider.connection, user.publicKey);
  
    // Fetch the initialized tickets to pick a valid number
    const bingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    const availableTickets = bingoAccountData.tickets.filter((t: any) => t.user === null);
    const availableNumbers = availableTickets.map((t: any) => t.number);
    assert.ok(availableNumbers.length > 0, "There should be available tickets to buy");
 
    // Choose a number from the available tickets
    const chosenNumber = availableNumbers[0];
  
    await program.methods
      .lotteryBuyTicket(chosenNumber)
      .accounts({
        user: user.publicKey,
        bingoAccount: bingoAccountPda,
        winners: winnersAccountPda,
        //@ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc({ commitment: "confirmed" });
  
    const updatedBingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    const ticket = updatedBingoAccountData.tickets.find((t: any) => t.number === chosenNumber);

    assert.ok(ticket, "Ticket with the chosen number should exist");
    assert.equal(ticket.user!.toBase58(), user.publicKey.toBase58(), "The ticket should belong to Bob");

    try {
      await program.methods
        .lotteryBuyTicket(chosenNumber)
        .accounts({
          user: user.publicKey,
          bingoAccount: bingoAccountPda,
          winners: winnersAccountPda,
          //@ts-ignore
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user])
        .rpc({ commitment: "confirmed" });
      
      assert.fail("The ticket should already be taken and throw an error");

    } catch (err) {
      // Check that the error is 'NumberAlreadyTaken' error
      assert.include(err.message, "NumberAlreadyTaken", "Expected error 'NumberAlreadyTaken' was not thrown");
    }

  });
  

  it("should allow the winner to claim their reward", async () => {
    await airdrop(provider.connection, user.publicKey);
    
    let winningTicketNumber: number;
    let winnerTicket: any;
    
    // Buy all tickets (25 tickets)
    const bingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    const availableTickets = bingoAccountData.tickets.filter((t: any) => t.user === null);
    const availableNumbers = availableTickets.map((t: any) => t.number);

    for (let i = 0; i < availableNumbers.length; i++) {
      const chosenNumber = availableNumbers[i];
  
      // Buy the ticket for each available number
      await program.methods.lotteryBuyTicket(chosenNumber).accounts({
        bingoAccount: bingoAccountPda,
        winners: winnersAccountPda,
        user: user.publicKey,
        //@ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([user]).rpc();
    }

    // Now, the selectWinner function should execute automatically when the counter reaches 25,
    // and the winner should be selected within the program flow.
    const winnersData = await program.account.winners.fetch(winnersAccountPda);
    winnerTicket = winnersData.keys[0];  // Assuming the first ticket is the winner
    winningTicketNumber = winnerTicket.number;

    const userBalanceBefore = await provider.connection.getBalance(user.publicKey);

    // Simulate that the winning player claims their reward
    await program.methods.lotteryClaimReward(winningTicketNumber).accounts({
      bingoAccount: bingoAccountPda,
      winners: winnersAccountPda,
      user: user.publicKey,
      //@ts-ignore
      systemProgram: anchor.web3.SystemProgram.programId,  
    }).signers([user]).rpc();

    // Verify that the user's balance has increased correctly
    const userBalanceAfter = await provider.connection.getBalance(user.publicKey);
    const expectedReward = 25_000_000_00;

    assert.equal(userBalanceBefore + expectedReward, userBalanceAfter , "Reward not correctly transferred");

    // Wait for the winner to be selected automatically (when the counter reaches 25)
    const winnersAccountData = await program.account.winners.fetch(winnersAccountPda);
    const winnerTicketExists = winnersAccountData.keys.some(
      (ticket) => ticket.user?.toString() === user.publicKey.toString() && ticket.number === winningTicketNumber
    );
    assert.isFalse(winnerTicketExists, "Ticket should have been removed from winners list after claiming reward");
  }, 30000); // expand timeout


  it("should not allow a non-winner to claim the reward", async () => {
    let nonWinner: anchor.web3.Keypair = anchor.web3.Keypair.generate();  // Nuevo usuario no ganador
    await airdrop(provider.connection, nonWinner.publicKey);
    await airdrop(provider.connection, user.publicKey);
   
    let winningTicketNumber: number;
    let userTickets: number[] = [];
    let winnerTicket: any;
    
    // Buy all tickets (25 tickets)
    const bingoAccountData = await program.account.bingoAccount.fetch(bingoAccountPda);
    const availableTickets = bingoAccountData.tickets.filter((t: any) => t.user === null);
    const availableNumbers = availableTickets.map((t: any) => t.number);

    for (let i = 0; i < availableNumbers.length; i++) {
      const chosenNumber = availableNumbers[i];
  
      // Buy the ticket for each available number
      await program.methods.lotteryBuyTicket(chosenNumber).accounts({
        bingoAccount: bingoAccountPda,
        winners: winnersAccountPda,
        user: user.publicKey,
        //@ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([user]).rpc();
      
      // Optional: Store bought tickets for later validation
      userTickets.push(chosenNumber);
    }

    // Wait for the winner to be selected automatically (when the counter reaches 25)
    const winnersData = await program.account.winners.fetch(winnersAccountPda);
    winnerTicket = winnersData.keys[0];  // Assuming the first ticket is the winner
    winningTicketNumber = winnerTicket.number;
    
    // The non-winner user tries to claim the reward for a non-winning ticket
    try {
      await program.methods.lotteryClaimReward(winnerTicket.number).accounts({
        bingoAccount: bingoAccountPda,
        winners: winnersAccountPda,
        user: nonWinner.publicKey,
        //@ts-ignore
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([nonWinner]).rpc();
      
      assert.fail("Expected error 'NotAWinner' was not thrown");
    } catch (err) {
      assert.include(err.message, "NotAWinner", "Expected error 'NotAWinner' was not thrown");
    }
  }, 30000); // expand timeout

})

// ------------------------------------------------------------------------------------------------

async function airdrop(connection: any, address: any, amount = 10000000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

function getBingoAddress(author: PublicKey, programID: PublicKey) {
  
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(BINGO_ACCOUNT_SEED),
      // author.toBuffer()
    ], programID);
}

function getWinnersAddress(author: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(WINNERS_SEED),
      // author.toBuffer()
    ], programID);
}

