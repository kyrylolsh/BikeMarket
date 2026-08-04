import { useMemo, useState } from "react";

import Loader from "../components/Loader/Loader";
import ProductCard from "../components/ProductCard/ProductCard";
import SearchBar from "../components/SearchBar/SearchBar";

import { useProducts } from "../hooks/useProducts";

export default function Exchange() {
  const { products, loading } = useProducts();

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.type !== "exchange") return false;

      return (
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.brand
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        product.category
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [products, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          🔄 Обмін
        </h1>

        <p className="mt-3 text-lg text-gray-500">
          Тут користувачі пропонують обмін велосипедів та велозапчастин.
        </p>

      </div>

      <div className="mb-8">

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Пошук оголошення..."
        />

      </div>

      {filteredProducts.length === 0 ? (

        <div className="rounded-2xl bg-white p-12 text-center shadow">

          <h2 className="text-2xl font-bold">
            Поки що немає оголошень для обміну
          </h2>

          <p className="mt-3 text-gray-500">
            Станьте першим, хто запропонує обмін 🚲
          </p>

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