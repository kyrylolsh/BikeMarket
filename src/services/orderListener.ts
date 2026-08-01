import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Order } from "./orderService";


export function listenSellerOrders(
  sellerId: string,
  callback: (orders: Order[]) => void
) {

  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );


  return onSnapshot(
    q,
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
        )
        .sort((a: any, b: any) => {

          const dateA =
            a.createdAt?.toDate
              ? a.createdAt.toDate()
              : new Date(a.createdAt);


          const dateB =
            b.createdAt?.toDate
              ? b.createdAt.toDate()
              : new Date(b.createdAt);


          return dateB.getTime() - dateA.getTime();

        }) as Order[];


      callback(orders);

    }
  );
}