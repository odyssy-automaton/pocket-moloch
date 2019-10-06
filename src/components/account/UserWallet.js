import React, { useContext, useEffect, useState } from 'react';

import useModal from '../shared/useModal';
import Modal from '../shared/Modal';
import CopyToClipboard from 'react-copy-to-clipboard';

import {
  CurrentUserContext,
  LoaderContext,
  CurrentWalletContext,
} from '../../contexts/Store';

import Loading from '../shared/Loading';
import './UserWallet.scss';
import UserBalance from './UserBalances';
import WithdrawWethForm from './WithdrawWethForm';
import WithdrawEthForm from './WithdrawEthForm';
import Deploy from './Deploy';
import WrapEth from './WrapEth';
import ApproveWeth from './ApproveWeth';
import RageQuit from './RageQuit';
import DepositForm from './DepositForm';

import DeployDevices from './DeployDevices';
import StateModals from '../shared/StateModals';
const UserWallet = ({ history }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [loading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const { isShowing, toggle } = useModal();
  const  handleToggle = (modal)=>toggle(modal);
  return (
    <>
      {loading && <Loading />}
      {currentUser && currentUser.sdk && (
        <div className="UserWallet">
          <StateModals />
          <UserBalance toggle={handleToggle}/>
            
            {/* <Modal
              isShowing={isShowing.depositForm}
              hide={() => toggle('depositForm')}
            >
              <DepositForm className="FlexCenter" />
            </Modal> */}

            <DeployDevices />

           

            <Modal
              isShowing={isShowing.wrapForm}
              hide={() => toggle('wrapForm')}
            >
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

            
            <Modal
              isShowing={isShowing.sendWeth}
              hide={() => toggle('sendWeth')}
            >
              <WithdrawWethForm />
            </Modal>

            
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
      )}
    </>
  );
};
export default UserWallet;
