// firebase-config.js

import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE.REACT_APP_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE.REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// evita duplicate-app: reutiliza app se já existir
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// usar API compat para Database/Storage (consistente com o restante do código)
const database = firebase.database();
const storage = firebase.storage();
const auth = firebase.auth();

export { app, firebase, database, storage, auth };


