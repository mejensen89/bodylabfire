import firebase from 'firebase';


const config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyD2phjazBJ11tnYm3WcLVBLlfU8ZV4LQkg",
    authDomain: "bodylabfire.firebaseapp.com",
    databaseURL: "https://bodylabfire.firebaseio.com",
    projectId: "bodylabfire",
    storageBucket: "bodylabfire.appspot.com",
    messagingSenderId: "298581608652"
};
const fire = firebase.initializeApp(config);

export default fire;