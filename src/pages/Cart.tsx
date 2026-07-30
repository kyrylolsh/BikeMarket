import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">
          🛒 Кошик
        </h1>

        <p className="mt-8 text-xl text-gray-500">
          Кошик порожній
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-xl bg-green-600 px-8 py-4 text-white hover:bg-green-700"
        >
          Перейти до головної сторінки
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <div className="mb-10 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          🛒 Кошик
        </h1>

        <button
          onClick={clearCart}
          className="rounded-xl bg-red-500 px-5 py-3 text-white hover:bg-red-600"
        >
          Очистити кошик
        </button>

      </div>

      <div className="space-y-6">

        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-6 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center"
          >

            <img
              src={item.image}
              alt={item.name}
              className="h-36 w-36 rounded-xl object-cover"
            />

            <div className="flex-1">

              <h2 className="text-2xl font-bold">
                {item.name}
              </h2>

              <p className="mt-2 text-gray-500">
                {item.brand}
              </p>

              <p className="mt-4 text-2xl font-bold text-green-600">
                {item.price.toLocaleString()} ₴
              </p>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() => decreaseQuantity(item.id)}
                className="h-10 w-10 rounded-lg bg-gray-200 text-xl"
              >
                −
              </button>

              <span className="text-xl font-bold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(item.id)}
                className="h-10 w-10 rounded-lg bg-green-600 text-xl text-white"
              >
                +
              </button>

            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="rounded-xl bg-red-500 px-5 py-3 text-white hover:bg-red-600"
            >
              Видалити
            </button>

          </div>
        ))}

      </div>

      <div className="mt-12 rounded-2xl bg-green-600 p-8 text-white">

        <div className="flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Разом:
          </h2>

          <p className="text-4xl font-bold">
            {total.toLocaleString()} ₴
          </p>

        </div>

        <Link
          to="/checkout"
          className="mt-8 block rounded-xl bg-white py-4 text-center text-xl font-bold text-green-600"
        >
          Оформити замовлення
        </Link>

      </div>

    </div>
  );
}