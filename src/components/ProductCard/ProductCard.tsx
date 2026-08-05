import { useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

import type { Product } from "../../types/Product";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { user } = useAuth();

  const { addToCart } = useCart();

  const {
    addToFavorites,
    removeFromFavorites,
  } = useFavorites();


  const firebaseFavorite =
    !!user &&
    (product.likedBy ?? []).includes(user.uid);


  const [liked, setLiked] =
    useState(firebaseFavorite);

  const [likes, setLikes] =
    useState(product.likes ?? 0);

  const [pulse, setPulse] =
    useState(false);



  async function handleFavorite() {

    if (!user) return;


    setPulse(true);

    setTimeout(() => {
      setPulse(false);
    }, 300);



    if (liked) {

      setLiked(false);
      setLikes((prev) =>
        Math.max(prev - 1, 0)
      );

      await removeFromFavorites(product);


    } else {

      setLiked(true);
      setLikes((prev) =>
        prev + 1
      );

      await addToFavorites(product);

    }
  }



  return (

    <div
      className="
      flex
      h-full
      flex-col
      overflow-hidden
      rounded-2xl
      bg-white
      shadow-lg
      transition
      hover:-translate-y-2
      hover:shadow-2xl
      "
    >


      {/* Фото */}

      <div className="relative">

        <Link to={`/product/${product.id}`}>

          <img
            src={product.image}
            alt={product.name}
            className="
            h-60
            w-full
            object-cover
            "
          />

        </Link>


        {/* Статистика */}

        <div
          className={`
          absolute
          bottom-3
          right-3
          flex
          items-center
          gap-3
          rounded-full
          bg-white/95
          px-4
          py-2
          shadow-md
          backdrop-blur
          transition
          ${
            pulse
            ? "scale-125"
            : "scale-100"
          }
          `}
        >

          <div className="flex items-center gap-1">

            <FiHeart
              size={18}
              className="text-red-500"
            />

            <span className="font-bold">
              {likes}
            </span>

          </div>


          <div
            className="
            h-5
            w-px
            bg-gray-300
            "
          />


          <div className="flex items-center gap-1">

            <span>
              👀
            </span>

            <span className="font-bold">
              {product.views ?? 0}
            </span>

          </div>


        </div>


      </div>



      {/* Контент */}

      <div
        className="
        flex
        flex-1
        flex-col
        p-5
        "
      >


        {product.brand && (

          <p className="text-sm text-gray-500">
            {product.brand}
          </p>

        )}



        <Link
          to={`/product/${product.id}`}
        >

          <h2
            className="
            mt-2
            line-clamp-2
            min-h-[56px]
            text-xl
            font-bold
            hover:text-green-600
            "
          >
            {product.name}
          </h2>

        </Link>



        <p className="mt-2 text-gray-600">
          {product.category}
        </p>



        <p className="mt-3 text-sm text-gray-500">

          {product.type === "wanted"
            ? `🔎 Шукає: ${
                product.sellerNickname ??
                "Користувач"
              }`
            :
              `👤 ${
                product.sellerNickname ??
                "Користувач"
              }`
          }

        </p>



        {/* Ціна */}

        <div className="mt-5 min-h-[40px]">


        {product.type === "wanted" ? (

          <p className="text-2xl font-bold text-blue-600">

            💰 Бюджет{" "}

            {
              product.negotiable
              ?
              "Договірна"
              :
              `${Number(
                product.price
              ).toLocaleString()} ₴`
            }

          </p>


        )
        :
        product.type === "exchange" ? (

          <p
            className="
            text-xl
            font-bold
            text-indigo-600
            "
          >
            🔄 Обмін
          </p>


        )
        :
        product.type === "event" ? (

          <p
            className="
            text-xl
            font-bold
            text-orange-600
            "
          >
            📅 Велоподія
          </p>


        )
        :
        (

          <p
            className="
            text-2xl
            font-bold
            text-green-600
            "
          >

            {Number(
              product.price
            ).toLocaleString()} ₴

          </p>

        )

        }


        </div>




        {/* Обране */}

        <button

          onClick={handleFavorite}

          className={`
          mt-auto
          rounded-xl
          border
          py-3
          font-semibold
          transition

          ${
            liked
            ?
            "border-red-500 bg-red-500 text-white"
            :
            "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          }

          `}
        >

          <FiHeart
            className="mr-2 inline"
          />


          {
            liked
            ?
            "В обраному"
            :
            "Додати в обране"
          }


        </button>




        {/* Основна кнопка */}


        {
          product.type === "wanted"
          ?

          (

          <Link

            to={`/product/${product.id}`}

            className="
            mt-3
            block
            rounded-xl
            bg-blue-600
            py-3
            text-center
            font-semibold
            text-white
            hover:bg-blue-700
            "
          >

            Переглянути

          </Link>

          )


          :

          product.type === "exchange"

          ?

          (

          <Link

            to={`/product/${product.id}`}

            className="
            mt-3
            block
            rounded-xl
            bg-blue-600
            py-3
            text-center
            font-semibold
            text-white
            hover:bg-blue-700
            "
          >

            🔄 Запропонувати обмін

          </Link>

          )


          :

          (

          <button

            onClick={() =>
              addToCart(product)
            }

            className="
            mt-3
            rounded-xl
            bg-green-600
            py-3
            font-semibold
            text-white
            hover:bg-green-700
            "
          >

            🛒 Купити

          </button>

          )

        }


      </div>


    </div>

  );
}