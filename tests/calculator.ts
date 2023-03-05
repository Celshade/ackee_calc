import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Calculator } from "../target/types/calculator";
import { expect } from "chai";

const { SystemProgram } = anchor.web3


describe("calculator", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Referencing the program so that we can call methods
  const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;
  // Generate keypair for calculator account
  const calculatorKP = anchor.web3.Keypair.generate();
  // Greeting text
  const text = "Winter School of Solana [Celshade]";

  // Call create() - set calculator KP as siginer
  it("Creating Calculator Instance", async () => {
    await program.methods.create(text).accounts(
      {
        calculator: calculatorKP.publicKey,
        user: programProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId
      }
    ).signers([calculatorKP]).rpc()

  // Fetch account and read if the string is in the account
  const account = await program.account.calculator.fetch(calculatorKP.publicKey)
  expect(account.greeting).to.eql(text)
  // console.log("Your transaction signature", tx);
  });

  // Test add()
  it("Addition", async () => {
    await program.methods.add(new anchor.BN(2), new anchor.BN(3)).accounts(
      {
        calculator: calculatorKP.publicKey
      }
    ).rpc()

  const account = await program.account.calculator.fetch(calculatorKP.publicKey);
  expect(account.result).to.eql(new anchor.BN(5))
  // console.log("Your transaction signature", tx);
  });

  // Test sub()
  it("Subtraction", async () => {
    await program.methods.sub(new anchor.BN(5), new anchor.BN(2)).accounts(
      {
        calculator: calculatorKP.publicKey
      }
    ).rpc()

  const account = await program.account.calculator.fetch(calculatorKP.publicKey);
  expect(account.result).to.eql(new anchor.BN(3))
  // console.log("Your transaction signature", tx);
  });

  // Test mul()
  it("Multiplication", async () => {
    await program.methods.mul(new anchor.BN(2), new anchor.BN(3)).accounts(
      {
        calculator: calculatorKP.publicKey
      }
    ).rpc()

  const account = await program.account.calculator.fetch(calculatorKP.publicKey);
  expect(account.result).to.eql(new anchor.BN(6))
  // console.log("Your transaction signature", tx);
  });

  // Test div()
  it("Division", async () => {
    await program.methods.div(new anchor.BN(6), new anchor.BN(3)).accounts(
      {
        calculator: calculatorKP.publicKey
      }
    ).rpc()

  const account = await program.account.calculator.fetch(calculatorKP.publicKey);
  expect(account.result).to.eql(new anchor.BN(2))
  // console.log("Your transaction signature", tx);
  });
});
