import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const money = (v, cur='USD') => {
  const n = Number(v);
  if (!isFinite(n)) return null;
  try { return new Intl.NumberFormat('en-US',{style:'currency',currency:cur,maximumFractionDigits:0}).format(n); }
  catch { return `${n.toLocaleString()} ${cur}`; }
};

export default function Card({ u }) {
  const { favs, toggleFav, cmp, toggleCmp } = useApp();
  const id = u.id || u.slug || u.name;
  const tuition = money(u.tuitionAnnual, u.currency);
  const inFav = favs.includes(id);
  const inCmp = cmp.includes(id);

  return (
    <div className="card p-4 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a] flex flex-col gap-3 text-gray-900 dark:text-white">
      <div className="flex items-center gap-3">
        {u.logo ? <img src={u.logo} alt={u.name} className="w-12 h-12 object-contain rounded-lg" /> : <div className="w-12 h-12 rounded-lg bg-gray-200" />}
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{u.name}</div>
          <div className="text-xs text-gray-500 truncate">{u.city}{(u.countryFull || u.country) ? `, ${u.countryFull || u.country}` : ''}</div>
          <div className="text-xs mt-1 flex flex-wrap gap-x-2 gap-y-1">
            <span className={u.rating ? 'text-yellow-500' : 'text-gray-400'}>
              {u.rating ? `⭐ ${u.rating}` : 'No rating'}
            </span>
            {!!u.languages?.length && <span className="text-gray-500">• {u.languages.join(', ')}</span>}
            {tuition && <span className="text-gray-500">• {tuition}/year</span>}
            {u.internationalStudentsPercent!=null && <span className="text-gray-500">• {u.internationalStudentsPercent}% intl</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {u.strongMajors?.slice(0,3).map(m => (
          <span key={m} className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-[#121c2b] border border-gray-200 dark:border-[#223243]">{m}</span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2">
        <Link to={`/detail/${u.slug || id}`} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-[#2a3a4a] bg-white dark:bg-[#0f1621] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#132031]">
          View details →
        </Link>
        <button
          onClick={() => toggleFav(id)}
          className={`px-3 py-2 rounded-xl border ${inFav ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-300 dark:border-[#2a3a4a] bg-white dark:bg-[#0f1621] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#132031]'}`}
        >
          ❤
        </button>
        <button
          onClick={() => toggleCmp(id)}
          className={`px-3 py-2 rounded-xl border ${inCmp ? 'bg-emerald-500 text-white border-emerald-500' : 'border-gray-300 dark:border-[#2a3a4a] bg-white dark:bg-[#0f1621] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#132031]'}`}
        >
          ⇄
        </button>
      </div>
    </div>
  );
}
