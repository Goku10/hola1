export const INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return todayISO(d);
}

export function startOfWeek(iso) {
  const d = new Date(`${iso}T12:00:00`);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return todayISO(d);
}

export function defaultCard() {
  return { box: 1, nextReview: todayISO(), seen: 0, correct: 0 };
}

export function isDue(card, today = todayISO()) {
  if (!card) return true;
  return (card.nextReview || today) <= today;
}

export function promote(card, today = todayISO()) {
  const prev = card || defaultCard();
  const box = Math.min(5, (prev.box || 0) + 1);
  const interval = INTERVALS[box] ?? 1;
  return {
    ...prev,
    box,
    nextReview: addDays(today, interval),
    seen: (prev.seen || 0) + 1,
    correct: (prev.correct || 0) + 1,
    lastReview: today,
  };
}

export function demote(card, today = todayISO()) {
  const prev = card || defaultCard();
  return {
    ...prev,
    box: 1,
    nextReview: today,
    seen: (prev.seen || 0) + 1,
    lastReview: today,
  };
}

export function getCard(map, id) {
  return map[id] || null;
}

export function dueVocabIds(vocabMap, allItems, today = todayISO()) {
  const due = [];
  const unseen = [];
  for (const item of allItems) {
    const card = vocabMap[item.id];
    if (!card) unseen.push(item.id);
    else if (isDue(card, today)) due.push(item.id);
  }
  due.sort((a, b) => (vocabMap[a].box || 1) - (vocabMap[b].box || 1));
  return { due, unseen };
}

export function dueGrammarIds(grammarMap, allItems, today = todayISO()) {
  const due = [];
  const unseen = [];
  for (const item of allItems) {
    const card = grammarMap[item.id];
    if (!card) unseen.push(item.id);
    else if (isDue(card, today)) due.push(item.id);
  }
  due.sort((a, b) => (grammarMap[a].box || 1) - (grammarMap[b].box || 1));
  return { due, unseen };
}

export function buildReviewQueue(due, unseen, maxDue = 15, maxNew = 5) {
  return [...due.slice(0, maxDue), ...unseen.slice(0, maxNew)];
}

export function masteredCount(map, minBox = 3) {
  return Object.values(map).filter((c) => (c.box || 0) >= minBox).length;
}

export function reviewedThisWeek(map, weekStart) {
  return Object.values(map).filter((c) => c.lastReview && c.lastReview >= weekStart).length;
}
