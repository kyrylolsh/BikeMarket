import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";

export default function Sell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    image: "",
    price: "",
  });

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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !form.name ||
      !form.brand ||
      !form.category ||
      !form.description ||
      !form.image ||
      !form.price
    ) {
      toast.error("Заповніть усі поля");
      return;
    }

    try {
      await productService.addProduct({
        name: form.name,
        brand: form.brand,
        category: form.category,
        description: form.description,
        image: form.image,
        price: Number(form.price),

        sellerId: user.uid,
        sellerEmail: user.email ?? "",

        createdAt: new Date(),
      });

      toast.success("Оголошення успішно опубліковано!");

      setForm({
        name: "",
        brand: "",
        category: "",
        description: "",
        image: "",
        price: "",
      });

      navigate("/catalog");
    } catch {
      toast.error("Не вдалося опублікувати оголошення");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        🚲 Продати велосипед
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl bg-white p-6 shadow"
      >
        <input
          placeholder="Назва велосипеда"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Бренд"
          value={form.brand}
          onChange={(e) =>
            setForm({
              ...form,
              brand: e.target.value,
            })
          }
          className="rounded-xl border p-3"
        />

        <input
          placeholder="Категорія (MTB, Road, BMX...)"
          value={form.category}
          onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value,
            })
          }
          className="rounded-xl border p-3"
        />

        <textarea
          rows={4}
          placeholder="Опис"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="rounded-xl border p-3"
        />

        <input
          placeholder="URL фотографії"
          value={form.image}
          onChange={(e) =>
            setForm({
              ...form,
              image: e.target.value,
            })
          }
          className="rounded-xl border p-3"
        />

        <input
          type="number"
          placeholder="Ціна"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
          className="rounded-xl border p-3"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
        >
          🚀 Опублікувати оголошення
        </button>
      </form>
    </div>
  );
}