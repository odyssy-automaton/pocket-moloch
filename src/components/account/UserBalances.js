import React, { useContext, useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import { Auth } from 'aws-amplify';
import { truncateAddr } from '../../utils/Helpers';
import Arrow from '../../assets/DropArrow.svg'
import './UserWallet.scss';
import useInterval from '../../utils/PollingUtil';
import Deploy from './Deploy'
import UserTransactions from './UserTransactions';

import ConnectAccount from './ConnectAccount';
import { WalletStatuses } from '../../utils/WalletStatus';
import AccountList from '../../views/account/AccountList';
const UserBalance = ({toggle}) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
  const [headerSwitch, setHeaderSwitch] = useState('Balances');
  const [parsedNamedDevices, setParsedNamedDevices] = useState({});

  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.sdk) {
        try {
          const user = await Auth.currentAuthenticatedUser();
          const userAttributes = await Auth.userAttributes(user);
          if (
            userAttributes.find((item) => item.Name === 'custom:named_devices')
          ) {
            setParsedNamedDevices(
              JSON.parse(
                userAttributes.find(
                  (item) => item.Name === 'custom:named_devices',
                ).Value,
              ),
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
    // eslint-disable-next-line
  }, [currentUser]);

  const onCopy = () => {
    setDelay(2500)
    setCopied(true)
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay)
  return (
      <div className="Wallet">
        { currentWallet.state != 'Deployed' && (
        <div className="WalletOverlay FlexCenter">
          <div className="Contents FlexCenter">
            <h2>Account almost ready</h2>
            <p>You still need to <span className="StrikeThrough">(1) Send some Eth to</span> (2) Deploy the wallet.</p>
            <button>Continue Setup</button>
          </div>
        </div>
        )}
        <div className="Header">
          <div className="WalletInfo">
            <p className={"Status " + (currentWallet.state != 'Deployed' ? 'Disconnected' : '')}>{currentWallet.state || 'Checking Status'}</p>
              <CopyToClipboard
                onCopy={onCopy}
                text={currentUser.attributes['custom:account_address']}
              >
                <button className="Address Data">
                  
                  <p className="Data">
                    {truncateAddr(currentUser.attributes['custom:account_address'])}
                  </p>{' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
                  </svg>
                  { copied && (
                  <div className="Flash">
                    <p>Copied!</p>
                  </div>
                  )}
                </button>
              </CopyToClipboard>
          </div>
          <div className="ActionsDropdown">
            <button>Actions  <img src={Arrow} alt="arrow"/></button>
            <div className="ActionsDropdownContent">
              <button
                onClick={()=>toggle('depositForm')}
                className="Button--Secondary"
              >
                Deposit
              </button>
              {currentWallet.state === WalletStatuses.Deployed && (
              <button onClick={() => toggle('wrapForm')}>Wrap ETH</button>
            )}
            {currentWallet.state === WalletStatuses.Deployed && (
              <button className="Button--Primary" onClick={() => toggle('allowanceForm')}>
                Approve wETH
              </button>
            )}
            <Deploy />
            <ConnectAccount />
            <button onClick={()=>window.open('https://uniswap.exchange/swap','_blank')}>Uniswap</button>
            {currentWallet.state === WalletStatuses.Deployed && (
              <button
               className="Button--Secondary"
                onClick={() => toggle('sendEth')}
              >
                Send ETH
              </button>
            )}
            {currentWallet.state === WalletStatuses.Deployed && (
              <button
                className="Button--Secondary"
                onClick={() => toggle('sendWeth')}
              >
                Send wETH
              </button>
            )}
            {currentWallet.state === WalletStatuses.Deployed
            && 
              <div onClick={()=>window.open(`https://daohaus.club/dao/${process.env.REACT_APP_CONTRACT_ADDRESS}`,'_blank')}>Update delegate</div>
            }
            </div>
          </div>
        </div>
        <div className="SwitchHeader">
          <button className={headerSwitch === 'Balances'? 'Tab SelectedElement':''} onClick={()=>setHeaderSwitch('Balances')}>Balances</button>
          <button className={headerSwitch === 'Transactions'? 'Tab SelectedElement':''} onClick={()=>setHeaderSwitch('Transactions')}>Transactions</button>
          <button className={headerSwitch === 'Accounts'? 'Tab SelectedElement':''} onClick={()=>setHeaderSwitch('Accounts')}>Accounts</button>
        </div>
        <div className="Contents">
        {headerSwitch === 'Balances' && 
          <div className="Balances">
            <div className="Item">
              <p>Shares</p>
              <p className="Data">{currentWallet.shares}</p>
            </div>
            <div className="Item">
              <p>ETH</p>
              <p className="Data">{currentWallet.eth}
              { currentWallet.eth < 0.02 && (
              <span className="Danger Note Gas">!</span>
              )}
              </p>
            </div>
            <div className="Item">
              <p>wETH</p>
              <p className="Data">{currentWallet.weth}</p>
            </div>
            <div className="Item">
              <p>wETH Allowance</p>
              <p className="Data">{currentWallet.allowance} 
              { currentWallet.weth > currentWallet.allowance && (
                  <span className="Danger Note Allowance">!</span>
              )}</p>
            </div>
          </div>}
          {headerSwitch==='Transactions' &&
          <UserTransactions />}
          {headerSwitch==='Accounts' && !!Object.keys(parsedNamedDevices).length &&
           <AccountList/>
          }
        </div><div className="Wallet__Footer">
          <p className="Powered">&nbsp;Powered by <a href="http://abridged.io">Abridged</a></p>
        </div>
      </div>
  );
};

export default UserBalance;
