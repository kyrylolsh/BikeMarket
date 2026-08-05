import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
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
    if (!id) return;

    const unsubscribe = onSnapshot(
      doc(db, "products", id),
      (snapshot) => {
        if (!snapshot.exists()) {
          setLoading(false);
          return;
        }

        const data = {
          id: snapshot.id,
          ...snapshot.data(),
        } as Product;

        setProduct(data);

        setSelectedImage((prev) =>
          prev ||
          (data.images?.length
            ? data.images[0]
            : data.image)
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
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


    } catch (error) {

      console.error(error);

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

                className={`overflow-hidden rounded-xl border-2 transition ${
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


          {product.brand && (
            <p className="text-lg text-gray-500">
              {product.brand}
            </p>
          )}


          <h1 className="mt-2 text-5xl font-bold">
            {product.name}
          </h1>


          <p className="mt-6 text-lg leading-8 text-gray-600">
            {product.description}
          </p>

          {product.type === "exchange" &&
           product.exchangeFor && (
            <div className="mt-6 rounded-2xl bg-blue-50 p-5 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-700">
                🔄 Хочу отримати в обмін
              </h3>

              <p className="mt-3 text-lg text-gray-700">
                {product.exchangeFor}
              </p>
            </div>
          )}



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
              📦 Стан
            </p>

            <p className="mt-2 text-lg">

              {product.condition === "new"
                ? "Новий"
                : "Б/У"}

            </p>

          </div>




          <div className="mt-6 rounded-2xl border p-5">

            <p className="font-semibold">
              👤 Продавець
            </p>

            <p className="mt-2 text-lg font-medium">
              {product.sellerNickname ?? "Користувач"}
            </p>

            <Link
              to={`/seller/${product.sellerId}`}
              className="mt-4 inline-block text-green-600 hover:underline"
            >
              Усі товари продавця →
            </Link>

          </div>





         {product.type === "exchange" ? (
           <div className="mt-8 rounded-2xl bg-blue-50 p-5">
             <p className="text-3xl font-bold text-blue-600">
               🔄 Обмін
             </p>
           </div>
         ) : (
           <p className="mt-8 text-5xl font-bold text-green-600">
             {product.price.toLocaleString()} ₴
           </p>
         )}





          {user?.uid === product.sellerId ? (

            <>
              <button
                disabled
                className="mt-10 w-full cursor-not-allowed rounded-xl bg-gray-400 px-8 py-4 text-xl font-bold text-white"
              >
                🚫 Це ваше оголошення
              </button>

              <Link
                to={`/edit-product/${product.id}`}
                className="mt-4 block w-full rounded-xl bg-yellow-500 px-8 py-4 text-center text-xl font-bold text-white hover:bg-yellow-600"
              >
                ✏️ Редагувати оголошення
              </Link>
            </>

          ) : product.type === "wanted" ? (

            <button
              onClick={handleChat}
              className="mt-10 w-full rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold text-white hover:bg-blue-700"
            >
              💬 Написати
            </button>

          ) : product.type === "exchange" ? (

            <button
              onClick={handleChat}
              className="mt-10 w-full rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold text-white hover:bg-blue-700"
            >
              🔄 Запропонувати обмін
            </button>

          ) : (

            <button
              onClick={() => addToCart(product)}
              className="mt-10 w-full rounded-xl bg-green-600 px-8 py-4 text-xl font-bold text-white hover:bg-green-700"
            >
              🛒 Додати у кошик
            </button>

          )}

          {user &&
            user.uid !== product.sellerId &&
            product.type !== "wanted" &&
            product.type !== "exchange" && (

              <button
                onClick={handleChat}
                className="mt-4 w-full rounded-xl bg-blue-600 px-8 py-4 text-xl font-bold text-white hover:bg-blue-700"
              >
                💬 Написати продавцю
              </button>

          )}


        </div>


      </div>


    </div>

  );

}