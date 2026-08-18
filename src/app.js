import { loadState, saveState, saveStateNow } from './storage.js';
import {
  todayISO, addDays, startOfWeek, promote, demote, isDue,
  dueVocabIds, dueGrammarIds, buildReviewQueue, masteredCount, reviewedThisWeek,
} from './srs.js';
import {
  PERSONAL, LEVEL_LABELS, WORD_GOALS, VOCAB_TARGET,
  vocabSetsByLevel, grammarSetsByLevel, listeningItemsByLevel,
  readingItemsByLevel, speakingByLevel, writingPromptsByLevel,
  interpolateName, allVocab, findVocab, allGrammarItems,
} from './data.js';

function displayName() {
  return (state.profile?.name || '').trim() || PERSONAL.name;
}

function greetingTitle() {
  const h = new Date().getHours();
  const g = h < 12 ? '¡Buenos días' : h < 20 ? '¡Buenas tardes' : '¡Buenas noches';
  return `${g}, ${displayName()}!`;
}

function overviewSubtitle() {
  const due = dueCounts().totalDue;
  const streak = countStreak();
  const phase = `MYP4 · ${LEVEL_LABELS[currentLevel]}`;
  if (due > 0) return `Tienes ${due} tarjeta${due === 1 ? '' : 's'} esperándote · ${phase}`;
  if (streak > 0) return `Racha de ${streak} día${streak === 1 ? '' : 's'} — ¡sigue así! · ${phase}`;
  return `Un poco cada día — eso es todo · ${phase}`;
}

const TITLE = {
  overview: ['¡Hola! Overview', ''],
  review: ['Daily review', 'Due cards first, then a few new ones'],
  vocab: ['Vocabulary trainer', 'Browse topics — reviews schedule themselves'],
  grammar: ['Grammar practice', 'Finish a set — misses come back later'],
  listening: ['Listening comprehension', 'Audio + questions — Criterion A practice'],
  reading: ['Reading comprehension', 'Written text — Criterion B practice'],
  speaking: ['Speaking practice', 'Echo for sounds; respond for Criterion C'],
  writing: ['Writing workshop', 'Drafts save on this device — Criterion D'],
  progress: ['Your progress', 'Practice evidence, not a teacher grade'],
};

const SUN_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
const MOON_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

const state = loadState();
const today = todayISO();
let currentLevel = state.profile.level || '12';
let currentTopic = state.resume.vocabTopic || Object.keys(vocabSetsByLevel[currentLevel])[0];
let fcIndex = 0;
let currentGrammar = state.resume.grammarTopic || Object.keys(grammarSetsByLevel[currentLevel])[0];
let grammarQueue = [];
let grammarPos = 0;
let grammarSessionCorrect = 0;
let listenIdx = state.resume.listenIdx || 0;
let listenAnswers = {};
let readingIdx = state.resume.readingIdx || 0;
let speakMode = state.resume.speakMode || 'echo';
let speakIdx = state.resume.speakIdx || 0;
let writeIdx = state.resume.writeIdx || 0;
let reviewKind = 'vocab';
let reviewQueue = [];
let reviewPos = 0;
let quizItem = null;

function persist() {
  state.profile.level = currentLevel;
  state.resume.vocabTopic = currentTopic;
  state.resume.grammarTopic = currentGrammar;
  state.resume.listenIdx = listenIdx;
  state.resume.readingIdx = readingIdx;
  state.resume.speakMode = speakMode;
  state.resume.speakIdx = speakIdx;
  state.resume.writeIdx = writeIdx;
  saveState(state);
}

function ensureTodayBuckets() {
  if (state.sessionCounts.date !== today) {
    state.sessionCounts = {
      date: today,
      reviews: 0,
      listeningAnswers: 0,
      speakingRecordings: 0,
      writingWords: 0,
    };
  }
  if (state.dailyPlan.date !== today) {
    state.dailyPlan = {
      date: today,
      listening: false,
      vocab: false,
      speaking: false,
      writing: false,
    };
  }
}
ensureTodayBuckets();

function markStreak() {
  if (!state.streak.dates.includes(today)) {
    state.streak.dates.push(today);
    state.streak.dates.sort();
  }
}

function logActivity(type, extra = {}) {
  ensureTodayBuckets();
  markStreak();
  state.activityLog.push({ date: today, type, ...extra });
  persist();
  refreshChrome();
}

function countStreak() {
  const dates = new Set(state.streak.dates);
  if (!dates.has(today) && !dates.has(addDays(today, -1))) return dates.has(today) ? 1 : 0;
  let n = 0;
  let d = dates.has(today) ? today : addDays(today, -1);
  while (dates.has(d)) {
    n += 1;
    d = addDays(d, -1);
  }
  return n;
}

function weekRange(offsetWeeks = 0) {
  const start = startOfWeek(today);
  const from = addDays(start, offsetWeeks * 7);
  const to = addDays(from, 6);
  return { from, to };
}

function accuracyInRange(from, to) {
  const rows = state.activityLog.filter((a) => a.date >= from && a.date <= to && typeof a.correct === 'boolean');
  if (!rows.length) return null;
  const ok = rows.filter((a) => a.correct).length;
  return Math.round((100 * ok) / rows.length);
}

function vocabMap() {
  return state.vocab[currentLevel];
}
function grammarMap() {
  return state.grammar[currentLevel];
}

function dueCounts() {
  const v = dueVocabIds(vocabMap(), allVocab(currentLevel), today);
  const g = dueGrammarIds(grammarMap(), allGrammarItems(currentLevel), today);
  return {
    vocabDue: v.due.length,
    vocabNew: v.unseen.length,
    grammarDue: g.due.length,
    totalDue: v.due.length + g.due.length,
  };
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const btn = document.querySelector('[data-theme-toggle]');
  if (btn) {
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
  }
}

function initTheme() {
  let theme = state.profile.theme;
  if (!theme) theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  state.profile.theme = theme;
  applyTheme(theme);
}

function showSection(id, fromResume = false) {
  document.querySelectorAll('.section').forEach((s) => s.classList.remove('active'));
  const el = document.getElementById(`sec-${id}`);
  if (!el) return;
  el.classList.add('active');
  document.querySelectorAll('.navitem').forEach((n) => n.classList.toggle('active', n.dataset.section === id));
  document.querySelectorAll('#mobileNav button').forEach((n) => n.classList.toggle('active', n.dataset.section === id));
  let [title, sub] = TITLE[id];
  if (id === 'overview') {
    title = greetingTitle();
    sub = overviewSubtitle();
  }
  document.getElementById('pageTitle').textContent = title;
  document.getElementById('pageSubtitle').textContent = sub || `MYP4 · ${LEVEL_LABELS[currentLevel]} · Spanish Acquisition`;
  if (!fromResume) state.resume.section = id;
  persist();
  if (id === 'review') startReview();
  if (id === 'progress') renderProgress();
  if (id === 'listening') renderListening();
  if (id === 'reading') renderReading();
  if (id === 'speaking') renderSpeaking();
  if (id === 'writing') renderWriting();
  if (id === 'grammar') renderGrammarTopic();
}

function updatePlanChecks() {
  ensureTodayBuckets();
  const sc = state.sessionCounts;
  state.dailyPlan.listening = sc.listeningAnswers >= 5;
  state.dailyPlan.vocab = sc.reviews >= 15 || state.activityLog.some((a) => a.date === today && a.type === 'reading');
  state.dailyPlan.speaking = sc.speakingRecordings >= 3;
  state.dailyPlan.writing = sc.writingWords >= WORD_GOALS[currentLevel];
  document.getElementById('planListen').checked = state.dailyPlan.listening;
  document.getElementById('planVocab').checked = state.dailyPlan.vocab;
  document.getElementById('planSpeak').checked = state.dailyPlan.speaking;
  document.getElementById('planWrite').checked = state.dailyPlan.writing;
}

function renderStreakGrid() {
  const grid = document.getElementById('streakGrid');
  grid.innerHTML = '';
  const monday = startOfWeek(today);
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const done = new Set(state.streak.dates);
  labels.forEach((label, i) => {
    const iso = addDays(monday, i);
    const el = document.createElement('div');
    el.className = 'streak-day' + (done.has(iso) ? ' done' : '');
    el.textContent = label;
    el.title = iso;
    grid.appendChild(el);
  });
}

function refreshChrome() {
  const learned = masteredCount(vocabMap(), 3);
  const target = VOCAB_TARGET[currentLevel];
  document.getElementById('kpiWords').textContent = String(learned);
  document.getElementById('kpiWordsSub').textContent = `of ${target} target words (box 3+)`;
  const week = weekRange(0);
  const acc = accuracyInRange(week.from, week.to);
  document.getElementById('kpiAccuracy').textContent = acc == null ? '—' : `${acc}%`;
  const speakTotal = (state.speaking.echoCount || 0) + (state.speaking.openCount || 0);
  document.getElementById('kpiSpeak').textContent = String(speakTotal);
  const streak = countStreak();
  document.getElementById('kpiStreak').textContent = String(streak);
  document.getElementById('kpiStreakSub').textContent = streak ? `¡sigue así, ${displayName()}!` : 'practice to start';
  const due = dueCounts();
  const badge = document.getElementById('reviewBadge');
  badge.textContent = due.totalDue ? String(due.totalDue) : '';
  badge.dataset.count = String(due.totalDue);
  updatePlanChecks();
  renderStreakGrid();
  if (document.getElementById('sec-overview').classList.contains('active')) {
    document.getElementById('pageTitle').textContent = greetingTitle();
    document.getElementById('pageSubtitle').textContent = overviewSubtitle();
  }
  checkAchievements();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function recordVocabResult(id, correct) {
  const map = vocabMap();
  map[id] = correct ? promote(map[id], today) : demote(map[id], today);
  ensureTodayBuckets();
  state.sessionCounts.reviews += 1;
  logActivity('vocab', { id, correct });
}

function recordGrammarResult(id, correct) {
  const map = grammarMap();
  map[id] = correct ? promote(map[id], today) : demote(map[id], today);
  ensureTodayBuckets();
  state.sessionCounts.reviews += 1;
  logActivity('grammar', { id, correct });
}

/* ---------- Vocab browse ---------- */
function vocabSet() {
  return vocabSetsByLevel[currentLevel][currentTopic];
}

function renderVocabTabs() {
  const wrap = document.getElementById('vocabTopics');
  wrap.innerHTML = '';
  Object.keys(vocabSetsByLevel[currentLevel]).forEach((topic) => {
    const b = document.createElement('button');
    b.className = 'tab' + (topic === currentTopic ? ' active' : '');
    b.textContent = topic;
    b.onclick = () => {
      currentTopic = topic;
      fcIndex = 0;
      persist();
      renderVocabTabs();
      renderFlashcard();
      newQuizQuestion();
    };
    wrap.appendChild(b);
  });
}

function renderFlashcard() {
  const set = vocabSet();
  if (!set?.length) return;
  fcIndex = ((fcIndex % set.length) + set.length) % set.length;
  const item = set[fcIndex];
  document.getElementById('fcWord').textContent = item.es;
  document.getElementById('fcTranslation').textContent = item.en;
  document.getElementById('flashcard').classList.remove('flipped');
}

function newQuizQuestion() {
  const set = vocabSet();
  quizItem = set[Math.floor(Math.random() * set.length)];
  document.getElementById('quizPrompt').innerHTML = `What does “<strong>${quizItem.es}</strong>” mean?`;
  const opts = new Set([quizItem.en]);
  while (opts.size < Math.min(4, set.length)) {
    opts.add(set[Math.floor(Math.random() * set.length)].en);
  }
  const wrap = document.getElementById('quizOptions');
  wrap.innerHTML = '';
  shuffle([...opts]).forEach((o) => {
    const b = document.createElement('button');
    b.className = 'quizoption';
    b.textContent = o;
    b.onclick = () => {
      const ok = o === quizItem.en;
      b.classList.add(ok ? 'correct' : 'wrong');
      [...wrap.children].forEach((c) => {
        c.disabled = true;
        if (c.textContent === quizItem.en) c.classList.add('correct');
      });
      recordVocabResult(quizItem.id, ok);
      document.getElementById('quizNext').style.display = 'inline-flex';
    };
    wrap.appendChild(b);
  });
  document.getElementById('quizNext').style.display = 'none';
}

/* ---------- Review ---------- */
function startReview() {
  const v = dueVocabIds(vocabMap(), allVocab(currentLevel), today);
  const g = dueGrammarIds(grammarMap(), allGrammarItems(currentLevel), today);
  if (reviewKind === 'vocab') {
    reviewQueue = buildReviewQueue(v.due, v.unseen, 15, 5);
  } else {
    reviewQueue = buildReviewQueue(g.due, g.unseen, 10, 4);
  }
  reviewPos = 0;
  renderReview();
}

function renderReview() {
  const due = dueCounts();
  document.getElementById('reviewMeta').textContent =
    reviewKind === 'vocab'
      ? `Vocab due: ${due.vocabDue} · new remaining: ${due.vocabNew} · this round ${Math.min(reviewPos + 1, reviewQueue.length) || 0}/${reviewQueue.length}`
      : `Grammar due: ${due.grammarDue} · this round ${Math.min(reviewPos + 1, reviewQueue.length) || 0}/${reviewQueue.length}`;

  const empty = !reviewQueue.length || reviewPos >= reviewQueue.length;
  document.getElementById('reviewEmpty').style.display = empty ? 'block' : 'none';
  document.getElementById('reviewCard').style.display = !empty && reviewKind === 'vocab' ? 'flex' : 'none';
  document.getElementById('reviewGrammar').style.display = !empty && reviewKind === 'grammar' ? 'block' : 'none';
  document.getElementById('reviewBtns').style.display = !empty && reviewKind === 'vocab' ? 'flex' : 'none';
  if (empty) return;

  const id = reviewQueue[reviewPos];
  if (reviewKind === 'vocab') {
    const item = findVocab(currentLevel, id);
    document.getElementById('rvWord').textContent = item.es;
    document.getElementById('rvTranslation').textContent = item.en;
    document.getElementById('reviewCard').classList.remove('flipped');
  } else {
    const item = allGrammarItems(currentLevel).find((q) => q.id === id);
    document.getElementById('rvGTopic').textContent = item.topic;
    document.getElementById('rvGSentence').textContent = item.sentence;
    const wrap = document.getElementById('rvGOptions');
    wrap.innerHTML = '';
    item.opts.forEach((o) => {
      const b = document.createElement('button');
      b.className = 'btn btn-ghost';
      b.textContent = o;
      b.onclick = () => {
        const ok = o === item.correct;
        b.style.background = ok ? 'var(--color-success-highlight)' : 'var(--color-error-highlight)';
        [...wrap.children].forEach((c) => { c.disabled = true; });
        recordGrammarResult(item.id, ok);
        setTimeout(() => {
          reviewPos += 1;
          renderReview();
        }, 700);
      };
      wrap.appendChild(b);
    });
  }
}

function answerReview(know) {
  if (reviewKind !== 'vocab' || reviewPos >= reviewQueue.length) return;
  const id = reviewQueue[reviewPos];
  recordVocabResult(id, know);
  reviewPos += 1;
  renderReview();
}

/* ---------- Grammar sets ---------- */
function buildGrammarQueue() {
  const items = grammarSetsByLevel[currentLevel][currentGrammar].qs;
  const map = grammarMap();
  const due = items.filter((q) => isDue(map[q.id], today) && map[q.id]);
  const unseen = items.filter((q) => !map[q.id]);
  const rest = items.filter((q) => map[q.id] && !isDue(map[q.id], today));
  const ordered = [...due, ...unseen, ...rest];
  grammarQueue = ordered.slice(0, 10).map((q) => q.id);
  grammarPos = 0;
  grammarSessionCorrect = 0;
}

function renderGrammarTabs() {
  const wrap = document.getElementById('grammarTopics');
  wrap.innerHTML = '';
  Object.keys(grammarSetsByLevel[currentLevel]).forEach((topic) => {
    const b = document.createElement('button');
    b.className = 'tab' + (topic === currentGrammar ? ' active' : '');
    b.textContent = topic;
    b.onclick = () => {
      currentGrammar = topic;
      persist();
      renderGrammarTabs();
      buildGrammarQueue();
      renderGrammarQ();
    };
    wrap.appendChild(b);
  });
}

function renderGrammarTopic() {
  renderGrammarTabs();
  buildGrammarQueue();
  renderGrammarQ();
}

function renderGrammarQ() {
  const set = grammarSetsByLevel[currentLevel][currentGrammar];
  document.getElementById('gTitle').textContent = currentGrammar;
  document.getElementById('gExplain').innerHTML = set.explain;
  document.getElementById('gProdPrompt').innerHTML = set.production;
  const key = `${currentLevel}:${currentGrammar}`;
  document.getElementById('gProduction').value = state.grammarProduction[key] || '';
  document.getElementById('gPractice').style.display = 'block';
  document.getElementById('gComplete').style.display = 'none';

  if (grammarQueue.length && grammarPos >= grammarQueue.length) {
    document.getElementById('gComplete').style.display = 'block';
    document.getElementById('gSentence').textContent = 'Set finished — you can still write a production sentence below.';
    document.getElementById('gOptions').innerHTML = '';
    document.getElementById('gCompleteMsg').textContent =
      `${grammarSessionCorrect} / ${grammarQueue.length} correct this set. Misses will return in Review.`;
    document.getElementById('gProgFill').style.width = '100%';
    return;
  }

  const item = set.qs.find((q) => q.id === grammarQueue[grammarPos]);
  document.getElementById('gSentence').textContent = item.sentence;
  const wrap = document.getElementById('gOptions');
  wrap.innerHTML = '';
  item.opts.forEach((o) => {
    const b = document.createElement('button');
    b.className = 'btn btn-ghost';
    b.textContent = o;
    b.onclick = () => {
      const ok = o === item.correct;
      b.style.background = ok ? 'var(--color-success-highlight)' : 'var(--color-error-highlight)';
      [...wrap.children].forEach((c) => { c.disabled = true; });
      if (ok) grammarSessionCorrect += 1;
      recordGrammarResult(item.id, ok);
      document.getElementById('gScore').textContent =
        `Question ${grammarPos + 1} of ${grammarQueue.length} · ${grammarSessionCorrect} correct`;
      setTimeout(() => {
        grammarPos += 1;
        renderGrammarQ();
      }, 800);
    };
    wrap.appendChild(b);
  });
  document.getElementById('gProgFill').style.width = `${(grammarPos / grammarQueue.length) * 100}%`;
  document.getElementById('gScore').textContent =
    `Question ${grammarPos + 1} of ${grammarQueue.length} · ${grammarSessionCorrect} correct`;
}

/* ---------- TTS ---------- */
const synth = window.speechSynthesis;
let cachedVoices = [];
function loadVoices() {
  if (synth) {
    const v = synth.getVoices();
    if (v?.length) cachedVoices = v;
  }
  return cachedVoices;
}
if (synth && typeof synth.onvoiceschanged !== 'undefined') synth.onvoiceschanged = loadVoices;
loadVoices();

function pickSpanishVoice() {
  const voices = loadVoices();
  if (!voices.length) return null;
  const spanish = voices.filter((v) => /es/i.test(v.lang));
  if (!spanish.length) return null;
  const prefer = [
    (v) => /Google/i.test(v.name),
    (v) => /Microsoft|Natural|Neural|Premium|Enhanced/i.test(v.name),
    (v) => /Mónica|Paulina|Helena|Laura|Diego|Jorge|Enrique/i.test(v.name),
    (v) => /es-ES/i.test(v.lang),
  ];
  for (const test of prefer) {
    const found = spanish.find(test);
    if (found) return found;
  }
  return spanish[0];
}

let currentAudio = null;
function speakBrowser(text, lang) {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang || 'es-ES';
  const voice = pickSpanishVoice();
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  }
  u.rate = 0.85;
  synth.cancel();
  synth.speak(u);
}

async function speak(text, lang) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  try {
    const SUPA_URL = 'https://neaqswhmshshevicfoyn.supabase.co';
    const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lYXFzd2htc2hzaGV2aWNmb3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTMyODksImV4cCI6MjEwMjYyOTI4OX0.HSOaPr4WY0fl5QuS2oSM2O30mopAYvVVts3sTKfvl7A';
    const res = await fetch(`${SUPA_URL}/functions/v1/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPA_KEY}` },
      body: JSON.stringify({ text, lang }),
    });
    if (!res.ok) throw new Error('tts failed');
    const blob = await res.blob();
    if (!blob || blob.size < 100) throw new Error('empty audio');
    const audioUrl = URL.createObjectURL(blob);
    currentAudio = new Audio(audioUrl);
    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };
    await currentAudio.play();
  } catch {
    speakBrowser(text, lang);
  }
}

/* ---------- Listening ---------- */
function listeningItems() {
  return listeningItemsByLevel[currentLevel];
}

function renderListening() {
  const items = listeningItems();
  listenIdx = ((listenIdx % items.length) + items.length) % items.length;
  const item = items[listenIdx];
  listenAnswers = {};
  document.getElementById('lVisual').textContent = `Visual: ${item.visual}`;
  document.getElementById('lStatus').textContent = `Clip ${listenIdx + 1} of ${items.length} — play, then answer both questions`;
  const area = document.getElementById('lQuizArea');
  area.innerHTML = '';
  item.qs.forEach((q, qi) => {
    const block = document.createElement('div');
    block.style.marginBottom = 'var(--space-4)';
    block.innerHTML = `<p style="font-weight:600;margin-bottom:var(--space-2)">${q.q}</p>`;
    q.opts.forEach((o) => {
      const b = document.createElement('button');
      b.className = 'quizoption';
      b.textContent = o;
      b.onclick = () => {
        if (listenAnswers[qi] != null) return;
        const ok = o === q.correct;
        listenAnswers[qi] = ok;
        b.classList.add(ok ? 'correct' : 'wrong');
        [...block.querySelectorAll('.quizoption')].forEach((c) => {
          c.disabled = true;
          if (c.textContent === q.correct) c.classList.add('correct');
        });
        ensureTodayBuckets();
        state.sessionCounts.listeningAnswers += 1;
        logActivity('listening', { id: item.id, q: qi, correct: ok });
        const rec = state.listening[currentLevel][item.id] || { correct: 0, total: 0 };
        rec.total += 1;
        if (ok) rec.correct += 1;
        rec.date = today;
        state.listening[currentLevel][item.id] = rec;
        persist();
        if (Object.keys(listenAnswers).length === item.qs.length) {
          const t = document.getElementById('lTranscript');
          t.textContent = `Transcript: ${item.text}`;
          t.classList.add('show');
        }
      };
      block.appendChild(b);
    });
    area.appendChild(block);
  });
  const t = document.getElementById('lTranscript');
  t.textContent = '';
  t.classList.remove('show');
}

/* ---------- Reading ---------- */
function readingItems() {
  return readingItemsByLevel[currentLevel];
}

function renderReading() {
  const items = readingItems();
  readingIdx = ((readingIdx % items.length) + items.length) % items.length;
  const item = items[readingIdx];
  document.getElementById('rTitle').textContent = item.title;
  document.getElementById('rVisual').textContent = `Visual: ${item.visual}`;
  document.getElementById('rPassage').textContent = item.text;
  document.getElementById('rResponseLabel').textContent = item.responsePrompt;
  const saved = state.reading[currentLevel][item.id] || {};
  document.getElementById('rResponse').value = saved.response || '';
  document.getElementById('rStatus').textContent = '';
  const gloss = document.getElementById('rGlossary');
  gloss.classList.remove('show');
  gloss.textContent = '';
  const area = document.getElementById('rQuizArea');
  area.innerHTML = '';
  item.qs.forEach((q, qi) => {
    const block = document.createElement('div');
    block.style.marginBottom = 'var(--space-4)';
    block.innerHTML = `<p style="font-weight:600;margin-bottom:var(--space-2)">${q.q}</p>`;
    q.opts.forEach((o) => {
      const b = document.createElement('button');
      b.className = 'quizoption';
      b.textContent = o;
      b.dataset.answer = o;
      b.dataset.q = String(qi);
      block.appendChild(b);
    });
    area.appendChild(block);
  });
  persist();
}

function submitReading() {
  const item = readingItems()[readingIdx];
  const area = document.getElementById('rQuizArea');
  const already = [...area.querySelectorAll('.quizoption')].some((b) => b.disabled);
  if (already) return;
  const chosen = [];
  let correctCount = 0;
  item.qs.forEach((q, qi) => {
    const buttons = [...area.querySelectorAll(`.quizoption[data-q="${qi}"]`)];
    const pick = buttons.find((b) => b.dataset.picked === '1')?.dataset.answer;
    const ok = pick === q.correct;
    if (ok) correctCount += 1;
    chosen.push({ pick, ok });
    buttons.forEach((b) => {
      b.disabled = true;
      if (b.dataset.answer === q.correct) b.classList.add('correct');
      if (b.dataset.picked === '1' && b.dataset.answer !== q.correct) b.classList.add('wrong');
    });
    logActivity('reading', { id: item.id, q: qi, correct: ok });
  });
  const response = document.getElementById('rResponse').value;
  state.reading[currentLevel][item.id] = {
    answers: chosen,
    response,
    correctCount,
    total: item.qs.length,
    date: today,
  };
  document.getElementById('rStatus').textContent = `${correctCount} / ${item.qs.length} comprehension questions correct. Your personal response is saved.`;
  const gloss = document.getElementById('rGlossary');
  gloss.textContent = 'You can re-read the Spanish text above. Personal response is not auto-graded.';
  gloss.classList.add('show');
  persist();
  refreshChrome();
}

/* ---------- Speaking ---------- */
function speakTarget() {
  const bank = speakingByLevel[currentLevel];
  if (speakMode === 'echo') {
    const list = bank.echo;
    speakIdx = ((speakIdx % list.length) + list.length) % list.length;
    return interpolateName(list[speakIdx], state.profile.name);
  }
  const list = bank.open;
  speakIdx = ((speakIdx % list.length) + list.length) % list.length;
  return list[speakIdx].prompt;
}

function renderSpeaking() {
  document.querySelectorAll('#speakTabs .tab').forEach((t) => t.classList.toggle('active', t.dataset.speak === speakMode));
  document.getElementById('spModeHint').textContent = speakMode === 'echo'
    ? 'Say this phrase out loud. The match % is pronunciation practice, not Criterion C.'
    : `Contesta en español, ${displayName()} — 2 a 4 frases. Use the self-check if recognition fails.`;
  document.getElementById('spTarget').textContent = speakTarget();
  document.getElementById('spResult').style.display = 'none';
  document.getElementById('spSelfCheck').style.display = speakMode === 'open' ? 'flex' : 'none';
  document.getElementById('spStatus').textContent = 'Tap the mic and speak clearly';
  ['spTask', 'spVocab', 'spClear'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
}

function recordSpeaking(heard, pct) {
  ensureTodayBuckets();
  state.sessionCounts.speakingRecordings += 1;
  if (speakMode === 'echo') state.speaking.echoCount += 1;
  else state.speaking.openCount += 1;
  state.speaking.history.push({ date: today, mode: speakMode, heard: heard || '', pct: pct ?? null });
  logActivity('speaking', { mode: speakMode });
}

/* ---------- Writing ---------- */
function currentPrompt() {
  const list = writingPromptsByLevel[currentLevel];
  writeIdx = ((writeIdx % list.length) + list.length) % list.length;
  return list[writeIdx];
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function renderWriting() {
  const p = currentPrompt();
  document.getElementById('wPromptText').textContent = interpolateName(p.prompt, state.profile.name);
  document.getElementById('wGoal').textContent = `Goal: ${p.goal} words`;
  const draft = state.writing.drafts[p.id] || '';
  document.getElementById('wText').value = draft;
  document.getElementById('wCount').textContent = `${wordCount(draft)} words`;
  const checks = state.writing.checklists[p.id] || [];
  const wrap = document.getElementById('wChecklist');
  wrap.innerHTML = '';
  p.checklist.forEach((label, i) => {
    const row = document.createElement('div');
    row.className = 'checklist-item';
    row.innerHTML = `<input type="checkbox" ${checks[i] ? 'checked' : ''}><span>${label}</span>`;
    row.querySelector('input').onchange = (e) => {
      const cur = state.writing.checklists[p.id] || p.checklist.map(() => false);
      cur[i] = e.target.checked;
      state.writing.checklists[p.id] = cur;
      persist();
    };
    wrap.appendChild(row);
  });
  const model = document.getElementById('wModel');
  model.textContent = p.model;
  const shown = state.writing.modelsShown[p.id];
  model.classList.toggle('show', !!shown);
  document.getElementById('wShowModel').textContent = shown ? 'Hide model answer' : 'Show model answer';
}

function saveWritingDraft() {
  const p = currentPrompt();
  const text = document.getElementById('wText').value;
  state.writing.drafts[p.id] = text;
  const n = wordCount(text);
  document.getElementById('wCount').textContent = `${n} words`;
  ensureTodayBuckets();
  if (n > state.sessionCounts.writingWords) state.sessionCounts.writingWords = n;
  if (n >= 8) markStreak();
  persist();
  refreshChrome();
}

/* ---------- Logros (achievements) ---------- */
function masteredBothLevels() {
  return masteredCount(state.vocab['12'], 3) + masteredCount(state.vocab['34'], 3);
}

function anyReadingDone() {
  return ['12', '34'].some((lv) => Object.values(state.reading[lv]).some((r) => (r.total || 0) > 0));
}

function anyDraftAtGoal() {
  return Object.values(state.writing.drafts).some((t) => wordCount(t) >= 60);
}

const ACHIEVEMENTS = [
  { id: 'streak3', label: 'Primer sendero — 3 días seguidos', test: () => countStreak() >= 3 },
  { id: 'streak7', label: 'Constancia élfica — 7 días', test: () => countStreak() >= 7 },
  { id: 'streak14', label: 'Guardiana del bosque — 14 días', test: () => countStreak() >= 14 },
  { id: 'streak30', label: 'Luz del bosque — 30 días', test: () => countStreak() >= 30 },
  { id: 'words10', label: 'Diez palabras dominadas', test: () => masteredBothLevels() >= 10 },
  { id: 'words25', label: 'Veinticinco palabras dominadas', test: () => masteredBothLevels() >= 25 },
  { id: 'words50', label: 'Cincuenta palabras dominadas', test: () => masteredBothLevels() >= 50 },
  { id: 'words100', label: 'Cien palabras — hoja de oro', test: () => masteredBothLevels() >= 100 },
  { id: 'firstReading', label: 'Primera lectura completada', test: () => anyReadingDone() },
  { id: 'firstRecording', label: 'Primera grabación de voz', test: () => (state.speaking.echoCount + state.speaking.openCount) >= 1 },
  { id: 'firstWriting', label: 'Primer escrito completo', test: () => anyDraftAtGoal() },
];

let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 6000);
}

function checkAchievements() {
  let newest = null;
  for (const a of ACHIEVEMENTS) {
    if (!state.achievements[a.id] && a.test()) {
      state.achievements[a.id] = today;
      newest = a;
    }
  }
  if (newest) {
    showToast(`¡Enhorabuena, ${displayName()}! ${newest.label}`);
    persist();
    if (document.getElementById('sec-progress').classList.contains('active')) renderLogros();
  }
}

function renderLogros() {
  const wrap = document.getElementById('logrosList');
  if (!wrap) return;
  wrap.innerHTML = '';
  const leaf = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><path d="M27 5C15 5 6 12 6 23c0 1.8.4 3.2 1 4C18 27 27 20 27 9c0-1.4 0-2.7 0-4z" fill="currentColor" fill-opacity="0.25"/><path d="M7 27C11 18 17 11 26 6"/></svg>';
  ACHIEVEMENTS.forEach((a) => {
    const earnedOn = state.achievements[a.id];
    const row = document.createElement('div');
    row.className = 'logro ' + (earnedOn ? 'earned' : 'locked');
    row.innerHTML = `<span class="medal">${leaf}</span><span>${a.label}</span><span class="when">${earnedOn || ''}</span>`;
    wrap.appendChild(row);
  });
}

/* ---------- Progress ---------- */
function listeningAccuracy() {
  const recs = Object.values(state.listening[currentLevel]);
  const tot = recs.reduce((s, r) => s + (r.total || 0), 0);
  const ok = recs.reduce((s, r) => s + (r.correct || 0), 0);
  return tot ? Math.round((100 * ok) / tot) : 0;
}

function readingAccuracy() {
  const recs = Object.values(state.reading[currentLevel]);
  const tot = recs.reduce((s, r) => s + (r.total || 0), 0);
  const ok = recs.reduce((s, r) => s + (r.correctCount || 0), 0);
  return tot ? Math.round((100 * ok) / tot) : 0;
}

function grammarAccuracy() {
  const cards = Object.values(grammarMap());
  const seen = cards.reduce((s, c) => s + (c.seen || 0), 0);
  const ok = cards.reduce((s, c) => s + (c.correct || 0), 0);
  return seen ? Math.round((100 * ok) / seen) : null;
}

function barRow(name, val) {
  const row = document.createElement('div');
  row.style.marginBottom = 'var(--space-4)';
  row.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:var(--text-sm);margin-bottom:var(--space-2)"><span>${name}</span><span style="font-variant-numeric:tabular-nums">${val}%</span></div><div class="progressbar"><div class="progressbar-fill" style="width:${val}%"></div></div>`;
  return row;
}

function renderProgress() {
  const due = dueCounts();
  const weekStart = startOfWeek(today);
  document.getElementById('pDue').textContent = String(due.totalDue);
  document.getElementById('pLearnedWeek').textContent = String(reviewedThisWeek(vocabMap(), weekStart));
  document.getElementById('pVocab').textContent = `${masteredCount(vocabMap(), 3)} / ${VOCAB_TARGET[currentLevel]}`;
  const gAcc = grammarAccuracy();
  document.getElementById('pGrammar').textContent = gAcc == null ? '—' : `${gAcc}%`;
  document.getElementById('pSpeak').textContent = String((state.speaking.echoCount || 0) + (state.speaking.openCount || 0));
  const thisW = weekRange(0);
  const lastW = weekRange(-1);
  const a1 = accuracyInRange(thisW.from, thisW.to);
  const a0 = accuracyInRange(lastW.from, lastW.to);
  document.getElementById('pWeekAcc').textContent = a1 == null ? '—' : `${a1}%`;
  document.getElementById('pLastWeekAcc').textContent = a0 == null ? '—' : `${a0}%`;

  const drafts = Object.values(state.writing.drafts).filter((t) => wordCount(t) >= 40).length;
  const wrap = document.getElementById('critBars');
  wrap.innerHTML = '';
  wrap.appendChild(barRow('A — Listening (accuracy)', listeningAccuracy()));
  wrap.appendChild(barRow('B — Reading + vocab reviews', Math.round((readingAccuracy() + Math.round((100 * masteredCount(vocabMap(), 3)) / VOCAB_TARGET[currentLevel])) / 2)));
  wrap.appendChild(barRow('C — Speaking (attempts toward 15)', Math.min(100, Math.round((((state.speaking.echoCount || 0) + (state.speaking.openCount || 0)) / 15) * 100))));
  wrap.appendChild(barRow('D — Grammar accuracy + writing drafts', Math.round((((gAcc || 0) + Math.min(100, drafts * 20)) / 2))));
  renderLogros();
}

function switchLevel(level) {
  currentLevel = level;
  currentTopic = Object.keys(vocabSetsByLevel[level])[0];
  currentGrammar = Object.keys(grammarSetsByLevel[level])[0];
  fcIndex = 0;
  listenIdx = 0;
  readingIdx = 0;
  speakIdx = 0;
  writeIdx = 0;
  document.querySelectorAll('#levelToggle .level-btn').forEach((b) => b.classList.toggle('active', b.dataset.level === level));
  persist();
  renderVocabTabs();
  renderFlashcard();
  newQuizQuestion();
  renderGrammarTopic();
  renderListening();
  renderReading();
  renderSpeaking();
  renderWriting();
  refreshChrome();
  const active = document.querySelector('.section.active')?.id?.replace('sec-', '') || 'overview';
  document.getElementById('pageSubtitle').textContent = TITLE[active][1] || `MYP4 · ${LEVEL_LABELS[currentLevel]} · Spanish Acquisition`;
}

/* ---------- Wire UI ---------- */
initTheme();
document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
  state.profile.theme = state.profile.theme === 'dark' ? 'light' : 'dark';
  applyTheme(state.profile.theme);
  persist();
});

if (!(state.profile.name || '').trim()) state.profile.name = PERSONAL.name;
document.getElementById('learnerName').value = state.profile.name;
document.getElementById('learnerName').addEventListener('input', (e) => {
  state.profile.name = e.target.value;
  persist();
  if (document.getElementById('sec-speaking').classList.contains('active')) renderSpeaking();
});

document.querySelectorAll('.navitem, #mobileNav button').forEach((b) => {
  b.addEventListener('click', () => showSection(b.dataset.section));
});
document.querySelectorAll('#levelToggle .level-btn').forEach((b) => {
  b.addEventListener('click', () => switchLevel(b.dataset.level));
});
document.querySelectorAll('#levelToggle .level-btn').forEach((b) => b.classList.toggle('active', b.dataset.level === currentLevel));

document.getElementById('flashcard').addEventListener('click', () => document.getElementById('flashcard').classList.toggle('flipped'));
document.getElementById('fcNext').onclick = () => { fcIndex += 1; renderFlashcard(); persist(); };
document.getElementById('fcPrev').onclick = () => { fcIndex -= 1; renderFlashcard(); persist(); };
document.getElementById('fcSpeak').onclick = () => speak(document.getElementById('fcWord').textContent);
document.getElementById('fcKnow').onclick = () => {
  recordVocabResult(vocabSet()[fcIndex].id, true);
  fcIndex += 1;
  renderFlashcard();
};
document.getElementById('fcMiss').onclick = () => {
  recordVocabResult(vocabSet()[fcIndex].id, false);
  fcIndex += 1;
  renderFlashcard();
};
document.getElementById('quizNext').onclick = newQuizQuestion;

document.getElementById('reviewCard').addEventListener('click', () => document.getElementById('reviewCard').classList.toggle('flipped'));
document.getElementById('rvKnow').onclick = () => answerReview(true);
document.getElementById('rvMiss').onclick = () => answerReview(false);
document.getElementById('rvSpeak').onclick = () => speak(document.getElementById('rvWord').textContent);
document.querySelectorAll('#reviewTabs .tab').forEach((t) => {
  t.onclick = () => {
    reviewKind = t.dataset.review;
    document.querySelectorAll('#reviewTabs .tab').forEach((x) => x.classList.toggle('active', x === t));
    startReview();
  };
});

document.getElementById('gNewSet').onclick = () => {
  buildGrammarQueue();
  renderGrammarQ();
};
document.getElementById('gProduction').addEventListener('input', (e) => {
  state.grammarProduction[`${currentLevel}:${currentGrammar}`] = e.target.value;
  if (wordCount(e.target.value) >= 4) markStreak();
  persist();
});

document.getElementById('lPlay').onclick = () => speak(listeningItems()[listenIdx].text);
document.getElementById('lNext').onclick = () => { listenIdx += 1; persist(); renderListening(); };
document.getElementById('lPrev').onclick = () => { listenIdx -= 1; persist(); renderListening(); };

document.getElementById('rQuizArea').addEventListener('click', (e) => {
  const btn = e.target.closest('.quizoption');
  if (!btn || btn.disabled) return;
  const qi = btn.dataset.q;
  document.querySelectorAll(`#rQuizArea .quizoption[data-q="${qi}"]`).forEach((b) => {
    b.dataset.picked = b === btn ? '1' : '0';
    b.classList.toggle('picked', b === btn);
    b.style.outline = b === btn ? '2px solid var(--color-primary)' : '';
  });
});
document.getElementById('rSubmit').onclick = submitReading;
document.getElementById('rNext').onclick = () => { readingIdx += 1; persist(); renderReading(); };
document.getElementById('rPrev').onclick = () => { readingIdx -= 1; persist(); renderReading(); };
document.getElementById('rResponse').addEventListener('input', () => {
  const item = readingItems()[readingIdx];
  const prev = state.reading[currentLevel][item.id] || {};
  prev.response = document.getElementById('rResponse').value;
  state.reading[currentLevel][item.id] = prev;
  persist();
});

document.querySelectorAll('#speakTabs .tab').forEach((t) => {
  t.onclick = () => {
    speakMode = t.dataset.speak;
    speakIdx = 0;
    persist();
    renderSpeaking();
  };
});
document.getElementById('spNext').onclick = () => {
  speakIdx += 1;
  persist();
  renderSpeaking();
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recordBtn = document.getElementById('spRecordBtn');
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  let listeningMic = false;
  recordBtn.onclick = () => {
    if (listeningMic) return;
    listeningMic = true;
    recordBtn.classList.add('recording');
    document.getElementById('spStatus').textContent = 'Listening...';
    try { recognition.start(); } catch { listeningMic = false; }
  };
  recognition.onresult = (e) => {
    const heard = e.results[0][0].transcript;
    document.getElementById('spHeard').textContent = heard;
    document.getElementById('spResult').style.display = 'block';
    let pct = null;
    if (speakMode === 'echo') {
      const target = speakTarget().toLowerCase().replace(/[.,¿?¡!]/g, '');
      const h = heard.toLowerCase().replace(/[.,¿?¡!]/g, '');
      const targetWords = target.split(/\s+/);
      const heardWords = new Set(h.split(/\s+/));
      const matches = targetWords.filter((w) => heardWords.has(w)).length;
      pct = Math.round((100 * matches) / targetWords.length);
      const badge = document.getElementById('spBadge');
      if (pct >= 80) { badge.className = 'badge badge-success'; badge.textContent = `Word match ${pct}% — pronunciation practice only`; }
      else if (pct >= 50) { badge.className = 'badge badge-warning'; badge.textContent = `Word match ${pct}% — try again`; }
      else { badge.className = 'badge'; badge.style.background = 'var(--color-error-highlight)'; badge.style.color = 'var(--color-error)'; badge.textContent = `Word match ${pct}%`; }
    } else {
      const badge = document.getElementById('spBadge');
      badge.className = 'badge badge-primary';
      badge.textContent = 'Answer captured — use the self-check below';
    }
    recordSpeaking(heard, pct);
    document.getElementById('spStatus').textContent = 'Tap the mic and speak clearly';
  };
  recognition.onend = () => { listeningMic = false; recordBtn.classList.remove('recording'); };
  recognition.onerror = () => {
    listeningMic = false;
    recordBtn.classList.remove('recording');
    document.getElementById('spStatus').textContent = 'Could not hear you — check mic, then use self-check if this is Respond mode';
    if (speakMode === 'open') recordSpeaking('', null);
  };
} else {
  recordBtn.onclick = () => {
    document.getElementById('spStatus').textContent = 'Speech recognition needs Chrome or Edge — mark the self-check after you speak';
    if (speakMode === 'open') {
      document.getElementById('spSelfCheck').style.display = 'flex';
      recordSpeaking('', null);
    }
  };
}

document.getElementById('wText').addEventListener('input', saveWritingDraft);
document.getElementById('wNewPrompt').onclick = () => { writeIdx += 1; persist(); renderWriting(); };
document.getElementById('wShowModel').onclick = () => {
  const p = currentPrompt();
  const next = !state.writing.modelsShown[p.id];
  state.writing.modelsShown[p.id] = next;
  persist();
  document.getElementById('wModel').classList.toggle('show', next);
  document.getElementById('wShowModel').textContent = next ? 'Hide model answer' : 'Show model answer';
};

document.getElementById('resumeBtn').onclick = () => showSection(state.resume.section || 'review', true);

window.addEventListener('beforeunload', () => saveStateNow(state));

renderVocabTabs();
renderFlashcard();
newQuizQuestion();
renderGrammarTopic();
renderListening();
renderReading();
renderSpeaking();
renderWriting();
refreshChrome();

const resumeSection = state.resume.section;
if (resumeSection && resumeSection !== 'overview') showSection(resumeSection, true);
else showSection('overview', true);
