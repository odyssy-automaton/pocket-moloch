import React, { useState, useEffect, createContext } from 'react';
import { Auth } from 'aws-amplify';

import {
  SdkEnvironmentNames,
  getSdkEnvironment,
  createSdk,
} from '@archanova/sdk';

import config from '../config';

import useInterval from '../utils/PollingUtil';
import WethService from '../utils/WethService';
import Web3Service from '../utils/Web3Service';
import McDaoService from '../utils/McDaoService';
import BcProcessorService from '../utils/BcProcessorService';

export const CurrentUserContext = createContext();
export const CurrentWalletContext = createContext();
// export const NameContext = createContext('MetaCartel DAO');
export const LoaderContext = createContext(false);
export const RefreshContext = createContext();

// main store of global state
const Store = ({ children }) => {
  // store of aws auth information and sdk
  const [currentUser, setCurrentUser] = useState();
  // stores user wallet balances and shares
  const [currentWallet, setCurrentWallet] = useState({
    eth: 0,
    weth: 0,
    allowamce: 0,
    shares: 0,
    state: null,
    devices: null,
    _txList: [],
    addrByBelegateKey: null,
  });

  // const [name, setName] = useState('MetaCartel DAO');
  const [loading, setLoading] = useState(false);
  // set initial delay to 1 second to update sdk balance
  const [delay, setDelay] = useState(1000);
  // track number of times to do a 1 second update
  const [numTries, setNumTries] = useState(0);

  const wethService = new WethService();
  const web3Service = new Web3Service();
  const daoService = new McDaoService();
  const bcProcessorService = new BcProcessorService();

  useEffect(() => {
    // runs on app load, sets up user auth and sdk
    const currentUser = async () => {
      try {
        // check if user is authenticated
        // try will throw if not
        const user = await Auth.currentAuthenticatedUser();
        // attributes are only updated here until re-auth
        // so grab attributes from here
        const attributes = await Auth.currentUserInfo();
        const realuser = { ...user, ...{ attributes: attributes.attributes } };
        setCurrentUser(realuser);

        // attach sdk
        // console.log("in load: realuser", realuser);
        const sdkEnv = getSdkEnvironment(
          SdkEnvironmentNames[`${config.SDK_ENV}`],
        );
        // check or set up local storage and initialize sdk connection
        const sdk = new createSdk(
          sdkEnv.setConfig('storageAdapter', localStorage),
        );
        await sdk.initialize();
        // check if account is connected in local storage

        const accounts = await sdk.getConnectedAccounts();
        // if the there is an account connect it
        // this should never not exsist, it is added to AWS on first signin
        if (accounts.items.length) {
          await sdk.connectAccount(
            realuser.attributes['custom:account_address'],
          );
        }
        // store sdk instance (needed?)
        //setUserSdk(sdk);
        // add sdk instance to current user
        setCurrentUser({ ...realuser, ...{ sdk } });
      } catch (err) {
        console.log(err);
      }
    };

    currentUser();
  }, []);

  //global polling service
  useInterval(async () => {
    // run on interval defined by $delay only if authenticated
    if (currentUser) {
      let accountDevices = null;
      // get account address from aws
      const acctAddr = currentUser.attributes['custom:account_address'];
      // get delegate key from contract to see if it is different
      const addrByBelegateKey = await daoService.memberAddressByDelegateKey(
        acctAddr,
      );

      // get weth balance and allowance of contract
      const wethWei = await wethService.balanceOf(acctAddr);
      const allowanceWei = await wethService.allowance(
        acctAddr,
        daoService.contractAddr,
      );

      // get member shares of dao contract
      const member = await daoService.members(addrByBelegateKey);
      // shares will be 0 if not a member, could also be 0 if rage quit
      // TODO: check membersheip a different way
      const shares = parseInt(member.shares);
      // convert from wei to eth
      const weth = web3Service.fromWei(wethWei);
      const allowance = web3Service.fromWei(allowanceWei);
      // use attached sdk
      const sdk = currentUser.sdk;

      // set initial values of contract wallet
      // these are set to zero every interval, maybe needed when user logs out
      let ethWei = 0;
      let eth = 0;
      let state = 'Started';

      // state.account will be undefined if not connected
      // should be loading durring this?
      //     it seems the sdk loads and then it takes a bit to get the account info
      //     could i check earlier that there is no account info
      //     not with getConnectedDevices because it errors before account connected
      if (sdk && sdk.state.account) {
        console.log('connected state', sdk.state);

        ethWei = (sdk && sdk.state.account.balance.real.toString()) || 0;
        eth = web3Service.fromWei(ethWei);
        // state.account.state undefined if still connecting?
        // will be 'Created' or 'Delpoyed'
        state = (sdk && sdk.state.account.state);
        // check acount devices on sdk
        accountDevices = await sdk.getConnectedAccountDevices();
        
        // set delay to 10 seconds after sdk balance is updated
        setDelay(10000);
      } else {
        console.log('not connected, try again', sdk);
        state = 'Connecting';

        setNumTries(numTries + 1);
        // console.log('tries', numTries);
        // if sdk is not connected withen 5 seconds it probably is a new account
        // should be loading durring this?
        // TODO: need a better way to check this
        if (numTries === 5) {
          state = 'Not Connected';
          

          setDelay(10000);
        }
      }

      // check transactions left over in bcprocessor storage
      const _txList = bcProcessorService.getTxList(acctAddr);
      const pendingList = bcProcessorService.getTxPendingList(acctAddr);

      if (pendingList.length) {
        for (let i = 0; i < pendingList.length; i++) {
          await bcProcessorService.checkTransaction(pendingList[i].tx);
        }
      }

      // set state
      setCurrentWallet({
        ...currentWallet,
        ...{
          weth,
          allowance,
          eth,
          state,
          shares,
          accountDevices,
          _txList,
          addrByBelegateKey,
        },
      });
    }
  }, delay);

  return (
    // <NameContext.Provider value={[name, setName]}>
    <LoaderContext.Provider value={[loading, setLoading]}>
      <RefreshContext.Provider value={[delay, setDelay]}>
        <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
          <CurrentWalletContext.Provider
            value={[currentWallet, setCurrentWallet]}
          >
            {children}
          </CurrentWalletContext.Provider>
        </CurrentUserContext.Provider>
      </RefreshContext.Provider>
    </LoaderContext.Provider>
    // </NameContext.Provider>
  );
};

export default Store;
