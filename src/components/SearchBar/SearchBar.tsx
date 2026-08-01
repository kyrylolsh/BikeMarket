import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  function handleChange(value: string) {
    setSearch(value);

    const query = value.trim();

    // якщо очистили поле
    if (!query) {
      if (location.pathname === "/search") {
        navigate("/", { replace: true });
      }
      return;
    }

    // переходимо тільки якщо ще не на сторінці пошуку
    if (location.pathname !== "/search") {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    } else {
      navigate(
        `/search?query=${encodeURIComponent(query)}`,
        { replace: true }
      );
    }
  }

  return (
    <div className="flex w-full max-w-[700px] items-center rounded-xl border px-4 py-3">
      <FiSearch className="text-gray-400" />

      <input
        className="ml-3 w-full outline-none"
        placeholder="Пошук..."
        value={search}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}