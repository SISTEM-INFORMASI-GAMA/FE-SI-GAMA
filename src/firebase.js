import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCSwQl05qNMb9CZctZiT0FN-GNfrtB23LI',
  authDomain: 'wehealth-23675.firebaseapp.com',
  projectId: 'wehealth-23675',
  storageBucket: 'wehealth-23675.appspot.com',
  messagingSenderId: '162890564283',
  appId: '1:162890564283:web:7e50307209bf5868cbdf9e',
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Iitialize Firestore
export const db = getFirestore(app);
