import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../components/Loader/Loader";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { chatService } from "../services/chatService";
import { productService } from "../services/productService";
import type { Product } from "../types/Product";

export default function ProductPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const { addToCart } = useCart();

  const [loading, setLoading] =
    useState(true);

  const [product, setProduct] =
    useState<Product | null>(null);

  const [selectedImage, setSelectedImage] =
    useState("");

  useEffect(() => {
    async function loadProduct() {
      const data =
        await productService.getById(id!);

      if (data) {
        setProduct(data);

        if (
          data.images &&
          data.images.length > 0
        ) {
          setSelectedImage(data.images[0]);
        } else {
          setSelectedImage(data.image);
        }
      }

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  async function handleChat() {
    if (!product) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.uid === product.sellerId) {
      toast.error("Це ваше оголошення");
      return;
    }

    try {
      const chatId =
        await chatService.createOrGetChat(
          user.uid,
          user.email ?? "",

          product.sellerId!,
          product.sellerEmail ?? "",

          product.id,
          product.name,
          product.image,
          product.price
        );

      navigate(`/chat/${chatId}`);
    } catch {
      toast.error(
        "Не вдалося створити чат"
      );
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">
          Товар не знайдено
        </h1>
      </div>
    );
  }

  const gallery =
    product.images &&
    product.images.length > 0
      ? product.images
      : [product.image];

  return (
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-12 lg:grid-cols-2">

              {/* Фото */}

              <div>

                <img
                  src={selectedImage}
                  alt={product.name}
                  className="h-[520px] w-full rounded-3xl object-cover shadow-xl"
                />

                <div className="mt-5 flex flex-wrap gap-3">

                  {gallery.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setSelectedImage(image)
                      }
                      className={`overflow-hidden rounded-xl border-2 transition

                      ${
                        selectedImage === image
                          ? "border-green-600"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-24 w-24 object-cover"
                      />
                    </button>
                  ))}

                </div>

              </div>

              {/* Інформація */}

              <div>

                <p className="text-lg text-gray-500">
                  {product.brand}
                </p>

                <h1 className="mt-2 text-5xl font-bold">
                  {product.name}
                </h1>

                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {product.description}
                </p>

                <div className="mt-8 rounded-2xl border p-5">

                  <p className="font-semibold">
                    Категорія
                  </p>

                  <p className="mt-2 text-lg">
                    {product.category}
                  </p>

                </div>

                <div className="mt-6 rounded-2xl border p-5">

                  <p className="font-semibold">
                    👤 Продавець
                  </p>

                  <p className="mt-2">
                    {product.sellerEmail}
                  </p>

                  <Link
                    to={`/seller/${product.sellerId}`}
                    className="mt-4 inline-block text-green-600 hover:underline"
                  >
                    Усі товари продавця →
                  </Link>

                </div>

                <p className="mt-8 text-5xl font-bold text-green-600">
                  {product.price.toLocaleString()} ₴
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-10 w-full rounded-xl bg-green-600 px-8 py-4 text-xl font-bold text-white transition hover:bg-green-700"
                >
                  🛒 Додати у кошик
                </button>

                {user &&
                  user.uid !== product.sellerId && (

                    <button
                      onClick={handleChat}
                      className="mt-4 w-full rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold text-white transition hover:bg-blue-700"
                    >
                      💬 Написати продавцю
                    </button>

                )}

              </div>

            </div>
          </div>
        );
      }