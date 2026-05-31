// Pure, React-free game logic for "Amigos de Merda". Unit-tested.

export function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A deck is an array of indices into AMIGOS_QUESTIONS, in shuffled order.
export function buildDeck(count, rng = Math.random) {
  return shuffle([...Array(count).keys()], rng);
}

// Current card id, cycling infinitely as deckIdx grows.
export function currentCardId(deck, deckIdx) {
  if (deck.length === 0) return null;
  return deck[deckIdx % deck.length];
}

// Players sorted by number of cards (desc), each with its `cards` array.
export function ranking(players, scores) {
  return players
    .map((p) => ({ ...p, cards: scores[p.id] || [] }))
    .sort((a, b) => b.cards.length - a.cards.length);
}
