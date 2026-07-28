import { Navigate, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  if (loading) {
    return (
      <div className="p-10 text-center">
        Завантаження...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleLogout() {
    try {
      await logout();

      toast.success("Ви успішно вийшли");

      navigate("/");
    } catch {
      toast.error("Помилка виходу");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        👤 Мій профіль
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow">

        <p className="text-lg">
          <span className="font-bold">
            Email:
          </span>{" "}
          {user.email}
        </p>

        <p className="mt-4 text-lg">
          <span className="font-bold">
            UID:
          </span>{" "}
          {user.uid}
        </p>

        <p className="mt-4 text-lg">
          <span className="font-bold">
            Email підтверджено:
          </span>{" "}
          {user.emailVerified ? "Так" : "Ні"}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">

          <Link
            to="/orders"
            className="rounded-xl bg-green-600 px-6 py-4 text-center font-bold text-white transition hover:bg-green-700"
          >
            📦 Мої замовлення
          </Link>

          <Link
            to="/my-listings"
            className="rounded-xl bg-blue-600 px-6 py-4 text-center font-bold text-white transition hover:bg-blue-700"
          >
            🚲 Мої оголошення
          </Link>

          <Link
            to="/sell"
            className="rounded-xl bg-emerald-600 px-6 py-4 text-center font-bold text-white transition hover:bg-emerald-700"
          >
            ➕ Продати велосипед
          </Link>

        <Link
          to="/seller-orders"
          className="rounded-xl bg-orange-600 px-6 py-4 text-center font-bold text-white hover:bg-orange-700"
        >
          📦 Замовлення клієнтів
        </Link>

          <Link
            to="/messages"
            className="rounded-xl bg-indigo-600 px-6 py-4 text-center font-bold text-white transition hover:bg-indigo-700"
          >
            💬 Мої повідомлення
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600 md:col-span-2"
          >
            🚪 Вийти
          </button>

        </div>

      </div>

    </div>
  );
}