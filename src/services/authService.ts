import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export const authService = {
  async register(
    nickname: string,
    email: string,
    password: string
  ) {
    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email,
          nickname,
          photoURL: "",
          createdAt: serverTimestamp(),
        }
      );

      return result;
    } catch (e: any) {
      console.error("REGISTER ERROR");
      console.error(e);
      console.error("CODE:", e.code);
      console.error("MESSAGE:", e.message);
      throw e;
    }
  },

  async login(
    email: string,
    password: string
  ) {
    try {
      return await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (e: any) {
      console.error("LOGIN ERROR");
      console.error(e);
      console.error("CODE:", e.code);
      console.error("MESSAGE:", e.message);
      throw e;
    }
  },

  async loginWithGoogle() {
    try {
      const result =
        await signInWithPopup(
          auth,
          googleProvider
        );

      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email: result.user.email ?? "",
          nickname:
            result.user.displayName ||
            result.user.email?.split("@")[0] ||
            "Користувач",
          photoURL:
            result.user.photoURL ?? "",
          createdAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      return result;
    } catch (e: any) {
      console.error("GOOGLE LOGIN ERROR");
      console.error(e);
      console.error("CODE:", e.code);
      console.error("MESSAGE:", e.message);
      throw e;
    }
  },

  async updatePhoto(
    uid: string,
    photoURL: string
  ) {
    await setDoc(
      doc(db, "users", uid),
      {
        photoURL,
      },
      {
        merge: true,
      }
    );
  },

  logout() {
    return signOut(auth);
  },
};