import * as firebase from "firebase"

const devConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_DEV_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DEV_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DEV_URL,
    projectId: process.env.REACT_APP_FIREBASE_DEV_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_DEV_STORAGE,
    messagingSenderId: process.env.REACT_APP_FIREBASE_DEV_MESSAGING,
}

const prodConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_PROD_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_PROD_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_PROD_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROD_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_PROD_STORAGE,
    messagingSenderId: process.env.REACT_APP_FIREBASE_PROD_MESSAGING,
}

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig

firebase.initializeApp(config)
