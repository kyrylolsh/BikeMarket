import { useEffect, useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";
import type { Product } from "../types/Product";
import { FIELD_LIMITS } from "../utils/limits";

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

    if (!product.name.trim()) {
      toast.error("Введіть назву");
      return;
    }

    if (!product.description.trim()) {
      toast.error("Введіть опис");
      return;
    }

    if (
      product.name.length >
      FIELD_LIMITS.productName
    ) {
      toast.error(
        `Назва максимум ${FIELD_LIMITS.productName} символів`
      );
      return;
    }

    if (
      product.brand &&
      product.brand.length >
        FIELD_LIMITS.brand
    ) {
      toast.error(
        `Бренд максимум ${FIELD_LIMITS.brand} символів`
      );
      return;
    }

    if (
      product.description.length >
      FIELD_LIMITS.description
    ) {
      toast.error(
        `Опис максимум ${FIELD_LIMITS.description} символів`
      );
      return;
    }

    if (
      product.type !== "event" &&
      product.type !== "wanted" &&
      product.price <= 0
    ) {
      toast.error("Вкажіть ціну");
      return;
    }

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
        <div>
          <input
            value={product.name}
            maxLength={
              FIELD_LIMITS.productName
            }
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
            placeholder="Назва"
          />

          <p className="mt-1 text-sm text-gray-500">
            {product.name.length}/
            {FIELD_LIMITS.productName}
          </p>
        </div>

        {product.type !== "event" && (
          <div>
            <input
              value={product.brand ?? ""}
              maxLength={
                FIELD_LIMITS.brand
              }
              onChange={(e) =>
                setProduct({
                  ...product,
                  brand: e.target.value,
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Бренд"
            />

            <p className="mt-1 text-sm text-gray-500">
              {(product.brand ?? "")
                .length}
              /
              {FIELD_LIMITS.brand}
            </p>
          </div>
        )}

        <div>
          <textarea
            value={product.description}
            maxLength={
              FIELD_LIMITS.description
            }
            onChange={(e) =>
              setProduct({
                ...product,
                description:
                  e.target.value,
              })
            }
            className="w-full rounded-xl border p-3"
            placeholder="Опис"
            rows={6}
          />

          <p className="mt-1 text-sm text-gray-500">
            {
              product.description
                .length
            }
            /
            {
              FIELD_LIMITS.description
            }
          </p>
        </div>

        {product.type !== "event" &&
          product.type !== "wanted" && (
            <input
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: Number(
                    e.target.value
                  ),
                })
              }
              className="w-full rounded-xl border p-3"
              placeholder="Ціна"
            />
          )}

        {product.type === "wanted" && (
          <input
            type="number"
            value={product.price}
            onChange={(e) =>
              setProduct({
                ...product,
                price: Number(
                  e.target.value
                ),
              })
            }
            className="w-full rounded-xl border p-3"
            placeholder="Бюджет"
          />
        )}

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