# SNS Deploy

Upload static website to IPFS pinning services and update your Solana Name Service Records.

```
yarn add global @bonfida/sns-deploy
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
- Wallet (w): Wallet that owns the domain name
- Path (p): Path to the folder you want to upload to IPFS

## IPFS

To deploy on IPFS, the CLI uses [ipfs-deploy](https://github.com/ipfs-shipyard/ipfs-deploy). By default it pins the content to Infura.

## Solana Name Service

The CLI will update the content of Solana account of your **.sol** domain.
