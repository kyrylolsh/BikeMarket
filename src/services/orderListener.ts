import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Order } from "./orderService";

export function listenSellerOrders(
  sellerId: string,
  callback: (orders: Order[]) => void
) {
  return onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const orders = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((order: any) =>
          order.items?.some(
            (item: any) =>
              item.sellerId === sellerId
          )
        ) as Order[];

      callback(orders);
    }
  );
}