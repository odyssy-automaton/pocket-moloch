import React, { useContext } from 'react';

import { LoaderContext, CurrentWalletContext } from '../../contexts/Store';
import Loading from '../shared/Loading';
import Modal from '../shared/Modal';
import ExportKeyStore from './ExportKeyStore';
import SendAccountTransaction from './SendAccountTransaction';
import ConnectAccount from './ConnectAccount';
import useModal from '../shared/useModal';
import { WalletStatuses } from '../../utils/WalletStatus';

const AdvancedForm = () => {
  const [loading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const { isShowing, toggle } = useModal();

  return (
    <>
      {loading && <Loading />}

      <h2>Advanced</h2>
      <ConnectAccount />
      <hr />
      {currentWallet.state === WalletStatuses.Deployed && (
        <>
          <button
            className="Button--Primary"
            onClick={() => toggle('exportKeyStore')}
          >Export Keystore</button>
          <Modal
            isShowing={isShowing.exportKeyStore}
            hide={() => toggle('exportKeyStore')}
          >
            <ExportKeyStore />
          </Modal>
          <button
            className="Button--Primary"
            onClick={() => toggle('sendAccountTransaction')}
          >Send Account Transaction</button>
          <Modal
            isShowing={isShowing.sendAccountTransaction}
            hide={() => toggle('sendAccountTransaction')}
          >
            <SendAccountTransaction />
          </Modal>
        </>
      )}
    </>
  );
};

export default AdvancedForm;
