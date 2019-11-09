import React, { useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

import './StateModals.scss';
import useModal from './useModal';

import Modal from './Modal';
import DepositFormInitial from '../account/DepositFormInitial';
import { WalletStatuses } from '../../utils/WalletStatus';
import Deploy from '../account/Deploy';
import DepositForm from '../account/DepositForm';

const StateModals = (props) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  // Toggle functions
  const { isShowing, toggle, open, openOnce } = useModal();
  const { location } = props;

  useEffect(() => {
    if (!currentUser) {
      console.log('no user', currentUser);
      return () => false;
    } else {
      (async () => {
        console.log('currentWallet.status check', currentWallet.status);
        const status = currentWallet.status;

        switch (status) {
          case WalletStatuses.UnDeployed:
            openOnce('connectedUndeployed');
            break;
          case WalletStatuses.LowGasForDeploy:
            openOnce('depositFormInitial');
            break;
          case WalletStatuses.LowGas:
            openOnce('depositForm');
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
        isShowing={isShowing.depositFormInitial}
        hide={() => toggle('depositFormInitial')}
      >
        <DepositFormInitial className="FlexCenter" />
      </Modal>
      <Modal
        isShowing={isShowing.depositForm}
        hide={() => toggle('depositForm')}
      >
        <DepositForm className="FlexCenter" />
      </Modal>
      <Modal
        isShowing={isShowing.connectedUndeployed}
        hide={() => toggle('connectedUndeployed')}
      >
        <p>You are ready to deploy your account</p>
        <Deploy />
      </Modal>
    </>
  );
};
export default withRouter(StateModals);
