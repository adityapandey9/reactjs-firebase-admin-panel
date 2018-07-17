import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyC2kCm-S22fqGe9giYaIKUnwrjiRqc7fF0",
    authDomain: "shop-744dd.firebaseapp.com",
    databaseURL: "https://shop-744dd.firebaseio.com",
    projectId: "shop-744dd",
    storageBucket: "shop-744dd.appspot.com",
    messagingSenderId: "794984756590"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
  auth,
};