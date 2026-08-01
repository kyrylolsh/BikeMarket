import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard/ProductCard";
import { useProducts } from "../hooks/useProducts";
import Loader from "../components/Loader/Loader";

export default function Home() {
  const { products, loading } = useProducts();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

      {/* Hero */}

      <section className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">

        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
          BikeMarket
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 sm:text-lg lg:text-xl">
          Найкращий маркетплейс велотоварів в Україні.
          MTB, Road, BMX та електровелосипеди.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">

          <Link
            to="/bikes"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-green-600 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:w-auto"
          >
            🚴 Купити велосипед
          </Link>

          <Link
            to="/bike-parts"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-green-600 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:w-auto"
          >
            🛠 Купити велозапчастини
          </Link>

          <Link
            to="/events"
            className="inline-flex w-full items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-green-600 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:w-auto"
          >
            📅 Переглянути велоподії
          </Link>

        </div>

      </section>

      {/* Products */}

      <section className="mt-12 sm:mt-16 lg:mt-20">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            Популярні оголошення
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/catalog"
            className="inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white"
          >
            Усі товари
          </Link>
        </div>

      </section>

    </div>
  );
}