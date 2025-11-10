// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Card from "../components/Card";
import { ISO2_TO_NAME } from "../utils";

// ---------- helpers ----------
const API = import.meta.env.VITE_API_URL;
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "") + "/";

function normUni(u = {}) {
  return {
    ...u,
    countryFull: u.countryFull || ISO2_TO_NAME[u.country] || u.country || "",
    rating: typeof u.rating === "number" ? u.rating : Number(u.rating) || 0,
    tuitionAnnual:
      typeof u.tuitionAnnual === "number"
        ? u.tuitionAnnual
        : Number(u.tuitionAnnual) || 0,
    majors: Array.isArray(u.majors) ? u.majors : [],
    languages: Array.isArray(u.languages) ? u.languages : [],
    hasGrant: !!u.hasGrant,
    city: u.city || "",
    name: u.name || "",
  };
}

function buildSuggest(arr) {
  const set = new Set();
  arr.forEach((u) => {
    if (u.name) set.add(u.name);
    if (u.countryFull) set.add(u.countryFull);
    if (u.city) set.add(u.city);
    (u.majors || []).forEach((m) => m && set.add(m));
  });
  return Array.from(set);
}

function apply(list, f, q) {
  const qq = (q || "").toLowerCase();

  return list.filter((u) => {
    // текстовый поиск
    const okQ =
      !qq ||
      [u.name, u.countryFull, u.city, ...(u.majors || [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(qq));

    // страны
    const okCountry =
      !f.countries?.length || f.countries.includes(u.countryFull);

    // города
    const okCity = !f.cities?.length || f.cities.includes(u.city);

    // специальности
    const okMaj =
      !f.majors?.length || (u.majors || []).some((m) => f.majors.includes(m));

    // язык
    const okLang =
      !f.langs?.length || (u.languages || []).some((l) => f.langs.includes(l));

    // грант
    const okGrant =
      f.grant === "any" || (f.grant === "yes" ? u.hasGrant : !u.hasGrant);

    // деньги/рейтинг
    const okTuition = (u.tuitionAnnual || 0) <= (f.maxTuition ?? 100000);
    const okRating = (u.rating || 0) >= (f.minRating ?? 0);

    return (
      okQ &&
      okCountry &&
      okCity &&
      okMaj &&
      okLang &&
      okGrant &&
      okTuition &&
      okRating
    );
  });
}

// Основной лоадер: пробуем API, затем локальный public/data
async function loadUniversities() {
  const tryUrls = [];
  if (API) tryUrls.push(`${API.replace(/\/+$/, "")}/data/universities.json`);
  tryUrls.push(`${BASE}data/universities.json`);

  let lastErr;
  for (const url of tryUrls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const src = Array.isArray(json) ? json : json?.universities || [];
      return src.map(normUni);
    } catch (e) {
      lastErr = e;
      // пробуем следующий URL
    }
  }
  throw lastErr || new Error("Failed to load universities.json");
}

// ---------- компонент ----------
export default function Home() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [instant, setInstant] = useState({
    countries: [],
    cities: [],
    majors: [],
    langs: [],
    grant: "any",
    maxTuition: 100000,
    minRating: 0,
  });
  const [applied, setApplied] = useState({
    countries: [],
    cities: [],
    majors: [],
    langs: [],
    grant: "any",
    maxTuition: 100000,
    minRating: 0,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await loadUniversities();
        if (!alive) return;
        setAll(data);
        setErr("");
      } catch (e) {
        if (!alive) return;
        setErr(String(e?.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const previewList = useMemo(
    () => apply(all, instant, query),
    [all, instant, query]
  );
  const finalList = useMemo(
    () => apply(all, applied, query),
    [all, applied, query]
  );

  const resetFilters = () => {
    const def = {
      countries: [],
      cities: [],
      majors: [],
      langs: [],
      grant: "any",
      maxTuition: 100000,
      minRating: 0,
    };
    setInstant(def);
    setApplied(def);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      {/* поиск — слой подсказок в Portal внутри SearchBar */}
      <div className="card p-4">
        <SearchBar
          items={buildSuggest(all)}
          onPick={(s) => setQuery(s)}
          onSubmit={(s) => setQuery(s)}
          placeholder="Find a university, country, city, or major…"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Filters
            all={all}
            resultCount={previewList.length}
            onInstant={(f) => setInstant(f)}
            onChange={(f) => setApplied(f)}
            onReset={resetFilters}
          />
        </div>

        <div className="lg:col-span-9 space-y-4">
          {loading ? (
            <div className="card p-6">Loading universities…</div>
          ) : err ? (
            <div className="card p-6 text-red-600 dark:text-red-400">
              Failed to load data: {err}
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Found: <b>{finalList.length}</b> of {all.length}
              </div>

              {finalList.length === 0 ? (
                <div className="card p-6 text-gray-600 dark:text-gray-300">
                  Universities not found
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {finalList.map((u) => (
                    <Card key={u.id || u.slug || u.name} u={u} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
