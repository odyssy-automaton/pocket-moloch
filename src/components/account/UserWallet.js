import React, { useContext } from 'react';

import useModal from '../shared/useModal';
import Modal from '../shared/Modal';

import ConnectAccount from './ConnectAccount';

import {
  CurrentUserContext,
  LoaderContext,
  CurrentWalletContext,
} from '../../contexts/Store';

import Loading from '../shared/Loading';
import './UserWallet.scss';
import UserBalance from './UserBalances';
import UserTransactions from './UserTransactions';
import WithdrawDaiForm from './WithdrawDaiForm';
import WithdrawEthForm from './WithdrawEthForm';
import Deploy from './Deploy';
import ApproveDai from './ApproveDai';
import RageQuit from './RageQuit';
import DepositForm from './DepositForm';

const UserWallet = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const { isShowing, toggle } = useModal();

  return (
    <>
      {loading && <Loading />}
      {currentUser && currentUser.sdk && (
        <div className="UserWallet">
          <UserBalance />
          <div className="Actions Pad">
            <h3>Actions</h3>
            <button
              className="Button--Primary"
              onClick={() => toggle('depositForm')}
            >
              Deposit
              <svg
                className="IconRight"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path fill="none" d="M0 0h24v24H0V0z" />
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
              </svg>
            </button>
            <Modal
              isShowing={isShowing.depositForm}
              hide={() => toggle('depositForm')}
            >
              <DepositForm className="FlexCenter" />
            </Modal>

            <Deploy />
            
            <ConnectAccount />

            {currentWallet.state === 'Deployed' && (
              <button onClick={() => toggle('allowanceForm')}>
                Approve DAI
              </button>
            )}
            <Modal
              isShowing={isShowing.allowanceForm}
              hide={() => toggle('allowanceForm')}
            >
              <ApproveDai />
            </Modal>

            {currentWallet.state === 'Deployed' && (
            <button
            className="Button--Primary"
            onClick={() => toggle('sendEth')}
            >Send ETH</button>
            )}
            <Modal
              isShowing={isShowing.sendEth}
              hide={() => toggle('sendEth')}
            >
              <WithdrawEthForm />
            </Modal>

            {currentWallet.state === 'Deployed' && (
            <button
            className="Button--Primary"
            onClick={() => toggle('sendDai')}
            >Send DAI</button>
            )}
            <Modal
              isShowing={isShowing.sendDai}
              hide={() => toggle('sendDai')}
            >
              <WithdrawDaiForm />
            </Modal>
            
            {currentWallet.state === 'Deployed' && (
              <button
                className="Button--Tertiary"
                onClick={() => toggle('rageForm')}
              >
                Rage Quit
              </button>
            )}
            <Modal
              isShowing={isShowing.rageForm}
              hide={() => toggle('rageForm')}
            >
              <RageQuit />
            </Modal>
            {/*
            <Link className="AltOption" to="/advanced">
              Advanced
            </Link>
            */}
          </div>
        </div>
      )}
      <UserTransactions />
    </>
  );
};
export default UserWallet;
