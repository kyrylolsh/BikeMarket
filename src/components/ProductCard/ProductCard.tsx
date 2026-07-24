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

        <p className="text-sm text-gray-500">
          {product.brand}
        </p>

        <Link to={`/product/${product.id}`}>
          <h2 className="mt-2 text-xl font-bold hover:text-green-600">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 text-gray-600">
          {product.category}
        </p>

        <p className="mt-4 text-2xl font-bold text-green-600">
          {product.price.toLocaleString()} ₴
        </p>

        <button
          onClick={() =>
            favorite
              ? removeFromFavorites(product.id)
              : addToFavorites(product)
          }
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

        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Купити
        </button>

      </div>

    </div>
  );
}