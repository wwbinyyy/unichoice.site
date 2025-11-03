// src/components/RegisterModal.jsx
import React, { useState } from 'react';

export default function RegisterModal({ open, onClose }) {
  const [reg, setReg] = useState({ name:'', email:'', country:'' });
  const [sentCode, setSentCode] = useState(null);
  const [code, setCode] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0f1621] text-gray-900 dark:text-white border border-gray-200 dark:border-[#1f2a36] p-5 space-y-4">
        <h2 className="text-xl font-semibold">Register</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Enter your name, Gmail and country. We’ll send a 6-digit code.
        </p>

        {!sentCode ? (
          <form className="space-y-3" onSubmit={e=>e.preventDefault()}>
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                     placeholder="Your name"
                     value={reg.name}
                     onChange={e=>setReg({...reg, name:e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm mb-1">Gmail</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                     type="email" placeholder="you@gmail.com"
                     value={reg.email}
                     onChange={e=>setReg({...reg, email:e.target.value})}/>
              <div className="text-xs text-gray-500 mt-1">Only @gmail.com</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Country</label>
              <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                     placeholder="Kazakhstan"
                     value={reg.country}
                     onChange={e=>setReg({...reg, country:e.target.value})}/>
            </div>
            <button
              onClick={()=>{
                if(!reg.name||!reg.country||!reg.email){ alert('Fill all fields.'); return; }
                if(!/^[^@]+@gmail\.com$/i.test(reg.email)){ alert('Use Gmail (…@gmail.com).'); return; }
                const c = String(Math.floor(100000 + Math.random()*900000));
                setSentCode(c);
                try{ localStorage.setItem('uc.lastCode', c); }catch{}
                alert('Confirmation code (demo): ' + c);
              }}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              Send code
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="text-sm">Enter the code sent to <b>{reg.email}</b>.</div>
            <input className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]"
                   placeholder="______" maxLength={6}
                   value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))}/>
            <div className="flex gap-2">
              <button
                onClick={()=>{
                  if(code===sentCode){
                    try{ localStorage.setItem('uc.user', JSON.stringify({...reg, verifiedAt: Date.now()})); }catch{}
                    onClose?.();
                  } else { alert('Wrong code.'); }
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                Confirm
              </button>
              <button onClick={()=>{ setSentCode(null); setCode(''); }}
                      className="px-4 py-2 rounded-xl border border-gray-300 dark:border-[#294055] bg-white dark:bg-[#0f1621]">
                Change email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
