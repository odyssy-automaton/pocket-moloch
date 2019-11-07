import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

import './StateModals.scss';
import useModal from './useModal';

import TwoButtonModal from './TwoButtonModal';
import Modal from './Modal';
import DepositFormInitial from '../account/DepositFormInitial';
import { WalletStatuses } from '../../utils/WalletStatus';
import Deploy from '../account/Deploy';

const StateModals = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  // Toggle functions
  const { isShowing, toggle, open } = useModal();
  const { history, location } = props;

  useEffect(() => {
    if (!currentUser) {
      console.log('no user', currentUser);
      return () => false;
    } 
    // remove this and go stright to deploy
    // else if (history.location.state && history.location.state.signUpModal) {
    //   // user just signed up
    //   open('signUpModal');
    // } 
    else {
      (async () => {
        console.log('currentWallet.status check', currentWallet.status);
        const status = currentWallet.status;

        switch (status) {
          case WalletStatuses.NotConnected:
              if (location.pathname !== '/account') {
                open('deviceNotConnectedModal');
              }
            break;
          case WalletStatuses.UnDeployedNeedsDevices:
            open('addDeviceModal');
            break;
          case WalletStatuses.UnDeployed:
            if (location.pathname !== '/account') {
              open('connectedUndeployed');
            }
            break;
          case WalletStatuses.LowGas:
            open('depositForm');
            break;
          case WalletStatuses.DeployedNeedsDevices:
            open('addDeviceModal');
            break;
          case WalletStatuses.DeployedNewDevice:
            open('newDeviceDetectedModal');
            break;
          default:
            break;
        }
      })();
    }
    // eslint-disable-next-line
  }, [currentWallet]);

  return (
    <>
      <Modal
        isShowing={isShowing.depositForm}
        hide={() => toggle('depositForm')}
      >
        <DepositFormInitial className="FlexCenter" />
      </Modal>
      <TwoButtonModal
        isShowing={isShowing.signUpModal}
        hide={() => toggle('signUpModal')}
        title="Account almost ready"
        text="You need to add at least one more recovery option"
        handleConfirm={() => history.push('/account-recovery')}
      />
      <Modal
        isShowing={isShowing.connectedUndeployed}
        hide={() => toggle('connectedUndeployed')}
      >
<p>
You are ready to deploy your account
        </p>
        <Deploy/>
      </Modal>
      {/* <TwoButtonModal
        isShowing={isShowing.connectedUndeployed}
        hide={() => toggle('connectedUndeployed')}
        title="You are ready to deploy your account"
        text="Lets Deploy"
        handleConfirm={() => {
          toggle('connectedUndeployed');
          history.push('/account');
        }}
      /> */}
      <Modal
        isShowing={isShowing.deviceNotConnectedModal}
        hide={() => toggle('deviceNotConnectedModal')}
      >
        <p>
          This device does not have access. Would you like to link it with a
          primary account on anoter device?
        </p>
        <button
          onClick={() => {
            toggle('deviceNotConnectedModal');
            history.push('/account');
          }}
        >
          Yes this
        </button>
        <p>
          Or have you lost your primary device and you would like to set up a
          new one?
        </p>
        <button
          onClick={() => {
            toggle('deviceNotConnectedModal');
            history.push('/advanced');
          }}
        >
          Yes lets do that.
        </button>
      </Modal>
      <TwoButtonModal
        isShowing={isShowing.newDeviceDetectedModal}
        hide={() => toggle('newDeviceDetectedModal')}
        title="New Device or Browser"
        text="This device does not have access. Would you like to add it?"
        handleConfirm={() => history.push('/account-recovery')}
      />
      <TwoButtonModal
        isShowing={isShowing.addDeviceModal}
        hide={() => toggle('addDeviceModal')}
        title="Secure your account"
        text="You need to add at least one more recovery option"
        handleConfirm={() => history.push('/account-recovery')}
      />
    </>
  );
};
export default withRouter(StateModals);
