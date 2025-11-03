// src/components/SearchBar.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function useClickAway(refs, onAway) {
  useEffect(() => {
    const onDown = (e) => {
      const inside = refs.some(r => r.current && r.current.contains(e.target));
      if (!inside) onAway();
    };
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('touchstart', onDown, true);
    return () => {
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('touchstart', onDown, true);
    };
  }, [refs, onAway]);
}

export default function SearchBar({
  placeholder = 'Find a university, country, city, or major…',
  items = [],
  onPick,       // (string) => void
  onSubmit,     // (string) => void
  className = '',
}) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const popRef = useRef(null);

  // быстрый предикативный поиск
  const suggestions = useMemo(() => {
    if (!q) return items.slice(0, 8);
    const qq = q.toLowerCase();
    return items.filter(i => i.toLowerCase().includes(qq)).slice(0, 8);
  }, [q, items]);

  // закрываем всё при клике вне
  useClickAway([inputRef, popRef], () => setOpen(false));

  // закрываем по Esc
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // позиционируем слой поверх всего (Portal)
  const [rect, setRect] = useState(null);
  useEffect(() => {
    const upd = () => {
      const el = inputRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({
        top: r.bottom + window.scrollY,
        left: r.left + window.scrollX,
        width: r.width,
      });
    };
    upd();
    window.addEventListener('resize', upd);
    window.addEventListener('scroll', upd, true);
    return () => {
      window.removeEventListener('resize', upd);
      window.removeEventListener('scroll', upd, true);
    };
  }, []);

  const suggestionLayer = open && rect ? createPortal(
    <div
      ref={popRef}
      style={{
        position: 'absolute',
        top: rect.top + 6,
        left: rect.left,
        width: rect.width,
        zIndex: 3000,
      }}
      className="rounded-2xl border border-gray-200 shadow-xl bg-white dark:bg-[#0f1621] dark:border-[#223243]"
    >
      {suggestions.length === 0 ? (
        <div className="px-3 py-2 text-sm text-gray-500">No suggestions</div>
      ) : (
        <ul className="max-h-72 overflow-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1a2433]"
              onMouseDown={(e) => {
                e.preventDefault();
                setQ(s);
                setOpen(false);
                // снимаем фокус, чтобы не «висел» caret
                requestAnimationFrame(() => inputRef.current?.blur());
                onPick?.(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <div className={className}>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setOpen(false);
            requestAnimationFrame(() => inputRef.current?.blur());
            onSubmit?.(q.trim());
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white dark:bg-[#0b111a] dark:border-[#1f2a36] outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
      {suggestionLayer}
    </div>
  );
}
