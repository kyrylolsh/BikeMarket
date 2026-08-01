import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSliders } from "react-icons/fi";

import ProductCard from "../components/ProductCard/ProductCard";
import Loader from "../components/Loader/Loader";
import FiltersPanel from "../components/Filters/FiltersPanel";

import { useProducts } from "../hooks/useProducts";


export default function Events() {

  const { products, loading } = useProducts();


  const [searchParams, setSearchParams] =
    useSearchParams();


  const search =
    searchParams.get("search") || "";


  const sort =
    searchParams.get("sort") || "default";


  const [filtersOpen, setFiltersOpen] =
    useState(false);


  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [brand, setBrand] =
    useState("All");

  const [condition, setCondition] =
    useState("All");


  function resetFilters() {
    setMinPrice("");
    setMaxPrice("");
    setBrand("All");
    setCondition("All");
  }


  const eventProducts = useMemo(() => {

    return products.filter(
      (product) =>
        product.type === "event"
    );

  }, [products]);



  const filteredProducts = useMemo(() => {

    let result = [...eventProducts];


    if(search){

      result = result.filter(
        (product)=>

          product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

          ||

          product.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    }



    if(minPrice){

      result = result.filter(
        (product)=>
          product.price >= Number(minPrice)
      );

    }



    if(maxPrice){

      result = result.filter(
        (product)=>
          product.price <= Number(maxPrice)
      );

    }



    switch(sort){

      case "newest":

        result.sort(
          (a,b)=>
          (b.createdAt?.seconds || 0)
          -
          (a.createdAt?.seconds || 0)
        );

        break;


      case "oldest":

        result.sort(
          (a,b)=>
          (a.createdAt?.seconds || 0)
          -
          (b.createdAt?.seconds || 0)
        );

        break;


      case "cheap":

        result.sort(
          (a,b)=>
          a.price-b.price
        );

        break;


      case "expensive":

        result.sort(
          (a,b)=>
          b.price-a.price
        );

        break;

    }


    return result;


  },[
    eventProducts,
    search,
    sort,
    minPrice,
    maxPrice
  ]);




  const brands = useMemo(()=>{

    return [
      ...new Set(
        eventProducts.map(
          p=>p.brand
        )
      )
    ];

  },[eventProducts]);




  if(loading){

    return <Loader/>;

  }



  return (

<div className="mx-auto max-w-7xl px-4 py-10">


<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


<h1 className="text-4xl font-bold">

📅 Велоподії

</h1>



<button

onClick={()=>
setFiltersOpen(true)
}

className="
flex items-center justify-center gap-2
rounded-xl bg-black px-5 py-3
font-semibold text-white
hover:bg-gray-800
"

>

<FiSliders/>

Фільтри

</button>


</div>




<div className="mb-8 grid gap-4 lg:grid-cols-2">



<input

value={search}

placeholder="Пошук події..."

onChange={(e)=>

setSearchParams({

search:e.target.value,

sort

})

}

className="
rounded-xl border p-3
"

/>




<select

value={sort}

onChange={(e)=>

setSearchParams({

search,

sort:e.target.value

})

}

className="
rounded-xl border p-3
"

>


<option value="default">

Без сортування

</option>


<option value="newest">

Нові події

</option>


<option value="oldest">

Старі події

</option>


</select>



</div>





{
filteredProducts.length === 0 ?


<div className="
rounded-xl bg-gray-100
p-10 text-center text-gray-500
">

Подій поки немає.


</div>


:


<div className="
grid grid-cols-1 gap-6
sm:grid-cols-2
xl:grid-cols-4
">


{
filteredProducts.map(
(product)=>(

<ProductCard

key={product.id}

product={product}

/>

)

)

}


</div>


}




<FiltersPanel

open={filtersOpen}

onClose={()=>
setFiltersOpen(false)
}

minPrice={minPrice}

maxPrice={maxPrice}

setMinPrice={setMinPrice}

setMaxPrice={setMaxPrice}

brand={brand}

setBrand={setBrand}

condition={condition}

setCondition={setCondition}

brands={brands}

onReset={resetFilters}

/>



</div>

  );

}