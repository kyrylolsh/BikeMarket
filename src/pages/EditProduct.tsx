import { useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

import {
  productService,
} from "../services/productService";

import type { Product } from "../types/Product";


export default function EditProduct() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user, loading } = useAuth();


  const [product, setProduct] =
    useState<Product | null>(null);


  const [saving, setSaving] =
    useState(false);


  useEffect(() => {

    async function load() {

      if (!id) return;

      const data =
        await productService.getById(id);


      setProduct(data);
    }


    load();

  }, [id]);



  if (loading) {
    return (
      <div className="p-10 text-center">
        Завантаження...
      </div>
    );
  }


  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }



  if (
    product &&
    product.sellerId !== user.uid
  ) {

    return (
      <div className="p-10 text-center">

        <h1 className="text-3xl font-bold">
          🚫 Доступ заборонено
        </h1>

        <p className="mt-4">
          Ви не є власником цього оголошення
        </p>

      </div>
    );
  }



  if (!product) {
    return (
      <div className="p-10 text-center">
        Завантаження...
      </div>
    );
  }



  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();


    try {

      setSaving(true);


      await productService.updateProduct(
        product.id,
        product
      );


      toast.success(
        "Оголошення оновлено"
      );


      navigate(
        `/product/${product.id}`
      );


    } catch {

      toast.error(
        "Помилка оновлення"
      );

    } finally {

      setSaving(false);

    }

  }



  return (

    <div className="mx-auto max-w-3xl px-6 py-10">


      <h1 className="mb-8 text-4xl font-bold">
        ✏️ Редагування оголошення
      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-8 shadow"
      >


        <input

          value={product.name}

          onChange={(e)=>
            setProduct({
              ...product,
              name:e.target.value
            })
          }

          className="w-full rounded-xl border p-3"

          placeholder="Назва"

        />



        <textarea

          value={product.description}

          onChange={(e)=>
            setProduct({
              ...product,
              description:e.target.value
            })
          }

          className="w-full rounded-xl border p-3"

          placeholder="Опис"

        />



        <input

          type="number"

          value={product.price}

          onChange={(e)=>
            setProduct({
              ...product,
              price:Number(e.target.value)
            })
          }

          className="w-full rounded-xl border p-3"

          placeholder="Ціна"

        />



        <button

          disabled={saving}

          className="w-full rounded-xl bg-green-600 py-4 text-xl font-bold text-white hover:bg-green-700"

        >

          {saving
            ? "Збереження..."
            : "💾 Зберегти"}

        </button>


      </form>


    </div>

  );
}