import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const storageBucketEnv = import.meta.env.VITE_STORAGEBUCKET || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "";
// Normaliza bucket caso venha com o prefixo gs://
const cleanStorageBucket = storageBucketEnv.replace(/^gs:\/\//, "");

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECTID || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_DATABASEURL || import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: cleanStorageBucket,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APPID || import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENTID || import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validação em desenvolvimento para alertar variáveis faltantes
if (!firebaseConfig.apiKey && import.meta.env.DEV) {
  console.error(
    "⚠️ Configuração do Firebase ausente! Verifique se o arquivo .env contém todas as chaves VITE_*."
  );
}

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
export { app, firebase };
export default firebase;
