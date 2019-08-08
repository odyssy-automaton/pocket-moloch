import React, { useContext, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import QRCode from 'react-qr-code';
import QrReader from 'react-qr-reader';

import config from '../../config';

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import Modal from '../shared/Modal';

import useInterval from '../../utils/PollingUtil';
import useModal from '../shared/useModal';

const ConnectAccount = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  //const [loading] = useContext(LoaderContext);

  const [qrCode, setQrCode] = useState('');
  const [delay, setDelay] = useState(null);
  const [copied, setCopied] = useState(false);
  const { isShowing, toggle } = useModal();
  const QrDelay = 500;

  const onCopy = () => {
    setDelay(2500);
    setCopied(true);
  };

  useInterval(() => {
    setCopied(false);
    setDelay(null);
  }, delay);

  const getQr = () => {
    const sdk = currentUser.sdk;
    //update from localhost with config
    const url = `${config.QR_HOST_URL}`;
    try {
      const connectUrl = `${url}/add-device/${sdk.state.deviceAddress}`;
      // console.log('connectUrl', connectUrl);
      setQrCode(connectUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleScan = (data) => {
    if (data) {
      window.location = data;
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      {copied && (
        <div className="Flash">
          <p>Copied!</p>
        </div>
      )}
      {currentWallet.state !== 'Deployed' ? (
        <button
          onClick={() => {
            toggle('getQrCode');
            getQr();
          }}
        >
          Add This Device
        </button>
      ) : (
        <>
          <button onClick={() => toggle('connectQrReader')}>
            Approve a New Device
          </button>
          <Modal
            isShowing={isShowing.connectQrReader}
            hide={() => toggle('connectQrReader')}
          >
            <div className="FlexCenter">
              <h3>Approve a new Device</h3>
              <p>
                Sign in on another device and scan it from here to add that
                device to your account.
              </p>
              <QrReader
                delay={QrDelay}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '80%' }}
              />
            </div>
          </Modal>
        </>
      )}

      <Modal isShowing={isShowing.getQrCode} hide={() => toggle('getQrCode')}>
        <div className="FlexCenter">
          <h3>Add this Device</h3>
          <p>
            Sign into a device/browser that has access to this acccount. Then,
            scan the QR code below to grant this device access. If you do not
            have access to a QR reader, then just copy the link below and
            navigate there on the device/browser that is connected.
          </p>
          {qrCode && (
            <div className="QR">
              <QRCode value={qrCode} />
              <CopyToClipboard onCopy={onCopy} text={qrCode}>
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
    </>
  );
};

export default ConnectAccount;
