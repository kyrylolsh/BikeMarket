import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

import type { Product } from "../../types/Product";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useFavorites();

  const favorite = isFavorite(product.id);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-60 w-full object-cover"
        />
      </Link>

      <div className="p-5">
        {/* Бренд */}
        {product.brand && (
          <p className="text-sm text-gray-500">
            {product.brand}
          </p>
        )}

        {/* Назва */}
        <Link to={`/product/${product.id}`}>
          <h2 className="mt-2 text-xl font-bold hover:text-green-600">
            {product.name}
          </h2>
        </Link>

        {/* Категорія */}
        <p className="mt-2 text-gray-600">
          {product.category}
        </p>

        {/* Автор */}
        <p className="mt-3 text-sm text-gray-500">
          {product.type === "wanted"
            ? `🔎 Шукає: ${product.sellerNickname ?? "Користувач"}`
            : `👤 ${product.sellerNickname ?? "Користувач"}`}
        </p>

        {/* Ціна */}
        {product.type === "wanted" ? (
          <p className="mt-4 text-2xl font-bold text-blue-600">
            💰 Бюджет:{" "}
            {product.negotiable
              ? "Договірна"
              : `${Number(product.price).toLocaleString()} ₴`}
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
            {Number(product.price).toLocaleString()} ₴
          </p>
        )}


        {/* Кнопка */}
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
            Купити
          </button>
        )}
      </div>
    </div>
  );
}