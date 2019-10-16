import React, { useContext, useState } from 'react';

import {
  LoaderContext,
  CurrentWalletContext,
  CurrentUserContext,
} from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import Modal from '../../components/shared/Modal';
import useModal from '../../components/shared/useModal';
import ExportKeyStore from '../../components/account/ExportKeyStore';
import SendAccountTransaction from '../../components/account/SendAccountTransaction';
import WithdrawWethForm from '../../components/account/WithdrawWethForm';
import WithdrawEthForm from '../../components/account/WithdrawEthForm';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Web3Service from '../../utils/Web3Service';
import { WalletStatuses } from '../../utils/WalletStatus';

const Advanced = () => {
  const [loading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [currentUser] = useContext(CurrentUserContext);
  const { isShowing, toggle } = useModal();
  const [pseudonymTouch, setPseudonymTouch] = useState(false);
  const [passwordTouch, setPasswordTouch] = useState(false);

  return (
    <>
      {loading && <Loading />}

      <h2>Advanced</h2>
      <hr />
      {currentWallet.state === WalletStatuses.Deployed ? (
        <>
          <button
            className="Button--Primary"
            onClick={() => toggle('exportKeyStore')}
          >
            Export Keystore
          </button>
          <Modal
            isShowing={isShowing.exportKeyStore}
            hide={() => toggle('exportKeyStore')}
          >
            <ExportKeyStore />
          </Modal>
          <button
            className="Button--Primary"
            onClick={() => toggle('sendAccountTransaction')}
          >
            Send Account Transaction
          </button>
          <Modal
            isShowing={isShowing.sendAccountTransaction}
            hide={() => toggle('sendAccountTransaction')}
          >
            <SendAccountTransaction />
          </Modal>
          <button
            className="Button--Primary"
            onClick={() => toggle('wethWithdrawForm')}
          >
            Withdraw wETH
          </button>
          <Modal
            isShowing={isShowing.wethWithdrawForm}
            hide={() => toggle('wethWithdrawForm')}
          >
            <WithdrawWethForm />
          </Modal>
          <button
            className="Button--Primary"
            onClick={() => toggle('ethWithdrawForm')}
          >
            Withdraw ETH
          </button>
          <Modal
            isShowing={isShowing.ethWithdrawForm}
            hide={() => toggle('ethWithdrawForm')}
          >
            <WithdrawEthForm />
          </Modal>
        </>
      ) : (
        <>
          <Formik
            initialValues={{ username: '', password: '' }}
            validate={(values) => {
              let errors = {};
              if (!values.username) {
                errors.username = 'Required';
              }
              if (!values.username) {
                errors.password = 'Required';
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const web3Service = new Web3Service();
              console.log('currentUser', currentUser);

              const key = web3Service.decryptKeyStore(
                currentUser.attributes['custom:encrypted_pk2'],
                values.password,
              );
              console.log('key', key);

              const options = {
                device: { privateKey: key.privateKey },
              };

              currentUser.sdk
                .initialize(options)
                .then(() => {
                  console.log('initialized');
                  currentUser.sdk.connectAccount(
                    currentUser.attributes['custom:account_address'],
                  );
                })
                .catch(console.error);
            }}
          >
            {({ isSubmitting, errors, touched }) => {
              return (
                <Form className="Form">
                  <h2>Restore Primary</h2>
                  <p>
                    I lost my primary and would like to restore with my password
                  </p>

                  <Field name="username">
                    {({ field, form }) => (
                      <div
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Pseudonym</label>
                        <input
                          type="text"
                          {...field}
                          onInput={() => setPseudonymTouch(true)}
                        />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="username"
                    render={(msg) => <div className="Error">{msg}</div>}
                  />
                  <Field type="password" name="password">
                    {({ field, form }) => (
                      <div
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Password</label>
                        <input
                          type="password"
                          {...field}
                          onInput={() => setPasswordTouch(true)}
                        />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="password"
                    render={(msg) => <div className="Error">{msg}</div>}
                  />
                  <div className="ButtonGroup">
                    <button
                      type="submit"
                      className={
                        Object.keys(errors).length < 1 &&
                        pseudonymTouch &&
                        passwordTouch
                          ? ''
                          : 'Disabled'
                      }
                      disabled={isSubmitting}
                    >
                      Sign In
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </>
      )}
    </>
  );
};

export default Advanced;
