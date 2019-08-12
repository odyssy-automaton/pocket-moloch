import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth, Storage } from 'aws-amplify';
import shortid from 'shortid';

import {
  SdkEnvironmentNames,
  getSdkEnvironment,
  createSdk,
} from '@archanova/sdk';

import config from '../../config';

import { CurrentUserContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import useModal from '../../components/shared/useModal';
import Modal from '../../components/shared/Modal'


const sdkEnv = getSdkEnvironment(SdkEnvironmentNames[`${config.SDK_ENV}`]); // kovan env by default

const SignIn = ({ history }) => {
  const [, setCurrentUser] = useContext(CurrentUserContext);
  const [authError, setAuthError] = useState();
  const { isShowing, toggle } = useModal();

  return (
    <div>
      <h2 className="Pad">Sign in to existing account</h2>
      <Modal
              isShowing={isShowing.signInMsg}
              hide={() => toggle('signInMsg')}
            >

              <h2>Welcom to the Dao</h2>
              <div className="IconWarning">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
              </div>
              <p>Thank you for creating an account. If you would like to join the DAO as a member, go to the twitter, telegram, or discord and find a current member to sponser you.</p>
              <h3>Important!</h3>
              <p>This app will not work in private mode. If you are using private mode in your browser please turn it off.</p>
              <h3>Some Notes:</h3>
              <p>This DAO uses contract wallets which are owned by your device keys. If you sign out of this device, you will no longer be able to access your wallet from this device.</p>
              <p>Make sure you have added at least one secondary device to access your wallet. With another approved device, you can always reapprove this device again.</p>
              <p>If you do choose to sign out and have not added any other device keys, you will not be able to access your wallet in the future. EVER!</p>
              <Link
                className="AltOption"
                to="/proposals"
                onClick={() => toggle('signInMsg')}
              >
                I undrstand, continue on
              </Link>
            </Modal>
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
          try {
            const user = await Auth.signIn({
              username: values.username,
              password: values.password,
            });

            const sdk = new createSdk(
              sdkEnv.setConfig('storageAdapter', localStorage),
            );
            // account address is set to 0x0 on signup
            // update this value after sdk is initialized and created
            // if account address exisit on aws aut connect account to sdk
            if (user.attributes['custom:account_address'] !== '0x0') {
              try {
                await sdk.initialize();
                await sdk.connectAccount(
                  user.attributes['custom:account_address'],
                );
                //currentUserInfo returns the correct attributes
                const attributes = await Auth.currentUserInfo();
                const realuser = {
                  ...user,
                  ...{ attributes: attributes.attributes },
                };
                setCurrentUser({ ...realuser, ...{ sdk } });
                setSubmitting(false);
                history.push('/proposals');
              } catch (err) {
                console.log(err); // {"error":"account device not found"}
              }
            } else {
              await sdk.initialize();
              const uuid = shortid.generate();
              const ensLabel = `${encodeURI(user.username)}-${uuid}`;
              const account = await sdk.createAccount(ensLabel);
              const accountDevices = await sdk.getConnectedAccountDevices();

              await Auth.updateUserAttributes(user, {
                'custom:account_address': account.address,
                'custom:device_address': accountDevices.items[0].device.address,
                'custom:ens_name': ensLabel,
              });
              const jsonse = JSON.stringify(
                {
                  username: user.username,
                  deviceId: accountDevices.items[0].device.address,
                },
                null,
                2,
              );
              const blob = new Blob([jsonse], {
                type: 'application/json',
              });
              try {
                // save user meta to S3
                Storage.put(
                  `member_${account.address.toUpperCase()}.json`,
                  blob,
                  {
                    contentType: 'text/json',
                  },
                );
              } catch (err) {
                console.log('storage error', err);
              }

              const attributes = await Auth.currentUserInfo();
              const realuser = {
                ...user,
                ...{ attributes: attributes.attributes },
              };
              setCurrentUser({ ...realuser, ...{ sdk } });

              setSubmitting(false);

              toggle('signInMsg')
              //history.push('/proposals');
            }
          } catch (err) {
            setAuthError(err);
            setSubmitting(false);
            console.log('error signing in: ', err);
          }
        }}
      >
        {({ isSubmitting }) => {
          if (isSubmitting) {
            return <Loading />;
          }

          return (
            <Form className="Form">
              {authError ? (
                <div className="Form__auth-error">{authError.message}</div>
              ) : null}
              <Field name="username">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Pseudonym</label>
                  <input type="text" {...field} />
                </div>
              )}
              </Field>
                <ErrorMessage name="username" render={msg => <div className="Error">{msg}</div>} />
              <Field type="password" name="password">
              {({ field, form }) => (
                <div
                  className={
                    field.value
                      ? 'Field HasValue'
                      : 'Field '
                  }
                >
                  <label>Password</label>
                  <input type="password" {...field} />
                </div>
              )}
              </Field>
              <ErrorMessage name="password" render={msg => <div className="Error">{msg}</div>} />
              <button type="submit" disabled={isSubmitting}>
                Sign In
              </button>
            </Form>
          );
        }}
      </Formik>
      <Link className="AltOption" to="/sign-up">
        Create a new account
      </Link>
    </div>
  );
};

export default withRouter(SignIn);
