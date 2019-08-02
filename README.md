# YangDAO

Bare bones, mobile-first set up for Moloch frontend with Abridged Wallet SDK by Odyssy.

## Development

1. Install dependencies

```bash
$ yarn install
```

2. Run a dev server

```bash
$ yarn start
```

### Linting

Set up auto-linting and prettier to be run on file save or in real-time in your IDE:
[VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

### Deployment instructions

Assumes the moloch contracts are forked and deployed to mainnet and kovan if you need testnet support.

#### 1. Fork and deploy the subgraph(s)

https://github.com/MolochVentures/moloch-monorepo/tree/master/packages/subgraph

Update the contract address(es) and deploy:
https://thegraph.com/docs/deploy-a-subgraph

#### 2. Build the AWS resources

Use the serverless framework to get this started. You'll need to install the serveless cli:
https://serverless.com/framework/docs/getting-started/

This will build a Cognito indentity pool and user pool, the s3 bucket for storing proposal and member metadata, the s3 bucket for hosting the build files and the CloudFront distribution for the front end hosting.

Update the service name in serveless.yml ln 1

```yaml
service: <name of your app>
```

Build the resources:

```bash
staging/kovan:
$ serverless deploy

prod/mainnet
$ serverless deploy --stage prod
```

Sync production build to S3

```bash
build the app:
$ yarn build

push to s3:
$ sync build/ s3://<your s3>

invalidate cloudfront cache:
$ aws cloudfront create-invalidation --distribution-id <your distribution id> --paths /\*

helper cmd:
$ yarn build && aws s3 sync build/ s3://<your s3> && aws cloudfront create-invalidation --distribution-id <your distribution id> --paths /\*
```
