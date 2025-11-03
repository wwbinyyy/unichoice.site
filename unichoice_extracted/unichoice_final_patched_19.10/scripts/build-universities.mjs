// Node 18+
// Установи зависимости:  pnpm add -D node-fetch@3
// Запуск:                node scripts/build-universities.mjs --per=25
// Результат:             data/universities.json

import { writeFile, mkdir } from "node:fs/promises";
import fetch from "node-fetch";
const TARGET_COUNTRIES = [
  "USA",
  "UK",
  "Canada",
  "Germany",
  "France",
  "Netherlands",
  "Italy",
  "Spain",
  "Switzerland",
  "Australia",
  "New Zealand",
  "Japan",
  "South Korea",
  "China",
  "Singapore",
  "UAE",
  "Kazakhstan",
  "Turkey",
  "Sweden",
  "Norway"
];
const PER_COUNTRY_DEFAULT = 20; // итого 20 стран * 20 = ~400
const perCountry =
  Number(process.argv.find(a => a.startsWith("--per="))?.split("=")[1]) ||
  PER_COUNTRY_DEFAULT;

// Простая карта популярных языков по стране (можно расширять)
const COUNTRY_LANGS = {
  "United States": ["English"],
  "United Kingdom": ["English"],
  Canada: ["English", "French"],
  Germany: ["German", "English"],
  France: ["French", "English"],
  Italy: ["Italian", "English"],
  Spain: ["Spanish", "English"],
  Netherlands: ["Dutch", "English"],
  Switzerland: ["German", "French", "Italian", "English"],
  Australia: ["English"],
  "New Zealand": ["English"],
  Japan: ["Japanese", "English"],
  "South Korea": ["Korean", "English"],
  Singapore: ["English", "Chinese", "Malay", "Tamil"],
  "United Arab Emirates": ["Arabic", "English"],
  Turkey: ["Turkish", "English"],
  Kazakhstan: ["Kazakh", "Russian", "English"],
  Poland: ["Polish", "English"],
  Czechia: ["Czech", "English"],
  Hungary: ["Hungarian", "English"],
};

// Набор популярных направлений (мажоры) — добавим всем, а где получится — уточним из Wiki
const DEFAULT_MAJORS = [
  "Computer Science",
  "Business",
  "Economics",
  "Engineering",
  "Law",
  "Medicine",
  "Data Science",
  "Design",
  "Finance",
  "International Relations"
];

// Утилита: ожидание
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Получаем список универов из публичного API (Hipolabs)
async function fetchUniversitiesByCountry(country) {
  const url = `https://universities.hipolabs.com/search?country=${encodeURIComponent(
    country
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Hipolabs failed for ${country}: ${res.status}`);
  const list = await res.json();
  // Возьмем первые perCountry (там бывают сотни)
  return list.slice(0, perCountry);
}

// Пытаемся обогатить из Википедии
async function enrichFromWikipedia(name, country) {
  // МедиаВики summary/картинка
  const api = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts|info&inprop=url&exintro=1&explaintext=1&format=json&origin=*&titles=${encodeURIComponent(
    name
  )}`;
  const res = await fetch(api);
  if (!res.ok) return {};
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const page = Object.values(pages)[0];
  if (!page || page.missing) return {};

  const summary = page.extract || "";
  const wikipediaUrl = page.fullurl;

  // Подтянем лого через Wikidata (часто есть)
  let image = null;
  try {
    const wd = `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&format=json&origin=*&titles=${encodeURIComponent(
      name
    )}`;
    const wdRes = await fetch(wd);
    const wdData = await wdRes.json();
    const wdPages = wdData?.query?.pages || {};
    const wdPage = Object.values(wdPages)[0];
    const qid = wdPage?.pageprops?.wikibase_item;
    if (qid) {
      const wdImg = `https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&origin=*&entity=${qid}&property=P154`; // logo image
      const imgRes = await fetch(wdImg);
      const imgData = await imgRes.json();
      const claim = imgData?.claims?.P154?.[0]?.mainsnak?.datavalue?.value;
      if (claim) {
        image = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
          claim
        )}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return { summary, wikipediaUrl, image };
}

// Простая эвристика для наличия грантов
function guessHasGrant(country) {
  // грубая логика: Европа/Азия чаще имеют стипендии; США/Великобритания — тоже, но реже
  const yes = new Set([
    "Germany","France","Italy","Spain","Netherlands","Switzerland","Poland","Czechia","Hungary",
    "Japan","South Korea","Singapore","Kazakhstan","Turkey","United Arab Emirates",
    "Canada","United Kingdom","United States","Australia","New Zealand"
  ]);
  return yes.has(country);
}

// Оценочный tuition (USD) по стране (примерно, лишь для первичного заполнения)
const TUITION_BY_COUNTRY = {
  "United States": 35000,
  "United Kingdom": 32000,
  Canada: 26000,
  Germany: 0,
  France: 2000,
  Italy: 2000,
  Spain: 2500,
  Netherlands: 2500,
  Switzerland: 1500,
  Australia: 28000,
  "New Zealand": 24000,
  Japan: 7000,
  "South Korea": 6000,
  Singapore: 9000,
  "United Arab Emirates": 12000,
  Turkey: 3000,
  Kazakhstan: 1500,
  Poland: 2000,
  Czechia: 1000,
  Hungary: 1500,
};

function normalize(str) {
  return String(str || "").trim();
}

async function main() {
  await mkdir("data", { recursive: true });

  const out = [];
  for (const country of TARGET_COUNTRIES) {
    console.log(`→ ${country}: fetching universities…`);
    const baseList = await fetchUniversitiesByCountry(country);

    for (const u of baseList) {
      const name = normalize(u.name);
      const website = (u.web_pages && u.web_pages[0]) || null;
      const city = (u["state-province"] || "").trim() || null;

      // обогащение Wiki (мягко, без падений)
      let summary = "";
      let image = null;
      try {
        const w = await enrichFromWikipedia(name, country);
        summary = w.summary || "";
        image = w.image || null;
        await sleep(150); // бережно к API
      } catch {}

      const record = {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name,
        country,
        city,
        founded: null, // можно расширить через Wikidata P571 (inception)
        languages: COUNTRY_LANGS[country] || ["English"],
        tuitionAnnual: TUITION_BY_COUNTRY[country] ?? null,
        hasGrant: guessHasGrant(country),
        summary:
          summary ||
          `A leading university in ${country}.`,
        programSummary:
          "Offers Bachelor's and Master's (and often PhD) across Engineering, Business, CS, Law and more.",
        majors: DEFAULT_MAJORS,
        cases: [], // можно вручную добавить позже заметных выпускников
        website,
        image, // может быть null — на карточке рендерь заглушку
      };

      out.push(record);
    }
  }

  // Минимальная дедупликация по id (на всякий случай)
  const ids = new Set();
  const deduped = out.filter(u => {
    if (ids.has(u.id)) return false;
    ids.add(u.id);
    return true;
  });

  await writeFile("data/universities.json", JSON.stringify({ universities: deduped }, null, 2), "utf8");
  console.log(`\n✔ Saved ${deduped.length} universities to data/universities.json`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
