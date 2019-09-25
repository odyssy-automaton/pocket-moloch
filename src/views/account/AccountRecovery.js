import React, { useContext, useState, useEffect } from 'react';

import { LoaderContext, CurrentUserContext,CurrentWalletContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import './AccountRecovery.scss';
import WhiteCheck from '../../assets/WhiteCheckSmall.svg';
import EthLogo from '../../assets/Ethereum_logo_2014.svg';
import PlusSign from '../../assets/+.svg';
import Modal from '../../components/shared/Modal';
import useModal from '../../components/shared/useModal';
import useInterval from '../../utils/PollingUtil';
import config from '../../config';

import CopyToClipboard from 'react-copy-to-clipboard';

import QRCode from 'react-qr-code';
import QrReader from 'react-qr-reader';

const AccountRecovery = () => {
    const [loading] = useContext(LoaderContext);
    const [currentUser] = useContext(CurrentUserContext);

  const [currentWallet] = useContext(CurrentWalletContext);
    const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(true);
    const [waitingSdk, setWaitingSdk] = useState(true);
    const [accountDevices, setAccountDevices] =  useState([]);
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
    
    useEffect(() => {

        (async () => {
            if (currentUser && currentUser.sdk) {
                try {
                const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
                setIsThisDeviceAdded(_accountDevices.items.some(item => item.device.address === currentUser.sdk.state.deviceAddress));
                setAccountDevices(_accountDevices.items.filter(item => item.device.address !== currentUser.sdk.state.deviceAddress));
                setWaitingSdk(false)}
                catch (error){
                    console.error(error)
                }
            }
        })()
        // eslint-disable-next-line
    }, [currentUser]);
    return (
        <div className="FlexContainer">
        {copied && (
        <div className="Flash">
          <p>Copied!</p>
        </div>
      )}
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
          <Modal isShowing={isShowing.getQrCode} hide={() => {toggle('getQrCode');
          getQr();}}>
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
            {(loading || waitingSdk) && <Loading />}
            <h2 className="Pad"> Recovery Options</h2>
            <div className="RecoveryOption">
                <p className="atSign">@</p><p>Email</p><img src={WhiteCheck} alt="white check" />
            </div>
           
            {accountDevices.map(item=>
                    <div key={item.device.address} className="RecoveryOption">
                        <p className="atSign">@</p><p>{item.device.address}</p><img src={WhiteCheck} alt="white check" />
                    </div>)
                    }
            <div
                onClick={isThisDeviceAdded ? null:() => toggle('getQrCode')}
                className="RecoveryOption" 
                style={{ backgroundColor: isThisDeviceAdded ? 'greenyellow' : 'whitesmoke', }}
                >
                <p className="atSign">@</p><p>{isThisDeviceAdded ? 'This device' : 'Add this device'}</p>
                <img src={isThisDeviceAdded ? WhiteCheck : PlusSign} alt="device status" />
            </div>
            <div className="AddDeviceList" onClick={() => toggle('connectQrReader')}>
                <img src={EthLogo} alt="eth logo" className="AddDeviceEthLogo" />
                    <p className="PinkText">Add another Device</p>
                <img src={PlusSign} alt="device status" />
            </div>
            {accountDevices.length < 1 && <p>You need to add at least one more device or browser with access to use as a recovery option.</p>}
        </div>
    )
};

export default AccountRecovery;