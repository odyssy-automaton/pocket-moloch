import React,{useContext, useState,} from 'react';

import { LoaderContext, CurrentUserContext } from '../../contexts/Store';
import Loading from '../../components/shared/Loading';
import './AccountRecovery.scss';
import WhiteCheck from '../../assets/WhiteCheckSmall.svg';
import EthLogo from '../../assets/Ethereum_logo_2014.svg';
import PlusSign from '../../assets/+.svg';

const AccountRecovery = () => {
    const [loading] = useContext(LoaderContext);
    const [currentUser] = useContext(CurrentUserContext);
    const [isThisDeviceAdded, setIsThisDeviceAdded] = useState(false)
console.log(currentUser)
    return (
      <div className="FlexContainer">
        {loading && <Loading />}
        <h2 className="Pad"> Recovery Options</h2>
            <div className="RecoveryOption">
            <p className="atSign">@</p><p>Email</p><img src={WhiteCheck} alt="white check" ></img>
            </div>
            <div className="RecoveryOption" style={{backgroundColor: isThisDeviceAdded ? 'greenyellow':'whitesmoke',}}>
            <p className="atSign">@</p><p>{isThisDeviceAdded ? 'This device' : 'Add this device'}</p><img src={isThisDeviceAdded ? WhiteCheck : PlusSign} alt="device status" ></img>
            </div>
            <div className="AddDeviceList" ><img src={EthLogo} alt="eth logo" className="AddDeviceEthLogo"/><p className="PinkText">Add another Device</p><img src={PlusSign} alt="device status" ></img>
        </div>
        </div>
    )
};

export default AccountRecovery;