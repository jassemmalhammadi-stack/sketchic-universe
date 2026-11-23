const GI18N = {
  ar: {
    headerSub: "اللعبة التشويقية التفاعلية",
    loreVaultBtn: "خزنة المخطوطة السرية 🔑",
    backHome: "← العودة للموقع",
    hudDimLabel: "البُعد الحالي",
    hudInkLabel: "مخزون الحبر",
    hudScoreLabel: "القطرات",
    spectrumSkin: "سيف الطيف الحي ✨",
    restartBtn: "إعادة المرحلة",
    overlayKicker: "SKETCHIC UNIVERSE: THE GAME • PLAYABLE TEASER",
    titleMain: "حارس الممحاة — الانتقال البُعدي",
    titleDesc:
      "اختر بطلك المعتمد من عالم سكتشيك وانطلق من صفحة السكتش ثنائية الأبعاد إلى طاولة البلوط ثلاثية الأبعاد! بدّل بين البُعدين لترسم جسوراً وتتفادى الماء والأقلام المتدحرجة هرباً من ناسك الفراغ الأبيض وضباب الممحاة.",
    ctrlMove: "حركة",
    ctrlJump: "قفز",
    ctrlShift: "تبديل 2D ⇄ 3D",
    ctrlBridge: "رسم جسر حبر (في 2D)",
    startBtn: "ابدأ المغامرة ▶",
    skipBtn: "تخطي المشهد ⏭",
    btnShift: "تبديل 2D⇄3D",
    btnBridge: "جسر حبر ✒",
    btnJump: "قفز ▲",
    loreTitle: "خزنة أكواد المخطوطة السرية",
    loreIntro:
      "أدخل الرموز المخفية داخل حلقات الموسم الثاني (مثل DROPLET-01 وPENDULUM-02 وPRISM-03 وORIGAMI-04) لفتح أسرار الفنان المفقود وتفعيل سيف «قلم الطيف الحي» داخل اللعبة.",
    loreSubmit: "فتح الكود",
    winTitle: "انتصار القلم الذهبي!",
    winDesc: "وصلت إلى القلم الذهبي وأعدت رسم الجبال الممحوّة! جرّب جمع كل قطرات الحبر أو فتح رموز الموسم الثاني في الخزنة.",
    loseTitle: "ابتلع الضباب الصفحة!",
    loseDesc: "الممحاة الرمادية أدركت خطواتك أو نفد الحبر من الماء — اضغط إعادة المحاولة وانطلق أسرع.",
    playAgain: "العب مجدداً ↻",
    dim2D: "صفحة 2D",
    dim3D: "طاولة 3D",
    codeValid: "تم فتح القصاصة السرية وتفعيل طيف الألوان ✓",
    codeInvalid: "كود غير معروف — ابحث في حلقات الموسم الثاني.",
  },
  en: {
    headerSub: "Interactive Browser Teaser",
    loreVaultBtn: "Secret Blueprint Vault 🔑",
    backHome: "← Back to Sketchic.net",
    hudDimLabel: "Dimension",
    hudInkLabel: "Ink Supply",
    hudScoreLabel: "Gold Drops",
    spectrumSkin: "Living Spectrum Blade ✨",
    restartBtn: "Restart Stage",
    overlayKicker: "SKETCHIC UNIVERSE: THE GAME • PLAYABLE TEASER",
    titleMain: "The Eraser's Edge — 2D ↔ 3D Shift",
    titleDesc:
      "Pick your official Sketchic canon hero and leap from the flat 2D sketchbook page onto the 3D oak studio desk! Shift dimensions to craft bridges, dodge watercolor drops and rolling pencils, outrun The Pale Draughtsman's Eraser Fog, and reach The Golden Nib.",
    ctrlMove: "Move",
    ctrlJump: "Jump",
    ctrlShift: "Shift 2D ⇄ 3D",
    ctrlBridge: "Ink Bridge (in 2D)",
    startBtn: "Start Quest ▶",
    skipBtn: "Skip Cutscene ⏭",
    btnShift: "Shift 2D⇄3D",
    btnBridge: "Ink Bridge ✒",
    btnJump: "Jump ▲",
    loreTitle: "Secret Blueprint Code Vault",
    loreIntro:
      "Enter hidden Season 2 episode codes (such as DROPLET-01, PENDULUM-02, PRISM-03, ORIGAMI-04) to unlock Maker lore fragments and the Living Spectrum Blade skin.",
    loreSubmit: "Unlock Code",
    winTitle: "Victory at The Golden Nib!",
    winDesc: "You reached The Golden Nib and redrew the erased world! Collect all golden drops or unlock Season 2 lore in the Vault.",
    loseTitle: "Wiped by the Eraser Fog!",
    loseDesc: "The cold grey mist caught up or water diluted your ink — jump right back in and dash across the desk.",
    playAgain: "Play Again ↻",
    dim2D: "2D PAGE",
    dim3D: "3D DESK",
    codeValid: "Secret Blueprint Fragment unlocked + Spectrum Blade enabled ✓",
    codeInvalid: "Unknown code — watch Season 2 episodes for clues.",
  },
};

const LORE_CODES = {
  "DROPLET-01": {
    ar: ["القصاصة #01 — الطوفان الزجاجي", "رسالة الفنان: «لا تفتحوا الدرج الأسفل... المسودة الأولى لم تكتمل»."],
    en: ["Blueprint #01 — The Spilled Sea", "Maker's note: \"Do not open the lower drawer... the first draft remains unfinished.\""],
  },
  "PENDULUM-02": {
    ar: ["القصاصة #02 — ظل الساعة", "توقيع بندول الساعة النحاسي يطابق رسم المسودة البيضاء الصامتة داخل الدرج."],
    en: ["Blueprint #02 — Pendulum Shadow", "The brass clockwork signature matches the silent white geometric draft hidden below."],
  },
  "PRISM-03": {
    ar: ["القصاصة #03 — انكسار الصمت", "نور القلم الذهبي ينكسر عبر قلب الزجاج إلى ألوان الطيف السبعة حين يعاون الحبرُ المنشور."],
    en: ["Blueprint #03 — Refraction of Silence", "Golden ink splits into seven spectrum rays when living ink unites with stained glass."],
  },
  "ORIGAMI-04": {
    ar: ["القصاصة #04 — حارسة الطيّات", "شوهد الفنان يغادر الغرفة عبر لوحة مقلوبة داخل الدرج المنسي لا عبر الباب."],
    en: ["Blueprint #04 — The Folded Sentinel", "The Maker vanished through an upside-down painting inside the lower drawer, not the studio door."],
  },
  "THERMAL-05": {
    ar: ["القصاصة #05 — الحبر الحراري", "دفء الفانوس يكشف المسار الخفي المرسوم بحبر حراري بين القصاصات المخيطة بالذهب."],
    en: ["Blueprint #05 — Invisible Thermal Ink", "Lantern heat reveals the secret thermal ink corridor across the stitched blueprint."],
  },
  "UNFINISHED-06": {
    ar: ["القصاصة #06 — المسودة الأولى", "ناسك الفراغ الأبيض هو أول رسمة خطّها الفنان بالمسطرة ثم تركها غير مكتملة."],
    en: ["Blueprint #06 — The Unfinished Draft", "The Pale Draughtsman was the Maker's very first ruled draft, abandoned unfinished."],
  },
  "SPECTRUM-07": {
    ar: ["القصاصة #07 — قلم الطيف الحي", "اجتمعت الخامات الست لتصنع القلم الذي يكمّل الناقص ولا يمحوه."],
    en: ["Blueprint #07 — Living Spectrum Nib", "Six artistic mediums forged one instrument built to complete rather than erase."],
  },
  "MASTERPIECE-08": {
    ar: ["القصاصة #08 — اللوحة المكتملة", "أضاء لوح الرسم الرقمي Sketchic.net معلناً ولادة البُعد الجديد."],
    en: ["Blueprint #08 — Unfinished Masterpiece", "The digital drawing tablet awakened, opening Sketchic.net's next horizon."],
  },
};

const HERO_ORDER = ["ink_knight", "thread_weaver", "origami_warden", "ink_fox"];
const HEROES = {
  ink_knight: {
    id: "ink_knight",
    ar: "فارس الحبر",
    en: "Ink Knight",
    portrait: "../assets/images/game/portrait_ink_knight.png",
    sprite: "../assets/images/game/sprite_ink_knight.png",
    bridgeFill: "#e8a838",
    bridgeStroke: "#111111",
    rimColor: "#f5f0e6",
    renderH: 74,
  },
  thread_weaver: {
    id: "thread_weaver",
    ar: "حائك الخيوط",
    en: "Thread Weaver",
    portrait: "../assets/images/game/portrait_thread_weaver.png",
    sprite: "../assets/images/game/sprite_thread_weaver.png",
    bridgeFill: "#1e2460",
    bridgeStroke: "#f4c44e",
    rimColor: "#f4c44e",
    renderH: 72,
  },
  origami_warden: {
    id: "origami_warden",
    ar: "حارسة الأوريغامي",
    en: "Origami Warden",
    portrait: "../assets/images/game/portrait_origami_warden.png",
    sprite: "../assets/images/game/sprite_origami_warden.png",
    bridgeFill: "#f3ede2",
    bridgeStroke: "#e8a838",
    rimColor: "#e8a838",
    renderH: 76,
  },
  ink_fox: {
    id: "ink_fox",
    ar: "ثعلب الحبر",
    en: "Ink Fox",
    portrait: "../assets/images/game/portrait_ink_fox.png",
    sprite: "../assets/images/game/sprite_ink_fox.png",
    bridgeFill: "#2a2d34",
    bridgeStroke: "#f7f9fc",
    rimColor: "#f7f9fc",
    renderH: 58,
  },
};

const SPRITES = {};
HERO_ORDER.forEach((heroId) => {
  const img = new Image();
  img.src = HEROES[heroId].sprite;
  SPRITES[heroId] = img;
});
SPRITES.pale_draughtsman = new Image();
SPRITES.pale_draughtsman.src = "../assets/images/game/sprite_pale_draughtsman.png";

let lang = localStorage.getItem("sketchic_lang") || "ar";
let selectedHeroId = localStorage.getItem("sketchic_game_hero") || "ink_knight";
if (!HEROES[selectedHeroId]) selectedHeroId = "ink_knight";
let unlockedCodes = JSON.parse(localStorage.getItem("sketchic_lore_codes") || "[]");
let spectrumEnabled = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const stageOverlay = document.getElementById("stageOverlay");
const cutsceneVideo = document.getElementById("cutsceneVideo");
const overlayTitle = document.getElementById("overlayTitle");
const overlayDesc = document.getElementById("overlayDesc");
const startGameBtn = document.getElementById("startGameBtn");
const skipCutsceneBtn = document.getElementById("skipCutsceneBtn");
const restartBtn = document.getElementById("restartBtn");
const hudHeroBtn = document.getElementById("hudHeroBtn");
const hudHeroImg = document.getElementById("hudHeroImg");
const hudHeroName = document.getElementById("hudHeroName");
const heroRoster = document.getElementById("heroRoster");
const hudDimension = document.getElementById("hudDimension");
const hudInkBar = document.getElementById("hudInkBar");
const hudDrops = document.getElementById("hudDrops");
const spectrumSkinLabel = document.getElementById("spectrumSkinLabel");
const spectrumSkinToggle = document.getElementById("spectrumSkinToggle");
const gameLangBtn = document.getElementById("gameLangBtn");
const loreModal = document.getElementById("loreModal");
const loreVaultBtn = document.getElementById("loreVaultBtn");
const loreCloseBtn = document.getElementById("loreCloseBtn");
const loreBackdrop = document.getElementById("loreBackdrop");
const loreForm = document.getElementById("loreForm");
const loreInput = document.getElementById("loreInput");
const loreFeedback = document.getElementById("loreFeedback");
const loreList = document.getElementById("loreList");

const WORLD_WIDTH = 3400;
const GROUND_Y = 420;
const GRAVITY = 1550;

const keys = { left: false, right: false, jump: false };

const state = {
  mode: "title", // title | intro | play | victory | gameover
  dim: "2D",     // 2D | 3D
  cameraX: 0,
  fogX: -180,
  dropsCollected: 0,
  ink: 100,
  player: { x: 140, y: 340, vx: 0, vy: 0, w: 28, h: 42, onGround: false, facing: 1 },
  platforms: [],
  bridges: [],
  hazards: [],
  drops: [],
  nibGoal: { x: 3180, y: 240, w: 70, h: 180 },
};

function buildLevel() {
  state.dim = "2D";
  state.cameraX = 0;
  state.fogX = -160;
  state.dropsCollected = 0;
  state.ink = 100;
  state.player = { x: 130, y: 340, vx: 0, vy: 0, w: 28, h: 42, onGround: false, facing: 1 };
  state.bridges = [];
  state.platforms = [
    // 2D Sketchbook Zone (0 - 1150)
    { x: 0, y: 420, w: 460, h: 120, zone: "2D", label: "Sketchbook Page" },
    { x: 610, y: 380, w: 260, h: 160, zone: "2D", label: "Ink Ridge" },
    { x: 950, y: 350, w: 220, h: 190, zone: "2D", label: "Page Cliff" },
    // 3D Oak Desk Zone (1200 - 3400)
    { x: 1240, y: 420, w: 420, h: 120, zone: "3D", label: "Oak Desk" },
    { x: 1730, y: 360, w: 340, h: 24, zone: "3D", label: "Wooden Ruler Bridge" },
    { x: 2150, y: 310, w: 260, h: 230, zone: "3D", label: "Vintage Tome I" },
    { x: 2480, y: 250, w: 250, h: 290, zone: "3D", label: "Leather Tome II" },
    { x: 2810, y: 330, w: 190, h: 210, zone: "3D", label: "Brass Inkwell" },
    { x: 3060, y: 260, w: 340, h: 280, zone: "3D", label: "Summit Stack" },
  ];
  state.hazards = [
    { x: 1380, y: 392, baseX: 1380, range: 90, speed: 95, dir: 1, r: 14, kind: "pencil" },
    { x: 1850, y: 332, baseX: 1850, range: 110, speed: 120, dir: -1, r: 14, kind: "pencil" },
    { x: 2250, y: 120, baseY: 120, dropY: 310, vy: 180, r: 11, kind: "water" },
    { x: 2600, y: 90, baseY: 90, dropY: 250, vy: 210, r: 11, kind: "water" },
  ];
  state.drops = [
    { x: 320, y: 375, collected: false },
    { x: 540, y: 330, collected: false },
    { x: 740, y: 330, collected: false },
    { x: 1060, y: 300, collected: false },
    { x: 1480, y: 365, collected: false },
    { x: 1900, y: 310, collected: false },
    { x: 2280, y: 260, collected: false },
    { x: 2600, y: 200, collected: false },
    { x: 2900, y: 280, collected: false },
  ];
}

function tryPlayCutscene(src, nextMode, showSkip) {
  cutsceneVideo.hidden = false;
  cutsceneVideo.loop = nextMode === "title";
  cutsceneVideo.src = src;
  cutsceneVideo.onended = () => {
    if (nextMode !== "title") {
      cutsceneVideo.hidden = true;
      cutsceneVideo.pause();
      if (nextMode === "play") beginGameplay();
    }
  };
  cutsceneVideo.onerror = () => {
    cutsceneVideo.hidden = true;
    if (nextMode === "intro_start") beginGameplay();
  };
  skipCutsceneBtn.hidden = !showSkip;
  cutsceneVideo.play().catch(() => {
    cutsceneVideo.hidden = true;
    if (nextMode === "intro_start") beginGameplay();
  });
}

function showOverlay(mode) {
  state.mode = mode;
  const d = GI18N[lang];
  stageOverlay.hidden = false;
  if (heroRoster) heroRoster.hidden = false;
  if (mode === "title") {
    overlayTitle.textContent = d.titleMain;
    overlayDesc.textContent = d.titleDesc;
    startGameBtn.textContent = d.startBtn;
    skipCutsceneBtn.hidden = true;
    tryPlayCutscene("../assets/videos/game/Game_Title_Loop.mp4", "title", false);
  } else if (mode === "victory") {
    overlayTitle.textContent = d.winTitle;
    overlayDesc.textContent = d.winDesc;
    startGameBtn.textContent = d.playAgain;
    tryPlayCutscene("../assets/videos/game/Game_Victory_Cutscene.mp4", "victory", false);
  } else if (mode === "gameover") {
    overlayTitle.textContent = d.loseTitle;
    overlayDesc.textContent = d.loseDesc;
    startGameBtn.textContent = d.playAgain;
    cutsceneVideo.hidden = true;
    skipCutsceneBtn.hidden = true;
  }
}

function beginGameplay() {
  cutsceneVideo.pause();
  cutsceneVideo.hidden = true;
  stageOverlay.hidden = true;
  skipCutsceneBtn.hidden = true;
  state.mode = "play";
}

function startRunWithIntro() {
  buildLevel();
  state.mode = "intro";
  overlayTitle.textContent = GI18N[lang].titleMain;
  overlayDesc.textContent = GI18N[lang].titleDesc;
  skipCutsceneBtn.hidden = false;
  cutsceneVideo.hidden = false;
  cutsceneVideo.loop = false;
  cutsceneVideo.src = "../assets/videos/game/Game_Intro_Cutscene.mp4";
  cutsceneVideo.onended = beginGameplay;
  cutsceneVideo.onerror = beginGameplay;
  cutsceneVideo.play().catch(beginGameplay);
}

function toggleDimension() {
  if (state.mode !== "play") return;
  state.dim = state.dim === "2D" ? "3D" : "2D";
  updateHud();
}

function drawInkBridge() {
  if (state.mode !== "play" || state.dim !== "2D" || state.ink < 25) return;
  state.ink = Math.max(0, state.ink - 25);
  const bx = state.player.x + (state.player.facing > 0 ? 32 : -118);
  const by = state.player.y + state.player.h;
  state.bridges.push({ x: bx, y: by, w: 96, h: 12, zone: "2D", ttl: 8, hero: selectedHeroId });
  updateHud();
}

function updateHud() {
  const d = GI18N[lang];
  hudDimension.textContent = state.dim === "2D" ? d.dim2D : d.dim3D;
  hudDimension.style.color = state.dim === "2D" ? "#e8a838" : "#66d2d4";
  hudInkBar.style.width = `${Math.round(state.ink)}%`;
  hudDrops.textContent = String(state.dropsCollected);
  spectrumSkinLabel.hidden = unlockedCodes.length === 0;
}

function update(dt) {
  if (state.mode !== "play") return;
  const p = state.player;
  const speed = state.dim === "2D" ? 290 : 250;

  if (keys.left) {
    p.vx = -speed;
    p.facing = -1;
  } else if (keys.right) {
    p.vx = speed;
    p.facing = 1;
  } else {
    p.vx *= 0.78;
  }

  if (keys.jump && p.onGround) {
    p.vy = state.dim === "3D" ? -640 : -580;
    p.onGround = false;
  }

  p.vy += GRAVITY * dt;
  const prevBottom = p.y + p.h;
  p.x = Math.max(20, Math.min(WORLD_WIDTH - p.w, p.x + p.vx * dt));
  p.y += p.vy * dt;
  p.onGround = false;

  // Auto-align dimension aesthetic when crossing page edge (informative feedback)
  const solids = state.platforms.concat(state.bridges);
  for (const s of solids) {
    if (s.zone === "2D" && s.ttl !== undefined && state.dim !== "2D") continue;
    const overlapX = p.x + p.w > s.x && p.x < s.x + s.w;
    if (overlapX && p.vy >= 0 && prevBottom <= s.y + 14 && p.y + p.h >= s.y) {
      p.y = s.y - p.h;
      p.vy = 0;
      p.onGround = true;
    }
  }

  // Decay bridges
  state.bridges = state.bridges.filter((b) => {
    b.ttl -= dt;
    return b.ttl > 0;
  });

  // Update hazards
  for (const h of state.hazards) {
    if (h.kind === "pencil") {
      h.x += h.speed * h.dir * dt;
      if (Math.abs(h.x - h.baseX) > h.range) h.dir *= -1;
    } else if (h.kind === "water") {
      h.y += h.vy * dt;
      if (h.y > h.dropY) h.y = h.baseY;
    }
    const dx = p.x + p.w / 2 - h.x;
    const dy = p.y + p.h / 2 - h.y;
    if (Math.hypot(dx, dy) < h.r + 16) {
      if (h.kind === "water") {
        state.ink = Math.max(0, state.ink - 45 * dt * 8);
        if (state.ink <= 0) {
          showOverlay("gameover");
          return;
        }
      } else {
        p.vy = -380;
        p.vx = -220 * p.facing;
      }
    }
  }

  // Collect golden drops
  for (const drop of state.drops) {
    if (!drop.collected && Math.hypot(p.x + p.w / 2 - drop.x, p.y + p.h / 2 - drop.y) < 28) {
      drop.collected = true;
      state.dropsCollected += 1;
      state.ink = Math.min(100, state.ink + 25);
    }
  }

  // Eraser fog creeps relentlessly
  state.fogX += 58 * dt;
  if (p.x < state.fogX - 18 || p.y > canvas.height + 60) {
    showOverlay("gameover");
    return;
  }

  // Goal check
  const g = state.nibGoal;
  if (p.x + p.w > g.x && p.x < g.x + g.w && p.y + p.h > g.y && p.y < g.y + g.h) {
    showOverlay("victory");
    return;
  }

  state.cameraX = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, p.x - canvas.width * 0.36));
  updateHud();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky / Studio backdrop split between 2D Page & 3D Oak Desk
  const splitScreenX = 1190 - state.cameraX;
  const grad3D = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad3D.addColorStop(0, "#1c150f");
  grad3D.addColorStop(1, "#2f2116");
  ctx.fillStyle = grad3D;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (splitScreenX > 0) {
    ctx.fillStyle = "#f4ede0";
    ctx.fillRect(0, 0, Math.min(canvas.width, splitScreenX), canvas.height);
    // Hand-drawn ink mountains in 2D zone
    ctx.strokeStyle = "rgba(17,17,17,0.18)";
    ctx.lineWidth = 2;
    for (let mx = -state.cameraX; mx < splitScreenX; mx += 260) {
      ctx.beginPath();
      ctx.moveTo(mx, 420);
      ctx.lineTo(mx + 120, 230);
      ctx.lineTo(mx + 240, 420);
      ctx.stroke();
    }
  }

  // Golden sunbeams
  ctx.fillStyle = state.dim === "2D" ? "rgba(232,168,56,0.14)" : "rgba(56,163,165,0.1)";
  ctx.beginPath();
  ctx.moveTo(100, 0);
  ctx.lineTo(520, 0);
  ctx.lineTo(780, canvas.height);
  ctx.lineTo(260, canvas.height);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.translate(-state.cameraX, 0);

  // Platforms
  for (const s of state.platforms) {
    if (s.zone === "2D") {
      ctx.fillStyle = "#efe5d2";
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.strokeStyle = "#14110d";
      ctx.lineWidth = 3;
      ctx.strokeRect(s.x, s.y, s.w, s.h);
    } else {
      ctx.fillStyle = s.label.includes("Ruler") ? "#b87a3d" : "#4a2e1b";
      ctx.fillRect(s.x, s.y, s.w, s.h);
      ctx.strokeStyle = "#e8a838";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(s.x, s.y, s.w, s.h);
    }
  }

  const animTime = performance.now() / 1000;

  // Drawn canon hero bridges
  for (const b of state.bridges) {
    const bh = HEROES[b.hero] || HEROES[selectedHeroId];
    ctx.fillStyle = spectrumEnabled ? "#38a3a5" : bh.bridgeFill;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = bh.bridgeStroke;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    if (bh.id === "thread_weaver") {
      ctx.save();
      ctx.strokeStyle = "#f4c44e";
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.moveTo(b.x + 6, b.y + b.h / 2);
      ctx.lineTo(b.x + b.w - 6, b.y + b.h / 2);
      ctx.stroke();
      ctx.restore();
    } else if (bh.id === "origami_warden") {
      ctx.strokeStyle = "#e8a838";
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let cx = b.x + 8; cx < b.x + b.w - 8; cx += 16) {
        ctx.moveTo(cx, b.y + b.h - 2);
        ctx.lineTo(cx + 8, b.y + 2);
        ctx.lineTo(cx + 16, b.y + b.h - 2);
      }
      ctx.stroke();
    }
  }

  // Golden drops
  for (const d of state.drops) {
    if (d.collected) continue;
    const pulse = Math.sin(animTime * 4 + d.x * 0.02) * 1.5;
    ctx.fillStyle = "rgba(232,168,56,0.22)";
    ctx.beginPath();
    ctx.arc(d.x, d.y, 13 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e8a838";
    ctx.beginPath();
    ctx.arc(d.x, d.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff5d1";
    ctx.beginPath();
    ctx.arc(d.x - 2, d.y - 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hazards: rolling artist drafting pencils & luminous watercolor droplets
  for (const h of state.hazards) {
    drawHazard(h, animTime);
  }

  // Golden Nib Goal
  drawGoldenNib(state.nibGoal, animTime);

  // Active Canon Hero Sprite
  drawHeroSprite(state.player, HEROES[selectedHeroId], animTime);

  // Pale Draughtsman & Creeping Eraser Fog
  drawPaleDraughtsmanFog(animTime);

  ctx.restore();
}

function drawHazard(h, animTime) {
  if (h.kind === "pencil") {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.rotate(animTime * 5.2 * h.dir);
    // Crimson lacquered artist pencil cross-section/rolling silhouette
    ctx.fillStyle = "#b91c3b";
    ctx.fillRect(-17, -6, 26, 12);
    ctx.strokeStyle = "#14110d";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-17, -6, 26, 12);
    // Highlight ridge along barrel
    ctx.fillStyle = "rgba(255,220,220,0.28)";
    ctx.fillRect(-17, -4, 26, 3);
    // Brass ferrule & pink eraser end
    ctx.fillStyle = "#e8a838";
    ctx.fillRect(-22, -6, 6, 12);
    ctx.fillStyle = "#e58fa0";
    ctx.fillRect(-27, -5.5, 5, 11);
    // Sharpened wood cone & graphite tip
    ctx.fillStyle = "#e7cba0";
    ctx.beginPath();
    ctx.moveTo(9, -6);
    ctx.lineTo(23, 0);
    ctx.lineTo(9, 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#18181b";
    ctx.beginPath();
    ctx.moveTo(17, -2.5);
    ctx.lineTo(24, 0);
    ctx.lineTo(17, 2.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else {
    ctx.save();
    ctx.translate(h.x, h.y);
    ctx.fillStyle = "rgba(56, 163, 165, 0.92)";
    ctx.beginPath();
    ctx.moveTo(0, -h.r - 4);
    ctx.bezierCurveTo(h.r + 3, -2, h.r, h.r, 0, h.r);
    ctx.bezierCurveTo(-h.r, h.r, -h.r - 3, -2, 0, -h.r - 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#b8f3f4";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-3, 2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawGoldenNib(g, animTime) {
  const glow = 0.25 + 0.12 * Math.sin(animTime * 3);
  const cx = g.x + g.w / 2;
  const rad = ctx.createRadialGradient(cx, g.y + g.h * 0.45, 10, cx, g.y + g.h * 0.45, 115);
  rad.addColorStop(0, `rgba(244, 196, 78, ${glow})`);
  rad.addColorStop(1, "rgba(244, 196, 78, 0)");
  ctx.fillStyle = rad;
  ctx.fillRect(g.x - 70, g.y - 50, g.w + 140, g.h + 100);

  ctx.fillStyle = "#e8a838";
  ctx.beginPath();
  ctx.moveTo(cx, g.y);
  ctx.lineTo(g.x + g.w, g.y + 80);
  ctx.lineTo(g.x + g.w - 14, g.y + g.h);
  ctx.lineTo(g.x + 14, g.y + g.h);
  ctx.lineTo(g.x, g.y + 80);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#fff4cf";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Nib breather hole and slit line
  ctx.strokeStyle = "#4b320b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, g.y + 4);
  ctx.lineTo(cx, g.y + 92);
  ctx.stroke();
  ctx.fillStyle = "#2b1c06";
  ctx.beginPath();
  ctx.arc(cx, g.y + 96, 5.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawHeroSprite(p, hero, animTime) {
  const img = SPRITES[hero.id];
  const speed = Math.abs(p.vx);
  const isMoving = speed > 18;
  const bob = !p.onGround ? 0 : isMoving ? Math.abs(Math.sin(animTime * 14)) * 3.5 : 0;
  const breathe = p.onGround && !isMoving ? Math.sin(animTime * 3) * 0.018 : 0;
  const tilt = !p.onGround ? Math.max(-0.14, Math.min(0.14, p.vy * 0.00022)) : isMoving ? 0.055 : 0;
  const footX = p.x + p.w / 2;
  const footY = p.y + p.h;

  // Ground contact shadow
  if (p.onGround) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.36)";
    ctx.beginPath();
    ctx.ellipse(footX, footY + 1, 18, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(footX, footY - bob);
  ctx.scale(p.facing, 1);
  ctx.rotate(tilt);

  if (img && img.complete && img.naturalWidth > 0) {
    const dh = hero.renderH * (1 + breathe);
    const dw = dh * (img.naturalWidth / img.naturalHeight);
    if (spectrumEnabled) {
      const hue = (animTime * 120) % 360;
      ctx.shadowColor = `hsl(${hue}, 90%, 62%)`;
      ctx.shadowBlur = 14;
    } else {
      ctx.shadowColor = state.dim === "2D" ? "rgba(245,240,230,0.35)" : "rgba(56,163,165,0.4)";
      ctx.shadowBlur = 6;
    }
    ctx.drawImage(img, -dw / 2, -dh, dw, dh);
  } else {
    // Clean Option A geometric fallback until sprite finishes loading
    ctx.fillStyle = state.dim === "2D" ? "#111111" : "#1f1d1b";
    ctx.strokeStyle = spectrumEnabled ? "#66d2d4" : hero.rimColor;
    ctx.lineWidth = 2;
    ctx.fillRect(-p.w / 2, -p.h, p.w, p.h - 4);
    ctx.strokeRect(-p.w / 2, -p.h, p.w, p.h - 4);
  }
  ctx.restore();
}

function drawPaleDraughtsmanFog(animTime) {
  const fogGrad = ctx.createLinearGradient(state.fogX - 280, 0, state.fogX + 46, 0);
  fogGrad.addColorStop(0, "rgba(145,148,154,0.95)");
  fogGrad.addColorStop(0.65, "rgba(154,154,154,0.72)");
  fogGrad.addColorStop(1, "rgba(154,154,154,0.0)");
  ctx.fillStyle = fogGrad;
  ctx.fillRect(state.fogX - 300, 0, 346, canvas.height);

  // Faint #9A9A9A architectural graphite gridlines radiating around The Pale Draughtsman
  const bossX = state.fogX - 72;
  const hoverY = Math.sin(animTime * 2.2) * 7;
  ctx.save();
  ctx.strokeStyle = "rgba(216, 223, 230, 0.24)";
  ctx.lineWidth = 1;
  for (let gx = bossX - 130; gx <= bossX + 90; gx += 28) {
    ctx.beginPath();
    ctx.moveTo(gx, 50);
    ctx.lineTo(gx, canvas.height - 20);
    ctx.stroke();
  }
  for (let gy = 90; gy <= canvas.height - 40; gy += 32) {
    ctx.beginPath();
    ctx.moveTo(bossX - 150, gy + hoverY);
    ctx.lineTo(bossX + 95, gy + hoverY);
    ctx.stroke();
  }

  const bossImg = SPRITES.pale_draughtsman;
  if (bossImg && bossImg.complete && bossImg.naturalWidth > 0) {
    const bh = 258;
    const bw = bh * (bossImg.naturalWidth / bossImg.naturalHeight);
    ctx.globalAlpha = 0.94;
    ctx.shadowColor = "rgba(216, 223, 230, 0.45)";
    ctx.shadowBlur = 14;
    ctx.drawImage(bossImg, bossX - bw / 2, GROUND_Y + 28 - bh + hoverY, bw, bh);
  }
  ctx.restore();
}

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function setSelectedHero(heroId) {
  if (!HEROES[heroId]) return;
  selectedHeroId = heroId;
  localStorage.setItem("sketchic_game_hero", heroId);
  syncHeroUi();
}

function syncHeroUi() {
  const hero = HEROES[selectedHeroId] || HEROES.ink_knight;
  if (hudHeroImg) hudHeroImg.src = hero.portrait;
  if (hudHeroName) hudHeroName.textContent = hero[lang];
  if (heroRoster) {
    heroRoster.querySelectorAll(".hero-card").forEach((btn) => {
      const id = btn.getAttribute("data-hero");
      const active = id === selectedHeroId;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
      const lbl = btn.querySelector("[data-hero-label]");
      if (lbl && HEROES[id]) lbl.textContent = HEROES[id][lang];
    });
  }
}

function applyGameLang(nextLang) {
  lang = nextLang;
  localStorage.setItem("sketchic_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  gameLangBtn.textContent = lang === "ar" ? "EN" : "AR";
  const dict = GI18N[lang];
  document.querySelectorAll("[data-gi18n]").forEach((el) => {
    const k = el.getAttribute("data-gi18n");
    if (dict[k]) el.textContent = dict[k];
  });
  syncHeroUi();
  updateHud();
  renderLoreList();
}

function renderLoreList() {
  loreList.innerHTML = "";
  unlockedCodes.forEach((code) => {
    const entry = LORE_CODES[code];
    if (!entry) return;
    const div = document.createElement("div");
    div.className = "lore-entry";
    const strong = document.createElement("strong");
    strong.textContent = entry[lang][0];
    const p = document.createElement("p");
    p.textContent = entry[lang][1];
    div.appendChild(strong);
    div.appendChild(p);
    loreList.appendChild(div);
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") keys.jump = true;
  if (e.key === "Shift" || e.key === "e" || e.key === "E") toggleDimension();
  if (e.key === "f" || e.key === "F") drawInkBridge();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") keys.jump = false;
});

document.querySelectorAll("[data-key]").forEach((btn) => {
  const k = btn.getAttribute("data-key");
  const down = () => (keys[k] = true);
  const up = () => (keys[k] = false);
  btn.addEventListener("pointerdown", down);
  btn.addEventListener("pointerup", up);
  btn.addEventListener("pointerleave", up);
});

document.getElementById("touchShiftBtn").addEventListener("click", toggleDimension);
document.getElementById("touchBridgeBtn").addEventListener("click", drawInkBridge);

startGameBtn.addEventListener("click", startRunWithIntro);
skipCutsceneBtn.addEventListener("click", beginGameplay);
restartBtn.addEventListener("click", () => {
  buildLevel();
  beginGameplay();
});
gameLangBtn.addEventListener("click", () => applyGameLang(lang === "ar" ? "en" : "ar"));
spectrumSkinToggle.addEventListener("change", () => {
  spectrumEnabled = spectrumSkinToggle.checked;
});

loreVaultBtn.addEventListener("click", () => {
  loreModal.hidden = false;
  renderLoreList();
});
loreCloseBtn.addEventListener("click", () => (loreModal.hidden = true));
loreBackdrop.addEventListener("click", () => (loreModal.hidden = true));
loreForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = loreInput.value.trim().toUpperCase();
  const d = GI18N[lang];
  if (LORE_CODES[code]) {
    if (!unlockedCodes.includes(code)) {
      unlockedCodes.push(code);
      localStorage.setItem("sketchic_lore_codes", JSON.stringify(unlockedCodes));
    }
    spectrumEnabled = true;
    spectrumSkinToggle.checked = true;
    loreFeedback.textContent = d.codeValid;
    loreInput.value = "";
    renderLoreList();
    updateHud();
  } else {
    loreFeedback.textContent = d.codeInvalid;
  }
});

if (hudHeroBtn) {
  hudHeroBtn.addEventListener("click", () => {
    const idx = HERO_ORDER.indexOf(selectedHeroId);
    setSelectedHero(HERO_ORDER[(idx + 1) % HERO_ORDER.length]);
  });
}
if (heroRoster) {
  heroRoster.querySelectorAll(".hero-card").forEach((btn) => {
    btn.addEventListener("click", () => setSelectedHero(btn.getAttribute("data-hero")));
  });
}

buildLevel();
applyGameLang(lang);
showOverlay("title");
requestAnimationFrame(loop);
