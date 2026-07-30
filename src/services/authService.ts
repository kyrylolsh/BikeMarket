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
  updateDoc,
  setDoc as setUserDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";


const googleProvider =
  new GoogleAuthProvider();



export const authService = {


  async register(
    nickname: string,
    email: string,
    password: string
  ) {


    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );



    await setDoc(
      doc(
        db,
        "users",
        result.user.uid
      ),
      {

        uid:
          result.user.uid,

        email,

        nickname,

        photoURL:
          "",

        createdAt:
          serverTimestamp(),

      }
    );


    return result;

  },



  login(
    email: string,
    password: string
  ) {

    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  },



  async loginWithGoogle() {


    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );



    await setDoc(

      doc(
        db,
        "users",
        result.user.uid
      ),

      {

        uid:
          result.user.uid,


        email:
          result.user.email ?? "",


        nickname:
          result.user.displayName ||
          result.user.email?.split("@")[0] ||
          "Користувач",


        photoURL:
          result.user.photoURL ?? "",


        createdAt:
          serverTimestamp(),

      },

      {
        merge:true,
      }

    );


    return result;

  },



  async updatePhoto(
    uid:string,
    photoURL:string
  ){

    await setUserDoc(
      doc(
        db,
        "users",
        uid
      ),
      {
        photoURL,
      },
      {
        merge:true,
      }
    );

  },



  logout(){

    return signOut(auth);

  },


};