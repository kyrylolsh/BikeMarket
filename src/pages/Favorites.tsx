import ProductCard from "../components/ProductCard/ProductCard";
import { useFavorites } from "../context/FavoritesContext";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        ❤️ Обрані товари
      </h1>

      {favorites.length === 0 ? (
        <div className="rounded-2xl bg-gray-100 p-10 text-center">
          <p className="text-xl text-gray-500">
            У вас поки немає обраних товарів.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {favorites.map((product) => (
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