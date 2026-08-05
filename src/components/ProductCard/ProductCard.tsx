import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

import type { Product } from "../../types/Product";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { user } = useAuth();

  const { addToCart } = useCart();

  const {
    addToFavorites,
    removeFromFavorites,
  } = useFavorites();

  const favorite =
    !!user &&
    (product.likedBy ?? []).includes(user.uid);

  const [pulse, setPulse] = useState(false);

  async function handleFavorite() {
    if (!user) return;

    setPulse(true);

    setTimeout(() => {
      setPulse(false);
    }, 300);

    if (favorite) {
      await removeFromFavorites(product);
    } else {
      await addToFavorites(product);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">

      {/* Фото */}
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-60 w-full object-cover"
          />
        </Link>

        {/* Бейдж лайків */}
        <div
          className={`absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm transition-transform duration-300 ${
            pulse ? "scale-125" : "scale-100"
          }`}
        >
          <FiHeart
            className="text-red-500"
            size={18}
          />

          <span className="font-semibold text-gray-800">
            {product.likes ?? 0}
          </span>
        </div>
      </div>

      <div className="p-5">
        {product.brand && (
          <p className="text-sm text-gray-500">
            {product.brand}
          </p>
        )}

        <Link to={`/product/${product.id}`}>
          <h2 className="mt-2 text-xl font-bold hover:text-green-600">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-gray-600">
          {product.category}
        </p>

        <p className="mt-3 text-sm text-gray-500">
          {product.type === "wanted"
            ? `🔎 Шукає: ${
                product.sellerNickname ??
                "Користувач"
              }`
            : `👤 ${
                product.sellerNickname ??
                "Користувач"
              }`}
        </p>

        {/* Ціна */}
        {product.type === "wanted" ? (
          <p className="mt-4 text-2xl font-bold text-blue-600">
            💰 Бюджет{" "}
            {product.negotiable
              ? "Договірна"
              : `${Number(
                  product.price
                ).toLocaleString()} ₴`}
          </p>
        ) : product.type === "exchange" ? (
          <p className="mt-4 text-lg font-semibold text-indigo-600">
            🔄 Обмін
          </p>
        ) : product.type === "event" ? (
          <p className="mt-4 text-lg font-semibold text-orange-600">
            📅 Велоподія
          </p>
        ) : (
          <p className="mt-4 text-2xl font-bold text-green-600">
            {Number(
              product.price
            ).toLocaleString()} ₴
          </p>
        )}

        {/* Обране */}
        <button
          onClick={handleFavorite}
          className={`mt-5 w-full rounded-xl border py-3 font-semibold transition ${
            favorite
              ? "border-red-500 bg-red-500 text-white"
              : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          }`}
        >
          <FiHeart className="mr-2 inline" />

          {favorite
            ? "В обраному"
            : "Додати в обране"}
        </button>

        {/* Основна кнопка */}
        {product.type === "wanted" ? (
          <Link
            to={`/product/${product.id}`}
            className="mt-3 block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Переглянути
          </Link>
        ) : product.type === "exchange" ? (
          <Link
            to={`/product/${product.id}`}
            className="mt-3 block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            🔄 Запропонувати обмін
          </Link>
        ) : (
          <button
            onClick={() => addToCart(product)}
            className="mt-3 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            🛒 Купити
          </button>
        )}
      </div>
    </div>
  );
}