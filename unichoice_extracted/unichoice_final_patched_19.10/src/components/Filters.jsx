import React, { useEffect, useMemo, useRef, useState } from "react";

/* ——— утилиты ——— */
function useClickAway(ref, onAway) {
  useEffect(() => {
    const h = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onAway?.();
    };
    document.addEventListener("mousedown", h, true);
    document.addEventListener("touchstart", h, true);
    return () => {
      document.removeEventListener("mousedown", h, true);
      document.removeEventListener("touchstart", h, true);
    };
  }, [ref, onAway]);
}

/* ——— универсальный MultiSelect ——— */
function MultiSelect({ label, options, values, setValues, placeholder = "Type to search…" }) {
  const boxRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useClickAway(boxRef, () => setOpen(false));

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return (options || [])
      .filter(Boolean)
      .filter((o) => (qq ? String(o).toLowerCase().includes(qq) : true))
      .slice(0, 200);
  }, [options, q]);

  const removeTag = (v) => setValues(values.filter((x) => x !== v));
  const addValue = (v) => {
    if (!values.includes(v)) setValues([...values, v]);
    setQ("");
    setOpen(false);
  };

  return (
    <div className="space-y-1" ref={boxRef}>
      {label && <label className="block text-sm">{label}</label>}

      {/* выбранные теги */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-xl bg-gray-100 dark:bg-[#101a26] border border-gray-200 dark:border-[#223243]"
            >
              {v}
              <button
                onClick={() => removeTag(v)}
                className="px-1 rounded hover:bg-gray-200 dark:hover:bg-[#1a2433]"
                title="Remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* поле ввода + список */}
      <div className="relative">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621] text-gray-900 dark:text-white"
        />
        {open && (
          <ul
            className="absolute z-40 w-full mt-1 max-h-52 overflow-auto rounded-xl border border-gray-200 dark:border-[#223243] bg-white dark:bg-[#0f1621] shadow-lg"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">No options</li>
            ) : (
              filtered.map((o) => (
                <li
                  key={o}
                  onMouseDown={(e) => { e.preventDefault(); addValue(o); }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1a2433]"
                >
                  {o}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ——— сам фильтр ——— */
export default function Filters({
  all = [],
  onChange,          // применить по кнопке
  onInstant,         // мгновенно при каждом изменении (для счётчика)
  onReset,
  resultCount = 0,
}) {
  const wrapRef = useRef(null);
  useClickAway(wrapRef, () => {
    // не скрываем панель, но закрываем её внутренние выпадашки — это делает MultiSelect
  });

  // состояния (многовыбор)
  const [countries, setCountries] = useState([]);
  const [cities, setCities]       = useState([]);
  const [majors, setMajors]       = useState([]);
  const [langs, setLangs]         = useState([]);
  const [grant, setGrant]         = useState("any"); // any | yes | no
  const [maxTuition, setMaxTuition] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  const allCountries = useMemo(
    () => Array.from(new Set(all.map(u => u.countryFull).filter(Boolean))).sort(),
    [all]
  );
  const allCities = useMemo(
    () => Array.from(new Set(all.map(u => u.city).filter(Boolean))).sort(),
    [all]
  );
  const allMajors = useMemo(
    () => Array.from(new Set(all.flatMap(u => u.majors || []))).sort(),
    [all]
  );
  const allLangs = useMemo(
    () => Array.from(new Set(all.flatMap(u => u.languages || []))).sort(),
    [all]
  );

  // мгновенный эмит (для live-счётчика и live-подсветки количества)
  useEffect(() => {
    onInstant?.({ countries, cities, majors, langs, grant, maxTuition, minRating });
  }, [countries, cities, majors, langs, grant, maxTuition, minRating, onInstant]);

  return (
    <div
      ref={wrapRef}
      className="card p-4 space-y-4 bg-white dark:bg-[#0b111a] border border-gray-200 dark:border-[#1f2a36] rounded-2xl text-gray-900 dark:text-white"
    >
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Filter by multiple countries, majors, languages, tuition, rating, grants.
      </div>

      <MultiSelect
        label="Country"
        options={allCountries}
        values={countries}
        setValues={setCountries}
        placeholder="Type a country…"
      />

      <MultiSelect
        label="City"
        options={allCities}
        values={cities}
        setValues={setCities}
        placeholder="Type a city…"
      />

      <MultiSelect
        label="Major"
        options={allMajors}
        values={majors}
        setValues={setMajors}
        placeholder="Type a major…"
      />

      <MultiSelect
        label="Language"
        options={allLangs}
        values={langs}
        setValues={setLangs}
        placeholder="Type a language…"
      />

      <div>
        <label className="block text-sm mb-1">Grant availability</label>
        <select
          value={grant}
          onChange={(e) => setGrant(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
        >
          <option value="any">Any</option>
          <option value="yes">Has grant</option>
          <option value="no">No grant</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Max tuition: {maxTuition.toLocaleString()} $
        </label>
        <input
          type="range"
          min={0}
          max={150000}
          step={1000}
          value={maxTuition}
          onChange={(e) => setMaxTuition(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Min rating</label>
        <input
          type="number"
          min={0}
          max={1000}
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value || 0))}
          className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
        />
      </div>

      <button
        onClick={() =>
          onChange?.({ countries, cities, majors, langs, grant, maxTuition, minRating })
        }
        className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
      >
        Show results ({resultCount})
      </button>

      <button
        onClick={() => {
          setCountries([]); setCities([]); setMajors([]); setLangs([]);
          setGrant("any"); setMaxTuition(100000); setMinRating(0);
          onReset?.();
        }}
        className="w-full px-4 py-2 rounded-xl border dark:border-[#2a3a4a]"
      >
        Reset
      </button>
    </div>
  );
}
