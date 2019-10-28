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
        <div className="Header">
          <div className="WalletInfo">
              <CopyToClipboard
                onCopy={onCopy}
                text={currentUser.attributes['custom:account_address']}
              >
                <button className="Address Data">
                  <p>
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
              <p className="Status">account: {currentWallet.state || 'Checking Status'} device: 0x... state: ?</p>
          </div>
          <div className="ActionsDropdown">
            <div>Actions  <img src={Arrow} alt="arrow"/></div>
            <div className="ActionsDropdownContent">
              <div
                onClick={()=>toggle('depositForm')}
              >
                Deposit
              </div>
              {currentWallet.state === WalletStatuses.Deployed && (
              <div onClick={() => toggle('wrapForm')}>Wrap ETH</div>
            )}
            {currentWallet.state === WalletStatuses.Deployed && (
              <div onClick={() => toggle('allowanceForm')}>
                Approve wETH
              </div>
            )}
            <Deploy />
            <ConnectAccount />
            {currentWallet.state === WalletStatuses.Deployed && (
              <div
                className="Button--Primary"
                onClick={() => toggle('sendEth')}
              >
                Send ETH
              </div>
            )}
            {currentWallet.state === WalletStatuses.Deployed && (
              <div
                className="Button--Primary"
                onClick={() => toggle('sendWeth')}
              >
                Unwrap wETH
              </div>
            )}
            {currentWallet.state === WalletStatuses.Deployed && (
              <div
                className="Button--Tertiary"
                onClick={() => toggle('rageForm')}
              >
                Rage Quit (╯°□°）╯︵ ┻━┻
              </div>
            )}
            {currentWallet.state === WalletStatuses.Deployed
            && 
              <div onClick={()=>window.open(`https://daohaus.club/dao/${process.env.REACT_APP_CONTRACT_ADDRESS}`,'_blank')}>Update delegate</div>
            }
            </div>
          </div>
        </div>
        <div className="SwitchHeader">
          <div className={headerSwitch === 'Balances'? 'SelectedElement':''} onClick={()=>setHeaderSwitch('Balances')}>Balances</div>
          <div className={headerSwitch === 'Transactions'? 'SelectedElement':''} onClick={()=>setHeaderSwitch('Transactions')}>Transactions</div>
          <div className={headerSwitch === 'Devices'? 'SelectedElement':''} onClick={()=>setHeaderSwitch('Devices')}>Devices</div>
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
              <p className="Data">{currentWallet.eth}</p>
            </div>
            <div className="Item">
              <p>wETH</p>
              <p className="Data">{currentWallet.weth}</p>
            </div>
            <div className="Item">
              <p>wETH Allowance</p>
              <p className="Data">{currentWallet.allowance}</p>
            </div>
          </div>}
          {headerSwitch==='Transactions' &&
          <UserTransactions />}
          {headerSwitch==='Devices' && !!Object.keys(parsedNamedDevices).length &&
          <div className="Balances">
            <div className="Item">
              <p>Primary key</p>
              <p className="Data">{Object.keys(parsedNamedDevices).pop()}</p>
            </div>
            {Object.keys(parsedNamedDevices).slice(0,-1).map(item => 
              <div className="Item" key={item}>
                <p>Secondary key</p>
                <p className="Data">{item}</p>
              </div>
            )}
          </div>
          }
        </div>
        {/* <div className="Wallet__Footer">
          <p className="Powered">&nbsp;Powered by <a href="http://abridged.io">Abridged</a></p>
        </div> */}
      </div>
  );
};

export default UserBalance;
