const dev = {
  GRAPH_NODE_URI: process.env.REACT_APP_DEV_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_DEV_INFURA_URI, // replace with your infura key
  CONTRACT_ADDRESS: process.env.REACT_APP_DEV_CONTRACT_ADDRESS, // replace with your moloch testnet address
  WETH_CONTRACT_ADDRESS: process.env.REACT_APP_DEV_WETH_CONTRACT_ADDRESS, // kovan weth address (change if on different network)
  DAI_CONTRACT_ADDRESS: process.env.REACT_APP_DEV_DAI_CONTRACT_ADDRESS, // kovan dai address (change if on different network)
  SDK_ENV: process.env.REACT_APP_DEV_SDK_ENV, // replace network for sdk if not Kovan
  s3: {
    REGION: process.env.REACT_APP_DEV_S3_REGION,
    BUCKET: process.env.REACT_APP_DEV_S3_BUCKET,
  },
  cognito: {
    REGION: process.env.REACT_APP_DEV_COGNITO_REGION,
    USER_POOL_ID: process.env.REACT_APP_DEV_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_DEV_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_DEV_COGNITO_IDENTITY_POOL_ID,
  },
};

const prod = {
  GRAPH_NODE_URI: process.env.REACT_APP_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_INFURA_URI, // replace with your infura key
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS, // replace with your moloch address
  WETH_CONTRACT_ADDRESS: process.env.REACT_APP_WETH_CONTRACT_ADDRESS,
  DAI_CONTRACT_ADDRESS: process.env.REACT_APP_DAI_CONTRACT_ADDRESS,
  SDK_ENV: process.env.REACT_APP_SDK_ENV,
  s3: {
    REGION: process.env.REACT_APP_S3_REGION,
    BUCKET: process.env.REACT_APP_S3_BUCKET,
  },
  cognito: {
    REGION: process.env.REACT_APP_COGNITO_REGION,
    USER_POOL_ID: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    APP_CLIENT_ID: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
  },
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  ...config,
};
