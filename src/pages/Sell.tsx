import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { productService } from "../services/productService";

import { bikeCategories } from "../data/bikeCategories";
import { partsCategories } from "../data/partsCategories";
import { FIELD_LIMITS } from "../utils/limits";

export default function Sell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",

    brand: "",

    type: "" as
      | ""
      | "bike"
      | "gear"
      | "event"
      | "wanted"
      | "exchange",

    category: "",

    wantedCategory: "" as "" | "bike" | "gear",

    condition: "used" as "new" | "used",

    description: "",

    exchangeFor: "",

    images: [] as string[],

    price: "",

    eventDate: "",

    negotiable: false,

    eventLocation: "",

    phone: "",
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
      if (form.images.length >= 8) {
        toast.error("Максимум 8 фотографій");
        return;
      }
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
        images: [
          ...prev.images,
          result.secure_url,
        ],
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


    if (!form.type) {
      toast.error("Оберіть категорію оголошення");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Введіть назву");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Введіть опис");
      return;
    }

    if (
      form.type !== "wanted" &&
      form.images.length === 0
    ) {
      toast.error("Додайте хоча б одне фото");
      return;
    }

    // Для велосипедів і запчастин
    if (form.type !== "event") {
      if (!form.category) {
        toast.error("Оберіть підкатегорію");
        return;
      }

      if (
        form.type !== "wanted" &&
        !form.brand.trim()
      ) {
        toast.error("Вкажіть бренд");
        return;
      }

      if (
        form.type !== "event" &&
        form.type !== "wanted" &&
        form.type !== "exchange" &&
        !form.price
      ) {
        toast.error("Вкажіть ціну");
        return;
      }
  }

    // Для подій
    if (form.type === "event") {
      if (!form.eventDate) {
        toast.error("Оберіть дату");
        return;
      }

      if (!form.eventLocation.trim()) {
        toast.error("Вкажіть місце проведення");
        return;
      }

      if (!form.phone.trim()) {
        toast.error("Вкажіть номер телефону");
        return;
      }
    }

    if (
      form.name.length >
      FIELD_LIMITS.productName
    ) {
      toast.error(
        `Назва товару максимум ${FIELD_LIMITS.productName} символів`
      );
      return;
    }


    if (
      form.brand.length >
      FIELD_LIMITS.brand
    ) {
      toast.error(
        `Бренд максимум ${FIELD_LIMITS.brand} символів`
      );
      return;
    }


    if (
      form.description.length >
      FIELD_LIMITS.description
    ) {
      toast.error(
        `Опис максимум ${FIELD_LIMITS.description} символів`
      );
      return;
    }


    try {

      await productService.addProduct({

        name: form.name.trim(),

        brand:
          form.type === "event"
            ? ""
            : form.brand.trim(),

        description:
          form.description.trim(),

        exchangeFor:
          form.type === "exchange"
            ? form.exchangeFor.trim()
            : "",

        type: form.type,

        category:
          form.category,

        wantedCategory:
              form.type === "wanted"
                ? form.wantedCategory
                : "",

        condition:
          form.condition,

        image:
          form.images[0],

        images:
          form.images,

        price:
          form.type === "event" ||
          form.type === "exchange"
            ? 0
            : Number(form.price),

        negotiable:
          form.type === "wanted"
            ? form.negotiable
            : false,

        eventDate:
          form.type === "event"
            ? form.eventDate
            : "",

        eventLocation:
          form.type === "event"
            ? form.eventLocation
            : "",

        phone:
          form.type === "event"
            ? form.phone
            : "",


        sellerId: user.uid,

        sellerEmail: user.email ?? "",

        sellerNickname: user.nickname,

        createdAt: new Date(),

      });


      toast.success(
        "Оголошення успішно створено"
      );


      navigate(
        form.type === "bike"
          ? "/bikes"
          : form.type === "gear"
          ? "/bike-parts"
          : form.type === "event"
          ? "/events"
          : form.type === "exchange"
          ? "/exchange"
          : "/wanted"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Не вдалося створити оголошення"
      );

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


      {/* ====================== Вибір категорії ====================== */}

      <div>

      <h2 className="mb-3 text-2xl font-bold">
        Оберіть категорію оголошення
      </h2>


      <select
        value={form.type}
        onChange={(e) => {

          const value =
            e.target.value as
            | ""
            | "bike"
            | "gear"
            | "event"
            | "wanted"
            | "exchange";

          setForm({
            ...form,
            type: value,
            category: "",
            wantedCategory: "",
          });
        }}
        className="w-full rounded-xl border p-4"
      >

        <option value="">
          Оберіть категорію
        </option>

        <option value="bike">
          🚲 Велосипед
        </option>

        <option value="gear">
          🛠 Велозапчастина
        </option>

        <option value="event">
          📅 Подія
        </option>

        <option value="wanted">
          🔎 Куплю
        </option>

        <option value="exchange">
          🔄 Обмін
        </option>

      </select>

    {/* ================= Підкатегорія ================= */}

    {form.type &&
     form.type !== "event" &&
     form.type !== "wanted" &&
     form.type !== "exchange" && (

    <div>

    <h2 className="mb-3 mt-5 text-2xl font-bold">
      Оберіть підкатегорію
    </h2>


    <select
      value={form.category}

      onChange={(e)=>
        setForm({
          ...form,
          category:e.target.value,
        })
      }

      className="w-full rounded-xl border p-4"
    >

    <option value="">
      Оберіть підкатегорію
    </option>


    {(
      form.type === "bike"
        ? bikeCategories
        : partsCategories

    ).map((item)=>(

    <option
     key={item}
     value={item}
    >
     {item}
    </option>

    ))}


    </select>


    </div>

    )}

    {form.type === "wanted" && (
      <div>

        <h2 className="mb-3 mt-5 text-2xl font-bold">
          Що ви хочете купити?
        </h2>

        <select
          value={form.wantedCategory}
          onChange={(e) =>
            setForm({
              ...form,
              wantedCategory: e.target.value as "bike" | "gear",
              category: "",
            })
          }
          className="w-full rounded-xl border p-4"
        >
          <option value="">
            Оберіть категорію
          </option>

          <option value="bike">
            🚲 Велосипед
          </option>

          <option value="gear">
            🛠 Велозапчастина
          </option>

        </select>

      </div>
    )}

    {form.type === "exchange" && (

    <div>

    <h2 className="mb-3 mt-5 text-2xl font-bold">
    Що ви хочете обміняти?
    </h2>

    <select
    value={form.wantedCategory}
    onChange={(e)=>
    setForm({
    ...form,
    wantedCategory:e.target.value as "bike" | "gear",
    category:"",
    })
    }
    className="w-full rounded-xl border p-4"
    >

    <option value="">
    Оберіть категорію
    </option>

    <option value="bike">
    🚲 Велосипед
    </option>

    <option value="gear">
    🛠 Велозапчастина
    </option>

    </select>

    </div>

    )}

    {(form.type === "wanted" ||
      form.type === "exchange") &&
     form.wantedCategory && (

    <div>

      <h2 className="mb-3 mt-5 text-2xl font-bold">
        Оберіть підкатегорію
      </h2>

      <select
        value={form.category}
        onChange={(e)=>
          setForm({
            ...form,
            category:e.target.value,
          })
        }
        className="w-full rounded-xl border p-4"
      >

        <option value="">
          Оберіть підкатегорію
        </option>

        {(form.wantedCategory === "bike"
          ? bikeCategories
          : partsCategories
        ).map((item)=>(

          <option
            key={item}
            value={item}
          >
            {item}
          </option>

        ))}

      </select>

    </div>
    )}

      </div>


        <div>

          <h2 className="mb-2 text-2xl font-bold">
            {form.type === "event"
              ? "📅 Інформація про подію"
              : "📦 Основна інформація"}
          </h2>


          <div className="space-y-5">


            <input
              type="text"
              placeholder={
                form.type === "event"
                  ? "Назва події"
                  : form.type === "wanted"
                  ? "Що ви хочете купити?"
                  : "Назва товару"
              }
              value={form.name}
              maxLength={FIELD_LIMITS.productName}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border p-4"
            />

            <p className="text-sm text-gray-500">
              {form.name.length}/
              {FIELD_LIMITS.productName}
            </p>



            {form.type !== "event" &&
             form.type !== "wanted" && (
              <>
                <input
                  type="text"
                  placeholder="Бренд"
                  value={form.brand}
                  maxLength={FIELD_LIMITS.brand}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      brand: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border p-4"
                />
                <p className="text-sm text-gray-500">
                              {form.brand.length}/
                              {FIELD_LIMITS.brand}
                            </p>
              </>
            )}

        {/* ===== Поля для події ===== */}

        {form.type === "event" && (
          <>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventDate: e.target.value,
                })
              }
              className="w-full rounded-xl border p-4"
            />

            <input
              type="text"
              placeholder="Місце проведення"
              value={form.eventLocation}
              onChange={(e) =>
                setForm({
                  ...form,
                  eventLocation: e.target.value,
                })
              }
              className="w-full rounded-xl border p-4"
            />

            <input
              type="tel"
              placeholder="Номер телефону"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className="w-full rounded-xl border p-4"
            />

            <input
              type="email"
              value={user.email ?? ""}
              disabled
              className="w-full rounded-xl border bg-gray-100 p-4"
            />
          </>
        )}


            {form.type !== "event" && (
              <select
                value={form.condition}
                onChange={(e) =>
                  setForm({
                    ...form,
                    condition: e.target.value as "new" | "used",
                  })
                }
                className="w-full rounded-xl border p-4"
              >
                <option value="new">🟢 Новий</option>
                <option value="used">🟡 Б/У</option>
              </select>
            )}


          </div>

        </div>



        <div>

          <h2 className="mb-2 text-2xl font-bold">
            {form.type === "event"
              ? "📝 Опис події"
              : "📝 Опис товару"}
          </h2>


          <textarea
            rows={6}
            placeholder={
              form.type === "event"
                ? "Опишіть подію..."
                : "Опишіть товар..."
            }
            value={form.description}
            maxLength={FIELD_LIMITS.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="w-full rounded-xl border p-4"
          />


          <p className="text-sm text-gray-500">
            {form.description.length}/
            {FIELD_LIMITS.description}
          </p>

        </div>

      {/* ====================== Фото ====================== */}

      <div>
        <h2 className="mb-2 text-2xl font-bold">
          📷 Фотографії
        </h2>

        <p className="mb-6 text-gray-500">
          Перше фото стане головним у каталозі.
        </p>

        <p className="mb-4 text-sm font-medium text-gray-500">
          {form.images.length}/8 фотографій
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
              multiple={form.type !== "wanted" || form.type === "exchange"}
              accept="image/*"
              disabled={form.images.length >= 8}
              className="hidden"

              onChange={async (e) => {
                if (!e.target.files) return;

                const files = Array.from(e.target.files);

                if (form.images.length + files.length > 8) {
                  toast.error("Можна завантажити максимум 8 фотографій");
                  return;
                }



                if (form.type === "wanted") {
                  await uploadImage(files[0]);
                } else {
                  for (const file of files) {
                    await uploadImage(file);
                  }
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

        {form.images.length >= 8 && (
          <div className="mt-4 rounded-xl bg-yellow-100 p-4 text-center text-yellow-700">
            Досягнуто максимальної кількості фотографій (8)
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

      {form.type === "wanted" ? (

        <div>
          <h2 className="mb-2 text-2xl font-bold">
            💰 Бажана ціна покупки
          </h2>

          <p className="mb-6 text-gray-500">
            Вкажіть бажаний бюджет або залиште "договірна".
          </p>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              type="number"
              placeholder="Бюджет (₴)"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: e.target.value,
                })
              }
            />

          </div>

          <label className="mt-5 flex items-center gap-3 text-lg">

            <input
              type="checkbox"
              checked={form.negotiable}
              onChange={(e) =>
                setForm({
                  ...form,
                  negotiable: e.target.checked,
                })
              }
              className="h-5 w-5"
            />

            Договірна

          </label>

        </div>

      ) : form.type !== "event" &&
           form.type !== "exchange" && (

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
            max="1000000"
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            className="w-full rounded-xl border p-4"
          />

        </div>

      )}

    {form.type === "exchange" && (

    <div>

    <h2 className="mb-2 text-2xl font-bold">
    🔄 Що хочете отримати взамін?
    </h2>

    <textarea
      rows={4}
      placeholder="Наприклад: Trek Marlin 8 або Shimano XT..."
      value={form.exchangeFor}
      onChange={(e) =>
        setForm({
          ...form,
          exchangeFor: e.target.value,
        })
      }
      className="w-full rounded-xl border p-4"
    />

    </div>

    )}

      {/* ====================== Кнопка ====================== */}

      <div className="border-t pt-8">

        <button
          type="submit"
          disabled={
            uploading || !form.type
          }
          className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {form.type === "event"
            ? "📅 Створити подію"
            : "🚀 Опублікувати оголошення"}
        </button>

      </div>

      </form>

      </div>
      );
      }