#!/usr/bin/env node
// @ts-nocheck
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import yargs from "yargs";
import { updateContent } from "./name_service";
import { connection } from "./connection";
import fs from "fs";
import { Keypair } from "@solana/web3.js";
import ora from "ora";
import { execSync } from "child_process";

clear();

console.log(
  chalk.yellow(figlet.textSync("SNS Deploy", { horizontalLayout: "full" }))
);
console.log("\n");

const argv = yargs
  .scriptName("sns-deploy")
  .usage(
    "$0 [options]",
    // @ts-ignore
    "Update the content of your Solana name service account",
    (yargs) => {
      yargs.options({
        d: {
          alias: "domain",
          describe: "domain to update without .sol",
          demandOption: true,
        },
        w: {
          alias: "wallet",
          describe: "Solana wallet owning the domain",
          demandOption: true,
        },
        c: {
          alias: "content",
          describe: "Content to write in the solana account",
        },
        p: {
          alias: "path",
          describe: "Path to the folder to deploy ",
        },
      });
    }
  )
  .help()
  .alias("h", "help").argv;

let options = {
  wallet: argv.wallet as string,
  content: argv.content as string | undefined | null,
  domain: argv.domain as string,
  path: argv.p as string,
};

if (options.domain.includes(".sol")) {
  options.domain = options.domain.slice(0, -4);
}

export const deployIpfs = (path: string) => {
  const cmd = `npx ipfs-deploy ${path} -C -O`;
  const cid = execSync(cmd).toString();
  return cid;
};

export const main = async () => {
  let cid: null | string = "";
  try {
    if (options.path && options.content) {
      throw new Error(
        `Cannot update content with ${options.content} and with IPFS CID`
      );
    }
    if (!options.path && !options.content) {
      throw new Error("Invalid params");
    }
    if (options.path) {
      let loading = ora(chalk.green(`    Deploying on IPFS\n`)).start();
      cid = deployIpfs(options.path);
      loading.stop();
      console.log("- ✅  Content uploaded on IPFS");
    }
    let loading = ora(chalk.green(`Loading wallet`)).start();
    // Load wallet
    const secretKey = fs.readFileSync(options.wallet).toString();
    const signer = Keypair.fromSecretKey(Buffer.from(JSON.parse(secretKey)));
    loading.stop();
    console.log("- 🦄  Wallet loaded");
    loading = ora(
      chalk.green(`- 🪄  Updating account with content: ${options.content}`)
    ).start();
    options.content = options.path && cid ? cid : options.content;
    if (!options.content) throw new Error("Invalid params");
    const tx = await updateContent(
      connection,
      options.domain,
      options.content,
      signer
    );
    loading.stop();
    console.log("✔ ⚡️  Solana account updated");
    console.log(`✔ 🧭  Solana Explorer: https://explorer.solana.com/tx/${tx}`);
  } catch (e) {
    console.log("❌  An error has occurred:\n");
    // @ts-ignore
    console.log(e.stack || e.toString());
    process.exit(1);
  }
};

main();
