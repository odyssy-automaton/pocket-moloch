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

3. Amplify sync

Update your amplify config files

```bash
$ amplify env pull
```

### Linting

Set up auto-linting and prettier to be run on file save or in real-time in your IDE:
[VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

### deploy

#### dev
```bash
$ yarn build && aws s3 sync build/ s3://<your s3> && aws cloudfront create-invalidation --distribution-id <your distribution id> --paths /\*
```


### TODO: add documentation on serverless init

