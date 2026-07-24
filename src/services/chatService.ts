import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export interface Chat {
  id: string;

  buyerId: string;
  buyerEmail?: string;

  sellerId: string;
  sellerEmail?: string;

  productId: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;

  createdAt: any;
  updatedAt: any;

  lastMessage: string;
}

export const chatService = {
  async createOrGetChat(
    buyerId: string,
    buyerEmail: string,
    sellerId: string,
    sellerEmail: string,
    productId: string,
    productName: string,
    productImage: string,
    productPrice: number
  ): Promise<string> {
    const q = query(
      collection(db, "chats"),
      where("buyerId", "==", buyerId),
      where("sellerId", "==", sellerId),
      where("productId", "==", productId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }

    const docRef = await addDoc(
      collection(db, "chats"),
      {
        buyerId,
        buyerEmail,

        sellerId,
        sellerEmail,

        productId,
        productName,
        productImage,
        productPrice,

        lastMessage: "",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return docRef.id;
  },

  async getBuyerChats(
    buyerId: string
  ): Promise<Chat[]> {
    const q = query(
      collection(db, "chats"),
      where("buyerId", "==", buyerId),
      orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chat[];
  },

  async getSellerChats(
    sellerId: string
  ): Promise<Chat[]> {
    const q = query(
      collection(db, "chats"),
      where("sellerId", "==", sellerId),
      orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chat[];
  },

  async getChat(
    chatId: string
  ): Promise<Chat | null> {
    const snapshot = await getDoc(
      doc(db, "chats", chatId)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Chat;
  },

  async sendMessage(
    chatId: string,
    senderId: string,
    text: string
  ) {
    await addDoc(
      collection(db, "messages"),
      {
        chatId,
        senderId,
        text,
        createdAt: serverTimestamp(),
      }
    );

    await updateDoc(
      doc(db, "chats", chatId),
      {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      }
    );
  },

  listenMessages(
    chatId: string,
    callback: (messages: Message[]) => void
  ) {
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("createdAt")
    );

    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[]
      );
    });
  },
 async deleteChat(chatId: string) {
   const messages = await getDocs(
     query(
       collection(db, "messages"),
       where("chatId", "==", chatId)
     )
   );

   for (const message of messages.docs) {
     await deleteDoc(message.ref);
   }

   await deleteDoc(doc(db, "chats", chatId));
 },
};