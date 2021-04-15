import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { SignInPage, SignUpPage } from 'pages';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path='/signin' component={SignInPage} />
      <Route exact path='/signup' component={SignUpPage} />
      <Redirect exact from='/' to='/signup' />
    </Switch>
  </Router>
);

export default Routes;
