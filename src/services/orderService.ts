import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Product } from "../types/Product";

interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;

  buyerId: string;

  name: string;
  phone: string;
  email: string;
  address: string;
  payment: string;

  items: OrderItem[];

  total: number;

  status: string;

  createdAt: any;
}

interface CreateOrder {
  buyerId: string;

  name: string;
  phone: string;
  email: string;
  address: string;
  payment: string;

  items: OrderItem[];

  total: number;
}

export const orderService = {
  async create(order: CreateOrder) {
    await addDoc(collection(db, "orders"), {
      ...order,
      status: "Нове",
      createdAt: new Date(),
    });
  },

  async getUserOrders(
    email: string
  ): Promise<Order[]> {
    const q = query(
      collection(db, "orders"),
      where("email", "==", email)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  },

  async getSellerOrders(
    sellerId: string
  ): Promise<Order[]> {
    const snapshot = await getDocs(
      collection(db, "orders")
    );

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];

    return orders.filter((order) =>
      order.items.some(
        (item) => item.sellerId === sellerId
      )
    );
  },

  async markOrdersAsViewed(
    sellerId: string
  ) {
    const snapshot = await getDocs(
      collection(db, "orders")
    );

    for (const document of snapshot.docs) {
      const order = document.data() as Order;

      const hasMyProducts = order.items.some(
        (item) => item.sellerId === sellerId
      );

      if (
        hasMyProducts &&
        order.status === "Нове"
      ) {
        await updateDoc(
          doc(db, "orders", document.id),
          {
            status: "Переглянуто",
          }
        );
      }
    }
  },
};