import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FourOhFour from './views/404/404';
import Home from './views/home/Home';
import Proposals from './views/proposals/Proposals';
import Proposal from './views/proposal/Proposal';
import ProposalNew from './views/proposal-new/ProposalNew';
import Members from './views/members/Members';
import Member from './views/member/Member';
import Help from './views/help/Help';
import Account from './views/account/Account';
import SignUp from './views/auth/SignUp';
import SignIn from './views/auth/SignIn';
import Confirm from './views/auth/Confirm';
import SignOut from './views/auth/SignOut';
import ForgotPassword from './views/auth/ForgotPassword';
import ForgotPasswordConfirm from './views/auth/ForgotPasswordConfirm';
import AccountRecovery from './views/account/AccountRecovery';
import ResendCode from './views/auth/ResendCode';
import ConnectAccount from './components/account/ConnectAccount';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/proposals" exact component={Proposals} />
    <Route path="/proposals/:filter" exact component={Proposals} />
    <Route path="/proposal/:id" exact component={Proposal} />
    <Route path="/proposal-new" exact component={ProposalNew} />
    <Route path="/members" exact component={Members} />
    <Route path="/member/:id" exact component={Member} />
    <Route path="/account" exact component={Account} />
    <Route path="/help" exact component={Help} />
    <Route path="/sign-up" exact component={SignUp} />
    <Route path="/sign-in" exact component={SignIn} />
    <Route path="/sign-out" exact component={SignOut} />
    <Route path="/confirm" exact component={Confirm} />
    <Route path="/forgot-password" exact component={ForgotPassword} />
    <Route
      path="/forgot-password-confirm"
      exact
      component={ForgotPasswordConfirm}
    />
    <Route path="/connect-account" exact component={ConnectAccount} />
    <Route path="/account-recovery" exact component={AccountRecovery} />
    <Route path="/resend-code" exact component={ResendCode} />
    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default Routes;
