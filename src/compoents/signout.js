import React from 'react';

import { auth } from '../firebase';

const SignOutButton = () =>
  <button
    type="button"
    onClick={auth.doSignOut}
    className="uk-button uk-button-primary"
  >
    Sign Out
  </button>

export default SignOutButton;