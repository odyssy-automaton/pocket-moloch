const dev = {
  GRAPH_NODE_URI: process.env.REACT_APP_DEV_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_DEV_INFURA_URI, // replace with your infura key
  CONTRACT_ADDRESS: process.env.REACT_APP_DEV_CONTRACT_ADDRESS, // replace with your moloch testnet address
  WETH_CONTRACT_ADDRESS: process.env.REACT_APP_DEV_WETH_CONTRACT_ADDRESS, // kovan weth address (change if on different network)
  DAI_CONTRACT_ADDRESS: process.env.REACT_APP_DEV_DAI_CONTRACT_ADDRESS, // kovan dai address (change if on different network)
  QR_HOST_URL: process.env.REACT_APP_DEV_QR_HOST_URL, // replace with your testnet host ex. https://kovan-mcdao.odyssy.io'
  SDK_ENV: process.env.REACT_APP_DEV_SDK_ENV, // replace network for sdk if not Kovan
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'mc-dao-app-v3-dev-metadatabucket-1ctea4adtwbn8',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_urbgTJlEt',
    APP_CLIENT_ID: '25o36j2p0n687h9u81vnpbht3b',
    IDENTITY_POOL_ID: 'us-east-1:bdc6726f-0193-463c-a003-521d6fbbbdc9',
  },
};

const prod = {
  GRAPH_NODE_URI: process.env.REACT_APP_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_INFURA_URI, // replace with your infura key
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS, // replace with your moloch address
  WETH_CONTRACT_ADDRESS: process.env.REACT_APP_WETH_CONTRACT_ADDRESS,
  DAI_CONTRACT_ADDRESS: process.env.REACT_APP_DAI_CONTRACT_ADDRESS,
  QR_HOST_URL: process.env.REACT_APP_QR_HOST_URL, // replace with your host
  SDK_ENV: process.env.REACT_APP_SDK_ENV,
  s3: {
    REGION: 'us-east-1',
    BUCKET: 'mc-dao-app-v3-prod-metadatabucket-1myuwdvfyna9r',
  },
  cognito: {
    REGION: 'us-east-1',
    USER_POOL_ID: 'us-east-1_UR1za6mRG',
    APP_CLIENT_ID: '227f6eifg563vdtgskdtlpptv2',
    IDENTITY_POOL_ID: 'us-east-1:878fbd76-6a42-4d30-9a91-6ea9fa1e4dfb',
  },
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  ...config,
};
