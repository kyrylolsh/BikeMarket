import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";
import type { Product } from "../types/Product";

export const productService = {
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(
      collection(db, "products")
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    const snapshot = await getDoc(
      doc(db, "products", id)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Product;
  },

  async addProduct(
    product: Omit<Product, "id">
  ): Promise<void> {
    await addDoc(
      collection(db, "products"),
      product
    );
  },

  async updateProduct(
    id: string,
    product: Omit<Product, "id">
  ): Promise<void> {
    await updateDoc(
      doc(db, "products", id),
      {
        ...product,
      }
    );
  },

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(
      doc(db, "products", id)
    );
  },

  async getUserProducts(
    email: string
  ): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("sellerEmail", "==", email)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  },

  async getSellerProducts(
    sellerId: string
  ): Promise<Product[]> {
    const q = query(
      collection(db, "products"),
      where("sellerId", "==", sellerId)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  },
};