// src/lib/data.js
let _cache = null;

const ISO2_TO_NAME = {
  US:'United States', GB:'United Kingdom', KZ:'Kazakhstan', AU:'Australia', CA:'Canada',
  DE:'Germany', FR:'France', ES:'Spain', IT:'Italy', NL:'Netherlands', SE:'Sweden',
  NO:'Norway', FI:'Finland', DK:'Denmark', CH:'Switzerland', AT:'Austria', BE:'Belgium',
  PL:'Poland', CZ:'Czech Republic', SK:'Slovakia', HU:'Hungary', TR:'Türkiye',
  AE:'United Arab Emirates', QA:'Qatar', SA:'Saudi Arabia', CN:'China', JP:'Japan',
  KR:'South Korea', SG:'Singapore', IN:'India', BR:'Brazil', MX:'Mexico'
};

export const slugify = (s='') =>
  String(s).trim().toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

export const parseNum = (val) => {
  if (val == null) return null;
  if (typeof val === 'number') return val;
  const m = String(val).replace(/[^\d.,]/g,'').replace(',', '').match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : null;
};

const toCountryName = (c) => {
  if (!c) return '';
  const raw = String(c).trim();
  if (/^[A-Za-z]{2}$/.test(raw)) return ISO2_TO_NAME[raw.toUpperCase()] || raw;
  return raw;
};
const cleanCity = (city) => String(city||'').replace(/,\s*[A-Z]{2}\s*$/,'').trim();

const toBool = (v) => {
  if (typeof v === 'boolean') return v;
  const s = String(v??'').toLowerCase();
  if (['yes','true','1','available'].includes(s)) return true;
  if (['no','false','0','not available','none'].includes(s)) return false;
  return null; // неизвестно — не режем фильтрацией
};

const norm = (u) => {
  const languages = Array.isArray(u.languages) ? u.languages : (u.language ? [u.language] : []);
  const majors    = Array.isArray(u.majors)    ? u.majors    : (u.majors ? [u.majors] : []);
  const strongMajors = Array.isArray(u.strongMajors) ? u.strongMajors : [];

  const tuitionAnnual = u.tuitionAnnual ?? u.tuition ?? u.tuitionPerYear ?? u.cost ?? null;

  return {
    id: u.id ?? slugify(u.name ?? ''),
    slug: u.slug ?? slugify(u.name ?? ''),
    name: u.name ?? '',
    country: toCountryName(u.country),
    city: cleanCity(u.city),
    founded: u.founded ?? u.established ?? null,

    rating: u.rating ?? u.qsRank ?? u.rank ?? null,
    tuitionAnnual,
    _tuitionNum: parseNum(tuitionAnnual),
    currency: u.currency ?? 'USD',
    hasGrant: toBool(u.hasGrant ?? u.grants),

    languages,
    degreeLevels: Array.isArray(u.degreeLevels) ? u.degreeLevels : [],
    majors, strongMajors,

    summary: u.summary ?? u.tagline ?? '',
    website: u.website ?? u.site ?? '',
    logo: u.logo ?? u.icon ?? '',
    campusPhoto: u.campusPhoto ?? u.image ?? (u.images && u.images[0]) ?? u.photo ?? '',

    employmentRate: u.employmentRate ?? null,
    internationalStudentsPercent: u.internationalStudentsPercent ?? u.intlPct ?? null,
    requirements: typeof u.requirements === 'string' ? u.requirements : null,
    admissionRequirements: (typeof u.admissionRequirements === 'object' && u.admissionRequirements !== null) ? u.admissionRequirements : null,
    countryFull: u.countryFull ?? toCountryName(u.country),

    cases: Array.isArray(u.cases) ? u.cases : [],
    deadlines: Array.isArray(u.deadlines) ? u.deadlines : [],
  };
};

export async function loadUniversities() {
  if (_cache) return _cache;
  const res = await fetch((import.meta.env.BASE_URL || './') + 'data/universities.json', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Cannot load /data/universities.json (${res.status})`);
  const json = await res.json();
  const src = Array.isArray(json) ? json : (json?.universities ?? []);
  _cache = src.map(norm);
  return _cache;
}
export const getUniversities = () => _cache || [];
export const findUniversity = (key) => {
  const x = String(key ?? '').toLowerCase();
  const arr = getUniversities();
  return (
    arr.find(u => String(u.slug).toLowerCase()===x) ||
    arr.find(u => String(u.id).toLowerCase()===x)   ||
    arr.find(u => u.name.toLowerCase()===x)        ||
    arr.find(u => u.name.toLowerCase().includes(x))||
    null
  );
};
