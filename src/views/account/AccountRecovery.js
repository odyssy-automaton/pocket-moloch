import React, { useContext, useState, useEffect } from 'react';

import { LoaderContext, CurrentUserContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import './AccountRecovery.scss';
import WhiteCheck from '../../assets/WhiteCheckSmall.svg';
import EthLogo from '../../assets/Ethereum_logo_2014.svg';
import PlusSign from '../../assets/+.svg';

const AccountRecovery = () => {
  const [loading] = useContext(LoaderContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(true);
  const [waitingSdk, setWaitingSdk] = useState(true);
  const [accountDevices, setAccountDevices] = useState([]);
  useEffect(() => {
    (async () => {
      if (currentUser && currentUser.sdk) {
        try {
          const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
          setIsThisDeviceAdded(
            _accountDevices.items.some(
              (item) =>
                item.device.address !== currentUser.sdk.state.deviceAddress,
            ),
          );
          setAccountDevices(
            _accountDevices.items.filter(
              (item) =>
                item.device.address === currentUser.sdk.state.deviceAddress,
            ),
          );
          setWaitingSdk(false);
        } catch (error) {
          console.error(error);
        }
      }
    })();
    // eslint-disable-next-line
  }, [currentUser]);
  return (
    <div className="FlexContainer">
      {(loading || waitingSdk) && <Loading />}
      <h2 className="Pad"> Recovery Options</h2>
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
        <svg className="AddItem" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
      </button>

      {accountDevices.map((item) => (
        <button key={item.device.address} className={isThisDeviceAdded ? 'Button--Input Verified' : 'Button--Input'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M17,1H7A2,2,0,0,0,5,3V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V3A2,2,0,0,0,17,1Zm0,18H7V5H17Z" />
          </svg>
          {item.device.address}
          <svg className="AddItem" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
        </button>
      ))}
      <button
        onClick={isThisDeviceAdded ? null : () => window.location.reload()}
        className={isThisDeviceAdded ? 'Button--Input Verified' : 'Button--Input'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M17,1H7A2,2,0,0,0,5,3V21a2,2,0,0,0,2,2H17a2,2,0,0,0,2-2V3A2,2,0,0,0,17,1Zm0,18H7V5H17Z" />
        </svg>
        {isThisDeviceAdded ? 'This device' : 'Add this device'}
        {isThisDeviceAdded ? (
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
      <button className="Button--Input">
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
      {accountDevices.length < 2 && (
        <p>
          You need to add at least one more device or browser with access to use
          as a recovery option.
        </p>
      )}
    </div>
  );
};

export default AccountRecovery;
