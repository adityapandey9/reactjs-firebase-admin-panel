import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Index from './pages/index';
import UploadImg from './pages/uploadimg';
import UploadData from './pages/uploaddata';
import Login from './pages/login';
import OrderPage from './pages/order';

import * as routes from './const/routes';
import { firebase } from './firebase/index';

class App extends Component {

  constructor() {
    super();
    this.state = {
      authUser: null,
    };
 }

 componentDidMount() {
    firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState(() => ({ authUser }))
        : this.setState(() => ({ authUser: null }));
    });
 }


  render() {
    return (
      <Router>
        <div>
          <Route
            exact path={routes.SIGN_IN}
            component={() => <Login islog={this.state.authUser} />}
          />
          <Route
            exact path={routes.LANDING}
            component={() => <Index islog={this.state.authUser} />}
          />
          <Route
            exact path={routes.DATA}
            component={() => <UploadData islog={this.state.authUser} />}
          />
          <Route
            exact path={routes.IMG}
            component={() => <UploadImg islog={this.state.authUser} />}
          />
          <Route
            exact path={routes.ORDER}
            component={() => <OrderPage islog={this.state.authUser} />}
          />
        </div>
      </Router>
    );
  }
}

export default App;
