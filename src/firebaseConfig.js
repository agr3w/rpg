// src/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAvR0bpQQaKEkZXE2b3MBs_Kfq54ZugupA",
    authDomain: "test-b6bc2.firebaseapp.com",
    databaseURL: "https://test-b6bc2-default-rtdb.firebaseio.com",
    projectId: "test-b6bc2",
    storageBucket: "test-b6bc2.appspot.com",
    messagingSenderId: "34622073568",
    appId: "1:34622073568:web:95f52bc1836c8add0a3e85",
    measurementId: "G-F2HZG6P3MF"
};

// Inicializa o Firebase apenas se não houver uma app existente
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporta as instâncias para usar no resto do app
export const auth = getAuth(app);
export default app;