import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      await authService.login(email, password);

      toast.success("Вхід успішний!");

      navigate("/");
    } catch {
      toast.error("Неправильний email або пароль");
    }
  }

  async function handleGoogleLogin() {
    try {
      await authService.loginWithGoogle();

      toast.success("Вхід через Google успішний!");

      navigate("/");
    } catch {
      toast.error("Не вдалося увійти через Google");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          Вхід
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border p-3"
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-xl border p-3"
          required
        />

        <button
          className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700"
        >
          Увійти
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full rounded-xl border border-gray-300 bg-white py-3 font-bold text-gray-700 transition hover:bg-gray-100"
        >
          🔵 Увійти через Google
        </button>

        <p className="mt-6 text-center">
          Немає акаунта?{" "}
          <Link
            to="/register"
            className="font-semibold text-green-600"
          >
            Зареєструватися
          </Link>
        </p>
      </form>
    </div>
  );
}