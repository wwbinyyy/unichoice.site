import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Ctx = createContext();

export default function AppProvider({ children }) {
  // 🌗 Тема
  const [theme, setTheme] = useState(() => localStorage.getItem('uc.theme') || 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('uc.theme', theme);
  }, [theme]);

  // ❤️ Избранное и сравнение ⇄
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uc.favs')||'[]'); } catch { return []; }
  });
  const [cmp, setCmp] = useState(() => {
    try { return JSON.parse(localStorage.getItem('uc.cmp')||'[]'); } catch { return []; }
  });

  useEffect(()=>localStorage.setItem('uc.favs', JSON.stringify(favs)), [favs]);
  useEffect(()=>localStorage.setItem('uc.cmp', JSON.stringify(cmp)), [cmp]);

  // === Favorites ===
  const addFav = (id) => setFavs(prev => prev.includes(id) ? prev : [...prev, id]);
  const removeFav = (id) => setFavs(prev => prev.filter(x => x !== id));
  const clearFavs = () => setFavs([]);
  const toggleFav = (id) => setFavs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // === Compare ===
  const addCmp = (id) => setCmp(prev => prev.includes(id) ? prev : [...prev, id]);
  const removeCmp = (id) => setCmp(prev => prev.filter(x => x !== id));
  const clearCmp = () => setCmp([]);
  const toggleCmp = (id) => setCmp(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const value = useMemo(()=>({
    theme, setTheme,
    favs, addFav, removeFav, clearFavs, toggleFav,
    cmp, addCmp, removeCmp, clearCmp, toggleCmp,
  }), [theme, favs, cmp]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
