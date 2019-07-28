const dev = {
  GRAPH_NODE_URI:
    'https://api.thegraph.com/subgraphs/name/odyssy-automaton/metacarteldaokovan', // replace with subgraph for your moloch
  INFURA_URI: 'https://kovan.infura.io/v3/<your infura key>', // replace with your infura key
  CONTRACT_ADDRESS: '<your moloch test net address>', // replace with your moloch testnet address
  WETH_CONTRACT_ADDRESS: '0xd0a1e359811322d97991e03f863a0c30c2cf029c', // kovan weth address (change if on different network)
  DAI_CONTRACT_ADDRESS: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2', // kovan dai address (change if on different network)
  QR_HOST_URL: '<your host>', // replace with your testnet host ex. https://kovan-mcdao.odyssy.io'
  SDK_ENV: 'Kovan', // replace network for sdk if not Kovan
  s3: {
    REGION: 'us-east-1',
    BUCKET: '<your s3 bucket information>', // replace your s3 bucket information
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_<pool id>', // replace your pool id
    APP_CLIENT_ID: '<your cognito information>',
    IDENTITY_POOL_ID: '<your cognito information>', // replace with your cognito information
  },
};

const prod = {
  GRAPH_NODE_URI:
    'https://api.thegraph.com/subgraphs/name/jamesyoung/metacarteldao', // replace with subgraph for your moloch
  INFURA_URI: 'https://mainnet.infura.io/v3/<your infura key>', // replace with your infura key
  CONTRACT_ADDRESS: '0x0372f3696fa7dc99801f435fd6737e57818239f2', // replace with your moloch address
  WETH_CONTRACT_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  DAI_CONTRACT_ADDRESS: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
  QR_HOST_URL: '<your host>', // replace with your host
  SDK_ENV: 'Main',
  s3: {
    REGION: 'us-east-1',
    BUCKET: '<your s3 bucket information>', // replace your s3 bucket information
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_<pool id>', // replace your pool id
    APP_CLIENT_ID: '227f6eifg563vdtgskdtlpptv2',
    IDENTITY_POOL_ID: '<your cognito information>', // replace with your cognito information
  },
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  ...config,
};
