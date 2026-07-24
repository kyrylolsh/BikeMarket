import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard/ProductCard";
import CategoryCard from "../components/CategoryCard/CategoryCard";

import { useProducts } from "../hooks/useProducts";
import Loader from "../components/Loader/Loader";
import { categories } from "../data/categories";

export default function Home() {
    const { products, loading } = useProducts();

      if (loading) {
        return <Loader />;
      }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 px-12 py-20 text-white">

        <h1 className="text-6xl font-extrabold">
          BikeMarket
        </h1>

        <p className="mt-6 max-w-2xl text-xl">
          Найкращий магазин велосипедів в Україні.
          MTB, Road, BMX та електровелосипеди.
        </p>

        <Link
          to="/catalog"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-green-600 transition hover:scale-105"
        >
          Перейти в каталог
        </Link>

      </section>

      {/* Categories */}

      <section className="mt-20">

        <h2 className="mb-8 text-4xl font-bold">
          Категорії
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              emoji={category.emoji}
            />
          ))}

        </div>

      </section>

      {/* Products */}

      <section className="mt-20">

        <h2 className="mb-8 text-4xl font-bold">
          Популярні велосипеди
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </section>

    </div>
  );
}