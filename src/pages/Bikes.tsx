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

    if (
      condition !== "All" &&
      "condition" in result[0]
    ) {
      result = result.filter(
        (product: any) =>
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
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8 flex items-center justify-between">

          <h1 className="text-4xl font-bold">
            Каталог велосипедів
          </h1>

          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            <FiSliders />
            Фільтри
          </button>

        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-3">

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
            className="rounded-xl border p-3 outline-none focus:border-green-600"
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
          onReset={resetFilters}
        />

      </div>
        );
      }