import React, { useContext, useEffect, useState } from 'react';

import useModal from '../shared/useModal';
import Modal from '../shared/Modal';
import CopyToClipboard from 'react-copy-to-clipboard';
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
import useInterval from '../../utils/PollingUtil';
import DeployDevices from './DeployDevices';
const UserWallet = ({history}) => {

  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
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
          console.log(currentUser.sdk.state.account.balance.real.toString()/1000000000000000000);
          if (!_accountDevices.items.some(item=> item.device.address === currentUser.sdk.state.deviceAddress)) {
            toggle('newDeviceDetectedModal')
          } 
          else if (_accountDevices.items.length<2) {
            toggle('addDeviceModal')
          }
          else if (currentUser.sdk.state.account.state==='Created'&&((currentUser.sdk.state.account.balance.real.toString()/1000000000000000000)<0.001)){
            toggle('depositModal')
          }
        }
    })()
    // eslint-disable-next-line
  },[currentUser]);
  const onCopy = () => {
    setDelay(2500);
    setCopied(true);
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay);
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
          <Modal
            isShowing={isShowing.depositModal}
            hide={() => toggle('depositModal')}
              >
               {copied && (
        <div className="Flash">
          <p>Copied!</p>
        </div>
      )}
            <h3>Deposit</h3>
            <p>To complete setup of your account, please deposit 0.05 ETH to cover costs of deployment.</p>
            <p>{currentUser.sdk.state.account.address}</p>
            <CopyToClipboard onCopy={onCopy} text={currentUser.sdk.state.account.address}>
                <button className="Address">
                  Copy Link
                  <svg
                    className="IconRight"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4H8c-1.1 0-1.99.9-1.99 2L6 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V11l-6-6zM8 21V7h6v5h5v9H8z" />
                  </svg>
                </button>
              </CopyToClipboard>
          </Modal>
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

            <DeployDevices />
            
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
