// src/pages/UniversitiesJSON.jsx
import React, { useEffect, useState } from 'react';
import { universities } from '../lib/data'; // ← берём уже готовые данные из lib/data.js

export default function UniversitiesJSON() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // просто загружаем universities из lib/data
    setData(universities);
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-semibold">Universities Data (from /data/universities.json)</h1>

      <div className="card p-4 overflow-auto max-h-[70vh]">
        <pre className="text-xs whitespace-pre-wrap break-words">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
