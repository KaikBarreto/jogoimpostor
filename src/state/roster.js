// Shared player roster, persisted per browser session so the elenco carries
// across games (Impostor <-> Amigos de Merda) and across navigation.
// Uses sessionStorage: kept while the tab is open, cleared when it closes.
const KEY = "roster";

export function loadRoster() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (p) => p && typeof p.id === "string" && typeof p.name === "string"
    );
  } catch {
    return [];
  }
}

export function saveRoster(players) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(players));
  } catch {
    /* ignore quota / disabled storage */
  }
}
