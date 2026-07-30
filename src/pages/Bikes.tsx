import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSliders } from "react-icons/fi";

import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import FiltersPanel from "../components/Filters/FiltersPanel";

import { useProducts } from "../hooks/useProducts";

import { bikeCategories } from "../data/bikeCategories";

export default function Catalog() {
  const { products, loading } = useProducts();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const search =
    searchParams.get("search") || "";

  const category =
    searchParams.get("category") || "All";

  const sort =
    searchParams.get("sort") || "default";

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [brand, setBrand] =
    useState("All");

  const [condition, setCondition] =
    useState("All");

  function resetFilters() {
    setMinPrice("");
    setMaxPrice("");
    setBrand("All");
    setCondition("All");
  }

  const brands = useMemo(() => {
    return [...new Set(products.map((p) => p.brand))].sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          product.brand
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          product.category
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter(
        (product) =>
          product.category === category
      );
    }

    if (minPrice) {
      result = result.filter(
        (product) =>
          product.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      result = result.filter(
        (product) =>
          product.price <= Number(maxPrice)
      );
    }

    if (brand !== "All") {
      result = result.filter(
        (product) =>
          product.brand === brand
      );
    }

    if (condition !== "All") {
      result = result.filter(
        (product) =>
          product.condition === condition
      );
    }

    switch (sort) {
      case "cheap":
        result.sort(
          (a, b) => a.price - b.price
        );
        break;

      case "expensive":
        result.sort(
          (a, b) => b.price - a.price
        );
        break;

      case "newest":
        result.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );
        break;

      case "oldest":
        result.sort(
          (a, b) =>
            (a.createdAt?.seconds || 0) -
            (b.createdAt?.seconds || 0)
        );
        break;
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
    minPrice,
    maxPrice,
    brand,
    condition,
  ]);

  if (loading) {
    return <Loader />;
  }
return (
  <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

    {/* Header */}

    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <h1 className="text-3xl font-bold sm:text-4xl">
        Каталог велосипедів
      </h1>

      <button
        onClick={() => setFiltersOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
      >
        <FiSliders />
        Фільтри
      </button>

    </div>

    {/* Search */}

    <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">

      <input
        type="text"
        value={search}
        placeholder="Пошук велосипеда..."
        onChange={(e) =>
          setSearchParams({
            search: e.target.value,
            category,
            sort,
          })
        }
        className="rounded-xl border p-3 outline-none transition focus:border-green-600"
      />

      <select
        value={category}
        onChange={(e) =>
          setSearchParams({
            search,
            category: e.target.value,
            sort,
          })
        }
        className="rounded-xl border p-3"
      >
        <option value="All">
          Усі категорії
        </option>

        {bikeCategories.map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}

      </select>

      <select
        value={sort}
        onChange={(e) =>
          setSearchParams({
            search,
            category,
            sort: e.target.value,
          })
        }
        className="rounded-xl border p-3"
      >
        <option value="default">
          Без сортування
        </option>

        <option value="newest">
          Спочатку нові
        </option>

        <option value="oldest">
          Спочатку старі
        </option>

        <option value="cheap">
          Спочатку дешеві
        </option>

        <option value="expensive">
          Спочатку дорогі
        </option>

      </select>

    </div>

    {/* Products */}

    {filteredProducts.length === 0 ? (

      <div className="rounded-xl bg-gray-100 p-10 text-center text-gray-500">
        За вашим запитом товарів не знайдено.
      </div>

    ) : (

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    )}

    <FiltersPanel
      open={filtersOpen}
      onClose={() => setFiltersOpen(false)}
      minPrice={minPrice}
      maxPrice={maxPrice}
      setMinPrice={setMinPrice}
      setMaxPrice={setMaxPrice}
      brand={brand}
      setBrand={setBrand}
      condition={condition}
      setCondition={setCondition}
      brands={brands}
      onReset={resetFilters}
    />

  </div>
);

}