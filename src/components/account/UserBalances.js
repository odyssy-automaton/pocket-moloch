import React, { useContext, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import { truncateAddr } from '../../utils/Helpers';

import './UserWallet.scss';
import useInterval from '../../utils/PollingUtil';

const UserBalance = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
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
          <p className="Status">{currentWallet.state || 'Checking Status'}</p>
        </div>
        <div className="Contents">
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
              <p>DAI</p>
              <p className="Data">{currentWallet.dai}</p>
            </div>
            <div className="Item">
              <p>DAI Allowance</p>
              <p className="Data">{currentWallet.allowance}</p>
            </div>
          </div>
        </div>
        <div className="Wallet__Footer">
          <p className="Powered">&nbsp;{/*Powered by <a href="http://abridged.io">Abridged</a>*/}</p>
        </div>
      </div>
  );
};

export default UserBalance;
