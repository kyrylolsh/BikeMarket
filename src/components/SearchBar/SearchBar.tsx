import { FiSearch } from "react-icons/fi";

export default function SearchBar() {
  return (
    <div className="flex w-80 items-center rounded-xl border px-4 py-3">

      <FiSearch className="text-gray-400" />

      <input
        type="text"
        placeholder="Пошук велосипеда..."
        className="ml-3 w-full outline-none"
      />

    </div>
  );
}