import { useMemo, useState } from "react";

import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import { useProducts } from "../hooks/useProducts";

export default function Catalog() {
  const { products, loading } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Пошук
    if (search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фільтр
    if (category !== "All") {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // Сортування
    if (sort === "cheap") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "expensive") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sort]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Каталог велосипедів
      </h1>

      {/* Фільтри */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Пошук велосипеда..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border p-3 outline-none focus:border-green-600"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="All">Усі категорії</option>
          <option value="MTB">MTB</option>
          <option value="Road">Road</option>
          <option value="Mountain">Mountain</option>
          <option value="Electric">Electric</option>
          <option value="BMX">BMX</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="default">Без сортування</option>
          <option value="cheap">Спочатку дешеві</option>
          <option value="expensive">Спочатку дорогі</option>
        </select>
      </div>

      {/* Товари */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl bg-gray-100 p-8 text-center text-gray-500">
          За вашим запитом товарів не знайдено.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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