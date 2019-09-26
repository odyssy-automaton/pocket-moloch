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
    const [accountDevices, setAccountDevices] =  useState([]);
    useEffect(() => {

        (async () => {
            if (currentUser && currentUser.sdk) {
                try {
                const _accountDevices = await currentUser.sdk.getConnectedAccountDevices();
                setIsThisDeviceAdded(_accountDevices.items.some(item => item.device.address !== currentUser.sdk.state.deviceAddress));
                setAccountDevices(_accountDevices.items.filter(item => item.device.address === currentUser.sdk.state.deviceAddress));
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
                onClick={isThisDeviceAdded ? null:()=>window.location.reload()}
                className="RecoveryOption" 
                style={{ backgroundColor: isThisDeviceAdded ? 'greenyellow' : 'whitesmoke', }}
                >
                <p className="atSign">@</p><p>{isThisDeviceAdded ? 'This device' : 'Add this device'}</p>
                <img src={isThisDeviceAdded ? WhiteCheck : PlusSign} alt="device status" />
            </div>
            <div className="AddDeviceList" >
                <img src={EthLogo} alt="eth logo" className="AddDeviceEthLogo" />
                    <p className="PinkText">Add another Device</p>
                <img src={PlusSign} alt="device status" />
            </div>
            {accountDevices.length < 1 && <p>You need to add at least one more device or browser with access to use as a recovery option.</p>}
        </div>
    )
};

export default AccountRecovery;