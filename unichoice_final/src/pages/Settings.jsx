import React, { useEffect, useState } from 'react';

export default function Settings(){
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('en');

  useEffect(()=>{
    try {
      const u = localStorage.getItem('uc.user');
      if (u) setUser(JSON.parse(u));
      const l = localStorage.getItem('uc.lang') || 'en';
      setLang(l);
    } catch {}
  },[]);

  const saveLang = (v) => {
    setLang(v);
    try { localStorage.setItem('uc.lang', v); } catch {}
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="card p-4 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a]">
        <h2 className="text-lg font-medium mb-2">Language</h2>
        <select
          value={lang}
          onChange={e=>saveLang(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621] text-gray-900 dark:text-white"
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
        <div className="text-xs text-gray-500 mt-2">
          Default is English. You can switch anytime.
        </div>
      </div>

      <div className="card p-4 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a]">
        <h2 className="text-lg font-medium mb-2">Profile</h2>
        {user ? (
          <div className="space-y-1 text-sm">
            <div><b>Name:</b> {user.name}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>Country:</b> {user.country}</div>
            <div className="text-xs text-gray-500">To change profile, re-open registration on the Register page.</div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-300">You are not registered yet.</div>
        )}
      </div>
    </div>
  );
}
