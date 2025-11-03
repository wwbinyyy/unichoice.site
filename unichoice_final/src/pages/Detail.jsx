// src/pages/Detail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { findUniversity, loadUniversities } from '../lib/data';

const Row = ({label, children}) => (children==null || children==='') ? null : (
  <div className="flex gap-2 text-sm">
    <div className="w-40 text-gray-500">{label}</div>
    <div className="flex-1">{children}</div>
  </div>
);

export default function Detail() {
  const { id } = useParams();
  const [u, setU] = useState(null);

  useEffect(()=>{ (async()=>{
    await loadUniversities();
    setU(findUniversity(id));
  })(); }, [id]);

  if (!u) return <div className="p-6 text-center text-gray-500">Loading…</div>;

  const tuition = u.tuitionAnnual ? `${u.tuitionAnnual} ${u.currency||''}/year` : '—';
  const intl = u.internationalStudentsPercent!=null ? `${u.internationalStudentsPercent}%` : '—';

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <Link to="/" className="text-blue-600 hover:underline">← Back</Link>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 card p-6 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a] space-y-4 text-gray-900 dark:text-white">
          <div className="flex items-center gap-4">
            {u.logo ? <img src={u.logo} alt={u.name} className="w-16 h-16 object-contain rounded-xl" /> : <div className="w-16 h-16 bg-gray-200 rounded-xl" />}
            <div>
              <h1 className="text-2xl font-bold">{u.name}</h1>
              <div className="text-gray-500">{u.city}{(u.countryFull || u.country)?`, ${u.countryFull || u.country}`:''}</div>
              {u.rating && <div className="text-yellow-500 font-semibold mt-1">⭐ {u.rating}</div>}
            </div>
          </div>

          {u.campusPhoto && (
            <img src={u.campusPhoto} alt="Campus"
                 className="w-full max-h-64 object-cover rounded-xl border border-gray-200 dark:border-[#1f2a36]" />
          )}

          <div className="space-y-2">
            <Row label="About">{u.summary || 'No summary available.'}</Row>
            <Row label="Founded">{u.founded}</Row>
            <Row label="Languages">{u.languages?.join(', ')}</Row>
            <Row label="Degree Levels">{u.degreeLevels?.join(', ')}</Row>
            <Row label="Tuition">{tuition}</Row>
            <Row label="Grants">{u.hasGrant === true ? 'Available' : (u.hasGrant === false ? 'Not available' : '—')}</Row>
            <Row label="% International">{intl}</Row>
            <Row label="Strong majors">{u.strongMajors?.length ? u.strongMajors.join(', ') : '—'}</Row>

            {u.website && <Row label="Website"><a href={u.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{u.website}</a></Row>}
          </div>

          {/* Admission Requirements Section */}
          {u.admissionRequirements && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#1f2a36]">
              <h3 className="text-lg font-semibold mb-4">Admission Requirements</h3>
              
              {u.admissionRequirements.bachelor && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Bachelor's Programs</h4>
                  <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    {u.admissionRequirements.bachelor.gpa && <div>• <span className="font-medium">GPA:</span> {u.admissionRequirements.bachelor.gpa}</div>}
                    {u.admissionRequirements.bachelor.standardizedTests && <div>• <span className="font-medium">Tests:</span> {u.admissionRequirements.bachelor.standardizedTests}</div>}
                    {u.admissionRequirements.bachelor.englishProficiency && <div>• <span className="font-medium">English:</span> {u.admissionRequirements.bachelor.englishProficiency}</div>}
                    {u.admissionRequirements.bachelor.additionalRequirements && <div>• <span className="font-medium">Additional:</span> {u.admissionRequirements.bachelor.additionalRequirements}</div>}
                    {u.admissionRequirements.bachelor.applicationDeadline && <div>• <span className="font-medium">Deadline:</span> {u.admissionRequirements.bachelor.applicationDeadline}</div>}
                  </div>
                </div>
              )}
              
              {u.admissionRequirements.master && (
                <div>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Master's Programs</h4>
                  <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    {u.admissionRequirements.master.gpa && <div>• <span className="font-medium">GPA:</span> {u.admissionRequirements.master.gpa}</div>}
                    {u.admissionRequirements.master.standardizedTests && <div>• <span className="font-medium">Tests:</span> {u.admissionRequirements.master.standardizedTests}</div>}
                    {u.admissionRequirements.master.englishProficiency && <div>• <span className="font-medium">English:</span> {u.admissionRequirements.master.englishProficiency}</div>}
                    {u.admissionRequirements.master.additionalRequirements && <div>• <span className="font-medium">Additional:</span> {u.admissionRequirements.master.additionalRequirements}</div>}
                    {u.admissionRequirements.master.applicationDeadline && <div>• <span className="font-medium">Deadline:</span> {u.admissionRequirements.master.applicationDeadline}</div>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:w-96 space-y-6">
          {/* --- DEADLINES --- */}
          <div className="card p-6 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a] text-gray-900 dark:text-white">
            <h2 className="text-lg font-semibold mb-3">Deadlines</h2>
            {u.deadlines?.length ? (
              <ul className="space-y-2 text-sm">
                {u.deadlines.map((d,i)=>(
                  <li key={i} className="border-b border-gray-200 dark:border-[#1f2a36] pb-2">
                    <div className="flex justify-between">
                      <span>{d.level} {d.term ? `(${d.term})` : ''}</span>
                      <span className="text-gray-500">{d.deadlineDate || 'Rolling'}</span>
                    </div>
                    <div className="text-gray-600">{d.roundName}</div>
                    {d.notes && <div className="text-xs text-gray-400">{d.notes}</div>}
                    {d.link && <a className="text-blue-600 text-xs hover:underline" href={d.link} target="_blank" rel="noreferrer">Details →</a>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">No deadlines available.</div>
            )}
          </div>

          {/* --- SUCCESS STORIES / CASES --- */}
          <div className="card p-6 rounded-2xl border border-gray-200 dark:border-[#1f2a36] bg-white dark:bg-[#0b111a] text-gray-900 dark:text-white">
            <h2 className="text-lg font-semibold mb-3">Success stories</h2>
            {u.cases?.length ? (
              <ul className="space-y-2 text-sm">
                {u.cases.map((c,i)=>(
                  <li key={i} className="border-b border-gray-200 dark:border-[#1f2a36] pb-2">
                    <div className="font-medium">{c.title}</div>
                    <div className="text-gray-600">{c.summary}</div>
                    {c.link && <a className="text-blue-600 text-xs hover:underline" href={c.link} target="_blank" rel="noreferrer">More →</a>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">No success stories yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
