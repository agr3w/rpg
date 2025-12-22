// firebase-config.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

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

// evita duplicate-app: reutiliza app se já existir
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// usar API compat para Database/Storage (consistente com o restante do código)
const database = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();

export { app, firebase, database, storage, auth };


