import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderEmail: string;
  createdAt: any;
}

export const messageService = {
  async send(
    chatId: string,
    text: string,
    senderId: string,
    senderEmail: string
  ) {
    await addDoc(
      collection(db, "chats", chatId, "messages"),
      {
        text,
        senderId,
        senderEmail,
        createdAt: serverTimestamp(),
      }
    );
  },

  subscribe(
    chatId: string,
    callback: (messages: Message[]) => void
  ) {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt")
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      callback(messages);
    });
  },
};