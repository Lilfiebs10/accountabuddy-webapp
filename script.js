/* ---------- Interactive phone demo ---------- */
const screenEl = document.getElementById('screen');
const demo = { cat: 'Fitness', target: 3, done: 1, chat: [
  { me: false, t: "Hey! I'm Priya. Also trying to get consistent. What's your goal?" },
  { me: true, t: "Running 3x a week. Did my first one today!" },
  { me: false, t: "Love it. I'll check on you Thursday 👟" }
]};
const screens = {
  goal() {
    const cats = ['Fitness', 'Work', 'Learning', 'Personal'];
    return `<h4>What's your goal?</h4>
      <div class="card"><b>Category</b><div class="chip-row">${cats.map(c => `<button class="chip" data-cat="${c}" aria-pressed="${demo.cat === c}">${c}</button>`).join('')}</div></div>
      <div class="card"><div class="row"><b>Times per week</b><span style="font-family:var(--mono);font-weight:700">${demo.target}×</span></div>
        <div class="chip-row">${[1,2,3,4,5,7].map(n => `<button class="chip" data-target="${n}" aria-pressed="${demo.target === n}">${n}</button>`).join('')}</div></div>
      <div class="card"><span style="color:var(--muted)">Your goal</span><b>${demo.cat}: ${demo.target}× per week for 8 weeks</b></div>
      <button class="btn btn-primary" data-go="match">Find my buddy</button>`;
  },
  match() {
    return `<h4>You're matched!</h4>
      <div class="match-ring"><div>94%</div></div>
      <p class="center">compatibility</p>
      <div class="card"><div class="row" style="justify-content:flex-start;gap:12px"><div class="avatar b">PR</div><div><b>Priya R.</b><div style="color:var(--muted);font-size:13px">${demo.cat} goal · same time zone</div></div></div>
        <div class="chip-row"><span class="pill">${demo.target}×/week</span><span class="pill orange">Evening check-ins</span></div></div>
      <button class="btn btn-primary" data-go="checkin">Start week 1</button>`;
  },
  checkin() {
    const pct = Math.min(100, Math.round(demo.done / demo.target * 100));
    const bp = Math.min(100, Math.round(2 / demo.target * 100));
    return `<h4>This week</h4>
      <div class="card"><div class="row"><b>You</b><span style="font-family:var(--mono)">${demo.done}/${demo.target}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>
      <div class="card"><div class="row"><b>Priya</b><span style="font-family:var(--mono)">${Math.min(2, demo.target)}/${demo.target}</span></div><div class="bar o"><i style="width:${bp}%"></i></div></div>
      ${demo.done >= demo.target ? `<div class="card" style="background:var(--you-soft);border-color:transparent"><b>Week complete! 🎉</b>Priya has been notified.</div>` : ''}
      <button class="btn btn-primary" data-checkin ${demo.done >= demo.target ? 'disabled style="opacity:.5"' : ''}>Log today's check-in</button>
      <button class="btn btn-ghost" data-undo>Undo</button>`;
  },
  chat() {
    return `<h4>Priya</h4>
      ${demo.chat.map(m => `<div class="msg ${m.me ? 'me' : 'them'}">${m.t}</div>`).join('')}
      <div style="margin-top:auto" class="chip-row">
        ${["You've got this! 💪", "Checked in today ✅", "Rough day, back tomorrow"].map(t => `<button class="chip" data-say="${t}">${t}</button>`).join('')}
      </div>`;
  }
};
let current = 'goal';
function show(name) {
  current = name;
  screenEl.innerHTML = screens[name]();
  document.querySelectorAll('.demo-tab').forEach(t => t.setAttribute('aria-selected', t.dataset.screen === name));
  if (name === 'chat') screenEl.scrollTop = screenEl.scrollHeight;
}
document.querySelectorAll('.demo-tab').forEach(t => t.addEventListener('click', () => show(t.dataset.screen)));
screenEl.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.cat) demo.cat = b.dataset.cat;
  if (b.dataset.target) { demo.target = +b.dataset.target; demo.done = Math.min(demo.done, demo.target); }
  if (b.dataset.go) return show(b.dataset.go);
  if ('checkin' in b.dataset) demo.done = Math.min(demo.target, demo.done + 1);
  if ('undo' in b.dataset) demo.done = Math.max(0, demo.done - 1);
  if (b.dataset.say) {
    demo.chat.push({ me: true, t: b.dataset.say });
    const replies = ["Yes!! Proud of you.", "Same here, let's keep it going.", "Totally fine. Tomorrow's a fresh start 🙌"];
    setTimeout(() => { demo.chat.push({ me: false, t: replies[Math.floor(Math.random() * replies.length)] }); if (current === 'chat') show('chat'); }, 700);
  }
  show(current);
});
show('goal');

/* ---------- Web dashboard (saved per browser) ---------- */
const KEY = 'ab-goals-v1';
const sample = () => [
  { id: 1, name: 'Run 3 times a week', target: 24, done: 17, last: null },
  { id: 2, name: 'Finish portfolio website', target: 10, done: 6, last: null },
  { id: 3, name: 'Read 20 pages a day', target: 30, done: 30, last: null }
];
let goals;
try { goals = JSON.parse(localStorage.getItem(KEY)) || sample(); } catch { goals = sample(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(goals)); } catch {} };
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function renderGoals() {
  const box = document.getElementById('goals');
  box.innerHTML = goals.length ? goals.map(g => {
    const pct = Math.round(g.done / g.target * 100), done = g.done >= g.target;
    return `<div class="goal">
      <div><div class="goal-title">${esc(g.name)} ${done ? '<span class="pill" style="background:var(--good);color:#fff;margin-left:6px">Done</span>' : ''}</div>
        <div class="goal-meta">${g.done} / ${g.target} check-ins · ${pct}%</div></div>
      <div class="goal-actions">
        <button class="icon-btn check" data-id="${g.id}" data-act="plus" ${done ? 'disabled' : ''}>+ Check in</button>
        <button class="icon-btn" data-id="${g.id}" data-act="del" aria-label="Remove goal">Remove</button>
      </div>
      <div class="bar"><i style="width:${pct}%;${done ? 'background:var(--good)' : ''}"></i></div>
    </div>`;
  }).join('') : `<div class="goal"><div class="goal-title">No goals yet</div><div class="goal-meta" style="grid-column:1/-1">Add your first goal with the form.</div></div>`;
  document.getElementById('st-total').textContent = goals.reduce((a, g) => a + g.done, 0);
  document.getElementById('st-done').textContent = goals.filter(g => g.done >= g.target).length;
}
document.getElementById('goals').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const id = +b.dataset.id;
  if (b.dataset.act === 'plus') goals = goals.map(g => g.id === id ? { ...g, done: Math.min(g.target, g.done + 1) } : g);
  if (b.dataset.act === 'del') goals = goals.filter(g => g.id !== id);
  save(); renderGoals();
});
document.getElementById('goal-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('g-name').value.trim();
  const target = Math.max(1, Math.min(365, +document.getElementById('g-target').value || 1));
  if (!name) return;
  goals.push({ id: Date.now(), name, target, done: 0 });
  document.getElementById('g-name').value = '';
  save(); renderGoals();
});
let armed = false;
document.getElementById('reset').addEventListener('click', () => {
  const note = document.getElementById('reset-note');
  if (!armed) { armed = true; note.hidden = false; setTimeout(() => { armed = false; note.hidden = true; }, 3000); return; }
  goals = sample(); save(); renderGoals(); armed = false; note.hidden = true;
});
renderGoals();

/* ---------- Blog ---------- */
const posts = [
  { tag: 'Technique', mins: 5, color: 'var(--you)', mark: 'SMART', title: 'How to write a goal your buddy can actually check',
    blurb: 'Vague goals are hard to hold anyone to. Here is how to make yours measurable.',
    body: `<p>"Get healthier" is a wish. "Walk 8,000 steps on 5 days this week" is a goal your buddy can ask about. The difference is whether someone else can tell if you did it.</p>
      <ol><li><b>Specific:</b> name the action, not the feeling.</li><li><b>Measurable:</b> pick a number your app can log.</li><li><b>Achievable:</b> start at 70% of what you think you can do.</li><li><b>Relevant:</b> tie it to why you started.</li><li><b>Time-bound:</b> set an end date for your next monthly check-in.</li></ol>
      <p>Share the final version with your buddy and ask: "Could you tell if I did this?" If the answer is yes, you're ready.</p>` },
  { tag: 'Success story', mins: 4, color: 'var(--buddy)', mark: '90 days', title: 'Two strangers, one 90-day writing streak',
    blurb: 'Maya and Theo were matched in January. By April they had both finished first drafts.',
    body: `<p>Maya wanted to finish a novel draft. Theo was writing a thesis. They had nothing in common except needing to write 500 words a day.</p>
      <p>They agreed on a simple rule: post your word count before 10pm, and if one of you misses, the other sends a single sentence prompt the next morning. "Some mornings the prompt was the only reason I opened the doc," Theo said.</p>
      <p>Ninety days later they had a combined 61,000 words, and they still check in every Sunday.</p>` },
  { tag: 'Technique', mins: 3, color: 'var(--ink)', mark: '2-day', title: 'The never-miss-twice rule',
    blurb: 'Missing a day is normal. Missing two is where habits break. Here is how buddies help.',
    body: `<p>Streaks feel great until they end. Then it is easy to think "I already broke it" and stop completely.</p>
      <p>The never-miss-twice rule changes the target: you are allowed to miss one day, but never two in a row. In AccountaBuddy, when you miss a check-in your buddy gets a gentle nudge to reach out the next day.</p>
      <p>Our data shows pairs who follow this rule are almost twice as likely to still be active at week 12.</p>` }
];
const postsEl = document.getElementById('posts'), reader = document.getElementById('reader');
postsEl.innerHTML = posts.map((p, i) => `<button class="post" data-i="${i}">
  <div class="post-art" style="background:${p.color}">${p.mark}</div>
  <div class="post-body"><span class="post-meta">${p.tag} · ${p.mins} min read</span><h3>${p.title}</h3><p>${p.blurb}</p></div></button>`).join('');
postsEl.addEventListener('click', e => {
  const b = e.target.closest('.post'); if (!b) return;
  const p = posts[+b.dataset.i];
  reader.innerHTML = `<span class="post-meta">${p.tag} · ${p.mins} min read</span><h2 style="font-size:32px">${p.title}</h2>${p.body}<div><button class="icon-btn" id="close-reader">Close article</button></div>`;
  reader.hidden = false;
  reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('close-reader').onclick = () => { reader.hidden = true; postsEl.scrollIntoView({ block: 'start' }); };
});

/* ---------- Signup + sharing ---------- */
document.getElementById('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('s-name').value.trim();
  const cat = document.getElementById('s-cat').value;
  const ok = document.getElementById('signup-ok');
  ok.textContent = `Thanks, ${name}! You're on the list for a ${cat.toLowerCase()} buddy. (This is a class demo, so nothing was actually sent.)`;
  ok.hidden = false;
  e.target.hidden = true;
});
const shareText = "I'm using AccountaBuddy to stay on track with my goals. It matches you with an accountability partner. Want to be buddies?";
const enc = encodeURIComponent(shareText);
document.getElementById('sh-x').href = `https://twitter.com/intent/tweet?text=${enc}`;
document.getElementById('sh-fb').href = `https://www.facebook.com/sharer/sharer.php?quote=${enc}&u=${encodeURIComponent('https://www.apple.com/app-store/')}`;
document.getElementById('sh-li').href = `https://www.linkedin.com/feed/?shareActive=true&text=${enc}`;
document.getElementById('sh-copy').addEventListener('click', async e => {
  const b = e.currentTarget;
  try { await navigator.clipboard.writeText(shareText); b.textContent = 'Copied!'; }
  catch { b.textContent = 'Copy blocked: select the text above'; }
  setTimeout(() => b.textContent = 'Copy invite text', 2000);
});
