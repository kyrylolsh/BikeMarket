import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";

export default function Checkout() {
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: user?.email ?? "",
    address: "",
    payment: "card",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.address
    ) {
      toast.error("Заповніть усі поля");
      return;
    }

    try {
      await orderService.create({
        buyerId: user?.uid ?? "",

        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        payment: form.payment,

        items: cart,

        total,
      });

      toast.success("Замовлення оформлено!");

      clearCart();

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error("Не вдалося оформити замовлення");
    }
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">
          Кошик порожній
        </h1>

        <p className="mt-6 text-gray-500">
          Додайте товари перед оформленням замовлення.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-10 text-4xl font-bold">
        Оформлення замовлення
      </h1>

      <div className="grid gap-10 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-8 shadow"
        >
          <input
            type="text"
            name="name"
            placeholder="Ім'я"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Телефон"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <input
            type="text"
            name="address"
            placeholder="Адреса доставки"
            value={form.address}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          />

          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            className="w-full rounded-xl border p-4"
          >
            <option value="card">
              Банківська картка
            </option>

            <option value="cash">
              Оплата при отриманні
            </option>
          </select>

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700"
          >
            Підтвердити замовлення
          </button>
        </form>

        <div className="rounded-2xl bg-gray-100 p-8">
          <h2 className="mb-6 text-2xl font-bold">
            Ваше замовлення
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  {(item.price * item.quantity).toLocaleString()} ₴
                </span>
              </div>
            ))}
          </div>

          <hr className="my-6" />

          <div className="flex justify-between text-2xl font-bold">
            <span>Разом</span>

            <span>
              {total.toLocaleString()} ₴
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}