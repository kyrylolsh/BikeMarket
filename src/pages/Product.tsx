import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../components/Loader/Loader";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { chatService } from "../services/chatService";
import { productService } from "../services/productService";
import type { Product } from "../types/Product";

export default function ProductPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      const data = await productService.getById(id!);

      if (data) {
        setProduct(data);
      }

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  async function handleChat() {
    if (!product) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.uid === product.sellerId) {
      toast.error("Це ваше власне оголошення.");
      return;
    }

    try {
      const chatId =
        await chatService.createOrGetChat(
          user.uid,
          user.email ?? "",

          product.sellerId!,
          product.sellerEmail ?? "",

          product.id,
          product.name,
          product.image,
          product.price
        );

      navigate(`/chat/${chatId}`);
    } catch {
      toast.error("Не вдалося відкрити чат");
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">
          Товар не знайдено
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-2">

        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-3xl shadow-xl"
        />

        <div>

          <p className="text-lg text-gray-500">
            {product.brand}
          </p>

          <h1 className="mt-3 text-5xl font-bold">
            {product.name}
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            {product.description}
          </p>

          <p className="mt-6 text-xl">
            Категорія:
            <span className="ml-2 font-bold">
              {product.category}
            </span>
          </p>

          <div className="mt-8 rounded-xl border p-5">

            <p className="font-semibold">
              👤 Продавець
            </p>

            <p className="mt-2">
              {product.sellerEmail}
            </p>

            <Link
              to={`/seller/${product.sellerId}`}
              className="mt-4 inline-block text-green-600 hover:underline"
            >
              Всі оголошення продавця →
            </Link>

          </div>

          <p className="mt-8 text-5xl font-bold text-green-600">
            {product.price.toLocaleString()} ₴
          </p>

          <button
            onClick={() => addToCart(product)}
            className="mt-10 w-full rounded-xl bg-green-600 px-8 py-4 text-xl font-semibold text-white hover:bg-green-700"
          >
            🛒 Додати у кошик
          </button>

          {user &&
            user.uid !== product.sellerId && (
              <button
                onClick={handleChat}
                className="mt-4 w-full rounded-xl bg-blue-600 px-8 py-4 text-xl font-semibold text-white hover:bg-blue-700"
              >
                💬 Написати продавцю
              </button>
            )}

        </div>

      </div>
    </div>
  );
}