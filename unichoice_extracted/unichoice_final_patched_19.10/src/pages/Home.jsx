import React, { useMemo, useState } from "react";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import Card from "../components/Card";
import universitiesRaw from "../../data/universities.json";
import { ISO2_TO_NAME } from "../utils";

// нормализация данных
const RAW = universitiesRaw.universities || universitiesRaw;
const ALL_UNIS = RAW.map((u) => ({
  ...u,
  countryFull: u.countryFull || ISO2_TO_NAME[u.country] || u.country,
  rating: typeof u.rating === "number" ? u.rating : 0,
  tuitionAnnual: typeof u.tuitionAnnual === "number" ? u.tuitionAnnual : 0,
}));

function buildSuggest(arr) {
  const set = new Set();
  arr.forEach((u) => {
    set.add(u.name);
    if (u.countryFull) set.add(u.countryFull);
    if (u.city) set.add(u.city);
    (u.majors || []).forEach((m) => set.add(m));
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

    return okQ && okCountry && okCity && okMaj && okLang && okGrant && okTuition && okRating;
  });
}

export default function Home() {
  const all = ALL_UNIS;

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
  const [applied, setApplied] = useState(instant);

  // мгновенный подсчёт и итоговый список
  const previewList = useMemo(() => apply(all, instant, query), [all, instant, query]);
  const finalList   = useMemo(() => apply(all, applied, query), [all, applied, query]);

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
            onReset={() => {
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
            }}
          />
        </div>

        <div className="lg:col-span-9 space-y-4">
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
        </div>
      </div>
    </div>
  );
}
