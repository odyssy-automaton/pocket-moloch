import React, { useContext, useEffect, useState } from 'react';

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
import WithdrawWethForm from './WithdrawWethForm';
import WithdrawEthForm from './WithdrawEthForm';
import Deploy from './Deploy';
import WrapEth from './WrapEth';
import ApproveWeth from './ApproveWeth';
import RageQuit from './RageQuit';
import DepositForm from './DepositForm';
import TwoButtonModal from '../../components/shared/TwoButtonModal';

const UserWallet = ({history}) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const { isShowing, toggle } = useModal();
  const [waitingSdk, setWaitingSdk] =useState(true);
  useEffect(()=>{
    (async () => {
      
        if (currentUser && currentUser.sdk) {
        
          const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
          setWaitingSdk(false);
          if (!_accountDevices.items.some(item=> item.device.address === currentUser.sdk.state.deviceAddress)) {
            toggle('newDeviceDetectedModal')
          } 
          else if (_accountDevices.items.length<2) {
            toggle('addDeviceModal')
          }
        }
    })()
    // eslint-disable-next-line
  },[currentUser]);
  return (
    <>
      {(loading  || waitingSdk) && <Loading />}
      {currentUser && currentUser.sdk && (<>
        <TwoButtonModal
            oneButton
            isShowing={isShowing.newDeviceDetectedModal}
            hide={() => toggle('newDeviceDetectedModal')}
            title="New Device or Browser"
            text="This device does not have access. You need to add it."
            handleConfirm={()=>history.push('/account-recovery')}
          />
          <TwoButtonModal
            oneButton
            isShowing={isShowing.addDeviceModal}
            hide={() => toggle('addDeviceModal')}
            title="Secure your account"
            text="You need to add at least one more recovery option"
            handleConfirm={()=>history.push('/account-recovery')}
          />
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
              <button onClick={() => toggle('wrapForm')}>Wrap ETH</button>
            )}

            <Modal
              isShowing={isShowing.wrapForm}
              hide={() => toggle('wrapForm')}
            >
              <WrapEth />
            </Modal>
            {currentWallet.state === 'Deployed' && (
              <button onClick={() => toggle('allowanceForm')}>
                Approve wETH
              </button>
            )}
            <Modal
              isShowing={isShowing.allowanceForm}
              hide={() => toggle('allowanceForm')}
            >
              <ApproveWeth />
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
            onClick={() => toggle('sendWeth')}
            >Send wETH</button>
            )}
            <Modal
              isShowing={isShowing.sendWeth}
              hide={() => toggle('sendWeth')}
            >
              <WithdrawWethForm />
            </Modal>
            
            {currentWallet.state === 'Deployed' && (
              <button
                className="Button--Tertiary"
                onClick={() => toggle('rageForm')}
              >
                Rage Quit (╯°□°）╯︵ ┻━┻
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
      </>)}
      <UserTransactions />
    </>
  );
};
export default UserWallet;
