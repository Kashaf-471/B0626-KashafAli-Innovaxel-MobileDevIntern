import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { firebaseConfig } from '../constants/firebaseConfig';

let firebaseApp: any;
let database: any;
let isFirebaseInitialized = false;

try {
  // Validate config has been updated and is not empty placeholder
  const isConfigValid = 
    firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
    firebaseConfig.databaseURL;

  if (isConfigValid) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApp();
    }
    database = getDatabase(firebaseApp);
    isFirebaseInitialized = true;
    console.log('Firebase Realtime Database initialized successfully!');
  } else {
    console.warn('Firebase configuration is missing or invalid. Falling back to local storage.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

export { firebaseApp, database, isFirebaseInitialized };
