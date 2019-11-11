import React, { useContext, useState, useEffect } from 'react';

import { LoaderContext, CurrentUserContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import Modal from '../../components/shared/Modal';
import useModal from '../../components/shared/useModal';
import useInterval from '../../utils/PollingUtil';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth } from 'aws-amplify';
import CopyToClipboard from 'react-copy-to-clipboard';

import QRCode from 'react-qr-code';
import QrReader from 'react-qr-reader';
import DeployDevices from '../../components/account/DeployDevices';

const AccountRecovery = ({ history }) => {
  const [loading] = useContext(LoaderContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(true);
  const [waitingSdk, setWaitingSdk] = useState(true);
  const [accountDevices, setAccountDevices] = useState([]);
  const [readQrCode, setReadQrCode] = useState('');
  const [writeQrCode, setWriteQrCode] = useState('');
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
  const { isShowing, toggle } = useModal();
  const [inputTouched, setInputTouched] = useState(false);
  const [showQrreader, setshowQrreader] = useState(false);
  const [parsedNamedDevices, setParsedNamedDevices] = useState({});

  const onCopy = () => {
    setDelay(2500);
    setCopied(true);
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay);

  const getQr = () => {
    if (currentUser) {
      const sdk = currentUser.sdk;
      try {
        const connectUrl = sdk.state.deviceAddress;
        setReadQrCode(connectUrl);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleScan = (data) => {
    if (data) {
      setshowQrreader(false);
      toggle('addScannedDevice');
      setWriteQrCode(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.sdk) {
        try {
          setWaitingSdk(true);
          const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
          setIsThisDeviceAdded(
            _accountDevices.items.some(
              (item) =>
                item.device.address === currentUser.sdk.state.deviceAddress,
            ),
          );

          // TODO: use currentWallet.accountDevices
          setAccountDevices(
            _accountDevices.items.filter((item) => {
              console.log(item);

              return (
                item.device.address !== currentUser.sdk.state.deviceAddress
              );
            }),
          );
          getQr();
          const user = await Auth.currentAuthenticatedUser();
          const userAttributes = await Auth.userAttributes(user);
          setWaitingSdk(false);
          if (
            userAttributes.find((item) => item.Name === 'custom:named_devices')
          ) {
            setParsedNamedDevices(
              JSON.parse(
                userAttributes.find(
                  (item) => item.Name === 'custom:named_devices',
                ).Value,
              ),
            );
          }
        } catch (error) {
          console.error(error);
          setWaitingSdk(false);
        }
      }
    })();
    // eslint-disable-next-line
  }, [currentUser]);
  return (
    <div className="FlexCenter">
      {copied && (
        <div className="Flash">
          <p>Copied!</p>
        </div>
      )}
      <Modal
        isShowing={isShowing.addScannedDevice}
        hide={() => toggle('addScannedDevice')}
      >
        <div className="FlexCenter">
          <h3>Are you sure you want to add this device? </h3>
          <p>
            Give the device/browser a name you’d recognize. For remembering
            where you have access and removing in the future.
          </p>
          <Formik
            initialValues={{
              deviceName: '',
            }}
            validate={(values) => {
              let errors = {};
              if (!values.deviceName) {
                errors.deviceName = 'Required';
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                if (
                  accountDevices.some(
                    (item) => item.device.address === writeQrCode,
                  )
                ) {
                  throw new Error('Device already added!');
                }
                const user = await Auth.currentAuthenticatedUser();
                const newAttr = {};
                newAttr[values.deviceName] = writeQrCode;
                const mergedAttributes = JSON.stringify(
                  Object.assign(newAttr, parsedNamedDevices),
                );
                await currentUser.sdk.createAccountDevice(writeQrCode);
                await Auth.updateUserAttributes(user, {
                  'custom:named_devices': mergedAttributes,
                });
                toggle('addScannedDevice');
                window.location.reload();
              } catch (err) {
                alert('Something went wrong: ' + err);
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form className="Form">
                <Field name="deviceName">
                  {({ field, form }) => (
                    <div className={field.value ? 'Field HasValue' : 'Field '}>
                      <label>Device Name</label>
                      <input
                        type="text"
                        {...field}
                        onInput={() => setInputTouched(true)}
                      />
                    </div>
                  )}
                </Field>
                <ErrorMessage
                  name="deviceName"
                  render={(msg) => <div className="Error">{msg}</div>}
                />
                <p>Ex. Mary’s Macbook/Chrome</p>
                <button
                  type="submit"
                  className={
                    inputTouched && Object.keys(errors).length === 0
                      ? ''
                      : 'Disabled'
                  }
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
      {showQrreader && (
        <Modal isShowing={true} hide={() => setshowQrreader(false)}>
          <div className="FlexCenter">
            <h3>Approve a new Device</h3>
            <p>
              Sign in on another device or browser and scan the QR Code there to
              give that device or browser access.
            </p>
            <QrReader
              delay={500}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '80%' }}
            />
            <Formik
              initialValues={{
                newAddr: '',
              }}
              validate={(values) => {
                let errors = {};
                if (!values.newAddr) {
                  errors.newAddr = 'Required';
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setshowQrreader(false);
                toggle('addScannedDevice');
                setWriteQrCode(values.newAddr);
                setSubmitting(false);
                resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="Form">
                  <p>Or Copy the link from the other device and paste here.</p>
                  <Field name="newAddr">
                    {({ field, form }) => (
                      <div
                        className={field.value ? 'Field HasValue' : 'Field '}
                      >
                        <label>Paste the New Device Address</label>
                        <input type="text" {...field} />
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="newAddr"
                    render={(msg) => <div className="Error">{msg}</div>}
                  />
                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
      )}
      <Modal
        isShowing={isShowing.getreadQrCode}
        hide={() => toggle('getreadQrCode')}
      >
        <div className="FlexCenter">
          <h3>Add this Device</h3>
          <p>
            Sign in on another device that has access and scan this QR Code to
            give this device or browser access.
          </p>
          {readQrCode && (
            <div className="QR">
              <QRCode value={readQrCode} />
              <CopyToClipboard onCopy={onCopy} text={readQrCode}>
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
            </div>
          )}
        </div>
      </Modal>
      {(loading || waitingSdk) && <Loading />}
      <h2 className="Pad">Recovery Options</h2>
      <DeployDevices />
      <button className="Button--Input Email Verified">
        <svg
          className="Icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
        Email
        <svg
          className="AddItem"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
          <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </button>

      <button className="Button--Input Email Verified">
        Export Paper Wallet
        <svg
          className="AddItem"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
          <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </button>

      <button className="Button--Input Email Verified">
        Manage Keysstore
        <svg
          className="AddItem"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
          <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </button>

      {accountDevices
        .filter((item) => item.type !== 'Extension')
        .map((item) => (
          <button
            key={item.device.address}
            className={
              isThisDeviceAdded ? 'Button--Input Verified' : 'Button--Input'
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M17,1H7A2,2,0,0,0,5,3V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V3A2,2,0,0,0,17,1Zm0,18H7V5H17Z" />
            </svg>
            {Object.keys(parsedNamedDevices).find(
              (key) => parsedNamedDevices[key] === item.device.address,
            ) || item.device.address}{' '}
            type: {item.type} state {item.state}
            <svg
              className="AddItem"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
              <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </svg>
          </button>
        ))}
      <button
        onClick={isThisDeviceAdded ? null : () => toggle('getreadQrCode')}
        className={
          isThisDeviceAdded ? 'Button--Input Verified' : 'Button--Input'
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17,1H7A2,2,0,0,0,5,3V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V3A2,2,0,0,0,17,1Zm0,18H7V5H17Z" />
        </svg>
        {isThisDeviceAdded ? 'This device' : 'Add this device'}
        {isThisDeviceAdded ? (
          <svg
            className="AddItem"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z" />
            <path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="AddItem"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        )}
      </button>
      <button className="Button--Input" onClick={() => setshowQrreader(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17,1H7A2,2,0,0,0,5,3V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V3A2,2,0,0,0,17,1Zm0,18H7V5H17Z" />
        </svg>
        Add another Device
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="AddItem"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>
      {accountDevices.length === 0 ? (
        <p>
          <strong>
            You need to add at least one more device or browser with access to
            use as a recovery option.
          </strong>
        </p>
      ) : (
        <button onClick={() => history.push('/account')}>Continue</button>
      )}
    </div>
  );
};

export default AccountRecovery;
