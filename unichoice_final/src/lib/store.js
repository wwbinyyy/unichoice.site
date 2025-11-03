// src/lib/store.js
const FAVORITES_KEY = "favorites";
const COMPARE_KEY = "compare";
const EVT = "uni-store:update";

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}
function write(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
  window.dispatchEvent(new CustomEvent(EVT, { detail: { key, count: arr.length } }));
}

function add(key, item) {
  const arr = read(key);
  if (!arr.find(x => x.id === item.id)) {
    arr.push({ id: item.id, name: item.name, slug: item.slug });
    write(key, arr);
  }
}
function remove(key, id) {
  const arr = read(key).filter(x => x.id !== id);
  write(key, arr);
}
function clear(key) { write(key, []); }
function has(key, id) { return !!read(key).find(x => x.id === id); }
function list(key) { return read(key); }

export const store = {
  EVT,
  // favorites
  listFavorites: () => list(FAVORITES_KEY),
  addFavorite: (item) => add(FAVORITES_KEY, item),
  removeFavorite: (id) => remove(FAVORITES_KEY, id),
  clearFavorites: () => clear(FAVORITES_KEY),
  isFavorite: (id) => has(FAVORITES_KEY, id),
  // compare
  listCompare: () => list(COMPARE_KEY),
  addCompare: (item) => add(COMPARE_KEY, item),
  removeCompare: (id) => remove(COMPARE_KEY, id),
  clearCompare: () => clear(COMPARE_KEY),
  inCompare: (id) => has(COMPARE_KEY, id),
  // counts
  counts() {
    return {
      favorites: list(FAVORITES_KEY).length,
      compare: list(COMPARE_KEY).length,
    };
  },
};
