import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiUser,
  FiPackage,
  FiShoppingBag,
  FiMessageCircle,
  FiPlusCircle,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

import { productService } from "../services/productService";
import { authService } from "../services/authService";

import {
  orderService,
  type Order,
} from "../services/orderService";

import type { Product } from "../types/Product";


export default function Profile() {

  const navigate = useNavigate();


  const {
    user,
    loading,
    logout,
  } = useAuth();


  const { favorites } =
    useFavorites();



  const [myListings,setMyListings] =
    useState<Product[]>([]);


  const [myOrders,setMyOrders] =
    useState<Order[]>([]);


  const [sellerOrders,setSellerOrders] =
    useState<Order[]>([]);



  useEffect(() => {

    async function loadStats(){

      if(!user) return;


      const listings =
        await productService.getSellerProducts(
          user.uid
        );


      const orders =
        await orderService.getUserOrders(
          user.email!
        );


      const customerOrders =
        await orderService.getSellerOrders(
          user.uid
        );


      setMyListings(listings);
      setMyOrders(orders);
      setSellerOrders(customerOrders);

    }


    loadStats();


  },[user]);




  if(loading){

    return (
      <div className="p-10 text-center">
        Завантаження...
      </div>
    );

  }




  if(!user){

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }




  async function handleLogout(){

    try{

      await logout();

      toast.success(
        "Ви успішно вийшли"
      );

      navigate("/");


    }catch{

      toast.error(
        "Помилка виходу"
      );

    }

  }




  async function handleAvatarUpload(
    file: File
  ){

    try{


      const data =
        new FormData();


      data.append(
        "file",
        file
      );


      data.append(
        "upload_preset",
        "bikemarket"
      );



      const response =
        await fetch(
          "https://api.cloudinary.com/v1_1/mtywdfsq/image/upload",
          {
            method:"POST",
            body:data,
          }
        );



      const result =
        await response.json();




      await authService.updatePhoto(
        user.uid,
        result.secure_url
      );



      toast.success(
        "Фото профілю оновлено"
      );



      window.location.reload();



    }catch(error){

      console.error(error);

      toast.error(
        "Помилка завантаження фото"
      );

    }

  }





  return (

<div className="mx-auto max-w-6xl px-6 py-10">



{/* HEADER PROFILE */}

<div className="mb-10 rounded-3xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 p-8 text-white shadow-2xl">


<div className="flex flex-col items-center gap-6 md:flex-row">



<label className="group relative cursor-pointer">

  {user.photoURL ? (

    <img
      src={user.photoURL}
      alt="avatar"
      className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl"
    />

  ) : (

    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-5xl text-green-600 shadow-xl">
      <FiUser />
    </div>

  )}

  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xl opacity-0 transition group-hover:opacity-100">
    📷
  </div>


  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e)=>{
      const file = e.target.files?.[0];

      if(file){
        handleAvatarUpload(file);
      }
    }}
  />

</label>





<div className="flex-1">


<h1 className="text-4xl font-bold">
Особистий кабінет
</h1>



<p className="mt-2 text-2xl font-semibold">
{user.nickname}
</p>



<p className="text-sm opacity-80">
{user.email}
</p>



<p className="mt-1 text-sm opacity-70">
ID: {user.uid}
</p>


</div>



</div>


</div>





{/* STATS */}

<div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


<div className="rounded-2xl bg-white p-6 shadow">

<FiPackage size={34}/>

<h2 className="mt-4 font-bold">
Оголошення
</h2>

<p className="text-3xl font-bold">
{myListings.length}
</p>

</div>



<div className="rounded-2xl bg-white p-6 shadow">

<FiShoppingBag size={34}/>

<h2 className="mt-4 font-bold">
Покупки
</h2>

<p className="text-3xl font-bold">
{myOrders.length}
</p>

</div>




<div className="rounded-2xl bg-white p-6 shadow">

<FiHeart size={34}/>

<h2 className="mt-4 font-bold">
Обране
</h2>

<p className="text-3xl font-bold">
{favorites.length}
</p>

</div>




<div className="rounded-2xl bg-white p-6 shadow">

<FiShoppingBag size={34}/>

<h2 className="mt-4 font-bold">
Продажі
</h2>

<p className="text-3xl font-bold">
{sellerOrders.length}
</p>

</div>



</div>





<div className="grid gap-6 md:grid-cols-2">



<Link
to="/orders"
className="rounded-2xl bg-white p-6 shadow"
>

<FiShoppingBag size={34}/>

<h2 className="mt-4 text-2xl font-bold">
Мої покупки
</h2>

</Link>




<Link
to="/seller-orders"
className="rounded-2xl bg-white p-6 shadow"
>

<FiPackage size={34}/>

<h2 className="mt-4 text-2xl font-bold">
Замовлення клієнтів
</h2>

</Link>




<Link
to="/my-listings"
className="rounded-2xl bg-white p-6 shadow"
>

<FiPackage size={34}/>

<h2 className="mt-4 text-2xl font-bold">
Мої оголошення
</h2>

</Link>




<Link
to="/sell"
className="rounded-2xl bg-white p-6 shadow"
>

<FiPlusCircle size={34}/>

<h2 className="mt-4 text-2xl font-bold">
Створити оголошення
</h2>

</Link>




<Link
to="/messages"
className="rounded-2xl bg-white p-6 shadow md:col-span-2"
>

<FiMessageCircle size={34}/>

<h2 className="mt-4 text-2xl font-bold">
Повідомлення
</h2>

</Link>




<button

onClick={handleLogout}

className="flex items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-lg font-bold text-white hover:bg-red-600 md:col-span-2"

>

<FiLogOut/>

Вийти з акаунта

</button>



</div>



</div>


  );

}