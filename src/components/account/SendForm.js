import React, {useContext} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { CurrentUserContext } from '../../contexts/Store';

const SendForm = () => {
  const [currentUser] = useContext(CurrentUserContext);
  const [copied, setCopied] = React.useState(false);
  const onCopy = () => setCopied(!copied);
  const addrStyle = {
    marginTop: '20px',
    border: '2px solid #efefef',
    padding: '15px 25px',
    borderRadius: '50px'
  }
  return (
    <React.Fragment>
        <h2>Send funds to your wallet address</h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="none" d="M0 0h24v24H0V0z"/>
          <path fill="#010101" d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
        </svg>
        <p className="Data" style={addrStyle}>
          {currentUser.attributes['custom:account_address']}
        </p>{' '}
        <button>
          Send
        </button>
    </React.Fragment>
);
}

export default SendForm;