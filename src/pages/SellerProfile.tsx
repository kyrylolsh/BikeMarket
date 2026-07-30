import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../components/Loader/Loader";
import ProductCard from "../components/ProductCard/ProductCard";
import { productService } from "../services/productService";
import type { Product } from "../types/Product";

export default function SellerProfile() {
  const { sellerId } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!sellerId) {
        setLoading(false);
        return;
      }

      const data =
        await productService.getSellerProducts(
          sellerId
        );

      setProducts(data);
      setLoading(false);
    }

    loadProducts();
  }, [sellerId]);

  if (loading) {
    return <Loader />;
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-6 text-4xl font-bold">
          🚲 Оголошення продавця
        </h1>

        <p className="text-gray-500">
          У цього продавця ще немає активних
          оголошень.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <h1 className="mb-3 text-4xl font-bold">
        🚲 Оголошення продавця
      </h1>

      <p className="mb-10 text-lg text-gray-500">
        👤 {products[0].sellerNickname ?? "Користувач"}
      </p>

      <p className="mb-8 text-gray-500">
        Всього оголошень:{" "}
        <span className="font-bold">
          {products.length}
        </span>
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </div>
  );
}