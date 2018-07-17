import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';

import { auth } from '../firebase';
import * as routes from '../const/routes';
import Layout from '../compoents/Layout';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.LANDING);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    if(this.props.islog != null){
      return <Redirect to={routes.LANDING} />;
    }

    return (
        <Layout title="Login Page" islog={this.props.islog}>
            <form onSubmit={this.onSubmit} className="middle">
                <div className="uk-margin">
                    { error && <p>{error.message}</p> }
                </div>
                <div className="uk-margin">
                    <input
                    value={email}
                    onChange={event => this.setState(byPropKey('email', event.target.value))}
                    type="text"
                    className="uk-input"
                    placeholder="Email Address"
                    />
                </div>
                <div className="uk-margin">
                    <input
                    value={password}
                    onChange={event => this.setState(byPropKey('password', event.target.value))}
                    type="password"
                    id="password_field"
                    className="uk-input"
                    placeholder="Password"
                    />
                </div>
                <div className="uk-margin">
                    <button disabled={isInvalid} type="submit" className="uk-button uk-button-danger">
                        Sign In
                    </button>
                </div>
            </form>
        </Layout>
    );
  }
}

export default withRouter(Login);
