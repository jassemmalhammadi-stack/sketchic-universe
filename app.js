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
  "clockwork-thread": {
    titleAr: "حائك الزمن",
    titleEn: "The Clockwork Thread",
    full: "assets/videos/The_Clockwork_Thread_Full_Film.mp4",
    shorts: "assets/videos/The_Clockwork_Thread_Shorts_9x16.mp4",
  },
  "stained-glass": {
    titleAr: "لحن الزجاج الملوّن",
    titleEn: "The Stained-Glass Echo",
    full: "assets/videos/The_Stained_Glass_Echo_Full_Film.mp4",
    shorts: "assets/videos/The_Stained_Glass_Echo_Shorts_9x16.mp4",
  },
  convergence: {
    titleAr: "تقاطع العوالم",
    titleEn: "The Sketchic Convergence",
    full: "assets/videos/The_Sketchic_Convergence_Full_Film.mp4",
    shorts: "assets/videos/The_Sketchic_Convergence_Shorts_9x16.mp4",
  },
};

const I18N = {
  ar: {
    brandSub: "عالم سكتشيك",
    navFilms: "الأفلام",
    navLaws: "القوانين الكونية",
    navChars: "الشخصيات والأدوات",
    navVoices: "الأصوات المثبتة",
    navStudio: "استوديو Flow",
    navYoutube: "@sketchic-net",
    heroBadge: "الإصدار الرسمي المعتمد • Google Flow Cinema",
    heroTitle: "حيث تصطدم خطوط الحبر بالسينما الواقعية",
    heroDesc:
      "عالم سينمائي هجين يجمع بين الرسومات اليدوية ثنائية الأبعاد (الحبر، الفحم، الألوان المائية، التطريز، والزجاج الملوّن) والبيئات الواقعية الملموسة — حيث تحافظ كل خامة على روحها الأصلية تحت إضاءة الغروب والفوانيس.",
    heroWatch: "استكشف كتالوج الأفلام",
    heroLaws: "دستور العالم الكوني",
    statFilms: "أفلام الموسم الأول",
    statFormats: "نسخ سينمائية وشورتس",
    statChars: "شخصيات وأدوات مثبتة",
    filmsKicker: "01 / الكتالوج الرسمي",
    filmsTitle: "أفلام الموسم الأول الستة",
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
    f4Genre: "خيال وحرفة",
    f4Title: "حائك الزمن",
    f4Desc:
      "في ورشة خياطة وساعات قديمة دافئة الإضاءة، يستيقظ مخلوق صغير منسوج من خيوط التطريز الذهبية والنيلية، ليحمل إبرة خياطة ذهبية ويتسلق تروس ساعة عملاقة لإعادة خياطة شقٍّ زمني متصدع.",
    f5Genre: "خيال موسيقي",
    f5Title: "لحن الزجاج الملوّن",
    f5Desc:
      "في قاعة زجاجية حجرية مهجورة، تنفصل حارسة من الزجاج الملوّن ذي الإطار الرصاصي الداكن عن نافذة قوطية فقدت ألوانها، لتجمع النوتات الحبرية الذهبية بقوسها المنشوري وتعيد اللحن والضوء.",
    f6Genre: "ختام الموسم الأول",
    f6Title: "تقاطع العوالم",
    f6Desc:
      'فوق طاولة مرسم رئيسية تلتقي فيها معالم العوالم الخمسة، تهبّ "عاصفة المحو الكبرى" لمسح كل شيء، فيتحد أبطال Sketchic Universe الخمسة بأدواتهم الفنية لحماية عالمهم المشترك.',
    watchFull: "مشاهدة الفيلم (16:9)",
    watchShorts: "شورتس (9:16)",
    openFlow: "فتح المشروع في Google Flow ↗",
    lawsKicker: "02 / الدستور الموحّد",
    lawsTitle: "القوانين الكونية لعالم سكتشيك",
    lawsSub: "ثلاث قواعد بصرية وسردية تحكم كل مشهد يتم إنتاجه داخل عالم Sketchic Universe.",
    law1Title: "الصدام المرئي (Visual Clash)",
    law1Desc:
      "تلتقي الخامات الفنية ثنائية الأبعاد (الحبر، الفحم، الألوان المائية، الورق، التطريز، والزجاج الملوّن) مع البيئة السينمائية الواقعية دون أن تذوب فيها؛ كل عنصر يحافظ على ملمسه الأصلي مع تفاعل حقيقي مع الضوء والظل.",
    law2Title: "فيزيائية الأدوات الفنية",
    law2Desc:
      "الأقلام، الأوراق الشفافة، الفوانيس، الإبرة الذهبية، القوس المنشوري، والممحاة ليست مجرد ديكور خلفي — بل هي أدوات خلق ومواجهة وبوابات عبور حقيقية تحرك مسار القصة وتحدد مصير الأبطال.",
    law3Title: "طبيعة الصراع (بلا عنف دموي)",
    law3Desc:
      "الصراع في سكتشيك بصري وخيالي خالص ضد قوى المحو، الفقدان، أو بهتان الألوان — يُعبَّر عنه بتمزق الورق، زحف ضباب الممحاة، أو تمرد الظلال، دون أي عنف دموي.",
    charsKicker: "03 / الشخصيات والأدوات المثبّتة",
    charsTitle: "أرشيف الأبطال والعناصر المرجعية",
    charsSub: "الشخصيات والأدوات المعتمَدة في Google Flow للحفاظ على الاتساق البصري عبر جميع المشاهد.",
    filterAll: "الكل (17)",
    roleHero: "البطل",
    roleHeroine: "البطلة",
    roleArtifact: "الأداة المنقذة",
    roleThreat: "التهديد",
    rolePortal: "الأداة السحرية",
    roleVehicle: "المركبة",
    roleCompanion: "المرافق",
    roleLandmark: "المعلم",
    roleElement: "العنصر",
    roleMasterLandmark: "معلم التقاطع",
    roleUnityArtifact: "شعار التحالف",
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
    c10Name: "حائك الخيوط",
    c10Desc:
      "مخلوق صغير منسوج من خيوط التطريز الذهبية والنيلية على قماش الكتان، يرتدي قبعة كشتبان ويحمل إبرة خياطة ذهبية لامعة كعصا.",
    c11Name: "ساعة التروس العملاقة",
    c11Desc:
      "آلية ساعة نحاسية عتيقة شاهقة فوق طاولة خياطة، تتشابك فيها التروس الذهبية والنوابض مع شقٍّ زمني متوهج في المركز.",
    c12Name: "بكرة الخيط الذهبي",
    c12Desc:
      "بكرة خشبية عتيقة ملفوفة بخيوط تطريز ذهبية متوهجة بجوار مقص نحاسي، تتصاعد منها الخيوط المضيئة لرتق الزمن.",
    c13Name: "حارسة الزجاج",
    c13Desc:
      "حارسة مرسومة من شظايا زجاج ملوّن شفاف (ياقوتي، أزرق، زمردي، وكهرماني) بإطار رصاصي داكن، تحمل قوساً منشوريّاً وتُلقي انعكاسات ضوئية ملوّنة.",
    c14Name: "النافذة القوطية المتلاشية",
    c14Desc:
      "نافذة قوطية دائرية عملاقة داخل قاعة حجرية مشمسة، نصفها يفيض بألوان الزجاج الملوّن ونصفها الآخر بهت وتحوّل إلى زجاج شفاف بلا لون.",
    c15Name: "النوتات الحبرية الذهبية",
    c15Desc:
      "نوتات موسيقية مرسومة بالحبر الذهبي وشرائط ألوان زجاجية متوهجة تسبح في الهواء وتُلقي انعكاسات قوس قزح على البلاط الحجري.",
    c16Name: "طاولة التقاطع الكبرى",
    c16Desc:
      "طاولة مرسم خشبية رئيسية تجتمع عليها دفاتر الحبر، الورق الشفاف المائي، تروس التطريز الذهبي، وقوس الزجاج الملوّن في مواجهة عاصفة المحو.",
    c17Name: "شعار التحالف المتوهج",
    c17Desc:
      "سنّ قلم ذهبي، قوس منشوري زجاجي، إبرة خياطة ذهبية، وخطوط حبر تتحد في دائرة نور متوهجة لدفع ضباب المحو بعيداً عن العوالم.",
    voicesKicker: "04 / الأصوات المثبّتة",
    voicesTitle: "سجل أصوات الشخصيات في Google Flow",
    voicesSub:
      "الأصوات الرسمية المعتمدة لبطاقات الشخصيات لضمان ثبات النبرة والأداء الصوتي عبر جميع الحلقات وتقاطع العوالم.",
    v1Trait: "Ink Knight Voice — شجاع وحماسي",
    v2Trait: "Explorer Voice — فضولي ومغامر",
    v3Trait: "Cartographer Voice — هادئ ومتأمّل",
    v4Trait: "صوت خفيف وأثيري",
    v5Trait: "صوت رشيق وشجاع",
    v6Trait: "صوت بلوري وواضح (البديل: Despina)",
    studioKicker: "05 / الهوية والإنتاج",
    studioTitle: "صُنع في Google Flow",
    studioDesc:
      "تُنتج أفلام Sketchic Universe عبر خطوط إنتاج Google Flow السينمائية باستخدام بطاقات الشخصيات والأصوات والأدوات المرجعية (Characters, Voices & Ingredients) لضمان وحدة الأسلوب، الإضاءة، وملمس الرسم اليدوي في كل لقطة.",
    studioYtBtn: "اشترك في قناة YouTube الرسمية",
    studioRewatch: "العودة إلى الأفلام",
    footerTag: "Sketchic Universe — عالم سكتشيك السينمائي",
  },
  en: {
    brandSub: "Sketchic Universe",
    navFilms: "Films",
    navLaws: "Cosmic Laws",
    navChars: "Characters & Props",
    navVoices: "Flow Voices",
    navStudio: "Flow Studio",
    navYoutube: "@sketchic-net",
    heroBadge: "Official Universe Release • Google Flow Cinema",
    heroTitle: "Where Hand-Drawn Ink Collides with Live-Action Cinema",
    heroDesc:
      "A hybrid cinematic universe uniting 2D hand-drawn ink, charcoal, watercolor, embroidery, and stained-glass art with tactile photorealistic worlds — preserving every medium's raw texture under golden hour sunbeams and lantern light.",
    heroWatch: "Explore the Film Catalog",
    heroLaws: "Read the Cosmic Laws",
    statFilms: "Season 1 Short Films",
    statFormats: "Cinema & Shorts Cuts",
    statChars: "Canonical Ingredients",
    filmsKicker: "01 / Official Catalog",
    filmsTitle: "Season 1 — Six Canonical Films",
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
    f4Genre: "Craft Fantasy",
    f4Title: "The Clockwork Thread",
    f4Desc:
      "Inside a warm antique tailor and clockmaker workshop, a tiny figure stitched from golden and indigo embroidery threads climbs towering brass gears with a golden needle to mend a rift in time.",
    f5Genre: "Melodic Fantasy",
    f5Title: "The Stained-Glass Echo",
    f5Desc:
      "In a sunlit stone conservatory, a 2D stained-glass mosaic guardian steps down from a fading gothic rose window, gathering golden ink musical notes with her prism bow to restore color and melody.",
    f6Genre: "Season 1 Finale",
    f6Title: "The Sketchic Convergence",
    f6Desc:
      "Upon a grand master artist table where all five worlds converge, a great Eraser Storm threatens to wipe everything clean — uniting Ink Knight, The Explorer, Ink Fox, Thread Weaver, and Glass Guardian.",
    watchFull: "Watch Full Film (16:9)",
    watchShorts: "Shorts Cut (9:16)",
    openFlow: "Open Project in Google Flow ↗",
    lawsKicker: "02 / Master Bible",
    lawsTitle: "Cosmic Laws of Sketchic Universe",
    lawsSub: "Three visual and narrative rules governing every scene produced in the Sketchic Universe.",
    law1Title: "Visual Clash",
    law1Desc:
      "2D artistic media (ink, charcoal, watercolor, paper, embroidery, and stained-glass) meet photorealistic live-action environments without melting away; each medium retains its authentic texture while casting real light and shadow.",
    law2Title: "Physics of Art Tools",
    law2Desc:
      "Fountain pens, translucent vellum, lanterns, sewing needles, prism bows, and erasers are never mere props — they are active instruments of creation, confrontation, and dimensional travel.",
    law3Title: "Conflict Without Gore",
    law3Desc:
      "Conflict in Sketchic is purely visual and imaginative against forces of erasure, loss, or fading color — expressed through torn paper, eraser mist, and rebellious shadows, with zero gore.",
    charsKicker: "03 / Canonical Ingredients",
    charsTitle: "Characters & Artifacts Archive",
    charsSub: "Reference characters and tools locked for Google Flow to preserve visual continuity across scenes.",
    filterAll: "All (17)",
    roleHero: "Protagonist",
    roleHeroine: "Protagonist",
    roleArtifact: "Saving Artifact",
    roleThreat: "Threat",
    rolePortal: "Magical Tool",
    roleVehicle: "Vessel",
    roleCompanion: "Companion",
    roleLandmark: "Landmark",
    roleElement: "Element",
    roleMasterLandmark: "Convergence Landmark",
    roleUnityArtifact: "Alliance Crest",
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
    c10Name: "Thread Weaver",
    c10Desc:
      "A tiny hand-embroidered figure stitched from glowing golden and indigo threads on dark linen, wearing a thimble cap and wielding a gleaming golden sewing needle.",
    c11Name: "The Giant Clockwork",
    c11Desc:
      "A towering antique brass clockwork mechanism on a tailor workbench with interlocking golden gears and a glowing temporal crack at its center.",
    c12Name: "The Golden Spool",
    c12Desc:
      "An ornate vintage wooden spool wound with luminous golden embroidery thread beside brass scissors, trailing glowing thread upward to mend time.",
    c13Name: "Glass Guardian",
    c13Desc:
      "A luminous 2D stained-glass guardian crafted from ruby, sapphire, emerald, and amber translucent glass shards with dark lead outlines, wielding a prism tuning-bow.",
    c14Name: "The Shattered Rose Window",
    c14Desc:
      "A colossal gothic rose window in an abandoned sunlit stone conservatory, half vibrant stained glass and half drained colorless glass.",
    c15Name: "Golden Ink Musical Notes",
    c15Desc:
      "Glowing hand-drawn 2D golden ink musical notes and shimmering stained-glass color ribbons casting rainbow caustics onto real stone flagstones.",
    c16Name: "The Grand Convergence Desk",
    c16Desc:
      "A grand oak master artist table where open sketchbooks, translucent watercolor vellum, clockwork gears, and a stained-glass arch meet against an advancing eraser storm.",
    c17Name: "The Radiant Sketchic Crest",
    c17Desc:
      "A golden fountain pen nib, stained-glass prism bow, golden sewing needle, and swirling ink lines converging in a radiant circle of light to push back the erasure mist.",
    voicesKicker: "04 / Locked Voices",
    voicesTitle: "Google Flow Character Voices",
    voicesSub:
      "Official voice bindings locked per character card to preserve vocal consistency across all episodes and the Season 1 convergence.",
    v1Trait: "Ink Knight Voice — Brave & Spirited",
    v2Trait: "Explorer Voice — Curious & Adventurous",
    v3Trait: "Cartographer Voice — Calm & Contemplative",
    v4Trait: "Light & Ethereal",
    v5Trait: "Agile & Courageous",
    v6Trait: "Crystalline & Clear (Alt: Despina)",
    studioKicker: "05 / Identity & Production",
    studioTitle: "Crafted in Google Flow",
    studioDesc:
      "Sketchic Universe films are produced in Google Flow pipelines using locked character, voice, and prop Ingredients to guarantee consistent line-art, lighting, and tactile craft in every frame.",
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
