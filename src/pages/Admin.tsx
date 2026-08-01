import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { productService } from "../services/productService";
import type { Product } from "../types/Product";

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    brand: "",

    type: "" as "" | "bike" | "gear" | "event",

    category: "",

    condition: "used" as "new" | "used",

    description: "",

    images: [] as string[],

    price: "",

    eventDate: "",
    eventLocation: "",
    phone: "",
  });

  async function loadProducts() {
    const data = await productService.getAll();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !form.type ||
      !form.name ||
      !form.description ||
      form.images.length === 0
    ) {
      toast.error("Заповніть усі поля");
      return;
    }


    if (
      form.type !== "event" &&
      (!form.brand || !form.category || !form.price)
    ) {
      toast.error("Заповніть усі поля");
      return;
    }


    if (
      form.type === "event" &&
      (!form.eventDate ||
       !form.eventLocation ||
       !form.phone)
    ) {
      toast.error("Заповніть інформацію про подію");
      return;
    }

    const productData = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      description: form.description,
      image: form.image,
      price: Number(form.price),
    };

    try {
      if (editingId) {
        await productService.updateProduct(
          editingId,
          productData
        );

        toast.success("Товар оновлено");
      } else {
        await productService.addProduct(productData);

        toast.success("Товар додано");
      }

      setForm({
        name: "",
        brand: "",
        category: "",
        description: "",
        image: "",
        price: "",
      });

      setEditingId(null);

      await loadProducts();
    } catch {
      toast.error("Сталася помилка");
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      image: product.image,
      price: product.price.toString(),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити товар?")) {
      return;
    }

    try {
      await productService.deleteProduct(id);

      toast.success("Товар видалено");

      if (editingId === id) {
        setEditingId(null);

        setForm({
          name: "",
          brand: "",
          category: "",
          description: "",
          image: "",
          price: "",
        });
      }

      await loadProducts();
    } catch {
      toast.error("Не вдалося видалити товар");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);

    setForm({
      name: "",
      brand: "",
      category: "",
      description: "",
      image: "",
      price: "",
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        ⚙️ Admin Panel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl bg-white p-6 shadow"
      >
        <input
          placeholder="Назва"
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
          placeholder="Категорія"
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
          placeholder="Опис"
          rows={4}
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
          placeholder="URL картинки"
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

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-700"
          >
            {editingId
              ? "Оновити товар"
              : "Додати товар"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl bg-gray-500 px-6 py-3 font-bold text-white transition hover:bg-gray-600"
            >
              Скасувати
            </button>
          )}
        </div>
      </form>

      <h2 className="mb-6 mt-12 text-3xl font-bold">
        Товари
      </h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
          >
            <div>
              <h3 className="text-lg font-bold">
                {product.name}
              </h3>

              <p className="text-gray-500">
                {product.brand}
              </p>

              <p className="font-semibold text-green-600">
                {product.price.toLocaleString()} ₴
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(product)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                Редагувати
              </button>

              <button
                onClick={() =>
                  handleDelete(product.id)
                }
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}