// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import Settings from './pages/Settings';
import Register from './pages/Register';
import AppProvider from './context/AppContext';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a1017] text-gray-900 dark:text-[#dfe7ee]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/u/:id" element={<Detail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AppProvider>
  );
}
