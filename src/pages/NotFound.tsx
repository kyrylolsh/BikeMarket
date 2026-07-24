import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>

      <p className="mt-4 text-gray-600">
        Сторінку не знайдено
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-white hover:bg-green-700"
      >
        На головну
      </Link>
    </div>
  );
}