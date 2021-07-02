import { updateNameRegistryData } from "@solana/spl-name-service";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { signAndSendTransactionInstructions } from "./utils";

export const SOL_TLD_AUTHORITY = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export const updateContent = async (
  connection: Connection,
  domainName: string,
  content: string,
  signer: Keypair
) => {
  const buf = Buffer.from(content);
  const buffers = [buf, Buffer.alloc(1_000 - buf.length)];
  const instructions = await updateNameRegistryData(
    connection,
    domainName,
    0,
    Buffer.concat(buffers),
    undefined,
    SOL_TLD_AUTHORITY
  );
  const tx = await signAndSendTransactionInstructions(connection, [], signer, [
    instructions,
  ]);
  return tx;
};
