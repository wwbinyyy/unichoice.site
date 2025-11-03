// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Register(){
  const { setUser } = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', country:'' });
  const [codeSent, setCodeSent] = useState(null);
  const [code, setCode] = useState('');

  const sendCode = () => {
    if(!form.name || !form.email || !form.country) return alert('Fill all fields.');
    if(!/^[^@]+@gmail\.com$/i.test(form.email)) return alert('Use Gmail address.');
    const c = String(Math.floor(100000 + Math.random()*900000));
    setCodeSent(c);
    try { localStorage.setItem('uc.lastCode', c); } catch {}
    alert('Verification code sent (demo): ' + c);
  };

  const verify = () => {
    if(code.trim() !== String(codeSent)) return alert('Wrong code.');
    const payload = { ...form, verifiedAt: Date.now() };
    setUser(payload);
    try { localStorage.setItem('uc.user', JSON.stringify(payload)); } catch {}
    nav('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <div className="card p-6 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a] space-y-4">
        <h1 className="text-xl font-semibold">Register</h1>
        {!codeSent ? (
          <>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                     value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm mb-1">Gmail</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                     value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@gmail.com" />
            </div>
            <div>
              <label className="block text-sm mb-1">Country</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                     value={form.country} onChange={e=>setForm({...form,country:e.target.value})} placeholder="Kazakhstan" />
            </div>
            <button onClick={sendCode} className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
              Send code
            </button>
          </>
        ) : (
          <>
            <div className="text-sm">A 6-digit code was sent to <b>{form.email}</b>.</div>
            <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                   value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} placeholder="Enter code" maxLength={6}/>
            <div className="flex gap-2">
              <button onClick={verify} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">Verify</button>
              <button onClick={()=>{ setCodeSent(null); setCode(''); }} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-[#2a3a4a]">Edit email</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
