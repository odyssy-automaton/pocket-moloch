import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

import './StateModals.scss';
import useModal from './useModal';

import TwoButtonModal from './TwoButtonModal';

const StateModals = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  // Toggle functions
  const { isShowing, toggle, open } = useModal();
  const {
    history,
  } = props;

  useEffect(() => {

    if(!currentUser){
      console.log('no user', currentUser)
      return () => false;
    }
     else if (history.location.state && history.location.state.signUpModal) {
      // user just signed up
      open('signUpModal');
    } else {
      (async () => {
        console.log('currentWallet.state', currentWallet.state);
        const _accountDevices = currentWallet.accountDevices;

        if (currentWallet.state && currentWallet.state === 'Not Connected') {
          open('deviceNotConnectedModal');
          return false;
        }

        if (
          _accountDevices &&
          _accountDevices.items.length > 1 &&
          (currentWallet.state && currentWallet.state === 'Created')
        ) {
          open('connectedUndeployed');
          return false;
        }

        if (currentWallet.state && currentWallet.state === 'Created') {
          console.log('[][][][][][', _accountDevices);

          if (!_accountDevices) {
            open('addDeviceModal');
            return false;
          }

          if (
            currentWallet.state === 'Deployed' &&
            _accountDevices &&
            _accountDevices.items.length < 2
          ) {
            open('addDeviceModal');
            return false;
          }

          if (
            currentWallet.state === 'Deployed' &&
            _accountDevices &&
            !_accountDevices.items.some(
              (item) =>
                item.device.address === currentUser.sdk.state.deviceAddress,
            )
          ) {
            open('newDeviceDetectedModal');
            return false;
          }
        }
      })();
    }
    // eslint-disable-next-line
  }, [currentWallet]);

  return (
    <>
      <TwoButtonModal
        isShowing={isShowing.signUpModal}
        hide={() => toggle('signUpModal')}
        title="Account almost ready"
        text="You need to add at least one more recovery option"
        handleConfirm={() => history.push('/account-recovery')}
      />
      <TwoButtonModal
        isShowing={isShowing.connectedUndeployed}
        hide={() => toggle('connectedUndeployed')}
        title="You are ready to deploy your account"
        text="You need to add some gas and deploy"
        handleConfirm={() => history.push('/account')}
      />
      <TwoButtonModal
        isShowing={isShowing.deviceNotConnectedModal}
        hide={() => toggle('deviceNotConnectedModal')}
        title="Would you like to authorize this device?"
        text="You must authorize from an already connected Device"
        handleConfirm={() => history.push('/connect-account')}
      />
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
