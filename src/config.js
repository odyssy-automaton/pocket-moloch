const dev = {
  GRAPH_NODE_URI: process.env.REACT_APP_DEV_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_DEV_INFURA_URI, // replace with your infura key
  CONTRACT_ADDRESS: process.env.REACT_APP_DEV_CONTRACT_ADDRESS, // replace with your moloch testnet address
  WETH_CONTRACT_ADDRESS: process.env.REACT_APP_DEV_WETH_CONTRACT_ADDRESS, // kovan weth address (change if on different network)
  DAI_CONTRACT_ADDRESS: process.env.REACT_APP_DEV_DAI_CONTRACT_ADDRESS, // kovan dai address (change if on different network)
  QR_HOST_URL: process.env.REACT_APP_DEV_QR_HOST_URL, // replace with your testnet host ex. https://kovan-mcdao.odyssy.io'
  SDK_ENV: process.env.REACT_APP_DEV_SDK_ENV, // replace network for sdk if not Kovan
  s3: process.env.REACT_APP_DEV_S3,
  cognito: process.env.REACT_APP_DEV_COGNITO,
};

const prod = {
  GRAPH_NODE_URI: process.env.REACT_APP_GRAPH_NODE_URI, // replace with subgraph for your moloch
  INFURA_URI: process.env.REACT_APP_INFURA_URI, // replace with your infura key
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS, // replace with your moloch address
  WETH_CONTRACT_ADDRESS: process.env.REACT_APP_WETH_CONTRACT_ADDRESS,
  DAI_CONTRACT_ADDRESS: process.env.REACT_APP_DAI_CONTRACT_ADDRESS,
  QR_HOST_URL: process.env.REACT_APP_QR_HOST_URL, // replace with your host
  SDK_ENV: process.env.REACT_APP_SDK_ENV,
  s3: process.env.REACT_APP_S3,
  cognito: process.env.REACT_APP_COGNITO,
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  ...config,
};
