import React, { useContext, useEffect, useState } from 'react';

import { ethToWei } from '@netgum/utils'; // returns BN

import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';
import BcProcessorService from '../../utils/BcProcessorService';
import Web3Service from '../../utils/Web3Service';
import BottomNav from '../../components/shared/BottomNav';

const AddDevice = ({ match }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const deviceAddr = match.params.deviceAddr;
  const web3Service = new Web3Service();
  const bcprocessor = new BcProcessorService();
  const [accountDevices, setAccountDevices] = useState([]);
  const [deviceAdded, setDeviceAdded] = useState(false);

  useEffect(() => {
    const getDevices = async () => {
      if (currentUser && currentUser.sdk) {
        
        const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
        setAccountDevices(_accountDevices.items);
      }
    };
    getDevices();
  }, [currentUser, deviceAdded]);

  const renderList = () => {
    return accountDevices.map((device, idx) => {
      return <div className="Row Device" key={idx}><p>{device.device.address}</p><button>Remove</button></div>;
    });
  };

  const addAndDeployDevice = async () => {
    //setLoading(true);

    try {
      // console.log(' accountDevices', accountDevices);
      // console.log(currentWallet.eth);
      if (accountDevices.find((item) => item.device.address === deviceAddr)) {
        alert('already added')
        return;
      }
      await currentUser.sdk.createAccountDevice(deviceAddr);
      const estimated = await currentUser.sdk.estimateAccountDeviceDeployment(
        deviceAddr,
      );
      // console.log(
      //   currentWallet.eth,
      //   ethToWei(currentWallet.eth),
      //   estimated.totalCost,
      // );

      if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
        alert(
          `you need more gas, at least: ${web3Service.fromWei(
            estimated.totalCost.toString(),
          )}`,
        );
        return;
      }

      const hash = await currentUser.sdk.submitAccountTransaction(estimated);

      bcprocessor.setTx(
        hash,
        currentUser.attributes['custom:account_address'],
        `Add Acount Device: ${deviceAddr}`,
        true,
      );
      setDeviceAdded(true);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="View Pad">
      {currentWallet.state === 'Deployed' && currentWallet.eth > 0 && !deviceAdded && (
        <div className="AddDevice">
          <h3>Are you sure you want to add this new device?</h3>
          <p>{deviceAddr}</p>
          <button onClick={() => addAndDeployDevice()}>Yes, Add the Device</button>
        </div>
      )}
      {accountDevices.length > 0 && (
        <>
          <h2>Current Approved Devices</h2>
          {renderList()}
        </>
      )}
      {!currentUser && <p className="Pad">Not logged in</p>}
      <BottomNav />
    </div>
  );
};

export default AddDevice;
