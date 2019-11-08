import React, { useContext } from 'react';

import { CurrentUserContext, LoaderContext } from '../../contexts/Store';
import useModal from '../shared/useModal';
import Modal from '../shared/Modal';
import Loading from '../shared/Loading';
import UserBalance from './UserBalances';
import WithdrawWethForm from './WithdrawWethForm';
import WithdrawEthForm from './WithdrawEthForm';
import WrapEth from './WrapEth';
import ApproveWeth from './ApproveWeth';
import DepositForm from './DepositForm';
import StateModals from '../shared/StateModals';

import './UserWallet.scss';

const UserWallet = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading] = useContext(LoaderContext);
  const { isShowing, toggle } = useModal();

  const handleToggle = (modal) => {
    toggle(modal);
  };

  return (
    <>
      {loading && <Loading />}
      {currentUser && currentUser.sdk && (
        <div className="UserWallet">
          <StateModals />
          <UserBalance toggle={handleToggle} />

          <Modal
            isShowing={isShowing.depositForm}
            hide={() => toggle('depositForm')}
          >
            <DepositForm className="FlexCenter" />
          </Modal>

          <Modal isShowing={isShowing.wrapForm} hide={() => toggle('wrapForm')}>
            <WrapEth />
          </Modal>

          <Modal
            isShowing={isShowing.allowanceForm}
            hide={() => toggle('allowanceForm')}
          >
            <ApproveWeth />
          </Modal>

          <Modal isShowing={isShowing.sendEth} hide={() => toggle('sendEth')}>
            <WithdrawEthForm />
          </Modal>

          <Modal isShowing={isShowing.sendWeth} hide={() => toggle('sendWeth')}>
            <WithdrawWethForm />
          </Modal>
        </div>
      )}
    </>
  );
};
export default UserWallet;
