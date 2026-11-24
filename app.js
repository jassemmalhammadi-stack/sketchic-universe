const SHOW_CONVERGENCE = false;

const I18N = {
  ar: {
    brandSub: "عالم سكتشيك",
    navFilms: "الأفلام",
    navComics: "القصص المصورة",
    navLaws: "القوانين الكونية",
    navChars: "الشخصيات والأدوات",
    navVoices: "الأصوات المثبتة",
    navPlay: "اللعبة 🎮",
    navStudio: "استوديو Flow",
    navYoutube: "@sketchic-net",
    heroBadge: "الإصدار الرسمي المعتمد • Google Flow Cinema",
    heroTitle: "حيث تصطدم خطوط الحبر بالسينما الواقعية",
    heroDesc:
      "عالم سينمائي هجين يجمع بين الرسومات اليدوية ثنائية الأبعاد (الحبر، الفحم، الألوان المائية، التطريز، والزجاج الملوّن) والبيئات الواقعية الملموسة — حيث تحافظ كل خامة على روحها الأصلية تحت إضاءة الغروب والفوانيس.",
    heroWatch: "استكشف كتالوج الأفلام",
    heroComics: "اقرأ القصص المصورة",
    heroPlay: "العب الديمو 🎮",
    heroLaws: "دستور العالم الكوني",
    statFilms: "عوالم وأفلام معتمدة",
    statFilmsFinale: "أفلام الموسم الأول",
    statFormats: "نسخ سينمائية وشورتس",
    statChars: "شخصيات وأدوات مثبتة",
    filmsKicker: "01 / الكتالوج الرسمي",
    filmsTitle: "العوالم الخمسة المعتمدة",
    filmsTitleFinale: "أفلام الموسم الأول الستة",
    filmsSub:
      "اختر بين النسخة السينمائية الكاملة (16:9) أو نسخة الشورتس العمودية (9:16) للمشاهدة الفورية داخل المشغّل.",
    watchFull: "مشاهدة الفيلم (16:9)",
    watchShorts: "شورتس (9:16)",
    readComicBtn: "القصة المصورة 📖",
    storyboardBtn: "مشاهد الدستور (6)",
    openFlow: "فتح المشروع في Google Flow ↗",
    openFlowScene: "فتح المشهد المجمّع ↗",
    comicsKicker: "02 / قصص عالم سكتشيك المصورة",
    comicsTitle: "مكتبة الكوميكس التفاعلية",
    comicsSub:
      "سلسلة قصص مصورة تجمع لوحات الحبر والواقعية فوق صفحات ورق سكتش تفاعلية مع تبديل فوري بين العربية والإنجليزية.",
    comicPilotRibbon: "#01 • عدد نموذجي",
    comicTagPilot: "العدد النموذجي الأول",
    comicTagLength: "4 صفحات • 8 إطارات",
    comicTagBilingual: "عربي ⇄ EN",
    readIssue1Btn: "اقرأ العدد الأول تفاعلياً",
    printComicBtn: "طباعة / حفظ PDF",
    comicsRoadmapLabel: "مكتبة أعداد الموسمين الأول والثاني",
    comicComingSoon: "قيد التحبير • قريباً",
    comicViewPages: "الصفحات",
    comicViewScroll: "تمرير كامل",
    comicCleanArt: "لوحات صافية",
    comicPrintShort: "طباعة / PDF",
    comicPrevPage: "الصفحة السابقة",
    comicNextPage: "الصفحة التالية",
    comicDirHint: "اتجاه القراءة: من اليمين إلى اليسار ←",
    lawsKicker: "03 / الدستور الموحّد",
    lawsTitle: "القوانين الكونية لعالم سكتشيك",
    lawsSub: "ثلاث قواعد بصرية وسردية تحكم كل مشهد يتم إنتاجه داخل عالم Sketchic Universe.",
    charsKicker: "04 / الشخصيات والأدوات المثبّتة",
    charsTitle: "أرشيف الأبطال والعناصر المرجعية",
    charsSub: "الشخصيات والأدوات المعتمَدة في Google Flow للحفاظ على الاتساق البصري عبر جميع المشاهد.",
    filterAllLabel: "الكل",
    canonCardBtn: "بطاقة Canon / Prompt",
    voicesKicker: "05 / الأصوات المثبّتة",
    voicesTitle: "سجل أصوات الشخصيات في Google Flow",
    voicesSub:
      "الأصوات الرسمية المعتمدة لبطاقات الشخصيات لضمان ثبات النبرة والأداء الصوتي عبر جميع العوالم والمشاهد.",
    voicesSubFinale:
      "الأصوات الرسمية المعتمدة لبطاقات الشخصيات لضمان ثبات النبرة والأداء الصوتي عبر جميع الحلقات وتقاطع العوالم.",
    studioKicker: "06 / الهوية والإنتاج",
    studioTitle: "صُنع في Google Flow",
    studioDesc:
      "تُنتج أفلام Sketchic Universe عبر خطوط إنتاج Google Flow السينمائية باستخدام بطاقات الشخصيات والأصوات والأدوات المرجعية (Characters, Voices & Ingredients) لضمان وحدة الأسلوب، الإضاءة، وملمس الرسم اليدوي في كل لقطة.",
    studioYtBtn: "اشترك في قناة YouTube الرسمية",
    studioRewatch: "العودة إلى الأفلام",
    footerTag: "Sketchic Universe — عالم سكتشيك السينمائي",
    copyPrompt: "نسخ الأمر",
    copiedPrompt: "تم النسخ ✓",
    comicAvailableBadge: "متاح للقراءة • 4 صفحات",
    readComicShort: "اقرأ العدد 📖",
    seasonAll: "جميع المواسم",
    season1Label: "الموسم 1",
    season2Label: "الموسم 2 — أثر الفنان",
    season3Label: "الموسم 3 — العالم الرقمي",
  },
  en: {
    brandSub: "Sketchic Universe",
    navFilms: "Films",
    navComics: "Illustrated Comics",
    navLaws: "Cosmic Laws",
    navChars: "Characters & Props",
    navVoices: "Flow Voices",
    navPlay: "Mini-Game 🎮",
    navStudio: "Flow Studio",
    navYoutube: "@sketchic-net",
    heroBadge: "Official Universe Release • Google Flow Cinema",
    heroTitle: "Where Hand-Drawn Ink Collides with Live-Action Cinema",
    heroDesc:
      "A hybrid cinematic universe uniting 2D hand-drawn ink, charcoal, watercolor, embroidery, and stained-glass art with tactile photorealistic worlds — preserving every medium's raw texture under golden hour sunbeams and lantern light.",
    heroWatch: "Explore the Film Catalog",
    heroComics: "Read Illustrated Comics",
    heroPlay: "Play Mini-Game 🎮",
    heroLaws: "Read the Cosmic Laws",
    statFilms: "Official Worlds & Films",
    statFilmsFinale: "Season 1 Short Films",
    statFormats: "Cinema & Shorts Cuts",
    statChars: "Canonical Ingredients",
    filmsKicker: "01 / Official Catalog",
    filmsTitle: "The Five Canonical Worlds",
    filmsTitleFinale: "Season 1 — Six Canonical Films",
    filmsSub:
      "Switch seamlessly between the 16:9 widescreen Full Film and the 9:16 vertical Shorts cut right inside the theater player.",
    watchFull: "Watch Full Film (16:9)",
    watchShorts: "Shorts Cut (9:16)",
    readComicBtn: "Read Comic 📖",
    storyboardBtn: "Storyboard (6)",
    openFlow: "Open Project in Google Flow ↗",
    openFlowScene: "Open Assembled Scene ↗",
    comicsKicker: "02 / Sketchic Comics",
    comicsTitle: "Interactive Illustrated Comics",
    comicsSub:
      "Hybrid 2D-ink & live-action comic issues presented on cream sketchbook pages with instant Arabic / English switching.",
    comicPilotRibbon: "#01 • PILOT",
    comicTagPilot: "Pilot Issue #01",
    comicTagLength: "4 Pages • 8 Panels",
    comicTagBilingual: "EN ⇄ AR",
    readIssue1Btn: "Read Issue #01 Interactive",
    printComicBtn: "Print / Save PDF",
    comicsRoadmapLabel: "Season 1 & Season 2 Comic Issues",
    comicComingSoon: "Inking • Coming Soon",
    comicViewPages: "Pages",
    comicViewScroll: "Full Scroll",
    comicCleanArt: "Clean Art",
    comicPrintShort: "Print / PDF",
    comicPrevPage: "Previous Page",
    comicNextPage: "Next Page",
    comicDirHint: "Reading Flow: Left to Right →",
    lawsKicker: "03 / Master Bible",
    lawsTitle: "Cosmic Laws of Sketchic Universe",
    lawsSub: "Three visual and narrative rules governing every scene produced in the Sketchic Universe.",
    charsKicker: "04 / Canonical Ingredients",
    charsTitle: "Characters & Artifacts Archive",
    charsSub: "Reference characters and tools locked for Google Flow to preserve visual continuity across scenes.",
    filterAllLabel: "All",
    canonCardBtn: "Canon Card / Prompt",
    voicesKicker: "05 / Locked Voices",
    voicesTitle: "Google Flow Character Voices",
    voicesSub:
      "Official voice bindings locked per character card to preserve vocal consistency across all worlds and scenes.",
    voicesSubFinale:
      "Official voice bindings locked per character card to preserve vocal consistency across all episodes and the Season 1 convergence.",
    studioKicker: "06 / Identity & Production",
    studioTitle: "Crafted in Google Flow",
    studioDesc:
      "Sketchic Universe films are produced in Google Flow pipelines using locked character, voice, and prop Ingredients to guarantee consistent line-art, lighting, and tactile craft in every frame.",
    studioYtBtn: "Subscribe on Official YouTube",
    studioRewatch: "Back to Films",
    footerTag: "Sketchic Universe — Hybrid Cinema Studio",
    copyPrompt: "Copy Prompt",
    copiedPrompt: "Copied ✓",
    comicAvailableBadge: "Available • 4 Pages",
    readComicShort: "Read Issue 📖",
    seasonAll: "All Seasons",
    season1Label: "Season 1",
    season2Label: "Season 2 — Traces of the Maker",
    season3Label: "Season 3 — The Digital Canvas",
  },
};

let canonDb = window.SKETCHIC_CANON_DB || null;
let canonSourceMode = "bundle";
let FILMS = {};
let COMICS = {};

let currentLang = localStorage.getItem("sketchic_lang") || "ar";
let activeSeasonFilter = "all";
let activeCharFilter = "all";
let activeFilmKey = null;
let activeFormat = "16:9";
let activeSubLang = currentLang;
let activeComicKey = null;
let activeComicPageIndex = 0;
let comicViewMode = "page";
let comicCleanArt = false;

const langToggle = document.getElementById("langToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");
const filmsFilterBar = document.getElementById("filmsFilterBar");
const filmsGrid = document.getElementById("filmsGrid");
const comicFeatured = document.getElementById("comicFeatured");
const comicsSeriesGrid = document.getElementById("comicsSeriesGrid");
const lawsGrid = document.getElementById("lawsGrid");
const charsFilterBar = document.getElementById("charsFilterBar");
const charsGrid = document.getElementById("charsGrid");
const voicesGrid = document.getElementById("voicesGrid");
const canonDbStatusText = document.getElementById("canonDbStatusText");

const cinemaModal = document.getElementById("cinemaModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalVideo = document.getElementById("modalVideo");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const cinemaStage = document.getElementById("cinemaStage");

const comicModal = document.getElementById("comicModal");
const comicBackdrop = document.getElementById("comicBackdrop");
const comicModalClose = document.getElementById("comicModalClose");
const comicModalTitle = document.getElementById("comicModalTitle");
const comicPageIndicator = document.getElementById("comicPageIndicator");
const comicStage = document.getElementById("comicStage");
const comicFooter = document.getElementById("comicFooter");
const comicPagePills = document.getElementById("comicPagePills");
const comicPrevBtn = document.getElementById("comicPrevBtn");
const comicNextBtn = document.getElementById("comicNextBtn");
const comicCleanArtBtn = document.getElementById("comicCleanArtBtn");
const comicLangBtn = document.getElementById("comicLangBtn");
const comicPrintBtn = document.getElementById("comicPrintBtn");

const canonModal = document.getElementById("canonModal");
const canonBackdrop = document.getElementById("canonBackdrop");
const canonModalClose = document.getElementById("canonModalClose");
const canonModalKicker = document.getElementById("canonModalKicker");
const canonModalTitle = document.getElementById("canonModalTitle");
const canonModalBody = document.getElementById("canonModalBody");

function isConvergenceUnlocked() {
  return Boolean(SHOW_CONVERGENCE || (canonDb && canonDb.meta && canonDb.meta.showConvergence));
}

function isSeason2Unlocked() {
  return Boolean(canonDb && canonDb.meta && canonDb.meta.showSeason2);
}

function isSeason3Unlocked() {
  return Boolean(canonDb && canonDb.meta && canonDb.meta.showSeason3);
}

function getVisibleWorlds() {
  if (!canonDb || !Array.isArray(canonDb.worlds)) return [];
  const showAll = isConvergenceUnlocked();
  const showS2 = isSeason2Unlocked();
  const showS3 = isSeason3Unlocked();
  return canonDb.worlds
    .filter((w) => {
      if (Number(w.season) >= 3) return showS3 && w.isPublic !== false;
      if (Number(w.season) === 2) return showS2 && w.isPublic !== false;
      return showAll || w.isPublic !== false;
    })
    .slice()
    .sort((a, b) => a.worldNum - b.worldNum);
}

function getVisibleCatalogCards() {
  if (!canonDb) return [];
  const showAll = isConvergenceUnlocked();
  const chars = (canonDb.characters || [])
    .filter((c) => showAll || c.isPublic !== false)
    .map((c) => Object.assign({}, c, { entityType: "character" }));
  const ings = (canonDb.ingredients || [])
    .filter((i) => showAll || i.isPublic !== false)
    .map((i) => Object.assign({}, i, { entityType: "ingredient" }));
  return chars.concat(ings).sort((a, b) => a.cardOrder - b.cardOrder);
}

function getVisibleComics() {
  if (!canonDb || !Array.isArray(canonDb.comics)) return [];
  const showAll = isConvergenceUnlocked();
  return canonDb.comics.filter((c) => showAll || c.isPublic !== false);
}

function getWorldById(worldId) {
  if (!canonDb || !Array.isArray(canonDb.worlds)) return null;
  return canonDb.worlds.find((w) => w.id === worldId) || null;
}

function getWorldBySlug(slug) {
  return getVisibleWorlds().find((w) => w.slug === slug) || null;
}

function getVoiceById(voiceId) {
  if (!canonDb || !Array.isArray(canonDb.voices)) return null;
  return canonDb.voices.find((v) => v.id === voiceId) || null;
}

function rebuildRegistriesFromCanon() {
  FILMS = {};
  getVisibleWorlds().forEach((w) => {
    FILMS[w.slug] = {
      titleAr: w.titleAr,
      titleEn: w.titleEn,
      full: w.webFullVideoPath,
      shorts: w.webShortsVideoPath,
      subtitles: {
        full: {
          ar: w.webFullSubArPath || "",
          en: w.webFullSubEnPath || "",
        },
        shorts: {
          ar: w.webShortsSubArPath || "",
          en: w.webShortsSubEnPath || "",
        },
      },
    };
  });

  COMICS = {};
  getVisibleComics().forEach((c) => {
    if (!Array.isArray(c.pages) || c.pages.length === 0) return;
    COMICS[c.slug] = {
      issueNum: c.issueNum,
      titleAr: c.titleAr,
      titleEn: c.titleEn,
      pages: c.pages.map((pg) => {
        if (pg.layout === "cover") {
          return {
            id: pg.pageKey || pg.id,
            layout: pg.layout,
            labelAr: pg.labelAr,
            labelEn: pg.labelEn,
            image: pg.coverImage,
            masthead: pg.masthead || "SKETCHIC COMICS",
            issueBadgeAr: pg.issueBadgeAr,
            issueBadgeEn: pg.issueBadgeEn,
            titleAr: pg.coverTitleAr || c.titleAr,
            titleEn: pg.coverTitleEn || c.titleEn,
            taglineAr: pg.taglineAr,
            taglineEn: pg.taglineEn,
          };
        }
        return {
          id: pg.pageKey || pg.id,
          layout: pg.layout,
          labelAr: pg.labelAr,
          labelEn: pg.labelEn,
          panels: (pg.panels || []).map((p) => ({
            num: p.panelNum,
            image: p.imageWebPath,
            captionAr: p.captionAr,
            captionEn: p.captionEn,
            speakerAr: p.speakerAr,
            speakerEn: p.speakerEn,
            speechAr: p.speechAr,
            speechEn: p.speechEn,
            sfxAr: p.sfxAr,
            sfxEn: p.sfxEn,
            epilogueAr: p.epilogueAr,
            epilogueEn: p.epilogueEn,
          })),
        };
      }),
    };
  });
}

function padTwo(num) {
  return num < 10 ? `0${num}` : String(num);
}

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  return el;
}

function renderHeroStats() {
  const worlds = getVisibleWorlds();
  const cards = getVisibleCatalogCards();
  const unlocked = isConvergenceUnlocked();
  const dict = I18N[currentLang];

  const filmsNum = document.getElementById("statFilmsNum");
  const charsNum = document.getElementById("statCharsNum");
  if (filmsNum) filmsNum.textContent = padTwo(worlds.length);
  if (charsNum) charsNum.textContent = String(cards.length);

  const statFilmsLabel = document.querySelector('[data-i18n="statFilms"]');
  if (statFilmsLabel) {
    statFilmsLabel.textContent = unlocked ? dict.statFilmsFinale : dict.statFilms;
  }

  const filmsTitleEl = document.querySelector('[data-i18n="filmsTitle"]');
  if (filmsTitleEl) {
    filmsTitleEl.textContent = unlocked ? dict.filmsTitleFinale : dict.filmsTitle;
  }

  const voicesSubEl = document.querySelector('[data-i18n="voicesSub"]');
  if (voicesSubEl) {
    voicesSubEl.textContent = unlocked ? dict.voicesSubFinale : dict.voicesSub;
  }
}

function applySeasonFilter() {
  if (!filmsGrid) return;
  filmsGrid.querySelectorAll(".film-card").forEach((card) => {
    const season = card.getAttribute("data-season");
    card.classList.toggle("hidden", activeSeasonFilter !== "all" && season !== activeSeasonFilter);
  });
}

function renderFilmsCatalog() {
  if (!filmsGrid) return;
  const dict = I18N[currentLang];
  const isAr = currentLang === "ar";
  const worlds = getVisibleWorlds();
  const visibleComics = getVisibleComics();
  const hasSeason2 = worlds.some((w) => Number(w.season) === 2);
  const hasSeason3 = worlds.some((w) => Number(w.season) === 3);

  if (!hasSeason2 && !hasSeason3 && activeSeasonFilter !== "all") {
    activeSeasonFilter = "all";
  }

  if (filmsFilterBar) {
    filmsFilterBar.hidden = !(hasSeason2 || hasSeason3);
    filmsFilterBar.innerHTML = "";
    if (hasSeason2 || hasSeason3) {
      const s1Count = worlds.filter((w) => Number(w.season) === 1).length;
      const s2Count = worlds.filter((w) => Number(w.season) === 2).length;
      const s3Count = worlds.filter((w) => Number(w.season) === 3).length;
      const seasonOptions = [
        { key: "all", label: `${dict.seasonAll} (${worlds.length})` },
        { key: "1", label: `${dict.season1Label} (${s1Count})` },
      ];
      if (hasSeason2) {
        seasonOptions.push({ key: "2", label: `${dict.season2Label} (${s2Count})` });
      }
      if (hasSeason3) {
        seasonOptions.push({ key: "3", label: `${dict.season3Label} (${s3Count})` });
      }
      seasonOptions.forEach((opt) => {
        const btn = makeEl(
          "button",
          `filter-btn${activeSeasonFilter === opt.key ? " active" : ""}`,
          opt.label
        );
        btn.type = "button";
        btn.setAttribute("data-season-filter", opt.key);
        filmsFilterBar.appendChild(btn);
      });
    }
  }

  filmsGrid.innerHTML = "";
  worlds.forEach((w) => {
    const card = makeEl("article", `film-card${w.isFinale ? " film-card-finale" : ""}`);
    card.setAttribute("data-film", w.slug);
    card.setAttribute("data-season", String(w.season || 1));

    const preview = makeEl("div", "film-preview");
    const video = document.createElement("video");
    video.className = "film-thumb-video";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";
    if (w.webPosterPath) {
      video.poster = w.webPosterPath;
    }
    const source = document.createElement("source");
    source.src = `${w.webFullVideoPath}#t=2`;
    source.type = "video/mp4";
    video.appendChild(source);
    preview.appendChild(video);

    const overlay = makeEl("div", "film-overlay");
    const sNum = Number(w.season || 1);
    const numLabel =
      sNum >= 2
        ? w.episode === 0
          ? `S${sNum} • TEASER`
          : `S${sNum} • E${padTwo(w.episode)}`
        : padTwo(w.worldNum);
    overlay.appendChild(makeEl("span", "film-number", numLabel));
    overlay.appendChild(makeEl("span", "film-duration", w.durationBadge));
    preview.appendChild(overlay);

    const playBtn = makeEl("button", "play-trigger");
    playBtn.type = "button";
    playBtn.setAttribute("data-open-film", w.slug);
    playBtn.setAttribute("data-format", "16:9");
    playBtn.setAttribute("aria-label", `Play ${w.titleEn}`);
    playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    preview.appendChild(playBtn);

    card.appendChild(preview);

    const body = makeEl("div", "film-body");
    const tags = makeEl("div", "film-tags");
    if (hasSeason2 || hasSeason3) {
      const sTag =
        sNum >= 2
          ? w.episode === 0
            ? `S${sNum} • Trailer`
            : `S${sNum}E${padTwo(w.episode)}`
          : `S1 • #${padTwo(w.worldNum)}`;
      tags.appendChild(makeEl("span", "tag film-season-badge", sTag));
    }
    tags.appendChild(makeEl("span", `tag ${w.tagStyle}`, isAr ? w.genreAr : w.genreEn));
    tags.appendChild(makeEl("span", "tag tag-ink", w.mediumTag));
    body.appendChild(tags);

    const h3 = makeEl("h3", "film-title");
    h3.appendChild(makeEl("span", "", isAr ? w.titleAr : w.titleEn));
    if (isAr) {
      h3.appendChild(makeEl("small", "film-title-en", w.titleEn));
    }
    body.appendChild(h3);

    body.appendChild(makeEl("p", "film-logline", isAr ? w.loglineAr : w.loglineEn));

    const paletteRow = makeEl("div", "film-palette");
    (w.palettes || [])
      .filter((p) => p.showOnCard)
      .forEach((p) => {
        const swatch = makeEl("span", "swatch");
        swatch.style.background = p.hexCode;
        swatch.title = `${p.hexCode} ${isAr ? p.labelAr : p.labelEn}`;
        paletteRow.appendChild(swatch);
      });
    body.appendChild(paletteRow);

    const actions = makeEl("div", "film-actions");
    const fullBtn = makeEl("button", "btn btn-sm btn-primary", dict.watchFull);
    fullBtn.type = "button";
    fullBtn.setAttribute("data-open-film", w.slug);
    fullBtn.setAttribute("data-format", "16:9");
    actions.appendChild(fullBtn);

    const shortsBtn = makeEl("button", "btn btn-sm btn-outline", dict.watchShorts);
    shortsBtn.type = "button";
    shortsBtn.setAttribute("data-open-film", w.slug);
    shortsBtn.setAttribute("data-format", "9:16");
    actions.appendChild(shortsBtn);

    const publishedComic = visibleComics.find(
      (c) => c.worldId === w.id && Array.isArray(c.pages) && c.pages.length > 0
    );
    if (publishedComic) {
      const comicBtn = makeEl("button", "btn btn-sm btn-ghost", dict.readComicBtn);
      comicBtn.type = "button";
      comicBtn.setAttribute("data-open-comic", publishedComic.slug);
      comicBtn.setAttribute("data-comic-page", "0");
      actions.appendChild(comicBtn);
    }
    body.appendChild(actions);

    const linksRow = makeEl("div", "film-links-row");
    const flowLink = makeEl("a", "flow-link", dict.openFlow);
    flowLink.href = w.flowProjectUrl;
    flowLink.target = "_blank";
    flowLink.rel = "noopener noreferrer";
    linksRow.appendChild(flowLink);

    const sceneCount = Array.isArray(w.scenes) ? w.scenes.length : 0;
    const sbLabel = isAr ? `مشاهد الدستور (${sceneCount})` : `Storyboard (${sceneCount})`;
    const sbBtn = makeEl("button", "btn-storyboard", sbLabel);
    sbBtn.type = "button";
    sbBtn.setAttribute("data-open-canon-world", w.slug);
    linksRow.appendChild(sbBtn);

    body.appendChild(linksRow);
    card.appendChild(body);
    filmsGrid.appendChild(card);

    card.addEventListener("mouseenter", () => {
      video.play().catch(() => {});
    });
    card.addEventListener("mouseleave", () => {
      video.pause();
    });
  });

  applySeasonFilter();
}

function renderComicsCatalog() {
  const dict = I18N[currentLang];
  const isAr = currentLang === "ar";
  const comics = getVisibleComics();
  const pilot = comics.find((c) => c.status === "pilot_published");

  if (comicFeatured && pilot) {
    comicFeatured.setAttribute("data-comic", pilot.slug);
    comicFeatured.innerHTML = "";

    const coverPg = (pilot.pages || []).find((p) => p.layout === "cover") || {};
    const stage = makeEl("div", "comic-cover-stage");
    const coverBtn = makeEl("button", "comic-cover-trigger");
    coverBtn.type = "button";
    coverBtn.setAttribute("data-open-comic", pilot.slug);
    coverBtn.setAttribute("data-comic-page", "0");
    coverBtn.setAttribute("aria-label", `Read Issue ${pilot.issueNum}: ${pilot.titleEn}`);

    const bookFrame = makeEl("div", "comic-book-frame");
    const coverImg = document.createElement("img");
    coverImg.src = coverPg.coverImage || "";
    coverImg.alt = `Sketchic Comics Issue ${pilot.issueNum} — ${pilot.titleEn} Cover`;
    coverImg.className = "comic-cover-img";
    bookFrame.appendChild(coverImg);

    const coverOverlay = makeEl("div", "comic-cover-overlay");
    coverOverlay.appendChild(makeEl("span", "comic-masthead", coverPg.masthead || "SKETCHIC COMICS"));
    coverOverlay.appendChild(makeEl("span", "comic-issue-ribbon", dict.comicPilotRibbon));

    const titleBox = makeEl("div", "comic-cover-title-box");
    titleBox.appendChild(makeEl("span", "comic-cover-title-ar", isAr ? pilot.titleAr : pilot.titleEn));
    titleBox.appendChild(makeEl("span", "comic-cover-title-en", pilot.titleEn.toUpperCase()));
    coverOverlay.appendChild(titleBox);

    bookFrame.appendChild(coverOverlay);
    coverBtn.appendChild(bookFrame);
    stage.appendChild(coverBtn);
    comicFeatured.appendChild(stage);

    const info = makeEl("div", "comic-featured-info");
    const infoTags = makeEl("div", "film-tags");
    infoTags.appendChild(makeEl("span", "tag tag-gold", dict.comicTagPilot));
    infoTags.appendChild(makeEl("span", "tag tag-ink", dict.comicTagLength));
    infoTags.appendChild(makeEl("span", "tag tag-teal", dict.comicTagBilingual));
    info.appendChild(infoTags);

    const titleEl = makeEl("h3", "comic-featured-title");
    titleEl.appendChild(makeEl("span", "", isAr ? pilot.titleAr : pilot.titleEn));
    titleEl.appendChild(makeEl("small", "film-title-en", `Issue ${pilot.issueNum} — ${pilot.titleEn}`));
    info.appendChild(titleEl);

    info.appendChild(makeEl("p", "comic-featured-desc", isAr ? pilot.summaryAr : pilot.summaryEn));

    const miniStrip = makeEl("div", "comic-mini-strip");
    miniStrip.setAttribute("aria-label", "Preview Panels");
    const storyPages = (pilot.pages || []).filter((p) => p.layout !== "cover");
    storyPages.forEach((sp, idx) => {
      const panels = sp.panels || [];
      const previewPanel = idx === storyPages.length - 1 ? panels[panels.length - 1] : panels[0];
      if (!previewPanel) return;
      const thumbBtn = makeEl("button", "comic-mini-thumb");
      thumbBtn.type = "button";
      thumbBtn.setAttribute("data-open-comic", pilot.slug);
      thumbBtn.setAttribute("data-comic-page", String(sp.pageIndex));
      thumbBtn.title = `Page ${sp.pageIndex} Preview`;
      const img = document.createElement("img");
      img.src = previewPanel.imageWebPath;
      img.alt = `Panel ${previewPanel.panelNum} Preview`;
      thumbBtn.appendChild(img);
      thumbBtn.appendChild(makeEl("span", "mini-badge", `P.0${sp.pageIndex}`));
      miniStrip.appendChild(thumbBtn);
    });
    info.appendChild(miniStrip);

    const infoActions = makeEl("div", "comic-featured-actions");
    const readBtn = makeEl("button", "btn btn-primary", dict.readIssue1Btn);
    readBtn.type = "button";
    readBtn.setAttribute("data-open-comic", pilot.slug);
    readBtn.setAttribute("data-comic-page", "0");
    infoActions.appendChild(readBtn);

    const printBtn = makeEl("button", "btn btn-outline", dict.printComicBtn);
    printBtn.type = "button";
    printBtn.setAttribute("data-print-comic", pilot.slug);
    infoActions.appendChild(printBtn);

    info.appendChild(infoActions);
    comicFeatured.appendChild(info);
  }

  if (comicsSeriesGrid) {
    comicsSeriesGrid.innerHTML = "";
    comics
      .filter((c) => c.status !== "pilot_published")
      .forEach((c) => {
        const isFinale = c.status === "hidden_finale" || c.status === "finale_ready";
        const isAvailable = Array.isArray(c.pages) && c.pages.length > 0;
        const coverPg = isAvailable ? c.pages.find((p) => p.layout === "cover") || c.pages[0] : null;
        const card = makeEl(
          "article",
          `comic-upcoming-card${isFinale ? " comic-upcoming-finale" : ""}${isAvailable ? " is-available" : ""}`
        );

        if (isAvailable && coverPg && coverPg.coverImage) {
          const thumbBtn = makeEl("button", "comic-card-thumb");
          thumbBtn.type = "button";
          thumbBtn.setAttribute("data-open-comic", c.slug);
          thumbBtn.setAttribute("data-comic-page", "0");
          thumbBtn.setAttribute("aria-label", `Read Issue ${c.issueNum}: ${c.titleEn}`);
          const coverImg = document.createElement("img");
          coverImg.src = coverPg.coverImage;
          coverImg.alt = `${c.titleEn} Cover`;
          thumbBtn.appendChild(coverImg);
          card.appendChild(thumbBtn);
        }

        const top = makeEl("div", "comic-upcoming-top");
        top.appendChild(makeEl("span", "comic-issue-num", c.issueNum));
        const statusLabel = isAvailable
          ? dict.comicAvailableBadge
          : isFinale
          ? isAr
            ? "ختام الموسم الأول"
            : "Season 1 Finale"
          : dict.comicComingSoon;
        top.appendChild(makeEl("span", `tag ${c.tagStyle}`, statusLabel));
        card.appendChild(top);

        const h4 = document.createElement("h4");
        h4.appendChild(makeEl("span", "", isAr ? c.titleAr : c.titleEn));
        if (isAr) {
          h4.appendChild(makeEl("small", "", c.titleEn));
        }
        card.appendChild(h4);

        card.appendChild(makeEl("p", "", isAr ? c.summaryAr : c.summaryEn));
        card.appendChild(makeEl("span", "tag tag-ink", c.mediumTag));

        if (isAvailable) {
          const cardActions = makeEl("div", "comic-card-actions");
          const openBtn = makeEl("button", "btn btn-sm btn-primary", dict.readComicShort);
          openBtn.type = "button";
          openBtn.setAttribute("data-open-comic", c.slug);
          openBtn.setAttribute("data-comic-page", "0");
          cardActions.appendChild(openBtn);

          const pdfBtn = makeEl("button", "btn btn-sm btn-outline", "PDF");
          pdfBtn.type = "button";
          pdfBtn.setAttribute("data-print-comic", c.slug);
          cardActions.appendChild(pdfBtn);
          card.appendChild(cardActions);
        }

        comicsSeriesGrid.appendChild(card);
      });
  }
}

function renderCosmicLaws() {
  if (!lawsGrid || !canonDb || !Array.isArray(canonDb.cosmicLaws)) return;
  const isAr = currentLang === "ar";
  lawsGrid.innerHTML = "";
  canonDb.cosmicLaws
    .slice()
    .sort((a, b) => a.lawNum - b.lawNum)
    .forEach((law) => {
      const card = makeEl("div", "law-card");
      card.appendChild(makeEl("div", "law-index", padTwo(law.lawNum)));
      card.appendChild(makeEl("h3", "", isAr ? law.titleAr : law.titleEn));
      card.appendChild(makeEl("p", "", isAr ? law.descriptionAr : law.descriptionEn));
      lawsGrid.appendChild(card);
    });
}

function applyCharFilter() {
  if (!charsGrid) return;
  charsGrid.querySelectorAll(".char-card").forEach((card) => {
    const group = card.getAttribute("data-film-group");
    card.classList.toggle("hidden", activeCharFilter !== "all" && group !== activeCharFilter);
  });
}

function renderCatalogCards() {
  const dict = I18N[currentLang];
  const isAr = currentLang === "ar";
  const worlds = getVisibleWorlds();
  const cards = getVisibleCatalogCards();

  if (activeCharFilter !== "all" && !worlds.some((w) => w.slug === activeCharFilter)) {
    activeCharFilter = "all";
  }

  if (charsFilterBar) {
    charsFilterBar.innerHTML = "";
    const allBtn = makeEl(
      "button",
      `filter-btn${activeCharFilter === "all" ? " active" : ""}`,
      `${dict.filterAllLabel} (${cards.length})`
    );
    allBtn.type = "button";
    allBtn.setAttribute("data-filter", "all");
    charsFilterBar.appendChild(allBtn);

    worlds.forEach((w) => {
      const btn = makeEl(
        "button",
        `filter-btn${activeCharFilter === w.slug ? " active" : ""}`,
        isAr ? w.titleAr : w.titleEn
      );
      btn.type = "button";
      btn.setAttribute("data-filter", w.slug);
      charsFilterBar.appendChild(btn);
    });
  }

  if (charsGrid) {
    charsGrid.innerHTML = "";
    cards.forEach((item) => {
      const homeWorld = getWorldById(item.primaryWorldId);
      const groupSlug = homeWorld ? homeWorld.slug : "";
      const card = makeEl("div", "char-card");
      card.setAttribute("data-film-group", groupSlug);
      card.setAttribute("data-canon-id", item.id);

      const top = makeEl("div", "char-top");
      top.appendChild(makeEl("span", "char-role", isAr ? item.roleAr : item.roleEn));
      const badgeCls = item.badgeStyle ? `char-film-badge ${item.badgeStyle}` : "char-film-badge";
      top.appendChild(makeEl("span", badgeCls, homeWorld ? homeWorld.titleEn : ""));
      card.appendChild(top);

      card.appendChild(makeEl("h3", "", isAr ? item.nameAr : item.nameEn));
      card.appendChild(makeEl("span", "char-en", item.nameEn));
      card.appendChild(makeEl("p", "", isAr ? item.descriptionAr : item.descriptionEn));

      const footer = makeEl("div", "char-card-footer");
      footer.appendChild(makeEl("span", "char-flow-tab", `Flow: ${item.flowTab}`));
      const inspectBtn = makeEl("button", "btn-canon-chip", dict.canonCardBtn);
      inspectBtn.type = "button";
      inspectBtn.setAttribute("data-open-canon-card", item.id);
      footer.appendChild(inspectBtn);

      card.appendChild(footer);
      charsGrid.appendChild(card);
    });
    applyCharFilter();
  }
}

function renderVoicesRegistry() {
  if (!voicesGrid || !canonDb) return;
  const isAr = currentLang === "ar";
  const showAll = isConvergenceUnlocked();
  const visibleWorldIds = new Set(getVisibleWorlds().map((w) => w.id));

  voicesGrid.innerHTML = "";
  (canonDb.voiceBindings || [])
    .filter((vb) => showAll || visibleWorldIds.has(vb.worldId))
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((vb) => {
      const voice = getVoiceById(vb.voiceId);
      const world = getWorldById(vb.worldId);
      const card = makeEl("div", "voice-card");

      const header = makeEl("div", "voice-header");
      header.appendChild(makeEl("span", "voice-char", vb.displayCharEn));
      header.appendChild(makeEl("span", "voice-name-chip", voice ? voice.voiceName : vb.voiceId));
      card.appendChild(header);

      card.appendChild(
        makeEl("span", "voice-film", world ? (isAr ? world.titleAr : world.titleEn) : vb.worldId)
      );
      card.appendChild(makeEl("p", "voice-trait", isAr ? vb.traitAr : vb.traitEn));
      voicesGrid.appendChild(card);
    });
}

function renderCanonStatusBadge() {
  if (!canonDbStatusText || !canonDb || !canonDb.meta) return;
  const isAr = currentLang === "ar";
  const worlds = getVisibleWorlds();
  const cards = getVisibleCatalogCards();
  const scenesCount = worlds.reduce((acc, w) => acc + (w.scenes ? w.scenes.length : 0), 0);
  const srcLabel = canonSourceMode === "api" ? "Live API" : isAr ? "حزمة متزامنة" : "Local Sync";
  canonDbStatusText.textContent = isAr
    ? `Sketchic Canon DB v${canonDb.meta.dbVersion} • ${worlds.length} عوالم • ${cards.length} بطاقة • ${scenesCount} مشهد (${srcLabel})`
    : `Sketchic Canon DB v${canonDb.meta.dbVersion} • ${worlds.length} Worlds • ${cards.length} Cards • ${scenesCount} Scenes (${srcLabel})`;
}

function renderAllFromCanon() {
  if (!canonDb) return;
  rebuildRegistriesFromCanon();
  renderHeroStats();
  renderFilmsCatalog();
  renderComicsCatalog();
  renderCosmicLaws();
  renderCatalogCards();
  renderVoicesRegistry();
  renderCanonStatusBadge();
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("sketchic_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  langToggle.querySelector(".lang-pill").textContent = lang === "ar" ? "EN" : "AR";
  if (comicLangBtn) {
    comicLangBtn.textContent = lang === "ar" ? "EN" : "AR";
  }

  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  renderAllFromCanon();

  if (activeSubLang !== "off") {
    activeSubLang = lang;
  }
  syncModalTextTracks();

  if (!cinemaModal.hidden && activeFilmKey) {
    updateModalHeader();
  }
  if (comicModal && !comicModal.hidden && activeComicKey) {
    renderComicReader();
  }
}

langToggle.addEventListener("click", () => {
  applyLanguage(currentLang === "ar" ? "en" : "ar");
});

mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Cinema Modal Player
function updateModalHeader() {
  const film = FILMS[activeFilmKey];
  if (!film) return;
  modalTitle.textContent = currentLang === "ar" ? `${film.titleAr} — ${film.titleEn}` : film.titleEn;
  modalSubtitle.textContent = activeFormat === "16:9" ? "16:9 Full Film" : "9:16 Vertical Shorts";
}

function clearModalTracks() {
  modalVideo.querySelectorAll("track").forEach((t) => t.remove());
}

function syncModalTextTracks() {
  document.querySelectorAll("[data-modal-sub]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-modal-sub") === activeSubLang);
  });
  const tracks = modalVideo.textTracks;
  if (!tracks) return;
  for (let i = 0; i < tracks.length; i += 1) {
    const tr = tracks[i];
    tr.mode = activeSubLang !== "off" && tr.language === activeSubLang ? "showing" : "hidden";
  }
}

function loadModalVideo() {
  const film = FILMS[activeFilmKey];
  if (!film) return;
  const isFull = activeFormat === "16:9";
  const src = isFull ? film.full : film.shorts;
  const subMap = film.subtitles ? (isFull ? film.subtitles.full : film.subtitles.shorts) : {};

  clearModalTracks();
  cinemaStage.classList.toggle("shorts", activeFormat === "9:16");
  modalVideo.src = src;

  const trackSpecs = [
    { lang: "ar", label: "العربية", src: subMap && subMap.ar },
    { lang: "en", label: "English", src: subMap && subMap.en },
  ];
  trackSpecs.forEach((spec) => {
    if (!spec.src) return;
    const track = document.createElement("track");
    track.kind = "subtitles";
    track.srclang = spec.lang;
    track.label = spec.label;
    track.src = spec.src;
    if (activeSubLang === spec.lang) {
      track.default = true;
    }
    modalVideo.appendChild(track);
  });

  syncModalTextTracks();
  modalVideo.addEventListener("loadedmetadata", syncModalTextTracks, { once: true });
  modalVideo.play().catch(() => {});
  updateModalHeader();

  document.querySelectorAll("[data-modal-fmt]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-modal-fmt") === activeFormat);
  });
}

function openCinemaModal(filmKey, format = "16:9") {
  if (!FILMS[filmKey]) return;
  activeFilmKey = filmKey;
  activeFormat = format;
  cinemaModal.hidden = false;
  document.body.style.overflow = "hidden";
  loadModalVideo();
}

function closeCinemaModal() {
  modalVideo.pause();
  clearModalTracks();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  cinemaModal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-modal-fmt]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFormat = btn.getAttribute("data-modal-fmt");
    loadModalVideo();
  });
});

document.querySelectorAll("[data-modal-sub]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeSubLang = btn.getAttribute("data-modal-sub") || "ar";
    syncModalTextTracks();
  });
});

modalClose.addEventListener("click", closeCinemaModal);
modalBackdrop.addEventListener("click", closeCinemaModal);

// Interactive Bilingual Comic Reader
function buildComicCoverSheet(comic, page) {
  const isAr = currentLang === "ar";
  const sheet = document.createElement("article");
  sheet.className = "comic-page-sheet comic-sheet-cover";

  const coverWrap = document.createElement("div");
  coverWrap.className = "comic-cover-sheet-inner";

  const img = document.createElement("img");
  img.src = page.image;
  img.alt = isAr ? `${page.titleAr} — الغلاف` : `${page.titleEn} — Cover`;
  img.className = "comic-sheet-cover-img";
  coverWrap.appendChild(img);

  const scrim = document.createElement("div");
  scrim.className = "comic-cover-sheet-scrim";
  coverWrap.appendChild(scrim);

  const topBar = document.createElement("div");
  topBar.className = "comic-cover-sheet-top";

  const masthead = document.createElement("span");
  masthead.className = "comic-sheet-masthead";
  masthead.textContent = page.masthead;

  const badge = document.createElement("span");
  badge.className = "comic-sheet-issue-badge";
  badge.textContent = isAr ? page.issueBadgeAr : page.issueBadgeEn;

  topBar.appendChild(masthead);
  topBar.appendChild(badge);
  coverWrap.appendChild(topBar);

  const heroBox = document.createElement("div");
  heroBox.className = "comic-cover-sheet-titles";

  const titlePrimary = document.createElement("h4");
  titlePrimary.className = "comic-sheet-title-main";
  titlePrimary.textContent = isAr ? page.titleAr : page.titleEn;

  const titleSecondary = document.createElement("span");
  titleSecondary.className = "comic-sheet-title-sub";
  titleSecondary.textContent = isAr ? page.titleEn : page.titleAr;

  const tagline = document.createElement("p");
  tagline.className = "comic-sheet-tagline";
  tagline.textContent = isAr ? page.taglineAr : page.taglineEn;

  heroBox.appendChild(titlePrimary);
  heroBox.appendChild(titleSecondary);
  heroBox.appendChild(tagline);
  coverWrap.appendChild(heroBox);

  sheet.appendChild(coverWrap);
  return sheet;
}

function buildComicPanelElement(panel) {
  const isAr = currentLang === "ar";
  const fig = document.createElement("figure");
  fig.className = `comic-panel comic-panel-${panel.num}`;

  const img = document.createElement("img");
  img.src = panel.image;
  img.alt = isAr ? `إطار ${panel.num}` : `Panel ${panel.num}`;
  img.className = "comic-panel-img";
  fig.appendChild(img);

  const numBadge = document.createElement("span");
  numBadge.className = "comic-panel-num";
  numBadge.textContent = String(panel.num);
  fig.appendChild(numBadge);

  const captionText = isAr ? panel.captionAr : panel.captionEn;
  if (captionText) {
    const caption = document.createElement("div");
    caption.className = "comic-caption";
    caption.textContent = captionText;
    fig.appendChild(caption);
  }

  const sfxText = isAr ? panel.sfxAr : panel.sfxEn;
  if (sfxText) {
    const sfx = document.createElement("span");
    sfx.className = "comic-sfx";
    sfx.textContent = sfxText;
    fig.appendChild(sfx);
  }

  const speechText = isAr ? panel.speechAr : panel.speechEn;
  if (speechText) {
    const bubble = document.createElement("div");
    bubble.className = "comic-bubble";
    const speakerText = isAr ? panel.speakerAr : panel.speakerEn;
    if (speakerText) {
      const speaker = document.createElement("span");
      speaker.className = "comic-speaker";
      speaker.textContent = speakerText;
      bubble.appendChild(speaker);
    }
    const line = document.createElement("p");
    line.textContent = speechText;
    bubble.appendChild(line);
    fig.appendChild(bubble);
  }

  const epilogueText = isAr ? panel.epilogueAr : panel.epilogueEn;
  if (epilogueText) {
    const epilogue = document.createElement("div");
    epilogue.className = "comic-epilogue";
    epilogue.textContent = epilogueText;
    fig.appendChild(epilogue);
  }

  return fig;
}

function buildComicStorySheet(comic, page, pageIndex) {
  const isAr = currentLang === "ar";
  const sheet = document.createElement("article");
  sheet.className = "comic-page-sheet";

  const sheetHeader = document.createElement("div");
  sheetHeader.className = "comic-sheet-header";

  const issueLabel = document.createElement("span");
  issueLabel.className = "comic-sheet-running-title";
  issueLabel.textContent = isAr
    ? `SKETCHIC COMICS • ${comic.issueNum} ${comic.titleAr}`
    : `SKETCHIC COMICS • ${comic.issueNum} ${comic.titleEn}`;

  const pageLabel = document.createElement("span");
  pageLabel.className = "comic-sheet-page-num";
  pageLabel.textContent = isAr ? page.labelAr : page.labelEn;

  sheetHeader.appendChild(issueLabel);
  sheetHeader.appendChild(pageLabel);
  sheet.appendChild(sheetHeader);

  const grid = document.createElement("div");
  grid.className = `comic-panels-grid ${page.layout}`;
  page.panels.forEach((panel) => {
    grid.appendChild(buildComicPanelElement(panel));
  });
  sheet.appendChild(grid);

  const sheetFooter = document.createElement("div");
  sheetFooter.className = "comic-sheet-footer";
  const pageIdxNum = document.createElement("span");
  pageIdxNum.textContent = `${pageIndex + 1} / ${comic.pages.length}`;
  const brandFoot = document.createElement("span");
  brandFoot.textContent = "Sketchic.net";
  sheetFooter.appendChild(brandFoot);
  sheetFooter.appendChild(pageIdxNum);
  sheet.appendChild(sheetFooter);

  return sheet;
}

function renderComicReader() {
  const comic = COMICS[activeComicKey];
  if (!comic || !comicStage) return;

  const isAr = currentLang === "ar";
  const totalPages = comic.pages.length;
  const activePage = comic.pages[activeComicPageIndex] || comic.pages[0];

  if (comicModalTitle) {
    comicModalTitle.textContent = isAr
      ? `${comic.issueNum} ${comic.titleAr} — ${comic.titleEn}`
      : `${comic.issueNum} ${comic.titleEn}`;
  }

  if (comicPageIndicator) {
    const label = isAr ? activePage.labelAr : activePage.labelEn;
    comicPageIndicator.textContent =
      comicViewMode === "scroll"
        ? isAr
          ? `عرض كامل (${totalPages} صفحات)`
          : `Full Scroll (${totalPages} Pages)`
        : `${label} (${activeComicPageIndex + 1} / ${totalPages})`;
  }

  comicStage.classList.toggle("scroll-mode", comicViewMode === "scroll");
  comicStage.classList.toggle("clean-art", comicCleanArt);
  comicStage.innerHTML = "";

  const pagesToRender = comicViewMode === "scroll" ? comic.pages : [activePage];
  pagesToRender.forEach((page, idx) => {
    const realIndex = comicViewMode === "scroll" ? idx : activeComicPageIndex;
    const sheet =
      page.layout === "cover"
        ? buildComicCoverSheet(comic, page)
        : buildComicStorySheet(comic, page, realIndex);
    comicStage.appendChild(sheet);
  });

  if (comicViewMode === "page") {
    comicStage.scrollTop = 0;
  }

  document.querySelectorAll("[data-comic-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-comic-view") === comicViewMode);
  });

  if (comicCleanArtBtn) {
    comicCleanArtBtn.classList.toggle("active", comicCleanArt);
    comicCleanArtBtn.setAttribute("aria-pressed", String(comicCleanArt));
  }

  if (comicFooter) {
    comicFooter.classList.toggle("hidden", comicViewMode === "scroll");
  }

  if (comicPrevBtn && comicNextBtn) {
    comicPrevBtn.disabled = activeComicPageIndex <= 0;
    comicNextBtn.disabled = activeComicPageIndex >= totalPages - 1;
  }

  if (comicPagePills) {
    comicPagePills.innerHTML = "";
    comic.pages.forEach((pg, idx) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `comic-pill${idx === activeComicPageIndex ? " active" : ""}`;
      pill.textContent = idx === 0 ? (isAr ? "الغلاف" : "Cover") : `0${idx}`;
      pill.addEventListener("click", () => {
        activeComicPageIndex = idx;
        renderComicReader();
      });
      comicPagePills.appendChild(pill);
    });
  }
}

function openComicModal(comicKey, startPageIndex = 0) {
  const comic = COMICS[comicKey];
  if (!comic || !comicModal) return;
  activeComicKey = comicKey;
  activeComicPageIndex = Math.max(0, Math.min(startPageIndex, comic.pages.length - 1));
  comicModal.hidden = false;
  document.body.style.overflow = "hidden";
  renderComicReader();
}

function closeComicModal() {
  if (!comicModal) return;
  comicModal.hidden = true;
  document.body.style.overflow = "";
}

function printComicIssue(comicKey) {
  const prevViewMode = comicViewMode;
  if (comicModal.hidden || activeComicKey !== comicKey) {
    comicViewMode = "scroll";
    openComicModal(comicKey, 0);
  } else if (comicViewMode !== "scroll") {
    comicViewMode = "scroll";
    renderComicReader();
  }
  const restoreAfterPrint = () => {
    comicViewMode = prevViewMode;
    if (!comicModal.hidden) renderComicReader();
    window.removeEventListener("afterprint", restoreAfterPrint);
  };
  window.addEventListener("afterprint", restoreAfterPrint);
  setTimeout(() => {
    window.print();
  }, 80);
}

// Canon DB Inspector Modal
function buildPromptBox(label, promptText) {
  const dict = I18N[currentLang];
  const box = makeEl("div", "canon-prompt-box");
  const head = makeEl("div", "canon-prompt-head");
  head.appendChild(makeEl("span", "canon-prompt-label", label));

  const copyBtn = makeEl("button", "canon-copy-btn", dict.copyPrompt);
  copyBtn.type = "button";
  copyBtn.setAttribute("data-copy-text", promptText);
  head.appendChild(copyBtn);

  box.appendChild(head);
  box.appendChild(makeEl("div", "canon-prompt-text", promptText));
  return box;
}

function openCanonWorldModal(worldSlug) {
  const world = getWorldBySlug(worldSlug);
  if (!world || !canonModal || !canonModalBody) return;
  const isAr = currentLang === "ar";
  const dict = I18N[currentLang];

  canonModalKicker.textContent = `CANON WORLD #0${world.worldNum} • ${world.id.toUpperCase()}`;
  canonModalTitle.textContent = isAr ? `${world.titleAr} — ${world.titleEn}` : world.titleEn;
  canonModalBody.innerHTML = "";

  const metaGrid = makeEl("div", "canon-meta-grid");
  const addMeta = (label, value) => {
    const item = makeEl("div", "canon-meta-item");
    item.appendChild(makeEl("span", "canon-meta-label", label));
    item.appendChild(makeEl("span", "canon-meta-val", value));
    metaGrid.appendChild(item);
  };
  addMeta(isAr ? "المجلد المحلي" : "Folder", world.folderName);
  addMeta(isAr ? "الخامة البصرية" : "Medium", world.mediumTag);
  addMeta(isAr ? "المشهد المجمّع" : "Assembled Scene", world.assembledSceneName);
  addMeta(isAr ? "عدد المشاهد" : "Scenes", `${(world.scenes || []).length} (${world.durationBadge})`);
  canonModalBody.appendChild(metaGrid);

  const linksBlock = makeEl("div", "canon-chips-row");
  const projLink = makeEl("a", "flow-link", dict.openFlow);
  projLink.href = world.flowProjectUrl;
  projLink.target = "_blank";
  projLink.rel = "noopener noreferrer";
  linksBlock.appendChild(projLink);
  if (world.flowSceneUrl) {
    const sceneLink = makeEl("a", "flow-link", dict.openFlowScene);
    sceneLink.href = world.flowSceneUrl;
    sceneLink.target = "_blank";
    sceneLink.rel = "noopener noreferrer";
    linksBlock.appendChild(sceneLink);
  }
  canonModalBody.appendChild(linksBlock);

  if (world.palettes && world.palettes.length) {
    const palBlock = makeEl("div", "canon-block");
    palBlock.appendChild(makeEl("div", "canon-block-title", isAr ? "لوحة الألوان المعتمدة" : "Canonical Color Palette"));
    const row = makeEl("div", "canon-swatches-row");
    world.palettes.forEach((p) => {
      const chip = makeEl("span", "canon-swatch-chip");
      const dot = makeEl("span", "canon-swatch-dot");
      dot.style.background = p.hexCode;
      chip.appendChild(dot);
      chip.appendChild(document.createTextNode(`${p.hexCode} • ${isAr ? p.labelAr : p.labelEn}`));
      row.appendChild(chip);
    });
    palBlock.appendChild(row);
    canonModalBody.appendChild(palBlock);
  }

  const allCards = getVisibleCatalogCards();
  const appearances = (canonDb.worldAppearances || []).filter((wa) => wa.worldId === world.id);
  if (appearances.length) {
    const castBlock = makeEl("div", "canon-block");
    castBlock.appendChild(
      makeEl("div", "canon-block-title", isAr ? "الشخصيات والمكونات المرتبطة" : "Linked Characters & Ingredients")
    );
    const row = makeEl("div", "canon-chips-row");
    appearances.forEach((wa) => {
      const entity = allCards.find((c) => c.id === wa.entityId);
      if (!entity) return;
      const chip = makeEl(
        "button",
        "canon-entity-chip",
        `${isAr ? entity.nameAr : entity.nameEn} (${entity.flowTab})`
      );
      chip.type = "button";
      chip.setAttribute("data-open-canon-card", entity.id);
      row.appendChild(chip);
    });
    castBlock.appendChild(row);
    canonModalBody.appendChild(castBlock);
  }

  if (world.visualRules && world.visualRules.length) {
    const rulesBlock = makeEl("div", "canon-block");
    rulesBlock.appendChild(makeEl("div", "canon-block-title", isAr ? "القواعد البصرية للعالم" : "World Visual Rules"));
    const list = makeEl("div", "canon-rules-list");
    world.visualRules.forEach((r) => {
      const item = makeEl("div", "canon-rule-item");
      item.appendChild(makeEl("div", "canon-scene-title", `${padTwo(r.ruleNum)}. ${isAr ? r.titleAr : r.titleEn}`));
      item.appendChild(makeEl("p", "canon-scene-goal", isAr ? r.descriptionAr : r.descriptionEn));
      list.appendChild(item);
    });
    rulesBlock.appendChild(list);
    canonModalBody.appendChild(rulesBlock);
  }

  const scenesBlock = makeEl("div", "canon-block");
  scenesBlock.appendChild(
    makeEl("div", "canon-block-title", isAr ? "السيناريو وأوامر المشاهد (Google Flow)" : "Storyboard & Google Flow Prompts")
  );
  const scenesList = makeEl("div", "canon-scenes-list");
  (world.scenes || []).forEach((s) => {
    const item = makeEl("div", "canon-scene-item");
    const head = makeEl("div", "canon-scene-head");
    head.appendChild(
      makeEl(
        "span",
        "canon-scene-title",
        `${isAr ? "المشهد" : "Scene"} ${s.sceneNum}: ${isAr ? s.titleAr : s.titleEn}`
      )
    );
    const vObj = s.voiceId ? getVoiceById(s.voiceId) : null;
    if (vObj) {
      head.appendChild(makeEl("span", "voice-name-chip", `Voice: ${vObj.voiceName}`));
    }
    item.appendChild(head);
    if (s.goalAr && isAr) {
      item.appendChild(makeEl("p", "canon-scene-goal", s.goalAr));
    }
    item.appendChild(buildPromptBox(`FLOW SCENE ${s.sceneNum} PROMPT`, s.flowPrompt));
    scenesList.appendChild(item);
  });
  scenesBlock.appendChild(scenesList);
  canonModalBody.appendChild(scenesBlock);

  canonModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function openCanonCardModal(cardId) {
  const cards = getVisibleCatalogCards();
  const card = cards.find((c) => c.id === cardId);
  if (!card || !canonModal || !canonModalBody) return;
  const isAr = currentLang === "ar";
  const homeWorld = getWorldById(card.primaryWorldId);
  const voice = card.voiceId ? getVoiceById(card.voiceId) : null;

  canonModalKicker.textContent = `CANON ${card.entityType.toUpperCase()} #${padTwo(card.cardOrder)} • ${card.id}`;
  canonModalTitle.textContent = isAr ? `${card.nameAr} — ${card.nameEn}` : card.nameEn;
  canonModalBody.innerHTML = "";

  const metaGrid = makeEl("div", "canon-meta-grid");
  const addMeta = (label, value) => {
    const item = makeEl("div", "canon-meta-item");
    item.appendChild(makeEl("span", "canon-meta-label", label));
    item.appendChild(makeEl("span", "canon-meta-val", value));
    metaGrid.appendChild(item);
  };
  addMeta(isAr ? "الدور" : "Role", isAr ? card.roleAr : card.roleEn);
  addMeta(isAr ? "تبويب Google Flow" : "Google Flow Tab", card.flowTab);
  addMeta(isAr ? "العالم الأساسي" : "Primary World", homeWorld ? (isAr ? homeWorld.titleAr : homeWorld.titleEn) : card.primaryWorldId);
  if (voice) {
    addMeta(
      isAr ? "الصوت المثبّت" : "Locked Voice",
      voice.fallbackVoice ? `${voice.voiceName} (Alt: ${voice.fallbackVoice})` : voice.voiceName
    );
  } else {
    addMeta(isAr ? "التصنيف" : "Category", card.category);
  }
  canonModalBody.appendChild(metaGrid);

  const descBlock = makeEl("div", "canon-block");
  descBlock.appendChild(makeEl("div", "canon-block-title", isAr ? "الوصف الكوني المعتمد" : "Canonical Description"));
  descBlock.appendChild(makeEl("p", "canon-scene-goal", isAr ? card.descriptionAr : card.descriptionEn));
  if (card.characterInfoEn) {
    descBlock.appendChild(buildPromptBox("FLOW CHARACTER INFO", card.characterInfoEn));
  }
  canonModalBody.appendChild(descBlock);

  const promptsBlock = makeEl("div", "canon-block");
  promptsBlock.appendChild(makeEl("div", "canon-block-title", isAr ? "أوامر التوليد المرجعية" : "Reference Flow Prompts"));
  if (card.entityType === "character") {
    promptsBlock.appendChild(buildPromptBox("PORTRAIT / INGREDIENT PROMPT", card.portraitPrompt));
    if (card.bodyPrompt) {
      promptsBlock.appendChild(buildPromptBox("CREATE BODY PROMPT", card.bodyPrompt));
    }
    if (card.continuityPrefix) {
      promptsBlock.appendChild(buildPromptBox("VISUAL CONTINUITY PREFIX", card.continuityPrefix));
    }
  } else {
    promptsBlock.appendChild(buildPromptBox("INGREDIENT REFERENCE PROMPT", card.referencePrompt));
  }
  canonModalBody.appendChild(promptsBlock);

  const visibleWorldIds = new Set(getVisibleWorlds().map((w) => w.id));
  const appearances = (canonDb.worldAppearances || []).filter(
    (wa) => wa.entityId === card.id && visibleWorldIds.has(wa.worldId)
  );
  if (appearances.length) {
    const appBlock = makeEl("div", "canon-block");
    appBlock.appendChild(makeEl("div", "canon-block-title", isAr ? "العوالم التي يظهر بها" : "World Appearances"));
    const row = makeEl("div", "canon-chips-row");
    appearances.forEach((wa) => {
      const w = getWorldById(wa.worldId);
      if (!w) return;
      const chip = makeEl(
        "button",
        "canon-entity-chip",
        `${padTwo(w.worldNum)} • ${isAr ? w.titleAr : w.titleEn}`
      );
      chip.type = "button";
      chip.setAttribute("data-open-canon-world", w.slug);
      row.appendChild(chip);
    });
    appBlock.appendChild(row);
    canonModalBody.appendChild(appBlock);
  }

  canonModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCanonModal() {
  if (!canonModal) return;
  canonModal.hidden = true;
  document.body.style.overflow = "";
}

if (canonModalClose) canonModalClose.addEventListener("click", closeCanonModal);
if (canonBackdrop) canonBackdrop.addEventListener("click", closeCanonModal);

// Delegated click handlers so dynamic re-renders never break bindings
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  const seasonBtn = target.closest("[data-season-filter]");
  if (seasonBtn && filmsFilterBar && filmsFilterBar.contains(seasonBtn)) {
    activeSeasonFilter = seasonBtn.getAttribute("data-season-filter") || "all";
    filmsFilterBar.querySelectorAll("[data-season-filter]").forEach((b) => b.classList.remove("active"));
    seasonBtn.classList.add("active");
    applySeasonFilter();
    return;
  }

  const filterBtn = target.closest(".filter-btn");
  if (filterBtn && charsFilterBar && charsFilterBar.contains(filterBtn)) {
    activeCharFilter = filterBtn.getAttribute("data-filter") || "all";
    charsFilterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    filterBtn.classList.add("active");
    applyCharFilter();
    return;
  }

  const openFilmBtn = target.closest("[data-open-film]");
  if (openFilmBtn) {
    const filmKey = openFilmBtn.getAttribute("data-open-film");
    const format = openFilmBtn.getAttribute("data-format") || "16:9";
    openCinemaModal(filmKey, format);
    return;
  }

  const openComicBtn = target.closest("[data-open-comic]");
  if (openComicBtn) {
    const comicKey = openComicBtn.getAttribute("data-open-comic");
    const pageIndex = Number(openComicBtn.getAttribute("data-comic-page") || 0);
    comicViewMode = "page";
    openComicModal(comicKey, pageIndex);
    return;
  }

  const printComicBtn = target.closest("[data-print-comic]");
  if (printComicBtn) {
    const comicKey = printComicBtn.getAttribute("data-print-comic");
    printComicIssue(comicKey);
    return;
  }

  const openWorldBtn = target.closest("[data-open-canon-world]");
  if (openWorldBtn) {
    openCanonWorldModal(openWorldBtn.getAttribute("data-open-canon-world"));
    return;
  }

  const openCardBtn = target.closest("[data-open-canon-card]");
  if (openCardBtn) {
    openCanonCardModal(openCardBtn.getAttribute("data-open-canon-card"));
    return;
  }

  const copyBtn = target.closest(".canon-copy-btn");
  if (copyBtn) {
    const text = copyBtn.getAttribute("data-copy-text") || "";
    const dict = I18N[currentLang];
    const markCopied = () => {
      copyBtn.textContent = dict.copiedPrompt;
      setTimeout(() => {
        copyBtn.textContent = dict.copyPrompt;
      }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        markCopied();
      } catch {}
      document.body.removeChild(ta);
    }
  }
});

document.querySelectorAll("[data-comic-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    comicViewMode = btn.getAttribute("data-comic-view") || "page";
    renderComicReader();
  });
});

if (comicCleanArtBtn) {
  comicCleanArtBtn.addEventListener("click", () => {
    comicCleanArt = !comicCleanArt;
    renderComicReader();
  });
}

if (comicLangBtn) {
  comicLangBtn.addEventListener("click", () => {
    applyLanguage(currentLang === "ar" ? "en" : "ar");
  });
}

if (comicPrintBtn) {
  comicPrintBtn.addEventListener("click", () => {
    if (activeComicKey) {
      printComicIssue(activeComicKey);
    }
  });
}

if (comicPrevBtn) {
  comicPrevBtn.addEventListener("click", () => {
    if (activeComicPageIndex > 0) {
      activeComicPageIndex -= 1;
      renderComicReader();
    }
  });
}

if (comicNextBtn) {
  comicNextBtn.addEventListener("click", () => {
    const comic = COMICS[activeComicKey];
    if (comic && activeComicPageIndex < comic.pages.length - 1) {
      activeComicPageIndex += 1;
      renderComicReader();
    }
  });
}

if (comicModalClose) comicModalClose.addEventListener("click", closeComicModal);
if (comicBackdrop) comicBackdrop.addEventListener("click", closeComicModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (canonModal && !canonModal.hidden) {
      closeCanonModal();
      return;
    }
    if (comicModal && !comicModal.hidden) {
      closeComicModal();
      return;
    }
    if (!cinemaModal.hidden) {
      closeCinemaModal();
      return;
    }
  }

  if (comicModal && !comicModal.hidden && comicViewMode === "page") {
    const comic = COMICS[activeComicKey];
    if (!comic) return;
    const isAr = currentLang === "ar";
    if (e.key === "ArrowLeft") {
      if (isAr && activeComicPageIndex < comic.pages.length - 1) {
        activeComicPageIndex += 1;
        renderComicReader();
      } else if (!isAr && activeComicPageIndex > 0) {
        activeComicPageIndex -= 1;
        renderComicReader();
      }
    } else if (e.key === "ArrowRight") {
      if (isAr && activeComicPageIndex > 0) {
        activeComicPageIndex -= 1;
        renderComicReader();
      } else if (!isAr && activeComicPageIndex < comic.pages.length - 1) {
        activeComicPageIndex += 1;
        renderComicReader();
      }
    }
  }
});

async function syncCanonFromApi() {
  if (window.location.protocol !== "http:" && window.location.protocol !== "https:") return;
  try {
    const res = await fetch("api/canon", { cache: "no-store" });
    if (!res.ok) return;
    const liveDb = await res.json();
    if (!liveDb || !liveDb.meta) return;

    const prevShow = Boolean(canonDb && canonDb.meta && canonDb.meta.showConvergence);
    const prevS2 = Boolean(canonDb && canonDb.meta && canonDb.meta.showSeason2);
    const prevS3 = Boolean(canonDb && canonDb.meta && canonDb.meta.showSeason3);
    const prevVersion = canonDb && canonDb.meta ? canonDb.meta.dbVersion : null;
    canonDb = liveDb;
    canonSourceMode = "api";

    if (prevShow !== Boolean(liveDb.meta.showConvergence) || prevS2 !== Boolean(liveDb.meta.showSeason2) || prevS3 !== Boolean(liveDb.meta.showSeason3) || prevVersion !== liveDb.meta.dbVersion) {
      renderAllFromCanon();
    } else {
      renderCanonStatusBadge();
    }
  } catch {
    // Fallback cleanly to bundled window.SKETCHIC_CANON_DB on static hosts
  }
}

// Initialize
applyLanguage(currentLang);
syncCanonFromApi();
