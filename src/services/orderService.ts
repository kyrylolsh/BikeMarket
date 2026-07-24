import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Product } from "../types/Product";

interface OrderItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: any;
}

interface CreateOrder {
  email: string;
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

  async getUserOrders(email: string): Promise<Order[]> {
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
};