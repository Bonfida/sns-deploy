# SNS Deploy

```
  ____    _   _   ____      ____                   _
 / ___|  | \ | | / ___|    |  _ \    ___   _ __   | |   ___    _   _
 \___ \  |  \| | \___ \    | | | |  / _ \ | '_ \  | |  / _ \  | | | |
  ___) | | |\  |  ___) |   | |_| | |  __/ | |_) | | | | (_) | | |_| |
 |____/  |_| \_| |____/    |____/   \___| | .__/  |_|  \___/   \__, |
                                          |_|                  |___/


â      Deploying on IPFS
- ð¦  Calculating size of buildâ¦
â ð  Directory build weighs 6.5 MiB.
- ð   Uploading and pinning to Infuraâ¦
â ð  Added and pinned to Infura with hash:
- â  Content uploaded on IPFS
- ð¦  Wallet loaded
â â¡ï¸  Solana account updated
â ð§­  Solana Explorer: https://explorer.solana.com/tx/5HdYkonKyjcTG5vLjSMCkjC71LHxidV7DW5XJpuzCg5QfuHt9wxKcNYrGP9xEew2NrLXV98fRnzt2EgbfL9DXEEH
```

Upload static website to IPFS pinning services and update your Solana Name Service Records.

```
yarn global add @bonfida/sns-deploy
```

```
npm i -g @bonfida/sns-deploy
```

Example

```
sns-deploy -d bonfida -w wallet.json -p build
```

### Options

- Domain (d): Domain name you own
- Solana Wallet (w): Path to the Solana Wallet that owns the domain name
- Path (p): Path to the folder you want to upload to IPFS
- Arweave Wallet (W): Path to your Arweave wallet (optional)

## IPFS

To deploy on IPFS, the CLI uses [ipfs-deploy](https://github.com/ipfs-shipyard/ipfs-deploy). By default it pins the content to Infura.

## Arweave

To deploy on Arweave, the CLI uses [arkb](https://github.com/textury/arkb).

## Solana Name Service

The CLI will update the content of Solana account of your **.sol** domain.
