import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase設定（開発環境用のダミー設定）
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firestoreを初期化
export const db = getFirestore(app);

// Authenticationを初期化
export const auth = getAuth(app);

// 開発環境でエミュレーターに接続
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Firestoreエミュレーターに接続
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // 既に接続済みの場合はエラーが発生するが無視
    console.log('Firestore emulator already connected');
  }
  
  // Authエミュレーターに接続
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    // 既に接続済みの場合はエラーが発生するが無視
    console.log('Auth emulator already connected');
  }
}

export default app;