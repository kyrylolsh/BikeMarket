import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";

import { db } from "../firebase";
import type { Product } from "../types/Product";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        data.sort(
          (a, b) => (b.likes ?? 0) - (a.likes ?? 0)
        );

        setProducts(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    products,
    loading,
  };
}