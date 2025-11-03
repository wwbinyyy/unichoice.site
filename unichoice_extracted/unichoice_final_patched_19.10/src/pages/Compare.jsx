import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import universitiesJson from "../../data/universities.json";

function getUniversities() {
  const raw = universitiesJson?.universities ?? universitiesJson ?? [];
  return Array.isArray(raw) ? raw : [];
}

const fmtMoney = (v) =>
  v == null ? "—" : `$${Number(v).toLocaleString()}/year`;

export default function Compare() {
  const { cmp, removeCmp, clearCmp } = useApp();
  const all = getUniversities();

  const items = useMemo(() => {
    if (!Array.isArray(all)) return [];
    return all.filter((u) => cmp.includes(u.id));
  }, [all, cmp]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Compare ({items.length})</h1>
        {items.length > 0 && (
          <button
            onClick={clearCmp}
            className="px-4 py-2 rounded-xl border dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Clear all
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-6 text-gray-600 dark:text-gray-300">
          Choose universities to compare on the{" "}
          <Link className="underline" to="/">Home</Link> page.
        </div>
      ) : (
        <div className="card p-0 overflow-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 dark:bg-[#0e1722]">
              <tr>
                {[
                  "University",
                  "Country",
                  "City",
                  "Tuition (USD)",
                  "QS 2025 Rank",
                  "% Intl Students",
                  "Strong Majors",
                  "",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t dark:border-gray-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img alt="" src={u.logo} className="size-8 rounded bg-gray-100" />
                      <Link to={`/detail/${u.slug || u.id}`} className="hover:underline font-medium">
                        {u.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{u.country || "—"}</td>
                  <td className="px-4 py-3">{u.city || "—"}</td>
                  <td className="px-4 py-3">{fmtMoney(u.tuitionAnnual)}</td>
                  <td className="px-4 py-3">{u.qs2025Rank || "—"}</td>
                  <td className="px-4 py-3">
                    {u.internationalStudentsPercent ?? "—"}{u.internationalStudentsPercent != null ? "%" : ""}
                  </td>
                  <td className="px-4 py-3">
                    {(u.strongMajors || u.majors || []).slice(0, 3).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeCmp(u.id)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-sm hover:bg-rose-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
