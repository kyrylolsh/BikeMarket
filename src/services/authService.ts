import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

export const authService = {
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  },

  login(email: string, password: string) {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  },

  logout() {
    return signOut(auth);
  },
};