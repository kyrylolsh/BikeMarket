import { useMemo, useState } from "react";

import Loader from "../components/Loader/Loader";
import ProductCard from "../components/ProductCard/ProductCard";

import { useProducts } from "../hooks/useProducts";

export default function Wanted() {
  const { products, loading } = useProducts();

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product.type === "wanted")
      .filter((product) =>
        product.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [products, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        🔎 Куплю
      </h1>

      <input
        type="text"
        placeholder="Пошук..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full rounded-xl border p-4"
      />

      {filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          Поки що немає оголошень.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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