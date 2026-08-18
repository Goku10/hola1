const STORAGE_KEY = 'espanol-myp4-v1';
const LOG_CAP = 500;

export function emptyState() {
  return {
    version: 1,
    profile: {
      name: 'Gitanjali',
      level: '12',
      theme: '',
    },
    achievements: {},
    streak: { dates: [] },
    vocab: { '12': {}, '34': {} },
    grammar: { '12': {}, '34': {} },
    listening: { '12': {}, '34': {} },
    reading: { '12': {}, '34': {} },
    speaking: { echoCount: 0, openCount: 0, history: [] },
    writing: { drafts: {}, checklists: {}, modelsShown: {} },
    grammarProduction: {},
    resume: {
      section: 'overview',
      vocabTopic: '',
      grammarTopic: '',
      listenIdx: 0,
      readingIdx: 0,
      speakMode: 'echo',
      speakIdx: 0,
      writeIdx: 0,
    },
    dailyPlan: {
      date: '',
      listening: false,
      vocab: false,
      speaking: false,
      writing: false,
    },
    sessionCounts: {
      date: '',
      reviews: 0,
      listeningAnswers: 0,
      speakingRecordings: 0,
      writingWords: 0,
    },
    activityLog: [],
  };
}

function merge(base, extra) {
  if (!extra || typeof extra !== 'object') return base;
  const out = { ...base };
  for (const key of Object.keys(extra)) {
    const bv = base[key];
    const ev = extra[key];
    if (ev && typeof ev === 'object' && !Array.isArray(ev) && bv && typeof bv === 'object' && !Array.isArray(bv)) {
      out[key] = merge(bv, ev);
    } else if (ev !== undefined) {
      out[key] = ev;
    }
  }
  return out;
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return merge(emptyState(), parsed);
  } catch {
    return emptyState();
  }
}

let saveTimer = null;

export function saveState(state) {
  const snapshot = state;
  const write = () => {
    try {
      if (snapshot.activityLog && snapshot.activityLog.length > LOG_CAP) {
        snapshot.activityLog = snapshot.activityLog.slice(-LOG_CAP);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {
      console.warn('Could not save progress', err);
    }
  };
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(write, 200);
}

export function saveStateNow(state) {
  if (saveTimer) clearTimeout(saveTimer);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save progress', err);
  }
}
