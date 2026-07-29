import { FiSliders } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;

  minPrice: string;
  maxPrice: string;

  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;

  brand: string;
  setBrand: (v: string) => void;

  condition: string;
  setCondition: (v: string) => void;

  brands: string[];

  onReset: () => void;
}

export default function FiltersPanel({
  open,
  onClose,

  minPrice,
  maxPrice,

  setMinPrice,
  setMaxPrice,

  brand,
  setBrand,

  condition,
  setCondition,

  brands,

  onReset,
}: Props) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-screen w-96 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-6">

          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <FiSliders />
            Фільтри
          </h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ✕
          </button>

        </div>

        <div className="space-y-8 p-6">

          <div>

            <h3 className="mb-4 text-lg font-bold">
              💰 Ціна
            </h3>

            <input
              type="number"
              placeholder="Від"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(e.target.value)
              }
              className="mb-3 w-full rounded-xl border p-3"
            />

            <input
              type="number"
              placeholder="До"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

          <div>

            <h3 className="mb-4 text-lg font-bold">
              🏷️ Бренд
            </h3>

            <select
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="All">
                Усі бренди
              </option>

              {brands.map((brandName) => (
                <option
                  key={brandName}
                  value={brandName}
                >
                  {brandName}
                </option>
              ))}
            </select>

          </div>

          <div>

            <h3 className="mb-4 text-lg font-bold">
              📦 Стан
            </h3>

            <select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="All">
                Усі
              </option>

              <option value="new">
                Новий
              </option>

              <option value="used">
                Б/У
              </option>

            </select>

          </div>

          <button
            onClick={onReset}
            className="w-full rounded-xl bg-red-500 py-3 font-bold text-white hover:bg-red-600"
          >
            Очистити всі фільтри
          </button>

        </div>
      </div>
    </>
  );
}