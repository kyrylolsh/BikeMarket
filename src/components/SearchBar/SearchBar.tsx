import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  function handleSearch() {
    if (!search.trim()) {
      navigate("/");
      return;
    }

    navigate(`/bikes?search=${search}`);
  }

  return (
    <div className="flex w-80 items-center rounded-xl border px-4 py-3">

      <FiSearch
        className="cursor-pointer text-gray-400"
        onClick={handleSearch}
      />

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Пошук..."
        className="ml-3 w-full outline-none"
      />

    </div>
  );
}