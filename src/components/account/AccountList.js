import React, { useContext, useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

import { CurrentUserContext } from '../../contexts/Store';
import useModal from '../../components/shared/useModal';
import DeployDevices from '../../components/account/DeployDevices';

import './AccountList.scss';

const AccountList = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(true);
  const [, setWaitingSdk] = useState(true);
  const [accountDevices, setAccountDevices] = useState([]);
  const { toggle } = useModal();
  const [parsedNamedDevices, setParsedNamedDevices] = useState({});

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

          setAccountDevices(
            _accountDevices.items.filter((item) => {
              console.log(item);

              return (
                item.device.address !== currentUser.sdk.state.deviceAddress
              );
            }),
          );
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
    <div className="FlexContainer">
      <button className="Button--Input Email Verified">
        Export Paper Wallet &nbsp;
        <small> required for lost password recovery</small>
        <small> COMING SOON </small>
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
            <DeployDevices />
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
    </div>
  );
};

export default AccountList;
