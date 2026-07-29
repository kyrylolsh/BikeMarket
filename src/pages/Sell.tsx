import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";

import { bikeCategories } from "../data/bikeCategories";
import { partsCategories } from "../data/partsCategories";

export default function Sell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "",

    type: "bike" as "bike" | "gear",

    category: bikeCategories[0],

    condition: "used" as "new" | "used",

    description: "",

    images: [] as string[],

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

  async function uploadImage(file: File) {
    try {
      setUploading(true);

      const data = new FormData();

      data.append("file", file);
      data.append("upload_preset", "bikemarket");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/mtywdfsq/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, result.secure_url],
      }));

      toast.success("Фото додано");
    } catch (error) {
      console.error(error);
      toast.error("Помилка завантаження фото");
    } finally {
      setUploading(false);
    }
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
      form.images.length === 0 ||
      !form.price
    ) {
      toast.error("Заповніть усі поля");
      return;
    }

    try {
      await productService.addProduct({
        name: form.name,
        brand: form.brand,

        type: form.type,
        category: form.category,
        condition: form.condition,

        description: form.description,

        image: form.images[0],
        images: form.images,

        price: Number(form.price),

        sellerId: user.uid,
        sellerEmail: user.email ?? "",

        createdAt: new Date(),
      });

      toast.success("Оголошення успішно створено");

      navigate(
        form.type === "bike"
          ? "/bikes"
          : "/bike-parts"
      );
    } catch (error) {
      console.error(error);
      toast.error("Не вдалося створити оголошення");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        🚀 Створити оголошення
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl bg-white p-8 shadow"
      >
      {/* ====================== Основна інформація ====================== */}

      <div>
        <h2 className="mb-2 text-2xl font-bold">
          📦 Основна інформація
        </h2>

        <p className="mb-6 text-gray-500">
          Заповніть основні характеристики товару.
        </p>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Назва товару"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            placeholder="Бренд"
            value={form.brand}
            onChange={(e) =>
              setForm({
                ...form,
                brand: e.target.value,
              })
            }
            className="w-full rounded-xl border p-4"
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as
                  | "bike"
                  | "gear",

                category:
                  e.target.value === "bike"
                    ? bikeCategories[0]
                    : partsCategories[0],
              })
            }
            className="w-full rounded-xl border p-4"
          >
            <option value="bike">
              🚲 Велосипед
            </option>

            <option value="gear">
              🛠 Велозапчастина / аксесуар
            </option>
          </select>

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="w-full rounded-xl border p-4"
          >
            {(form.type === "bike"
              ? bikeCategories
              : partsCategories
            ).map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

          <select
            value={form.condition}
            onChange={(e) =>
              setForm({
                ...form,
                condition: e.target.value as
                  | "new"
                  | "used",
              })
            }
            className="w-full rounded-xl border p-4"
          >
            <option value="new">
              🟢 Новий
            </option>

            <option value="used">
              🟡 Б/У
            </option>
          </select>

        </div>
      </div>

      {/* ====================== Опис ====================== */}

      <div>
        <h2 className="mb-2 text-2xl font-bold">
          📝 Опис товару
        </h2>

        <p className="mb-6 text-gray-500">
          Опишіть комплектацію, стан та особливості товару.
        </p>

        <textarea
          rows={6}
          placeholder="Опишіть товар..."
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full rounded-xl border p-4"
        />
      </div>

      {/* ====================== Фото ====================== */}

      <div>
        <h2 className="mb-2 text-2xl font-bold">
          📷 Фотографії
        </h2>

        <p className="mb-6 text-gray-500">
          Перше фото стане головним у каталозі.
        </p>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 p-8">
          <label className="block cursor-pointer text-center">

            <div className="text-6xl">
              📷
            </div>

            <p className="mt-4 text-lg font-bold">
              Натисніть, щоб вибрати фотографії
            </p>

            <p className="mt-2 text-gray-500">
              Можна вибрати декілька фотографій
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                if (!e.target.files) return;

                for (const file of Array.from(
                  e.target.files
                )) {
                  await uploadImage(file);
                }
              }}
            />

          </label>
        </div>

        {uploading && (
          <div className="mt-4 rounded-xl bg-green-100 p-4 text-center text-green-700">
            Завантаження фотографій...
          </div>
        )}

        {form.images.length > 0 && (
          <div className="mt-6">

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

              {form.images.map((image, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  <img
                    src={image}
                    alt=""
                    className="h-44 w-full rounded-xl object-cover"
                  />

                  {index === 0 && (
                    <div className="absolute left-2 top-2 rounded-lg bg-green-600 px-2 py-1 text-xs font-bold text-white">
                      Головне
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        images: prev.images.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="absolute right-2 top-2 h-8 w-8 rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}

            </div>
          </div>
        )}
      </div>
      {/* ====================== Ціна ====================== */}

      <div>
        <h2 className="mb-2 text-2xl font-bold">
          💰 Вартість
        </h2>

        <p className="mb-6 text-gray-500">
          Вкажіть бажану ціну продажу у гривнях.
        </p>

        <input
          type="number"
          placeholder="Ціна (₴)"
          value={form.price}
          onChange={(e) =>
            setForm({
              ...form,
              price: e.target.value,
            })
          }
          className="w-full rounded-xl border p-4"
        />
      </div>

      {/* ====================== Кнопка ====================== */}

      <div className="border-t pt-8">

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          🚀 Опублікувати оголошення
        </button>

      </div>

      </form>

      </div>
      );
      }