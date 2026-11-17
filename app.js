const FILMS = {
  "erasers-edge": {
    titleAr: "حارس الممحاة",
    titleEn: "The Eraser's Edge",
    full: "assets/videos/The_Erasers_Edge_Full_Film.mp4",
    shorts: "assets/videos/The_Erasers_Edge_Shorts_9x16.mp4",
  },
  "paper-sky": {
    titleAr: "نافذة السحاب",
    titleEn: "The Paper-Sky Voyager",
    full: "assets/videos/The_Paper_Sky_Voyager_Full_Film.mp4",
    shorts: "assets/videos/The_Paper_Sky_Voyager_Shorts_9x16.mp4",
  },
  "ink-thief": {
    titleAr: "سارق الظلال المرسومة",
    titleEn: "The Ink-Shadow Thief",
    full: "assets/videos/The_Ink_Shadow_Thief_Full_Film.mp4",
    shorts: "assets/videos/The_Ink_Shadow_Thief_Shorts_9x16.mp4",
  },
};

const I18N = {
  ar: {
    brandSub: "عالم سكتشيك",
    navFilms: "الأفلام",
    navLaws: "القوانين الكونية",
    navChars: "الشخصيات والأدوات",
    navStudio: "استوديو Flow",
    navYoutube: "@sketchic-net",
    heroBadge: "الإصدار الرسمي المعتمد • Google Flow Cinema",
    heroTitle: "حيث تصطدم خطوط الحبر بالسينما الواقعية",
    heroDesc:
      "عالم سينمائي هجين يجمع بين الرسومات اليدوية ثنائية الأبعاد (الحبر، الفحم، والألوان المائية) والبيئات الواقعية الملموسة — حيث تحافظ كل خامة على روحها الأصلية تحت إضاءة الغروب والفوانيس.",
    heroWatch: "استكشف كتالوج الأفلام",
    heroLaws: "دستور العالم الكوني",
    statFilms: "أفلام قصيرة معتمدة",
    statFormats: "نسخ سينمائية وشورتس",
    statChars: "شخصيات وأدوات مثبتة",
    filmsKicker: "01 / الكتالوج الرسمي",
    filmsTitle: "الأفلام الثلاثة المعتمدة",
    filmsSub:
      "اختر بين النسخة السينمائية الكاملة (16:9) أو نسخة الشورتس العمودية (9:16) للمشاهدة الفورية داخل المشغّل.",
    f1Genre: "مغامرة وخيال",
    f1Title: "حارس الممحاة",
    f1Desc:
      'في مرسم فنان مهجور تغمره شمس الغروب، يستيقظ محارب صغير مرسوم بالحبر الأسود ليكتشف أن "ضباب الممحاة" يبتلع عالمه الورقي، فيقفز إلى سطح الطاولة الحقيقي بحثاً عن القلم الذهبي.',
    f2Genre: "مغامرة وخيال",
    f2Title: "نافذة السحاب",
    f2Desc:
      "في مدينة حجرية باهتة الألوان، تكتشف مستكشفة أن رسوماتها على الأوراق الشفافة تتحول إلى بوابات ثلاثية الأبعاد أمام ضوء الشمس، فتعبر خلف طائرتها الورقية إلى عالم السماء المخططة.",
    f3Genre: "غموض ليلي",
    f3Title: "سارق الظلال المرسومة",
    f3Desc:
      "في بلدة حجرية ليليّة مضاءة بالفوانيس، تنفصل الظلال عن أصحابها وتتحول إلى مخلوقات حبرية متمرّدة تهرب نحو البرج الممزق، فينطلق رسّام الخرائط مع ثعلب الفحم المرسوم لاستعادة ظلّه قبل الفجر.",
    watchFull: "مشاهدة الفيلم (16:9)",
    watchShorts: "شورتس (9:16)",
    openFlow: "فتح المشروع في Google Flow ↗",
    localMaster: "إنتاج رسمي • Sketchic Universe",
    lawsKicker: "02 / الدستور الموحّد",
    lawsTitle: "القوانين الكونية لعالم سكتشيك",
    lawsSub: "ثلاث قواعد بصرية وسردية تحكم كل مشهد يتم إنتاجه داخل عالم Sketchic Universe.",
    law1Title: "الصدام المرئي (Visual Clash)",
    law1Desc:
      "تلتقي الرسومات ثنائية الأبعاد (الحبر، الفحم، الألوان المائية، الورق) مع البيئة السينمائية الواقعية دون أن تذوب خامة الرسم في الواقع؛ كل عنصر يحافظ على ملمسه الأصلي مع تفاعل حقيقي مع الضوء والظل.",
    law2Title: "فيزيائية الأدوات الفنية",
    law2Desc:
      "الأقلام، الأوراق الشفافة، الفوانيس، والممحاة ليست مجرد ديكور خلفي — بل هي أدوات خلق ومواجهة وبوابات عبور حقيقية تحرك مسار القصة وتحدد مصير الأبطال.",
    law3Title: "طبيعة الصراع (بلا عنف دموي)",
    law3Desc:
      "الصراع في سكتشيك بصري وخيالي خالص ضد قوى المحو، الفقدان، أو بهتان الألوان — يُعبَّر عنه بتمزق الورق، زحف ضباب الممحاة، أو تمرد الظلال، دون أي عنف دموي.",
    charsKicker: "03 / الشخصيات والأدوات المثبّتة",
    charsTitle: "أرشيف الأبطال والعناصر المرجعية",
    charsSub: "الشخصيات والأدوات المعتمَدة في Google Flow للحفاظ على الاتساق البصري عبر جميع المشاهد.",
    filterAll: "الكل (9)",
    roleHero: "البطل",
    roleHeroine: "البطلة",
    roleArtifact: "الأداة المنقذة",
    roleThreat: "التهديد",
    rolePortal: "الأداة السحرية",
    roleVehicle: "المركبة",
    roleCompanion: "المرافق",
    roleLandmark: "المعلم",
    c1Name: "فارس الحبر",
    c1Desc:
      "محارب صغير بطول إصبع مرسوم بالحبر الأسود والفحم، يرتدي عباءة ورقية ممزقة الحواف ويحمل سيفاً من سنّ قلم حبر رفيع، بعينين متوهجتين بلون أبيض دافئ.",
    c2Name: "القلم الذهبي",
    c2Desc:
      "قلم حبر عتيق ضخم من النحاس والذهب المنقوش يتكئ على كتب جلدية، يتوهج سنه بنور كهرماني دافئ يفيض بالحبر المضيء لإعادة رسم العالم.",
    c3Name: "ضباب الممحاة",
    c3Desc:
      "موجة زاحفة من الغبار الرمادي البارد وفتات الممحاة المطاطية، تمحو خطوط الحبر والألوان وتحوّل كل ما تلمسه إلى بياض ورقي فارغ.",
    c4Name: "المستكشفة",
    c4Desc:
      "شابة ترتدي معطفاً قماشياً ونظارات طيران نحاسية فوق أسطح مدينة حجرية باهتة، ترفع دفترها الشفاف أمام أشعة الشمس لتفتح بوابات السماء.",
    c5Name: "الدفتر الشفاف",
    c5Desc:
      "أوراق رسم شفافة تحمل خطوط حبر هندسية ولمسات ألوان مائية؛ بمجرد مرور ضوء الشمس خلالها تتحول الرسومات المسطحة إلى عمق ثلاثي الأبعاد.",
    c6Name: "الطائرة الورقية المرسومة",
    c6Desc:
      "طائرة ورقية مطوية من ورق كريمي وخطوط حبر هندسية وضربات ألوان مائية فيروزية وذهبية تحلق وسط الغيوم مخلفة ذيلاً من الحبر المضيء.",
    c7Name: "رسّام الخرائط",
    c7Desc:
      "رسّام خرائط شاب يرتدي معطفاً صوفياً داكناً وحقيبة جلدية، يحمل فانوساً نحاسياً دافئاً في شوارع الحجر الرطبة بحثاً عن ظله المفقود.",
    c8Name: "الثعلب المرسوم",
    c8Desc:
      "ثعلب رشيق مرسوم بالفحم الأسود وخطوط بيضاء متوهجة، يتحرك على الجدران والأرضيات الحجرية الحقيقية كظل حيّ.",
    c9Name: "البرج الممزق",
    c9Desc:
      "برج جرس قوطي حجري شاهق يتمزق جزؤه العلوي في سماء الليل الضبابية ليتحول إلى رسومات حبر مسطحة وطيور ظلّية دوّارة.",
    studioKicker: "04 / الهوية والإنتاج",
    studioTitle: "صُنع في Google Flow",
    studioDesc:
      "تُنتج أفلام Sketchic Universe عبر خطوط إنتاج Google Flow السينمائية باستخدام بطاقات الشخصيات والأدوات المرجعية (Ingredients) لضمان وحدة الأسلوب، الإضاءة، وملمس الرسم اليدوي في كل لقطة.",
    studioYtBtn: "اشترك في قناة YouTube الرسمية",
    studioRewatch: "العودة إلى الأفلام",
    footerTag: "Sketchic Universe — عالم سكتشيك السينمائي",
  },
  en: {
    brandSub: "Sketchic Universe",
    navFilms: "Films",
    navLaws: "Cosmic Laws",
    navChars: "Characters & Props",
    navStudio: "Flow Studio",
    navYoutube: "@sketchic-net",
    heroBadge: "Official Universe Release • Google Flow Cinema",
    heroTitle: "Where Hand-Drawn Ink Collides with Live-Action Cinema",
    heroDesc:
      "A hybrid cinematic universe uniting 2D hand-drawn ink, charcoal, and watercolor illustrations with tactile photorealistic worlds — preserving every medium's raw texture under golden hour sunbeams and lantern light.",
    heroWatch: "Explore the Film Catalog",
    heroLaws: "Read the Cosmic Laws",
    statFilms: "Official Short Films",
    statFormats: "Cinema & Shorts Cuts",
    statChars: "Canonical Ingredients",
    filmsKicker: "01 / Official Catalog",
    filmsTitle: "The Three Canonical Films",
    filmsSub:
      "Switch seamlessly between the 16:9 widescreen Full Film and the 9:16 vertical Shorts cut right inside the theater player.",
    f1Genre: "Fantasy & Adventure",
    f1Title: "The Eraser's Edge",
    f1Desc:
      "In a sunlit artist studio, a tiny hand-drawn ink warrior awakens as a creeping grey Eraser Fog devours his sketchbook. He leaps onto the wooden desk in search of the Golden Nib.",
    f2Genre: "Fantasy & Adventure",
    f2Title: "The Paper-Sky Voyager",
    f2Desc:
      "In a desaturated stone city, a young explorer discovers her translucent vellum sketches open into 3D sunlit portals, following her paper airship into the painted sky.",
    f3Genre: "Nocturnal Mystery",
    f3Title: "The Ink-Shadow Thief",
    f3Desc:
      "In a lantern-lit cobblestone town at night, rogue 2D ink shadows flee toward the Torn Paper Tower. A cartographer and his charcoal ink fox set out to reclaim his shadow before dawn.",
    watchFull: "Watch Full Film (16:9)",
    watchShorts: "Shorts Cut (9:16)",
    openFlow: "Open Project in Google Flow ↗",
    localMaster: "Official Production • Sketchic Universe",
    lawsKicker: "02 / Master Bible",
    lawsTitle: "Cosmic Laws of Sketchic Universe",
    lawsSub: "Three visual and narrative rules governing every scene produced in the Sketchic Universe.",
    law1Title: "Visual Clash",
    law1Desc:
      "2D hand-drawn ink, charcoal, watercolor, and paper meet photorealistic live-action environments without melting away; each medium retains its authentic texture while casting real light and shadow.",
    law2Title: "Physics of Art Tools",
    law2Desc:
      "Fountain pens, translucent vellum, lanterns, and erasers are never mere props — they are active instruments of creation, confrontation, and dimensional travel.",
    law3Title: "Conflict Without Gore",
    law3Desc:
      "Conflict in Sketchic is purely visual and imaginative against forces of erasure, loss, or fading color — expressed through torn paper, eraser mist, and rebellious shadows, with zero gore.",
    charsKicker: "03 / Canonical Ingredients",
    charsTitle: "Characters & Artifacts Archive",
    charsSub: "Reference characters and tools locked for Google Flow to preserve visual continuity across scenes.",
    filterAll: "All (9)",
    roleHero: "Protagonist",
    roleHeroine: "Protagonist",
    roleArtifact: "Saving Artifact",
    roleThreat: "Threat",
    rolePortal: "Magical Tool",
    roleVehicle: "Vessel",
    roleCompanion: "Companion",
    roleLandmark: "Landmark",
    c1Name: "Ink Knight",
    c1Desc:
      "A finger-sized 2D black ink and charcoal warrior wearing a tattered paper cape, wielding a fountain-pen nib sword with glowing warm-white eyes.",
    c2Name: "The Golden Nib",
    c2Desc:
      "A towering antique brass-and-gold fountain pen leaning against leather books, its nib glowing with warm amber luminous ink capable of redrawing the world.",
    c3Name: "The Eraser Fog",
    c3Desc:
      "A creeping wave of cold grey eraser dust and rubber crumbs that wipes away ink lines and color into blank white paper.",
    c4Name: "The Explorer",
    c4Desc:
      "A young woman in a canvas coat and brass aviator goggles on muted stone rooftops, holding her translucent sketchbook up to afternoon sunbeams.",
    c5Name: "Translucent Sketchbook Portal",
    c5Desc:
      "Translucent vellum sheets bearing blueprint ink and watercolor washes that transform from flat lines into glowing 3D portals in sunlight.",
    c6Name: "The Paper-Sky Airship",
    c6Desc:
      "A folded cream-paper airship painted with blueprint ink and teal-and-gold watercolor washes, soaring through clouds with golden ink trails.",
    c7Name: "The Cartographer",
    c7Desc:
      "A young nocturnal cartographer in a dark wool coat with a leather satchel, carrying a glowing brass lantern along wet cobblestone streets.",
    c8Name: "The Charcoal Ink Fox",
    c8Desc:
      "A nimble fox drawn in black charcoal with glowing white outlines, dashing across real wet stone walls and floors like a living shadow.",
    c9Name: "The Torn Paper Tower",
    c9Desc:
      "A gothic stone belltower rising into misty night skies where its upper spire tears open into flat 2D ink-on-parchment sketches and shadow birds.",
    studioKicker: "04 / Identity & Production",
    studioTitle: "Crafted in Google Flow",
    studioDesc:
      "Sketchic Universe films are produced in Google Flow pipelines using locked character and prop Ingredients to guarantee consistent line-art, lighting, and tactile craft in every frame.",
    studioYtBtn: "Subscribe on Official YouTube",
    studioRewatch: "Back to Films",
    footerTag: "Sketchic Universe — Hybrid Cinema Studio",
  },
};

let currentLang = localStorage.getItem("sketchic_lang") || "ar";
let activeFilmKey = null;
let activeFormat = "16:9";

const langToggle = document.getElementById("langToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");
const cinemaModal = document.getElementById("cinemaModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalVideo = document.getElementById("modalVideo");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const cinemaStage = document.getElementById("cinemaStage");

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("sketchic_lang", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  langToggle.querySelector(".lang-pill").textContent = lang === "ar" ? "EN" : "AR";

  const dict = I18N[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  if (!cinemaModal.hidden && activeFilmKey) {
    updateModalHeader();
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

// Hover preview on film cards
document.querySelectorAll(".film-card").forEach((card) => {
  const video = card.querySelector(".film-thumb-video");
  if (!video) return;
  card.addEventListener("mouseenter", () => {
    video.play().catch(() => {});
  });
  card.addEventListener("mouseleave", () => {
    video.pause();
  });
});

// Character filter tabs
const filterBtns = document.querySelectorAll(".filter-btn");
const charCards = document.querySelectorAll(".char-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    charCards.forEach((card) => {
      const group = card.getAttribute("data-film-group");
      card.classList.toggle("hidden", filter !== "all" && group !== filter);
    });
  });
});

// Cinema Modal Player
function updateModalHeader() {
  const film = FILMS[activeFilmKey];
  if (!film) return;
  modalTitle.textContent = currentLang === "ar" ? `${film.titleAr} — ${film.titleEn}` : film.titleEn;
  modalSubtitle.textContent = activeFormat === "16:9" ? "16:9 Full Film" : "9:16 Vertical Shorts";
}

function loadModalVideo() {
  const film = FILMS[activeFilmKey];
  if (!film) return;
  const src = activeFormat === "16:9" ? film.full : film.shorts;
  cinemaStage.classList.toggle("shorts", activeFormat === "9:16");
  modalVideo.src = src;
  modalVideo.play().catch(() => {});
  updateModalHeader();

  document.querySelectorAll("[data-modal-fmt]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-modal-fmt") === activeFormat);
  });
}

function openCinemaModal(filmKey, format = "16:9") {
  activeFilmKey = filmKey;
  activeFormat = format;
  cinemaModal.hidden = false;
  document.body.style.overflow = "hidden";
  loadModalVideo();
}

function closeCinemaModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  cinemaModal.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-film]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const filmKey = btn.getAttribute("data-open-film");
    const format = btn.getAttribute("data-format") || "16:9";
    openCinemaModal(filmKey, format);
  });
});

document.querySelectorAll("[data-modal-fmt]").forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFormat = btn.getAttribute("data-modal-fmt");
    loadModalVideo();
  });
});

modalClose.addEventListener("click", closeCinemaModal);
modalBackdrop.addEventListener("click", closeCinemaModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !cinemaModal.hidden) {
    closeCinemaModal();
  }
});

// Initialize
applyLanguage(currentLang);
