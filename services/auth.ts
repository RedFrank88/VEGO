import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { t } from "../i18n";

function getFirebaseAuthMessage(error: any): string {
  const code = error?.code;
  const translations = t();
  switch (code) {
    case "auth/email-already-in-use":
      return translations.auth_email_already_in_use;
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return translations.auth_invalid_credential;
    case "auth/user-not-found":
      return translations.auth_user_not_found;
    default:
      return error?.message || translations.error;
  }
}

export { getFirebaseAuthMessage };

export async function signUp(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });
  await setDoc(doc(db, "users", credential.user.uid), {
    email,
    displayName,
    ecoPoints: 0,
    createdAt: serverTimestamp(),
  });
  return credential.user;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function deleteAccount(password: string) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("No authenticated user");

  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
}
