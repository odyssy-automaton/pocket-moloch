import React, { useContext } from 'react';

import { LoaderContext, CurrentWalletContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import Modal from '../../components/shared/Modal';
import useModal from '../../components/shared/useModal';
import ExportKeyStore from '../../components/account/ExportKeyStore';
import SendAccountTransaction from '../../components/account/SendAccountTransaction';
import ConnectAccount from '../../components/account/ConnectAccount';
import WithdrawWethForm from '../../components/account/WithdrawWethForm';
import WithdrawEthForm from '../../components/account/WithdrawEthForm';

const Advanced = () => {
  const [loading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const { isShowing, toggle } = useModal();

  return (
    <>
      {loading && <Loading />}

      <h2>Advanced</h2>
      <ConnectAccount />
      <hr />
      {currentWallet.state === 'Deployed' && (
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
          <button
            className="Button--Primary"
            onClick={() => toggle('wethWithdrawForm')}
          >Withdraw wETH</button>
          <Modal
            isShowing={isShowing.wethWithdrawForm}
            hide={() => toggle('wethWithdrawForm')}
          >
            <WithdrawWethForm />
          </Modal>
          <button
            className="Button--Primary"
            onClick={() => toggle('ethWithdrawForm')}
          >Withdraw ETH</button>
          <Modal
            isShowing={isShowing.ethWithdrawForm}
            hide={() => toggle('ethWithdrawForm')}
          >
            <WithdrawEthForm />
          </Modal>
        </>
      )}
    </>
  );
};

export default Advanced;
