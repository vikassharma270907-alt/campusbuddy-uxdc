import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Constants and domain rules matching CampusBuddy specification
export const CATS = {
  study: "Study together",
  lunch: "Lunch together",
  coffee: "Coffee chat",
  explore: "Campus exploration",
  event: "Attend an event",
  cowork: "Co-working",
  sport: "Sports and games",
  hobby: "Hobby group",
  walk: "Short walk"
};

export const SL = ["Morning", "Afternoon", "Evening"];
export const STY = ["Quiet company", "Study-focused", "Casual conversation", "Small groups", "Explore and socialize"];

export const LOC = [
  "Taylor Family Digital Library (TFDL), Level 2 Commons",
  "MacEwan Student Centre (MSC), North Food Court",
  "Science Theatres (ST) Concourse Benches",
  "Prairie Chicken Swale / Quad Benches",
  "Rozsa Centre Student Atrium",
  "Gallagher Library (Earth Sciences), 1st Floor Study Zone"
];

export const STARTERS = {
  study: ["What are you studying this term?", "What’s the topic you keep putting off?", "Which problem set has been the toughest this week?"],
  lunch: ["What’s your go-to lunch spot on campus?", "What’s been the best part of your week?", "Any favourite coffee places nearby?"],
  coffee: ["How’s your semester going so far?", "What made you pick your major?", "Are you taking any fun electives this term?"],
  explore: ["Have you checked out this part of campus before?", "What’s one hidden campus spot you’d recommend?", "Do you commute or live nearby?"],
  event: ["What made you interested in this event?", "Have you been to one of these before?", "What kind of projects are you working on?"],
  cowork: ["What are you aiming to finish today?", "Want to check in again in 25 minutes?", "Are you working on personal or course projects?"],
  sport: ["How long have you been playing?", "What’s your favourite casual game?", "Do you play on any campus intramural teams?"],
  hobby: ["How did you get into this hobby?", "What’s your current favourite project?", "Any books or shows you're enjoying right now?"],
  walk: ["Which part of campus do you usually hang around?", "What’s your favourite way to unwind between classes?", "Nice day for fresh air, isn't it?"]
};

export const U = (n, role, course, cats, av, int, sty, vis = true) => ({
  n, role, course, cats, av, int, sty, vis
});

export const createInitialState = () => ({
  mode: null,
  me: "maya",
  tab: "today",
  onboarded: false,
  n: 100,
  modal: null,
  err: "",
  f: { c: "", d: "", s: "", o: "", sort: "fit" },
  fp: {},
  users: {
    maya: U("Maya", "First-year · Biology", "Biology", ["study", "coffee", "walk"], ["Morning", "Afternoon"], ["photography", "calculus", "hiking"], ["Quiet company", "Casual conversation"]),
    dev: U("Dev", "Commuter · Computer Science", "Computer Science", ["study", "cowork", "lunch"], ["Afternoon"], ["chess", "calculus", "coffee"], ["Study-focused"]),
    ines: U("Ines", "Third-year · Design", "Design", ["event", "explore", "coffee"], ["Evening", "Afternoon"], ["photography", "film", "design"], ["Explore and socialize", "Small groups"]),
    tom: U("Tom", "Second-year · Mathematics", "Mathematics", ["study", "coffee", "cowork"], ["Morning", "Afternoon"], ["calculus", "chess", "running"], ["Study-focused", "Small groups"]),
    zoe: U("Zoe", "Exchange student · Biology", "Biology", ["sport", "lunch", "walk"], ["Evening", "Morning"], ["hiking", "board games", "photography"], ["Explore and socialize"])
  },
  acts: [
    { id: "a1", t: "Calculus revision, quiet corner", c: "study", desc: "One hour of focused revision. Bring problem sets.", d: "Today", s: "Afternoon", dur: 60, loc: LOC[0], max: 3, host: "dev", ps: ["dev"], tags: ["calculus"], sty: "Study-focused", st: "open" },
    { id: "a2", t: "Lunch at MacEwan food court, newcomers welcome", c: "lunch", desc: "Casual lunch. No agenda, just company.", d: "Today", s: "Afternoon", dur: 45, loc: LOC[1], max: 4, host: "ines", ps: ["ines"], tags: ["design", "film"], sty: "Casual conversation", st: "open" },
    { id: "a3", t: "Golden-hour photo walk around Prairie Chicken", c: "walk", desc: "A short loop with phone cameras.", d: "Tomorrow", s: "Evening", dur: 40, loc: LOC[3], max: 4, host: "ines", ps: ["ines", "maya"], tags: ["photography", "hiking"], sty: "Explore and socialize", st: "open" },
    { id: "a4", t: "Coffee before 10am lecture", c: "coffee", desc: "Quick coffee and a chat.", d: "Tomorrow", s: "Morning", dur: 30, loc: LOC[4], max: 2, host: "tom", ps: ["tom"], tags: ["coffee", "calculus"], sty: "Casual conversation", st: "open" },
    { id: "a5", t: "Board games night at Rozsa", c: "sport", desc: "Two-table game night.", d: "Tomorrow", s: "Evening", dur: 90, loc: LOC[4], max: 2, host: "zoe", ps: ["zoe", "ines"], tags: ["board games"], sty: "Small groups", st: "open" },
    { id: "a6", t: "Cell biology study session", c: "study", desc: "Finished last week.", d: "Last week", s: "Afternoon", dur: 60, loc: LOC[0], max: 3, host: "tom", ps: ["tom", "maya"], tags: ["calculus"], sty: "Study-focused", st: "done" }
  ],
  inv: [
    { id: "i1", f: "tom", t: "maya", a: "a4", s: "pending" },
    { id: "i2", f: "ines", t: "maya", a: "a3", s: "accepted" }
  ],
  fb: [],
  blocks: [],
  reports: [],
  notes: [{ to: "maya", txt: "Tom invited you to “Coffee before 10am lecture”.", r: 0 }]
});

// Pure helper functions
export const isBlocked = (state, a, b) =>
  state.blocks.some(x => (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a));

export const jaccard = (a, b) => {
  if (!a.length && !b.length) return 0;
  const intersection = a.filter(x => b.includes(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
};

// Activity Match Score
// Weights: Activity: 30, Availability: 25, Shared Interests: 20, Course: 15, Style: 10
export function scoreActivity(user, host, act) {
  let score = 0;
  const why = [];

  // 1. Activity Compatibility (30)
  const catMatch = user.cats.includes(act.c);
  if (catMatch) {
    score += 30;
    why.push(`${CATS[act.c] || act.c} is one of your go-to activities.`);
  } else {
    score += 30 * 0.3; // minor credit for general openness
  }

  // 2. Availability (25)
  if (user.av.includes(act.s)) {
    score += 25;
    why.push(`You’re free ${act.d === "Today" ? "today" : "tomorrow"} ${act.s.toLowerCase()}.`);
  }

  // 3. Shared Interests / Tags (20)
  const shared = act.tags.filter(t => user.int.includes(t));
  if (shared.length > 0) {
    score += 20;
    why.push(`You share an interest in ${shared.join(", ")}.`);
  }

  // 4. Same Course / Major (15)
  if (user.course && host && host.course && user.course === host.course) {
    score += 15;
    why.push(`${host.n} studies ${host.course} too.`);
  }

  // 5. Interaction Style (10)
  if (user.sty.includes(act.sty)) {
    score += 10;
    why.push(`Matches your style: ${act.sty.toLowerCase()}.`);
  }

  return { score: Math.round(score), why };
}

// Peer Match Score (Person-to-Person)
export function scorePeer(u, o) {
  const catJac = jaccard(u.cats, o.cats);
  const avJac = jaccard(u.av, o.av);
  const intJac = jaccard(u.int, o.int);
  const courseMatch = u.course === o.course ? 15 : 0;
  const styJac = jaccard(u.sty, o.sty);

  const raw = 30 * catJac + 25 * avJac + 20 * intJac + courseMatch + 10 * styJac;
  const why = [];

  const ci = u.cats.filter(x => o.cats.includes(x));
  const ai = u.av.filter(x => o.av.includes(x));
  const ii = u.int.filter(x => o.int.includes(x));

  if (ci.length) why.push(`You both like ${ci.map(x => (CATS[x] || x).toLowerCase()).join(" and ")}.`);
  if (ai.length) why.push(`You’re both free in the ${ai.join(" and ").toLowerCase()}.`);
  if (ii.length) why.push(`You share an interest in ${ii.join(", ")}.`);
  if (u.course === o.course) why.push(`You’re both in ${u.course}.`);

  return { score: Math.round(raw), why };
}

// Action operations with strict validation
export function joinMoment(state, momentId, userId) {
  const act = state.acts.find(a => a.id === momentId);
  if (!act) return { ok: false, error: "Moment not found." };
  if (act.st !== "open") return { ok: false, error: "This moment is no longer open." };
  if (act.ps.includes(userId)) return { ok: false, error: "You’re already in this moment." };
  if (act.ps.length >= act.max) return { ok: false, error: "This moment is full." };
  if (isBlocked(state, userId, act.host)) return { ok: false, error: "You can’t join this moment due to privacy settings." };

  act.ps.push(userId);
  state.notes.unshift({
    to: act.host,
    txt: `${state.users[userId].n} joined “${act.t}”.`,
    r: 0
  });
  return { ok: true, act };
}

export function sendInvitation(state, fromId, toId, momentId) {
  if (fromId === toId) return { ok: false, error: "Cannot invite yourself." };
  const act = state.acts.find(a => a.id === momentId);
  if (!act) return { ok: false, error: "Moment not found." };
  if (act.st !== "open") return { ok: false, error: "Moment is not open." };
  if (act.ps.length >= act.max) return { ok: false, error: "That moment is full." };
  if (act.ps.includes(toId)) return { ok: false, error: "User is already in that moment." };
  if (isBlocked(state, fromId, toId)) return { ok: false, error: "Cannot invite this user." };

  const hasPending = state.inv.some(
    i => i.f === fromId && i.t === toId && i.a === momentId && i.s === "pending"
  );
  if (hasPending) return { ok: false, error: "You already invited them to this moment." };

  const newInvite = {
    id: "i" + state.n++,
    f: fromId,
    t: toId,
    a: momentId,
    s: "pending"
  };
  state.inv.push(newInvite);
  state.notes.unshift({
    to: toId,
    txt: `${state.users[fromId].n} invited you to “${act.t}”.`,
    r: 0
  });
  return { ok: true, invite: newInvite };
}

export function respondInvitation(state, inviteId, newStatus, currentUserId) {
  const inv = state.inv.find(i => i.id === inviteId);
  if (!inv) return { ok: false, error: "Invitation not found." };
  if (inv.s !== "pending") return { ok: false, error: "That invitation can’t change any more." };

  if (newStatus === "accepted" || newStatus === "declined") {
    if (inv.t !== currentUserId) return { ok: false, error: "Only the recipient can accept or decline." };
  } else if (newStatus === "cancelled") {
    if (inv.f !== currentUserId) return { ok: false, error: "Only the sender can cancel this invitation." };
  } else {
    return { ok: false, error: "Invalid status transition." };
  }

  const act = state.acts.find(a => a.id === inv.a);
  if (!act) return { ok: false, error: "Associated moment not found." };

  if (newStatus === "accepted") {
    if (act.st !== "open") return { ok: false, error: "That moment is no longer open." };
    if (act.ps.length >= act.max) return { ok: false, error: "That moment is full." };
    if (!act.ps.includes(inv.t)) {
      act.ps.push(inv.t);
    }
    state.notes.unshift({
      to: inv.f,
      txt: `${state.users[inv.t].n} accepted your invitation to “${act.t}”.`,
      r: 0
    });
  } else if (newStatus === "declined") {
    state.notes.unshift({
      to: inv.f,
      txt: `${state.users[inv.t].n} can’t make “${act.t}”.`,
      r: 0
    });
  }

  inv.s = newStatus;
  return { ok: true, invite: inv };
}

export function blockUser(state, blockerId, targetId) {
  if (blockerId === targetId) return { ok: false, error: "Cannot block yourself." };
  if (!isBlocked(state, blockerId, targetId)) {
    state.blocks.push([blockerId, targetId]);
  }
  // Auto-cancel all mutual pending invitations
  state.inv.forEach(i => {
    if (i.s === "pending" && isBlocked(state, i.f, i.t)) {
      i.s = "cancelled";
    }
  });
  return { ok: true };
}

export function unblockUser(state, blockerId, targetId) {
  state.blocks = state.blocks.filter(b => !(b[0] === blockerId && b[1] === targetId));
  return { ok: true };
}

// ----------------- TEST SUITE -----------------

describe('CampusBuddy Match Scoring Rules', () => {
  test('Exact activity match delivers maximum points across all 5 dimensions', () => {
    const user = U("StudentA", "Role", "Biology", ["study"], ["Afternoon"], ["calculus"], ["Study-focused"]);
    const host = U("StudentB", "Role", "Biology", ["study"], ["Afternoon"], ["calculus"], ["Study-focused"]);
    const act = { c: "study", s: "Afternoon", d: "Today", tags: ["calculus"], sty: "Study-focused" };

    const { score, why } = scoreActivity(user, host, act);
    assert.equal(score, 100, "Score should equal 30+25+20+15+10 = 100");
    assert.equal(why.length, 5, "All 5 plain-language reasons must be provided");
    assert.match(why[0], /Study together is one of your go-to activities/);
    assert.match(why[1], /You’re free today afternoon/);
    assert.match(why[2], /You share an interest in calculus/);
    assert.match(why[3], /studies Biology too/);
    assert.match(why[4], /Matches your style: study-focused/);
  });

  test('Partial match calculates exact design default weights', () => {
    // Activity: non-preferred category gives 30 * 0.3 = 9
    // Availability: matched -> +25
    // Shared interest: none -> +0
    // Course: different -> +0
    // Style: matched -> +10
    // Expected total: 9 + 25 + 0 + 0 + 10 = 44
    const user = U("StudentA", "Role", "Biology", ["lunch"], ["Afternoon"], ["biology"], ["Casual conversation"]);
    const host = U("StudentB", "Role", "Computer Science", ["study"], ["Afternoon"], ["chess"], ["Casual conversation"]);
    const act = { c: "study", s: "Afternoon", d: "Tomorrow", tags: ["chess"], sty: "Casual conversation" };

    const { score, why } = scoreActivity(user, host, act);
    assert.equal(score, 44);
    assert.equal(why.length, 2, "Only matching criteria generate plain-language reasons");
  });

  test('Peer Jaccard similarity respects category, time, interest, course and style weights', () => {
    const u1 = U("Maya", "", "Biology", ["study", "coffee"], ["Morning"], ["calculus", "hiking"], ["Quiet company"]);
    const u2 = U("Dev", "", "Biology", ["study", "lunch"], ["Morning"], ["calculus", "chess"], ["Quiet company"]);
    // Cats: {study}/{study,coffee,lunch} = 1/3 * 30 = 10
    // Av: {Morning}/{Morning} = 1/1 * 25 = 25
    // Int: {calculus}/{calculus,hiking,chess} = 1/3 * 20 = 6.666...
    // Course: Biology === Biology -> +15
    // Style: {Quiet company}/{Quiet company} = 1/1 * 10 = 10
    // Total raw: 10 + 25 + 6.667 + 15 + 10 = 66.667 -> round to 67
    const { score, why } = scorePeer(u1, u2);
    assert.equal(score, 67);
    assert.ok(why.length >= 3);
  });
});

describe('Capacity and Join Constraints', () => {
  test('Cannot join when moment is full', () => {
    const s = createInitialState();
    const act = s.acts.find(a => a.id === "a4"); // max 2, currently has tom
    assert.equal(act.ps.length, 1);

    // dev joins
    const r1 = joinMoment(s, "a4", "dev");
    assert.equal(r1.ok, true);
    assert.equal(act.ps.length, 2);

    // ines attempts to join full moment
    const r2 = joinMoment(s, "a4", "ines");
    assert.equal(r2.ok, false);
    assert.match(r2.error, /full/i);
    assert.equal(act.ps.length, 2);
  });

  test('Cannot join twice (duplicate join prevention)', () => {
    const s = createInitialState();
    const r1 = joinMoment(s, "a1", "maya");
    assert.equal(r1.ok, true);

    const r2 = joinMoment(s, "a1", "maya");
    assert.equal(r2.ok, false);
    assert.match(r2.error, /already in this moment/i);
  });

  test('Cannot join a cancelled or finished moment', () => {
    const s = createInitialState();
    const r = joinMoment(s, "a6", "dev"); // a6 is status "done"
    assert.equal(r.ok, false);
    assert.match(r.error, /no longer open/i);
  });
});

describe('Invitation State Machine Transitions', () => {
  test('Pending invitation transitions to accepted and updates participants', () => {
    const s = createInitialState();
    const inv = s.inv.find(i => i.id === "i1"); // tom -> maya for a4
    assert.equal(inv.s, "pending");

    const res = respondInvitation(s, "i1", "accepted", "maya");
    assert.equal(res.ok, true);
    assert.equal(inv.s, "accepted");

    const act = s.acts.find(a => a.id === "a4");
    assert.ok(act.ps.includes("maya"));
  });

  test('Final invitation states cannot transition again', () => {
    const s = createInitialState();
    // i2 is already accepted
    const res = respondInvitation(s, "i2", "declined", "maya");
    assert.equal(res.ok, false);
    assert.match(res.error, /can’t change any more/i);
  });

  test('Cannot accept invitation if moment reached capacity before response', () => {
    const s = createInitialState();
    // a4 max is 2. Let zoe join first so it becomes full.
    const act = s.acts.find(a => a.id === "a4");
    act.ps.push("zoe");
    assert.equal(act.ps.length, 2); // full!

    // Now Maya tries to accept i1
    const res = respondInvitation(s, "i1", "accepted", "maya");
    assert.equal(res.ok, false);
    assert.match(res.error, /full/i);
  });

  test('Duplicate pending invitations are prevented', () => {
    const s = createInitialState();
    // In initial state, i1 is from tom to maya for a4
    const res = sendInvitation(s, "tom", "maya", "a4");
    assert.equal(res.ok, false);
    assert.match(res.error, /already invited/i);
  });
});

describe('Blocking and Safety Constraints', () => {
  test('Blocking cancels all pending mutual invitations', () => {
    const s = createInitialState();
    assert.ok(s.inv.some(i => i.id === "i1" && i.s === "pending")); // tom -> maya

    blockUser(s, "maya", "tom");
    assert.ok(isBlocked(s, "maya", "tom"));
    assert.ok(isBlocked(s, "tom", "maya"));

    const inv = s.inv.find(i => i.id === "i1");
    assert.equal(inv.s, "cancelled", "Pending invite must be cancelled upon blocking");
  });

  test('Blocked users cannot join each other’s moments', () => {
    const s = createInitialState();
    blockUser(s, "dev", "maya");

    // dev is host of a1. maya tries to join a1
    const res = joinMoment(s, "a1", "maya");
    assert.equal(res.ok, false);
    assert.match(res.error, /privacy settings|can’t join/i);
  });

  test('Blocked users cannot invite each other', () => {
    const s = createInitialState();
    blockUser(s, "maya", "dev");

    const res = sendInvitation(s, "maya", "dev", "a3");
    assert.equal(res.ok, false);
    assert.match(res.error, /cannot invite/i);
  });

  test('Unblocking removes block state correctly', () => {
    const s = createInitialState();
    blockUser(s, "maya", "dev");
    assert.ok(isBlocked(s, "maya", "dev"));

    unblockUser(s, "maya", "dev");
    assert.ok(!isBlocked(s, "maya", "dev"));
  });
});

