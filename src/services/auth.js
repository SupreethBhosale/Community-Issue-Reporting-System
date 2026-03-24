import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  updateProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const registerWithEmail = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    });
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error('Invalid email or password. Please check your credentials or click Sign Up to create an account first.');
    }
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Save user data if not exists (using merge allows not overwriting role)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error) {
    throw error;
  }
};

export const setupRecaptcha = (buttonId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: 'invisible',
  });
};

export const sendOTP = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return true;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (otp) => {
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;
    
    // Save user
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      lastLogin: new Date().toISOString()
    }, { merge: true });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  return firebaseSignOut(auth);
};
