import {Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Header(){
  const { favs, cmp, theme, setTheme } = useApp();
  const [hasUser, setHasUser] = useState(false);

  useEffect(()=>{
    try { setHasUser(!!localStorage.getItem('uc.user')); } catch {}
    const h = () => { try { setHasUser(!!localStorage.getItem('uc.user')); } catch {} };
    window.addEventListener('storage', h);
    return ()=> window.removeEventListener('storage', h);
  },[]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-brand-600"></div>
          <span className="font-semibold text-2xl italic">UniChoice</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:underline" to="/favorites">❤ Favorites ({favs.length})</Link>
          <Link className="hover:underline" to="/compare">Compare ({cmp.length})</Link>
          <Link className="hover:underline" to="/settings">Settings</Link>
          {!hasUser && <Link className="hover:underline" to="/register">Register</Link>}
          <button onClick={()=>setTheme(theme==='dark'?'light':'dark')}
                  className="px-3 py-1 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-100 text-gray-800">
            {theme==='dark'?'Light':'Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}
