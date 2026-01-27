import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
}

// Validate Firebase config
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId

if (!isConfigured) {
  console.warn('Firebase configuration is missing. Please add your Firebase credentials to Vercel environment variables.')
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

// Only initialize Firebase if configuration is valid
if (isConfigured) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    
    // Enable offline persistence
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support offline persistence.')
        }
      })
    }
  } else {
    app = getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
  }
}

export { app, auth, db, isConfigured }
