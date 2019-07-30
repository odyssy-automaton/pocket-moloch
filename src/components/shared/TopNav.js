import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/Store';
import BcToast from './BcToast';

import Brand from '../../assets/yang-brand.png';
import './TopNav.scss';

const TopNav = (props) => {
  const [currentUser] = useContext(CurrentUserContext);

  // Toggle functions
  const [isElementOpen, setElementOpen] = React.useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);

  return (
    <div className="TopNav">
      {currentUser && <BcToast />}
      <div
        className={isElementOpen ? 'Backdrop__Open' : 'Backdrop'}
        onClick={toggleElement}
      />
      { props.match.params.name === '/proposal/' ? (
      <p>back</p>
      ):(
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
            <Link
              className="Dropdown__Open--Item"
              to="/sign-out"
              onClick={toggleElement}
            >
              {'<='} Sign out
            </Link>
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
