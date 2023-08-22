// firebase-config.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAvR0bpQQaKEkZXE2b3MBs_Kfq54ZugupA",
  authDomain: "test-b6bc2.firebaseapp.com",
  projectId: "test-b6bc2",
  databaseURL: "https://test-b6bc2-default-rtdb.firebaseio.com/",
  storageBucket: "gs://test-b6bc2.appspot.com",
  messagingSenderId: "34622073568",	
  appId: "1:34622073568:web:95f52bc1836c8add0a3e85",
  measurementId: "G-F2HZG6P3MF",
};

const app = firebase.initializeApp(firebaseConfig);

export { app, firebase };


