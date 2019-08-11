import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/Store';
import BcToast from './BcToast';

import Brand from '../../assets/meta_chill.png';
import './TopNav.scss';
import useModal from './useModal';
import Modal from './Modal'

const TopNav = (props) => {
  const [currentUser] = useContext(CurrentUserContext);

  // Toggle functions
  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);
  const { isShowing, toggle } = useModal();


  return (
    <div className="TopNav">
      {currentUser && <BcToast />}
      <div
        className={isElementOpen ? 'Backdrop__Open' : 'Backdrop'}
        onClick={toggleElement}
      />
      {props.match.params.name === '/proposal/' ? (
        <p>back</p>
      ) : (
        <Link className="Brand" to="/">
          <img src={Brand} alt="Pocket Moloch" />
        </Link>
      )}

      {currentUser ? (
        <div className="Auth">
          <button className="Auth__Button" onClick={toggleElement}>
            {currentUser.username}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>
          </button>
          <div className={isElementOpen ? 'Dropdown__Open' : 'Dropdown'}>
            <Link
              className="Dropdown__Open--Item"
              to="/account"
              onClick={toggleElement}
            >
              Account
            </Link>
            <a
              className="Dropdown__Open--Item"
              onClick={() => toggle('signOutMsg')}
            >
              {'<='} Sign out
            </a>
            <Modal
              isShowing={isShowing.signOutMsg}
              hide={() => toggle('signOutMsg')}
            >

              <h2>Confirm Sign Out?</h2>
              <div className="IconWarning">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
              </div>
              <p>This DAO uses contract wallets which are owned by your device keys. If you sign out of this device, you will no longer be able to access your wallet from this device.</p>
              <p>Make sure you have added at least one secondary device to access your wallet. With another approved device, you can always reapprove this device again.</p>
              <p>If you do choose to sign out and have not added any other device keys, you will not be able to access your wallet in the future. EVER!</p>
              <Link
                className="AltOption"
                to="/sign-out"
                onClick={() => {
                  toggle('signOutMsg');
                  toggleElement();
                }}
              >
                Yes, sign me out and remove this device
              </Link>
            </Modal>
          </div>
        </div>
      ) : (
        <div className="Auth">
          <Link className="Auth__Button" to="/sign-in" onClick={toggleElement}>
            Sign in {'=>'}
          </Link>
        </div>
      )}
    </div>
  );
};
export default withRouter(TopNav);
