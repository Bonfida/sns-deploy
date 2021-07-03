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
import { postIpfs2Arweave } from "./utils";

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
        W: {
          alias: "arweave-wallet",
          describe: "Path to the Arweave wallet",
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
  arweaveWallet: argv.W as string,
};

if (options.domain.includes(".sol")) {
  options.domain = options.domain.slice(0, -4);
}

export const deployIpfs = (path: string) => {
  const cmd = `npx ipfs-deploy ${path} -C -O`;
  const cid = execSync(cmd).toString();
  return cid.trim();
};

export const deployArweave = (path: string, wallet: string) => {
  const cmd = `npx @textury/arkb deploy ${path} --wallet ${wallet} --auto-confirm`;
  const hash = execSync(cmd).toString();
  return hash.split("https://arweave.net/")[1];
};

export const main = async () => {
  let cid: null | string = null; // IPFS
  let hash: null | string = null; // Arweave
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
      // Deploy on IPFS
      let loading = ora(chalk.green(`    Deploying on IPFS\n`)).start();
      cid = deployIpfs(options.path);
      loading.stop();
      console.log("- ✅  Content uploaded on IPFS");
      // Deploy on Arweave
      if (!!options.arweaveWallet) {
        let loading = ora(chalk.green(`    Deploying on Arweave\n`)).start();
        hash = deployArweave(options.path, options.arweaveWallet);
        loading.stop();
        console.log("- ✅  Content uploaded on Arweave");
      }
    }
    let loading = ora(chalk.green(`Loading Solana wallet\n`)).start();
    // Load wallet
    const secretKey = fs.readFileSync(options.wallet).toString();
    const signer = Keypair.fromSecretKey(Buffer.from(JSON.parse(secretKey)));
    loading.stop();
    console.log("- 🦄  Wallet loaded");
    if (cid && hash) {
      options.content = `ipfs=${cid}|arweave=${hash}`;
    } else if (cid) {
      options.content = `ipfs=${cid}`;
    }
    if (!options.content) throw new Error("Invalid params");
    loading = ora(
      chalk.green(`- 🪄  Updating account with content: ${options.content}`)
    ).start();
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
