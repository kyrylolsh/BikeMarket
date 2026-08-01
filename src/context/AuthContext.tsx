import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";



interface AppUser {

  uid: string;

  email: string | null;

  nickname: string;

  photoURL?: string;

}



interface AuthContextType {

  user: AppUser | null;

  loading: boolean;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

}



const AuthContext =
  createContext<AuthContextType | null>(
    null
  );





export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {


  const [user, setUser] =
    useState<AppUser | null>(null);


  const [loading, setLoading] =
    useState(true);





  async function loadUser() {

    if (!auth.currentUser) {

      setUser(null);

      return;

    }



    const userSnapshot =
      await getDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid
        )
      );



    const userData =
      userSnapshot.exists()
        ? userSnapshot.data()
        : {};



    setUser({

      uid:
        auth.currentUser.uid,


      email:
        auth.currentUser.email,


      nickname:
        userData.nickname ??
        "Користувач",


      photoURL:
        userData.photoURL ??
        auth.currentUser.photoURL ??
        "",

    });

  }





  useEffect(() => {


    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {


          if (!currentUser) {

            setUser(null);

            setLoading(false);

            return;

          }



          await loadUser();



          setLoading(false);


        }
      );



    return unsubscribe;


  }, []);







  async function refreshUser() {

    await loadUser();

  }







  async function logout() {
    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");

    setUser(null);

    await signOut(auth);
  }






  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        logout,

        refreshUser,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}







export function useAuth() {


  const context =
    useContext(AuthContext);



  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }



  return context;

}