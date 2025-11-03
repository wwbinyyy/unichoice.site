import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';

export default function AutoInput({ value, onChange, list, placeholder }){
  const [q,setQ]=useState(value||'');
  const [open,setOpen]=useState(false);
  useEffect(()=> setQ(value||''), [value]);
  const fuse = useMemo(()=> new Fuse(list, { threshold:0.3 }), [list]);
  const res = q? fuse.search(q).slice(0,6).map(r=>r.item):[];
  return (
    <div className="relative">
      <input value={q} onChange={e=>{ setQ(e.target.value); onChange(e.target.value); }} onFocus={()=> setOpen(true)} onBlur={()=> setTimeout(()=>setOpen(false), 120)}
        placeholder={placeholder} className="w-full px-3 py-2 border rounded-xl dark:bg-gray-800 dark:border-gray-700"/>
      {open && res.length>0 && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-soft overflow-hidden">
          {res.map(it=> (
            <button key={it} onMouseDown={()=>{ onChange(it); setQ(it); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">{it}</button>
          ))}
        </div>
      )}
    </div>
  )
}
