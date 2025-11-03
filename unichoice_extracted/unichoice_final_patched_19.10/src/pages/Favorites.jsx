import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import universitiesJson from "../../data/universities.json";

// Нормализация данных из JSON (массив или объект {universities: [...]})
function getUniversities() {
  const raw = universitiesJson?.universities ?? universitiesJson ?? [];
  return Array.isArray(raw) ? raw : [];
}

export default function Favorites() {
  const { favs, removeFav, clearFavs } = useApp();
  const all = getUniversities();

  const items = useMemo(() => {
    if (!Array.isArray(all)) return [];
    return all.filter((u) => favs.includes(u.id));
  }, [all, favs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Favorites ({items.length})</h1>
        {items.length > 0 && (
          <button
            onClick={clearFavs}
            className="px-4 py-2 rounded-xl border dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-6 text-gray-600 dark:text-gray-300">
          Nothing here yet. Go to{" "}
          <Link className="underline" to="/">Home</Link> and add some universities ❤️
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((u) => (
            <div key={u.id} className="card p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-3">
                <img alt="" src={u.logo} className="size-10 rounded-xl bg-gray-100" />
                <div>
                  <Link to={`/detail/${u.slug || u.id}`} className="font-medium hover:underline">
                    {u.name}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {u.city}{u.city && u.country ? ", " : ""}{u.country}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t dark:border-gray-800">
                <Link
                  to={`/detail/${u.slug || u.id}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  View
                </Link>
                <button
                  onClick={() => removeFav(u.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-sm hover:bg-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
