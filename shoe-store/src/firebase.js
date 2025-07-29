
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBAr3LNQPI48QETNep6-cnGjue9eGzYulk',
  authDomain: 'cyman-wears.firebaseapp.com',
  projectId: 'cyman-wears',
  storageBucket: 'cyman-wears.firebasestorage.app',
  messagingSenderId: '241725201665',
  appId: '1:241725201665:web:626e01eadd553dc22d4f00',
  measurementId: 'G-2EBY221JSP',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);