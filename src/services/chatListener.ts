import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

import type { Chat } from "./chatService";

export function listenUserChats(
  userId: string,
  callback: (chats: Chat[]) => void
) {
  const q = query(
    collection(db, "chats"),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs
      .map((doc) => {

        const data = doc.data() as Chat;

        return {
          id: doc.id,

          buyerId: data.buyerId,
          buyerEmail: data.buyerEmail,

          sellerId: data.sellerId,
          sellerEmail: data.sellerEmail,

          productId: data.productId,
          productName: data.productName,
          productImage: data.productImage,
          productPrice: data.productPrice,

          lastMessage: data.lastMessage,

          buyerUnread:
            data.buyerUnread ?? 0,

          sellerUnread:
            data.sellerUnread ?? 0,

          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      })
      .filter(
        (chat) =>
          chat.buyerId === userId ||
          chat.sellerId === userId
      );


    callback(chats);

  });
}