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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Auth } from 'aws-amplify';
import CopyToClipboard from 'react-copy-to-clipboard';

import QRCode from 'react-qr-code';
import QrReader from 'react-qr-reader';

const AccountRecovery = () => {
    const [loading] = useContext(LoaderContext);
    const [currentUser] = useContext(CurrentUserContext);

    const sdk = currentUser.sdk;
  const [currentWallet] = useContext(CurrentWalletContext);
    const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(true);
    const [waitingSdk, setWaitingSdk] = useState(true);
    const [accountDevices, setAccountDevices] =  useState([]);
    const [readQrCode, setReadQrCode] = useState('');
    const [writeQrCode, setWriteQrCode] = useState('');
    const [delay, setDelay] = useState(null);
    const [copied, setCopied] = useState(false);
    const { isShowing, toggle } = useModal();
const [inputTouched,setInputTouched]=useState(false)
    const [showQrreader, setshowQrreader] = useState(false);

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
        try {
          const connectUrl = sdk.state.deviceAddress;
          setReadQrCode(connectUrl);
        } catch (err) {
          console.log(err);
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
                const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
                setIsThisDeviceAdded(_accountDevices.items.some(item => item.device.address === currentUser.sdk.state.deviceAddress));
                setAccountDevices(_accountDevices.items.filter(item => item.device.address !== currentUser.sdk.state.deviceAddress));
                getQr();
                setWaitingSdk(false);
              }
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
            isShowing={isShowing.addScannedDevice}
            hide={() => toggle('addScannedDevice')}
          >
          <p>Account Recovery</p>
            <div className="FlexCenter">
              <h3>Are you sure you want to add this device? </h3>
              <p>
              Give the device/browser a name you’d recognize. For remembering where you have access and removing in the future.
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
                  const user = await Auth.currentAuthenticatedUser()
                  const userAttributes = await Auth.userAttributes(user)
                  const namedDevices=userAttributes.find(item=>item.Name==='custom:named_devices').Value;
                  const newAttr={};
                  newAttr[values.deviceName]=writeQrCode
                  const mergedAttributes = JSON.stringify(Object.assign(newAttr, JSON.parse(namedDevices)))
                  await sdk.createAccountDevice(writeQrCode)
                  await Auth.updateUserAttributes(user, {'custom:named_devices':mergedAttributes})
                 }
                 catch (err) {
                   console.error('Something went wrong: '+err)
                   setSubmitting(false)
                 }
                }}
              >
                {({ isSubmitting, errors }) => (
                  <Form className="Form">
                    <Field name="deviceName">
                      {({ field, form }) => (
                        <div
                          className={
                            field.value
                              ? 'Field HasValue'
                              : 'Field '
                          }
                        >
                          <label>Device Name</label>
                          <input type="text" {...field} onInput={()=>setInputTouched(true)}/>
                        </div>
                      )}
                    </Field>
                    <ErrorMessage name="deviceName" render={msg => <div className="Error">{msg}</div>} />
                    <p>Ex. Mary’s Macbook/Chrome</p>
                    <button type="submit" className={(inputTouched && Object.keys(errors).length===0) ? '':'Disabled'} disabled={isSubmitting}>
                      Submit
                    </button>
                  </Form>
        )}
      </Formik>
            </div>
          </Modal>
        {showQrreader && <Modal
            isShowing={true}
            hide={() => setshowQrreader(false)}

          >
          <p>Account Recovery</p>
            <div className="FlexCenter">
              <h3>Approve a new Device</h3>
              <p>
              Sign in on another device or browser and scan the QR Code there to give that device or browser access.
              </p>
              <QrReader
                delay={500}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '80%' }}
              />
            </div>
          </Modal>}
          <Modal isShowing={isShowing.getreadQrCode} hide={() => toggle('getreadQrCode')}>
        <div className="FlexCenter">
          <h3>Add this Device</h3>
          <p>
          Sign in on another device that has access and scan this QR Code to give this device or browser access.
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
                onClick={isThisDeviceAdded ? null:() => toggle('getreadQrCode')}
                className="RecoveryOption" 
                style={{ backgroundColor: isThisDeviceAdded ? 'greenyellow' : 'whitesmoke', }}
                >
                <p className="atSign">@</p><p>{isThisDeviceAdded ? 'This device' : 'Add this device'}</p>
                <img src={isThisDeviceAdded ? WhiteCheck : PlusSign} alt="device status" />
            </div>
            <div className="AddDeviceList" onClick={() => setshowQrreader(true)}>
                <img src={EthLogo} alt="eth logo" className="AddDeviceEthLogo" />
                    <p className="PinkText">Add another Device</p>
                <img src={PlusSign} alt="device status" />
            </div>
            {accountDevices.length < 1 ? <p>You need to add at least one more device or browser with access to use as a recovery option.</p> : <button>Continue</button>}
        </div>
    )
};

export default AccountRecovery;