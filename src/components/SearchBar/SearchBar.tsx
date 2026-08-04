import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Пошук...",
}: SearchBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [internalSearch, setInternalSearch] = useState("");

  const search =
    value !== undefined ? value : internalSearch;

  function handleChange(newValue: string) {
    // ============================
    // Локальний пошук (Catalog, Bikes, Parts, Wanted, Exchange)
    // ============================
    if (onChange) {
      onChange(newValue);
      return;
    }

    // ============================
    // Глобальний пошук (Header)
    // ============================
    setInternalSearch(newValue);

    const query = newValue.trim();

    if (!query) {
      if (location.pathname === "/search") {
        navigate("/", { replace: true });
      }
      return;
    }

    if (location.pathname !== "/search") {
      navigate(
        `/search?query=${encodeURIComponent(query)}`
      );
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
        placeholder={placeholder}
        value={search}
        onChange={(e) =>
          handleChange(e.target.value)
        }
      />
    </div>
  );
}