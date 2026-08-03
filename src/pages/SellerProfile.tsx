import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Loader from "../components/Loader/Loader";
import ProductCard from "../components/ProductCard/ProductCard";
import { productService } from "../services/productService";
import type { Product } from "../types/Product";

export default function SellerProfile() {
  const { sellerId } = useParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState<
    "bike" | "gear" | "event" | "wanted"
  >("bike");

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

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.type === tab
    );
  }, [products, tab]);

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

      <p className="mb-2 text-lg text-gray-500">
        👤 {products[0].sellerNickname ?? "Користувач"}
      </p>

      <p className="mb-8 text-gray-500">
        Всього оголошень:{" "}
        <span className="font-bold">
          {products.length}
        </span>
      </p>

      {/* Tabs */}

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setTab("bike")}
          className={`rounded-xl px-5 py-3 font-semibold ${
            tab === "bike"
              ? "bg-green-600 text-white"
              : "bg-white shadow"
          }`}
        >
          🚲 Велосипеди
        </button>

        <button
          onClick={() => setTab("gear")}
          className={`rounded-xl px-5 py-3 font-semibold ${
            tab === "gear"
              ? "bg-green-600 text-white"
              : "bg-white shadow"
          }`}
        >
          🛠 Запчастини
        </button>

        <button
          onClick={() => setTab("event")}
          className={`rounded-xl px-5 py-3 font-semibold ${
            tab === "event"
              ? "bg-green-600 text-white"
              : "bg-white shadow"
          }`}
        >
          📅 Події
        </button>

        <button
          onClick={() => setTab("wanted")}
          className={`rounded-xl px-5 py-3 font-semibold ${
            tab === "wanted"
              ? "bg-green-600 text-white"
              : "bg-white shadow"
          }`}
        >
          🔎 Куплю
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-bold">
            У цій категорії оголошень немає
          </h2>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}