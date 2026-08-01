import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import { useProducts } from "../hooks/useProducts";

export default function Search() {
  const { products, loading } = useProducts();

  const [params] = useSearchParams();

  const query = (params.get("query") || "").toLowerCase();

  const filtered = useMemo(() => {
    if (!query) return [];

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }, [products, query]);

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Результати пошуку
      </h1>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-gray-100 p-10 text-center">
          Нічого не знайдено
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((product) => (
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