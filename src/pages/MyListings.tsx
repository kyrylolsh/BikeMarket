import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";
import type { Product } from "../types/Product";

export default function MyListings() {
  const { user, loading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [tab, setTab] = useState<
    "bike" | "gear" | "exchange" | "event" | "wanted"
  >("bike");

  async function loadProducts() {
    if (!user?.email) return;

    const data =
      await productService.getUserProducts(user.email);

    setProducts(data);
    setPageLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.type === tab
    );
  }, [products, tab]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Завантаження...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (pageLoading) {
    return (
      <div className="p-10 text-center">
        Завантаження оголошень...
      </div>
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити оголошення?")) {
      return;
    }

    try {
      await productService.deleteProduct(id);

      toast.success("Оголошення видалено");

      loadProducts();
    } catch {
      toast.error("Помилка видалення");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-10 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          🚲 Мої оголошення
        </h1>

        <Link
          to="/sell"
          className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
        >
          + Нове оголошення
        </Link>

      </div>

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

        <button
          onClick={() => setTab("exchange")}
          className={`rounded-xl px-5 py-3 font-semibold ${
            tab === "exchange"
              ? "bg-green-600 text-white"
              : "bg-white shadow"
          }`}
        >
          🔄 Обмін
        </button>

      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">

          <h2 className="text-2xl font-bold">
            Тут поки що немає оголошень
          </h2>

        </div>
      ) : (
        <div className="space-y-5">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center"
            >

              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-36 w-36 rounded-xl object-cover"
                />
              )}

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {product.name}
                </h2>

                {product.brand && (
                  <p className="mt-2 text-gray-500">
                    {product.brand}
                  </p>
                )}

                <p className="mt-2 text-gray-500">
                  {product.category}
                </p>

                {product.type === "event" ? (
                  <>
                    <p className="mt-3 text-lg">
                      📅 {product.eventDate}
                    </p>

                    <p className="text-lg">
                      📍 {product.eventLocation}
                    </p>
                  </>
                ) : product.type === "exchange" ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-2xl font-bold text-blue-600">
                      🔄 Обмін
                    </p>

                    <p className="text-gray-600">
                      Категорія:
                      {" "}
                      <b>{product.category}</b>
                    </p>
                  </div>
                ) : product.type === "wanted" ? (
                  <p className="mt-3 text-3xl font-bold text-blue-600">
                    💰 Бюджет: {product.price.toLocaleString()} ₴
                  </p>
                ) : (
                  <p className="mt-3 text-3xl font-bold text-green-600">
                    {product.price.toLocaleString()} ₴
                  </p>
                )}

              </div>

              <div className="flex gap-3">

                <Link
                  to={`/product/${product.id}`}
                  className="rounded-lg bg-blue-500 px-5 py-3 text-white hover:bg-blue-600"
                >
                  Переглянути
                </Link>

                <Link
                  to={`/edit-product/${product.id}`}
                  className="rounded-lg bg-yellow-500 px-5 py-3 text-white hover:bg-yellow-600"
                >
                  Редагувати
                </Link>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg bg-red-500 px-5 py-3 text-white hover:bg-red-600"
                >
                  Видалити
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}