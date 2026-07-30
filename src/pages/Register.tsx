import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { authService } from "../services/authService";

export default function Register() {

  const navigate = useNavigate();


  const [nickname, setNickname] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();


    if (!nickname.trim()) {
      toast.error(
        "Введіть нікнейм"
      );
      return;
    }


    try {

      await authService.register(
        nickname.trim(),
        email,
        password
      );

      toast.success(
        "Акаунт успішно створено!"
      );


      navigate("/");


    } catch (error: any) {

      toast.error(
        error.message
      );

    }

  }


  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >

        <h1 className="mb-6 text-center text-3xl font-bold">
          Реєстрація
        </h1>


        <input
          type="text"
          placeholder="Нікнейм"
          value={nickname}
          maxLength={30}
          onChange={(e) =>
            setNickname(e.target.value)
          }
          className="mb-4 w-full rounded-xl border p-3"
          required
        />


        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-4 w-full rounded-xl border p-3"
          required
        />


        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="mb-6 w-full rounded-xl border p-3"
          required
        />


        <button
          className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700"
        >
          Зареєструватися
        </button>


        <p className="mt-6 text-center">

          Уже є акаунт?{" "}

          <Link
            to="/login"
            className="font-semibold text-green-600"
          >
            Увійти
          </Link>

        </p>


      </form>

    </div>

  );
}