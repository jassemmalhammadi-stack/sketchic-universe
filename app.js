/* ==========================================
   Sketchic Production Hub - Core Logic & SPA State (Updated)
   ========================================== */

// Default mock assets to seed the application initially
const MOCK_ASSETS = [
    {
        id: "mock-creator-1",
        type: "creator",
        title: "عازف الألوان الزيتية (Master of Oil Paintings)",
        desc: "الرسام الكوني الحاكم لبعد عصر النهضة الكلاسيكي. يعتمد في رسمه على الفرشاة الخشنة المشبعة بالسوائل، وتخضع رسوماته لقوانين الكثافة والجاذبية العالية والتدفق الزمني الوقور بـ 60 إطاراً في الثانية.",
        driveUrl: "https://drive.google.com/drive/folders/1mock-creator-oil",
        status: "finished",
        subOptions: {
            artStyle: "لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)",
            tool: "فرشاة شعر السنجاب الغليظة (Renaissance Hog Brush)"
        },
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-creator-2",
        type: "creator",
        title: "سيد الحبر الأسود (Lord of Black Ink)",
        desc: "الرسام الكوني الحاكم لبعد المانجا الحركي. يفرض واقعية حادة باللونين الأبيض والأسود فقط، وتتحرك رسوماته بقفزات خشنة ديناميكية (24 إطاراً) ولديه القدرة على رسم فقاعات كلام مادية تصطدم بالأجسام.",
        driveUrl: "https://drive.google.com/drive/folders/1mock-creator-ink",
        status: "finished",
        subOptions: {
            artStyle: "مانجا يابانية تقليدية بحبر أسود حاد",
            tool: "ريشة الرسم الكرتونية المعدنية (G-Pen)"
        },
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-creator-3",
        type: "creator",
        title: "رسام الرصاص المتطاير (Sketcher of Flying Graphite)",
        desc: "رسام متمرد يرفض التلوين أو التثبيت. عوالمه وشخصياته تتكون من خطوط رصاص متطايرة ومسودات سريعة زائلة، وتتميز بمرونة الحركة وسرعة التعديل لكنها تعاني من هشاشة شديدة أمام قوى المحو.",
        driveUrl: "https://drive.google.com/drive/folders/1mock-creator-sketch",
        status: "draft",
        subOptions: {
            artStyle: "رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)",
            tool: "قلم فحم ناعم وقابل للمحو (Graphite Pencil)"
        },
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-1",
        type: "scenario",
        title: "صدمة الألوان الأولى (The First Color Clash)",
        desc: "السيناريو التأسيسي لكون سكتشيك. يوثق لحظة تمزق لوحة الزمن وحدوث أول صدام مرئي بين عالم المانجا وعالم عصر النهضة الزيتي الكلاسيكي.",
        driveUrl: "https://docs.google.com/document/d/1mock-scenario-sketchic/edit",
        status: "finished",
        relatedScenario: "",
        relatedCharacters: [],
        usedPrompt: "بصفتك خبيراً سردياً لكون سكتشيك (Sketchic World)، قم بكتابة سيناريو سينمائي تفصيلي لقصة تدور حول 'الصدام المرئي الأول' بين بعد المانجا أحادي اللون وآخر زيتي كلاسيكي.",
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-2",
        type: "character",
        title: "الفارس كايو (Sir Kayo)",
        desc: "فارس مرسوم بالأسلوب الكلاسيكي الزيتي (عصر النهضة). يتميز بظلال ناعمة وإضاءة تشياروسكورو عميقة. يعتمد في حركته على 60 إطاراً في الثانية.",
        driveUrl: "https://drive.google.com/file/d/1mock-kayo-character/view",
        status: "finished",
        relatedScenario: "mock-1",
        relatedCreator: "mock-creator-1",
        relatedCharacters: [],
        usedPrompt: "A high-concept visual character design sheet of Sir Kayo, a knight rendered in Renaissance hyperrealistic oil painting style, detailed metal armor with soft dramatic chiaroscuro lighting, neutral background.",
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-3",
        type: "character",
        title: "المهاجم شين (Shin the Striker)",
        desc: "بطل مانجا شاب مرسوم بخطوط حبر سوداء حادة وتظليل نقطي (Screentone). يتحرك بقفزات خشنة ديناميكية (24 إطاراً) ولديه القدرة على إخراج فقاعات كلامية مادية.",
        driveUrl: "https://drive.google.com/file/d/1mock-shin-character/view",
        status: "finished",
        relatedScenario: "mock-1",
        relatedCreator: "mock-creator-2",
        relatedCharacters: [],
        usedPrompt: "A character sheet of Shin, a young manga action hero, black and white ink style, screentone shading, dynamic lines, on a pure white background.",
        createdAt: new Date().toISOString()
    },
    {
        id: "mock-4",
        type: "comic",
        title: "معركة التماس: الفصل الأول",
        desc: "قصة مصورة تمثل الصدام الأول بين شين وكايو عند بوابة القص اللوني. تظهر المؤثرات البصرية وتفاعل الفقاعات الكلامية مع درع كايو الزيتي.",
        driveUrl: "https://drive.google.com/file/d/1mock-comic-ch1/view",
        status: "draft",
        relatedScenario: "mock-1",
        relatedCreator: "mock-creator-2",
        relatedCharacters: ["mock-2", "mock-3"],
        usedPrompt: "قم بتوليد لوحات قصة مصورة (Comic Panel Guide) لصدام بين شين (أسلوب حبر مانجا) وكايو (أسلوب لوحة زيتية) عند بوابة القص اللوني وكيف تصطدم فقاعات كلام شين بدرع كايو.",
        createdAt: new Date().toISOString()
    }
];

// App State Manager
class SketchicApp {
    constructor() {
        this.assets = this.loadAssets();
        this.currentTab = 'dashboard';
        this.currentFilter = 'all';
        this.editingAssetId = null;

        // Initialize UI Element Selectors
        this.initSelectors();
        
        // Bind Event Listeners
        this.bindEvents();

        // Initial Renders
        this.switchTab('dashboard');
        this.updateStats();
        this.renderPipelineCounts();
        this.renderGuide('scenario');
    }

    loadAssets() {
        const stored = localStorage.getItem('sketchic_assets');
        if (!stored) {
            localStorage.setItem('sketchic_assets', JSON.stringify(MOCK_ASSETS));
            return MOCK_ASSETS;
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error loading assets from localStorage, falling back to mock", e);
            return MOCK_ASSETS;
        }
    }

    saveAssets() {
        localStorage.setItem('sketchic_assets', JSON.stringify(this.assets));
        this.updateStats();
        this.renderPipelineCounts();
        if (this.currentTab === 'assets') {
            this.renderAssetsList();
        } else if (this.currentTab === 'simulator') {
            this.renderSimulator();
        }
    }

    initSelectors() {
        // Nav Buttons
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');

        // Stats elements
        this.statTotal = document.getElementById('stat-total-assets');
        this.statDraft = document.getElementById('stat-draft-assets');
        this.statFinished = document.getElementById('stat-finished-assets');
        this.recBox = document.getElementById('rec-box');

        // Modal Elements
        this.modal = document.getElementById('asset-modal');
        this.assetForm = document.getElementById('asset-form');
        this.modalTitle = document.getElementById('modal-title');
        this.assetIdInput = document.getElementById('asset-id');
        this.assetTypeSelect = document.getElementById('asset-type');
        this.assetTitleInput = document.getElementById('asset-title');
        this.assetDescTextarea = document.getElementById('asset-desc');
        this.assetDriveUrlInput = document.getElementById('asset-drive-url');
        this.assetStatusSelect = document.getElementById('asset-status');
        this.prereqBox = document.getElementById('prereq-guide-box');
        
        // Dynamic prompt and options fields
        this.dynamicOptionsContainer = document.getElementById('dynamic-asset-options');
        this.groupSuggestedPrompt = document.getElementById('group-suggested-prompt');
        this.suggestedPromptText = document.getElementById('modal-suggested-prompt-text');
        this.btnCopyModalPrompt = document.getElementById('btn-copy-modal-prompt');
        this.assetUsedPromptInput = document.getElementById('asset-used-prompt');

        // Conditional linkage inputs
        this.groupRelatedScenario = document.getElementById('group-related-scenario');
        this.relatedScenarioSelect = document.getElementById('asset-related-scenario');
        
        // Creator Linkage selectors
        this.groupRelatedCreator = document.getElementById('group-related-creator');
        this.relatedCreatorSelect = document.getElementById('asset-related-creator');

        // Faction Selection
        this.groupRelatedFaction = document.getElementById('group-related-faction');
        this.relatedFactionSelect = document.getElementById('asset-related-faction');

        this.groupRelatedCharacters = document.getElementById('group-related-characters');
        this.charactersCheckboxContainer = document.getElementById('characters-checkbox-container');

        // Interface Physics Selector
        this.groupInterfacePhysics = document.getElementById('group-interface-physics');
        this.interfacePhysicsSelect = document.getElementById('asset-interface-physics');

        // Director's Visual Checklist
        this.groupDirectorChecklist = document.getElementById('group-director-checklist');
        this.chkNoBlending = document.getElementById('chk-no-blending');
        this.chkDepthContrast = document.getElementById('chk-depth-contrast');
        this.chkSonicDissonance = document.getElementById('chk-sonic-dissonance');

        // Publish to GitHub Pages
        this.btnPublishGithub = document.getElementById('btn-publish-github');

        // Assets Tab list elements
        this.assetsGrid = document.getElementById('assets-grid-container');
        this.noAssetsState = document.getElementById('no-assets-state');
        this.filterButtons = document.querySelectorAll('#asset-filters .filter-btn');

        // Guide Elements
        this.guideBtns = document.querySelectorAll('.guide-stage-btn');
        this.guideContentBody = document.getElementById('guide-content-body');

        // Simulator element
        this.portalFrame = document.getElementById('portal-frame');
    }

    bindEvents() {
        // Tab Navigation
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Open Modal buttons
        document.getElementById('btn-add-asset-quick').addEventListener('click', () => this.openAddModal());
        document.getElementById('btn-add-asset').addEventListener('click', () => this.openAddModal());
        document.getElementById('btn-add-asset-empty').addEventListener('click', () => this.openAddModal());

        // Close Modal
        document.getElementById('btn-close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('btn-cancel-modal').addEventListener('click', () => this.closeModal());
        
        // Form asset type change (Prerequisite triggers)
        this.assetTypeSelect.addEventListener('change', () => this.handleAssetTypeChange());
        this.assetStatusSelect.addEventListener('change', () => this.toggleChecklistDisplay());
        this.relatedFactionSelect.addEventListener('change', () => this.updateSuggestedPrompt());
        this.interfacePhysicsSelect.addEventListener('change', () => this.updateSuggestedPrompt());

        // Publish to Github Pages click listener
        if (this.btnPublishGithub) {
            this.btnPublishGithub.addEventListener('click', () => this.publishToGithub());
        }

        // Copy modal prompt button
        this.btnCopyModalPrompt.addEventListener('click', () => {
            navigator.clipboard.writeText(this.suggestedPromptText.textContent);
            this.btnCopyModalPrompt.textContent = "تم النسخ!";
            setTimeout(() => {
                this.btnCopyModalPrompt.textContent = "نسخ";
            }, 2000);
        });

        // Form Submit
        this.assetForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Asset Filters
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderAssetsList();
            });
        });

        // Guide Stage Buttons
        this.guideBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.guideBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderGuide(btn.dataset.guide);
            });
        });

        // Click on pipeline nodes to filter assets
        document.querySelectorAll('.pipeline-node').forEach(node => {
            node.addEventListener('click', () => {
                const stage = node.dataset.stage;
                this.switchTab('assets');
                // Set filter button active
                this.filterButtons.forEach(b => {
                    if (b.dataset.filter === stage) {
                        b.click();
                    }
                });
            });
        });
    }

    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Update Nav UI
        this.navButtons.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update Tab Panels
        this.tabPanes.forEach(pane => {
            if (pane.id === `tab-${tabId}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        // Tab Specific Activations
        if (tabId === 'assets') {
            this.renderAssetsList();
        } else if (tabId === 'simulator') {
            this.renderSimulator();
        } else if (tabId === 'dashboard') {
            this.updateStats();
            this.renderPipelineCounts();
        }
    }

    updateStats() {
        const total = this.assets.length;
        const draft = this.assets.filter(a => a.status === 'draft').length;
        const finished = this.assets.filter(a => a.status === 'finished').length;

        this.statTotal.textContent = total;
        this.statDraft.textContent = draft;
        this.statFinished.textContent = finished;

        // Smart production recommendation based on counts
        const creators = this.assets.filter(a => a.type === 'creator' && a.status === 'finished');
        const scenarios = this.assets.filter(a => a.type === 'scenario' && a.status === 'finished');
        const characters = this.assets.filter(a => a.type === 'character' && a.status === 'finished');
        const comics = this.assets.filter(a => a.type === 'comic' && a.status === 'finished');
        const videos = this.assets.filter(a => a.type === 'video' && a.status === 'finished');
        const games = this.assets.filter(a => a.type === 'game' && a.status === 'finished');

        let recText = "";
        if (creators.length === 0) {
            recText = "✍️ ابدأ بصياغة أول رسام كوني! الرسامون هم الكيانات التي تصيغ الأساليب وتحدد فيزياء الوجود والمادة للشخصيات.";
        } else if (scenarios.length === 0) {
            recText = "📝 ابدأ بكتابة أول سيناريو لكون سكتشيك! لا يمكنك إنتاج بقية الأصول دون وجود سيناريو مكتوب لتقسيم القصة.";
        } else if (characters.length < 2) {
            recText = "🎨 تحتاج الآن إلى تصميم شخصيتين على الأقل وربطهما برسّام صانع لتفعيل ظاهرة 'الصدام المرئي'.";
        } else if (comics.length === 0) {
            recText = "📚 لديك سيناريوهات وشخصيات جاهزة! الخطوة المثالية التالية هي صياغة أول قصة مصورة (Comic) أو لوحة سيناريو (Storyboard).";
        } else if (videos.length === 0) {
            recText = "🎬 ممتاز! حان الوقت لإنتاج أول فيديو متحرك (Video) لتجسيد الحركة المتنافرة وتطبيق ميثاق الإطارات الكوني.";
        } else if (games.length === 0) {
            recText = "🎮 خطوتك المتقدمة التالية هي برمجة لعبة بسيطة قابلة للتحميل لعالم سكتشيك، كطريقة لتفاعلية الكون.";
        } else {
            recText = "🌐 واو! لديك أصول جاهزة في كل المراحل. قم بنشرها كلها وتحديث حالة الأصول لتراها منعكسة فوراً في موقعك العام.";
        }
        this.recBox.innerHTML = recText;
    }

    renderPipelineCounts() {
        const counts = {
            scenario: 0,
            character: 0,
            comic: 0,
            video: 0,
            game: 0
        };

        this.assets.forEach(a => {
            if (counts[a.type] !== undefined) {
                counts[a.type]++;
            }
        });

        Object.keys(counts).forEach(type => {
            const el = document.getElementById(`count-${type}`);
            if (el) {
                el.textContent = `${counts[type]} أصل`;
            }
        });
    }

    // Modal Control & Validation Checks
    openAddModal() {
        this.editingAssetId = null;
        this.modalTitle.textContent = "إضافة أصل جديد";
        this.assetIdInput.value = "";
        this.assetForm.reset();
        this.prereqBox.style.display = "none";
        this.groupRelatedScenario.style.display = "none";
        this.groupRelatedCreator.style.display = "none";
        this.groupRelatedFaction.style.display = "none";
        this.groupRelatedCharacters.style.display = "none";
        this.groupInterfacePhysics.style.display = "none";
        this.groupDirectorChecklist.style.display = "none";
        this.chkNoBlending.checked = false;
        this.chkDepthContrast.checked = false;
        this.chkSonicDissonance.checked = false;
        this.dynamicOptionsContainer.innerHTML = "";
        this.groupSuggestedPrompt.style.display = "none";
        this.assetUsedPromptInput.value = "";
        this.modal.classList.add('open');
    }

    openEditModal(asset) {
        this.editingAssetId = asset.id;
        this.modalTitle.textContent = "تعديل أصل الإنتاج";
        
        this.assetIdInput.value = asset.id;
        this.assetTypeSelect.value = asset.type;
        this.assetTitleInput.value = asset.title;
        this.assetDescTextarea.value = asset.desc;
        this.assetDriveUrlInput.value = asset.driveUrl;
        this.assetStatusSelect.value = asset.status;
        this.assetUsedPromptInput.value = asset.usedPrompt || "";

        this.handleAssetTypeChange(asset);

        this.relatedFactionSelect.value = asset.relatedFaction || "";
        this.interfacePhysicsSelect.value = asset.interfacePhysics || "";

        if (asset.directorChecklist) {
            this.chkNoBlending.checked = !!asset.directorChecklist.noBlending;
            this.chkDepthContrast.checked = !!asset.directorChecklist.depthContrast;
            this.chkSonicDissonance.checked = !!asset.directorChecklist.sonicDissonance;
        } else {
            const isFinished = asset.status === 'finished';
            const isVisualAsset = ['comic', 'video', 'game'].includes(asset.type);
            this.chkNoBlending.checked = isFinished && isVisualAsset;
            this.chkDepthContrast.checked = isFinished && isVisualAsset;
            this.chkSonicDissonance.checked = isFinished && isVisualAsset;
        }

        this.toggleChecklistDisplay();
        this.modal.classList.add('open');
    }

    closeModal() {
        this.modal.classList.remove('open');
        this.editingAssetId = null;
    }

    toggleChecklistDisplay() {
        const type = this.assetTypeSelect.value;
        const status = this.assetStatusSelect.value;
        const isVisualAsset = ['comic', 'video', 'game'].includes(type);
        
        if (status === 'finished' && isVisualAsset) {
            this.groupDirectorChecklist.style.display = 'block';
        } else {
            this.groupDirectorChecklist.style.display = 'none';
        }
    }

    handleAssetTypeChange(editData = null) {
        const type = this.assetTypeSelect.value;
        if (!type) return;

        this.prereqBox.style.display = "block";
        this.prereqBox.className = "prereq-guide-box"; // Reset classes

        const creators = this.assets.filter(a => a.type === 'creator');
        const scenarios = this.assets.filter(a => a.type === 'scenario');
        const characters = this.assets.filter(a => a.type === 'character');
        const comics = this.assets.filter(a => a.type === 'comic');

        // Toggle visibility of new inputs
        if (type === 'character') {
            this.groupRelatedFaction.style.display = 'block';
        } else {
            this.groupRelatedFaction.style.display = 'none';
        }

        if (type === 'comic' || type === 'video') {
            this.groupInterfacePhysics.style.display = 'block';
        } else {
            this.groupInterfacePhysics.style.display = 'none';
        }

        this.toggleChecklistDisplay();

        // Populate Related Scenario Dropdown
        this.relatedScenarioSelect.innerHTML = '<option value="">لا يوجد سيناريو مرتبط (أو اختر سيناريو...)</option>';
        scenarios.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.title;
            this.relatedScenarioSelect.appendChild(opt);
        });

        // Populate Related Creator Dropdown
        this.relatedCreatorSelect.innerHTML = '<option value="">لا يوجد رسام مرتبط (أو اختر رساماً...)</option>';
        creators.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.title;
            this.relatedCreatorSelect.appendChild(opt);
        });

        // Populate Related Characters Checkboxes
        this.charactersCheckboxContainer.innerHTML = '';
        if (characters.length === 0) {
            this.charactersCheckboxContainer.innerHTML = '<span style="font-size:0.8rem;color:var(--text-tertiary);">لم يتم تصميم أي شخصية بعد.</span>';
        } else {
            characters.forEach(c => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.value = c.id;
                cb.name = 'related-chars';
                if (editData && editData.relatedCharacters && editData.relatedCharacters.includes(c.id)) {
                    cb.checked = true;
                }
                
                label.appendChild(cb);
                label.appendChild(document.createTextNode(` 👤 ${c.title}`));
                this.charactersCheckboxContainer.appendChild(label);
            });
        }

        // Configure Prerequisites and Guidance message
        let warningHtml = "";
        
        if (type === 'creator') {
            this.groupRelatedScenario.style.display = "none";
            this.groupRelatedCharacters.style.display = "none";
            this.groupRelatedCreator.style.display = "none";
            
            warningHtml = `
                <div class="prereq-title">✍️ إرشاد صياغة الرسام الكوني</div>
                <p>حدد الأسلوب الفني الحاكم والأداة المميزة للرسام. سيقوم النظام بتأصيل فيزيائه الكونية وتوزيعها تلقائياً على الشخصيات التي يرسمها.</p>
            `;
        } else if (type === 'scenario') {
            this.groupRelatedScenario.style.display = "none";
            this.groupRelatedCharacters.style.display = "none";
            this.groupRelatedCreator.style.display = "none";
            
            warningHtml = `
                <div class="prereq-title">📝 إرشاد بناء السيناريو</div>
                <p>السيناريو هو نواة العالم. يمكنك توليد مسودة سيناريو غنية لكون سكتشيك باستخدام <strong>Gemini Advanced</strong> عبر الأمر المحدد بالخيارات أدناه.</p>
            `;
        } else if (type === 'character') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedCharacters.style.display = "none";

            if (creators.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: لا يوجد رسامون</div>
                    <p>أنت بحاجة لتحديد رسام كوني واحد على الأقل ليقوم برسم وتجسيد هذه الشخصية وضبط قوانينها الفيزيائية.</p>
                `;
            } else if (scenarios.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: السيناريو مفقود</div>
                    <p>أنت بحاجة لكتابة سيناريو واحد على الأقل لربط الشخصية به.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-cyan)">🎨 إرشاد تصميم الشخصية</div>
                    <p>اربط الشخصية بالسيناريو وبالرسام الصانع لترث خواصه الفنية تلقائياً.</p>
                `;
            }

            if (editData) {
                if (editData.relatedScenario) this.relatedScenarioSelect.value = editData.relatedScenario;
                if (editData.relatedCreator) this.relatedCreatorSelect.value = editData.relatedCreator;
            }

        } else if (type === 'comic') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedCharacters.style.display = "block";

            const hasScen = scenarios.length > 0;
            const hasChar = characters.length >= 2;

            if (!hasScen || !hasChar) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ متطلبات ناقصة لإنشاء القصة المصورة</div>
                    <p>لإضافة قصة مصورة تحتاج على الأقل إلى: <strong>سيناريو واحد</strong> و <strong>شخصيتين (2)</strong> للصدام المرئي.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-orange)">📚 إرشاد إنشاء قصة مصورة / لوحة قصة</div>
                    <p>ارفع ملف القصة المصورة (المسودة أو النهائية) على مجلد Drive المخصص <code>03_Comics</code> واربطه بالسيناريو والشخصيات.</p>
                `;
            }

            if (editData) {
                if (editData.relatedScenario) this.relatedScenarioSelect.value = editData.relatedScenario;
                if (editData.relatedCreator) this.relatedCreatorSelect.value = editData.relatedCreator;
            }

        } else if (type === 'video') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedCharacters.style.display = "block";

            const hasComic = comics.length > 0;
            if (!hasComic) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ متطلبات ناقصة للفيديو</div>
                    <p>يُفضل أن يكون لديك قصة مصورة تم إضافتها مسبقاً كمرجع لتوليد الفيديو المتحرك.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">🎬 إرشاد إنتاج الفيديو</div>
                    <p>ارفع الفيديو النهائي بصيغة MP4 على مجلد <code>04_Videos</code> في Drive وضع رابط المشاركة هنا.</p>
                `;
            }

            if (editData) {
                if (editData.relatedScenario) this.relatedScenarioSelect.value = editData.relatedScenario;
                if (editData.relatedCreator) this.relatedCreatorSelect.value = editData.relatedCreator;
            }

        } else if (type === 'game') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedCharacters.style.display = "block";

            warningHtml = `
                <div class="prereq-title" style="color:var(--color-green)">🎮 إرشاد الألعاب للتحميل</div>
                <p>ارفع ملف اللعبة المضغوط على مجلد <code>05_Games</code> في Google Drive وضع رابط التحميل هنا.</p>
            `;

            if (editData) {
                if (editData.relatedScenario) this.relatedScenarioSelect.value = editData.relatedScenario;
                if (editData.relatedCreator) this.relatedCreatorSelect.value = editData.relatedCreator;
            }
        }

        this.prereqBox.innerHTML = warningHtml;
        this.renderDynamicOptions(type, editData);
    }

    renderDynamicOptions(type, editData = null) {
        this.dynamicOptionsContainer.innerHTML = "";
        this.groupSuggestedPrompt.style.display = "block";

        let optionsHtml = "";

        if (type === 'creator') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-artStyle">الأسلوب الفني الحاكم للرسام *</label>
                    <select id="opt-artStyle" required>
                        <option value="لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)">لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)</option>
                        <option value="مانجا يابانية تقليدية بحبر أسود حاد">مانجا يابانية تقليدية بحبر أسود حاد</option>
                        <option value="رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)">رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)</option>
                        <option value="رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)">رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)</option>
                        <option value="رسوم رقمية حديثة ذات متجهات هندسية (Vectors)">رسوم رقمية حديثة ذات متجهات هندسية (Vectors)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-tool">الأداة الكونية المميزة الخاصة به *</label>
                    <select id="opt-tool" required>
                        <option value="فرشاة شعر السنجاب الغليظة المشبعة بالزيت">فرشاة شعر السنجاب الغليظة المشبعة بالزيت</option>
                        <option value="ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)">ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)</option>
                        <option value="قلم رصاص غرافيت فحم ناعم وقابل للمحو">قلم رصاص غرافيت فحم ناعم وقابل للمحو</option>
                        <option value="قلم الألواح الرقمية اللاسلكي اللانهائي">قلم الألواح الرقمية اللاسلكي اللانهائي</option>
                        <option value="ممحاة مطاطية لمضاد المادة (Cosmic Eraser)">ممحاة مطاطية لمضاد المادة (Cosmic Eraser)</option>
                    </select>
                </div>
            `;
        } else if (type === 'scenario') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-genre">تصنيف قصة السيناريو *</label>
                    <select id="opt-genre" required>
                        <option value="خيال علمي (Sci-Fi)">خيال علمي (Sci-Fi)</option>
                        <option value="سايبربانك (Cyberpunk)">سايبربانك (Cyberpunk)</option>
                        <option value="فانتازيا سحرية (Fantasy)">فانتازيا سحرية (Fantasy)</option>
                        <option value="دراما الصدام المرئي (Visual Clash Drama)">دراما الصدام المرئي (Visual Clash Drama)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-style">أسلوب السرد *</label>
                    <select id="opt-style" required>
                        <option value="سرد تفصيلي بطيء ومكثف">سرد تفصيلي بطيء ومكثف</option>
                        <option value="سرد حركي سريع ومليء بالإثارة">سرد حركي سريع ومليء بالإثارة</option>
                        <option value="سرد فلسفي ميتافيزيقي">سرد فلسفي ميتافيزيقي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-parallelLayer">الطبقة الزمنية المتوازية (Parallel Layer) *</label>
                    <select id="opt-parallelLayer" required>
                        <option value="Layer 1 - الوجود المادي الفعلي">الطبقة الأولى - الوجود المادي الفعلي</option>
                        <option value="Layer 2 - الانعكاس والظلال">الطبقة الثانية - الانعكاس والظلال</option>
                        <option value="Layer 3 - المخطط الهيكلي الهندسي">الطبقة الثالثة - المخطط الهيكلي الهندسي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-framerate">معدل الإطارات الكوني (Framerate) *</label>
                    <select id="opt-framerate" required>
                        <option value="12fps">12 إطاراً في الثانية - حركة مانجا وكارتون خشنة</option>
                        <option value="24fps">24 إطاراً في الثانية - حركة سينمائية كلاسيكية</option>
                        <option value="60fps">60 إطاراً في الثانية - حركة ناعمة فائقة الواقعية (زيتي)</option>
                    </select>
                </div>
            `;
        } else if (type === 'character') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-charClass">الدور السردي للشخصية *</label>
                    <select id="opt-charClass" required>
                        <option value="بطل القصة الرئيسي (Protagonist)">بطل القصة الرئيسي (Protagonist)</option>
                        <option value="الخصم أو الشرير الرئيسي (Antagonist)">الخصم أو الشرير الرئيسي (Antagonist)</option>
                        <option value="شخصية مستيقظة تدرك أنها مرسومة (Awakened)">شخصية مستيقظة تدرك أنها مرسومة (Awakened)</option>
                        <option value="حارس زمن يحمي طبقات اللوحة (Time Keeper)">حارس زمن يحمي طبقات اللوحة (Time Keeper)</option>
                    </select>
                </div>
            `;
        } else if (type === 'comic') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-format">صيغة وعرض القصة المصورة *</label>
                    <select id="opt-format" required>
                        <option value="ويب تون طولي للموبايل (Vertical Webtoon)">ويب تون طولي للموبايل (Vertical Webtoon)</option>
                        <option value="صفحات مانجا تقليدية بالأبيض والأسود">صفحات مانجا تقليدية بالأبيض والأسود</option>
                        <option value="رواية مصورة غربية (Graphic Novel)">رواية مصورة غربية (Graphic Novel)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-color">نمط الألوان والصدام *</label>
                    <select id="opt-color" required>
                        <option value="أحادية اللون بالكامل (أبيض وأسود)">أحادية اللون بالكامل (أبيض وأسود)</option>
                        <option value="قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)">قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)</option>
                        <option value="ألوان كاملة غنية ومستوحاة من لوحات القماش">ألوان كاملة غنية ومستوحاة من لوحات القماش</option>
                    </select>
                </div>
            `;
        } else if (type === 'video') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-tool">محرك التوليد والتحريك بالذكاء الاصطناعي *</label>
                    <select id="opt-tool" required>
                        <option value="Runway Gen-3 Alpha">Runway Gen-3 Alpha</option>
                        <option value="OpenAI Sora">OpenAI Sora</option>
                        <option value="Luma Dream Machine">Luma Dream Machine</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-fps">انطباع حركة الإطارات الكونية *</label>
                    <select id="opt-fps" required>
                        <option value="مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)">مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)</option>
                        <option value="حركة سينمائية كلاسيكية (24 إطاراً في الثانية)">حركة سينمائية كلاسيكية (24 إطاراً في الثانية)</option>
                        <option value="حركة ناعمة وفائقة الواقعية (60 إطاراً في الثانية)">حركة ناعمة وفائقة الواقعية (60 إطاراً في الثانية)</option>
                    </select>
                </div>
            `;
        } else if (type === 'game') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-gameGenre">تصنيف اللعبة للتحميل *</label>
                    <select id="opt-gameGenre" required>
                        <option value="لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)">لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)</option>
                        <option value="مغامرة آر بي جي ثلاثية أبعاد (3D RPG Adventure)">مغامرة آر بي جي ثلاثية أبعاد (3D RPG Adventure)</option>
                        <option value="رواية بصرية تفاعلية مع خيارات سردية (Visual Novel)">رواية بصرية تفاعلية مع خيارات سردية (Visual Novel)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-mechanic">ميكانيكية التحكم بالأسلوب الفني *</label>
                    <select id="opt-mechanic" required>
                        <option value="تبديل شيدر اللاعب (من حبر مانجا خفيف إلى درع زيتي ثقيل)">تبديل شيدر اللاعب (من حبر مانجا خفيف إلى درع زيتي ثقيل)</option>
                        <option value="بوابات تغيير أبعاد الرسم لحل الألغاز الكونية">بوابات تغيير أبعاد الرسم لحل الألغاز الكونية</option>
                    </select>
                </div>
            `;
        }

        this.dynamicOptionsContainer.innerHTML = optionsHtml;

        // Prefill options if editing
        if (editData && editData.subOptions) {
            Object.keys(editData.subOptions).forEach(key => {
                const sel = this.dynamicOptionsContainer.querySelector(`#opt-${key}`);
                if (sel) sel.value = editData.subOptions[key];
            });
        }

        // Attach event listeners to update suggested prompt in real-time
        const selects = this.dynamicOptionsContainer.querySelectorAll('select');
        selects.forEach(sel => {
            sel.addEventListener('change', () => this.updateSuggestedPrompt());
        });

        this.updateSuggestedPrompt();
    }

    updateSuggestedPrompt() {
        const type = this.assetTypeSelect.value;
        if (!type) {
            this.groupSuggestedPrompt.style.display = "none";
            return;
        }

        let prompt = "";

        if (type === 'creator') {
            const artStyle = document.getElementById('opt-artStyle').value;
            const tool = document.getElementById('opt-tool').value;
            prompt = `اكتب ملفاً تعريفياً سردياً وأدبياً لرسام كوني في كون سكتشيك السينمائي يسمى [اسم الرسام].
الأسلوب الفني الحاكم لرسوماته وعالمه: [${artStyle}].
الأداة الكونية الخاصة التي يرسم بها: [${tool}].
اشرح صراعه الفلسفي وكيف تنعكس ضربات أداته وقوانينها الفيزيائية على رسوماته وعوالمه التي يرسمها.`;
        } else if (type === 'scenario') {
            const genre = document.getElementById('opt-genre').value;
            const style = document.getElementById('opt-style').value;
            const layer = document.getElementById('opt-parallelLayer').value;
            const fps = document.getElementById('opt-framerate').value;
            prompt = `بصفتك خبيراً سردياً لكون سكتشيك (Sketchic World)، قم بكتابة سيناريو سينمائي تفصيلي لقصة من تصنيف [${genre}] وبأسلوب [${style}]. 
يتموضع هذا السيناريو في [${layer}] ويخضع لمعدل إطارات كوني قدره [${fps}].
يجب أن تركز القصة على صدام الأسلوب الفني في الكادر ووجود أبعاد مرسومة متداخلة دون اندماج، مع كتابة السيناريو بهيكل مشاهد سينمائية تفصيلية.`;
        } else if (type === 'character') {
            const charClass = document.getElementById('opt-charClass').value;
            
            // Faction text & weapons
            let factionText = "لا ينتمي لأي فصيل كوني";
            let weaponText = "بلا سلاح كوني خاص";
            const factionVal = this.relatedFactionSelect.value;
            if (factionVal === 'keepers') {
                factionText = "حراس الأزمان (Time Keepers) - حماة هيكل الطبقات";
                weaponText = "قلم القياس الكوني (The Stylus of Order) - لإعادة رسم الحدود وإغلاق بوابات التماس";
            } else if (factionVal === 'erasers') {
                factionText = "قوى المحو (The Erasers) - غلاة التصفير الفني";
                weaponText = "ممحاة الفوضى (The Oblivion Eraser) - لمحو الخطوط الخارجية وتفتيت البنى";
            } else if (factionVal === 'awakened') {
                factionText = "الشخصيات المستيقظة (The Awakened) - الساعون لمعرفة الحقيقة";
                weaponText = "الرسم الذاتي (Self-Redrawing) - لإعادة رسم أطرافهم وتجاوز إطارات المشاهد";
            }

            // Check if a creator is selected to dynamically inject style
            let styleText = "أسلوب رسم فني متباين";
            let toolText = "أداة رسم كوني";
            if (this.relatedCreatorSelect.value) {
                const creator = this.assets.find(a => a.id === this.relatedCreatorSelect.value);
                if (creator && creator.subOptions) {
                    styleText = creator.subOptions.artStyle || styleText;
                    toolText = creator.subOptions.tool || toolText;
                }
            }

            prompt = `A professional visual character design sheet for a Sketchic Cinematic Universe character.
Character Role: [${charClass}].
Faction: [${factionText}].
Signature Cosmic Weapon: [${weaponText}].
Style Rules inherited from Creator: Drawn in [${styleText}] using [${toolText}].
Details: The character sheet must display a clean design of the character on a neutral background, highlighting the distinct lines, texture, and strokes of this specific art medium. Also illustrate their faction insignia and signature weapon.`;
        } else if (type === 'comic') {
            const format = document.getElementById('opt-format').value;
            const color = document.getElementById('opt-color').value;
            
            let physicsText = "ميكانيكية فيزياء تماس افتراضية";
            const physicsVal = this.interfacePhysicsSelect.value;
            if (physicsVal === 'chromatic') {
                physicsText = "القص اللوني والتنافر الضوئي (Chromatic Shear) - غشاء تماس متوهج وتفاعل ضوئي متباين";
            } else if (physicsVal === 'gravity') {
                physicsText = "عدم توافق الجاذبية الجمالية (Gravity Mismatch) - فيزياء أوزان وتأثير ريحي متباين لكل شخصية";
            } else if (physicsVal === 'speech') {
                physicsText = "التفاعل مع فقاعات الكلام المادية (Physical Speech Bubbles) - تحول فقاعات الكلام لكتل صلبة قابلة للمس والتحطيم";
            }

            prompt = `بناءً على تفاصيل القصة المرفقة، قم بإنشاء مخطط سيناريو لوحة قصة مصورة (Comic Panel Storyboard) بصيغة [${format}] وبأسلوب تلوين [${color}].
تُطبق في لوحات القصة ميكانيكية فيزياء التماس: [${physicsText}].
أريد تقسيم المشهد إلى لوحات (Panels) وتحديد مظهر وتأثيرات الصدام البصري الفني والفيزيائي في كل كادر عند خط التماس.`;
        } else if (type === 'video') {
            const tool = document.getElementById('opt-tool').value;
            const fps = document.getElementById('opt-fps').value;
            
            let physicsText = "ميكانيكية فيزياء تماس افتراضية";
            const physicsVal = this.interfacePhysicsSelect.value;
            if (physicsVal === 'chromatic') {
                physicsText = "القص اللوني والتنافر الضوئي (Chromatic Shear) - غشاء تماس متوهج وتفاعل ضوئي متباين";
            } else if (physicsVal === 'gravity') {
                physicsText = "عدم توافق الجاذبية الجمالية (Gravity Mismatch) - فيزياء أوزان وتأثير ريحي متباين لكل شخصية";
            } else if (physicsVal === 'speech') {
                physicsText = "التفاعل مع فقاعات الكلام المادية (Physical Speech Bubbles) - تحول فقاعات الكلام لكتل صلبة قابلة للمس والتحطيم";
            }

            prompt = `Generate a high-quality video prompt for AI generation tool [${tool}]:
Scene: A dynamic visual clash between two characters in the Sketchic universe. One character is animated with [${fps}] to show the distinct rendering properties, with beautiful light casting flat shadows on the 2D side and photorealistic shading on the oil-painted side.
Physics Interaction: Show the following interface physics in action: [${physicsText}].
High contrast, gorgeous cinematic light.`;
        } else if (type === 'game') {
            const gameGenre = document.getElementById('opt-gameGenre').value;
            const mechanic = document.getElementById('opt-mechanic').value;
            prompt = `Write a game design draft and Godot GDScript structure for [${gameGenre}] set in Sketchic universe.
The primary gameplay mechanic is [${mechanic}]. Explain how the rendering shaders change the player's physical properties (weight, gravity, interaction).`;
        }

        this.suggestedPromptText.textContent = prompt;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const type = this.assetTypeSelect.value;
        const title = this.assetTitleInput.value.trim();
        const desc = this.assetDescTextarea.value.trim();
        const driveUrl = this.assetDriveUrlInput.value.trim();
        const status = this.assetStatusSelect.value;
        
        const relatedScenario = this.relatedScenarioSelect.value;
        const relatedCreator = this.relatedCreatorSelect.value;
        
        const cbChecked = this.charactersCheckboxContainer.querySelectorAll('input[name="related-chars"]:checked');
        const relatedCharacters = Array.from(cbChecked).map(cb => cb.value);

        const usedPrompt = this.assetUsedPromptInput.value.trim();
        
        // Collect sub-options values
        const subOptions = {};
        const selects = this.dynamicOptionsContainer.querySelectorAll('select');
        selects.forEach(sel => {
            const key = sel.id.replace('opt-', '');
            subOptions[key] = sel.value;
        });

        if (!type || !title || !driveUrl) {
            alert("يرجى ملء جميع الحقول المطلوبة الكونية.");
            return;
        }

        // Validate Director's Checklist before saving as finished
        if (status === 'finished' && ['comic', 'video', 'game'].includes(type)) {
            const blendingChecked = this.chkNoBlending.checked;
            const depthChecked = this.chkDepthContrast.checked;
            const sonicChecked = this.chkSonicDissonance.checked;
            
            if (!blendingChecked || !depthChecked || !sonicChecked) {
                alert("خطأ: لا يمكن تحويل هذا الأصل البصري إلى حالة 'منتهي' إلا بعد تأكيد تطبيق مبادئ ميثاق المخرج البصري الثلاثة (No Blending, Contrast in Depth, Sonic Dissonance) وتثبيتها.");
                return;
            }
        }

        const relatedFaction = this.relatedFactionSelect.value;
        const interfacePhysics = this.interfacePhysicsSelect.value;
        const directorChecklist = {
            noBlending: this.chkNoBlending.checked,
            depthContrast: this.chkDepthContrast.checked,
            sonicDissonance: this.chkSonicDissonance.checked
        };

        if (this.editingAssetId) {
            // Edit mode
            this.assets = this.assets.map(a => {
                if (a.id === this.editingAssetId) {
                    return {
                        ...a,
                        type,
                        title,
                        desc,
                        driveUrl,
                        status,
                        relatedScenario,
                        relatedCreator,
                        relatedFaction,
                        relatedCharacters,
                        interfacePhysics,
                        directorChecklist,
                        usedPrompt,
                        subOptions
                    };
                }
                return a;
            });
        } else {
            // Add mode
            const newAsset = {
                id: 'asset-' + Date.now(),
                type,
                title,
                desc,
                driveUrl,
                status,
                relatedScenario,
                relatedCreator,
                relatedFaction,
                relatedCharacters,
                interfacePhysics,
                directorChecklist,
                usedPrompt,
                subOptions,
                createdAt: new Date().toISOString()
            };
            this.assets.push(newAsset);
        }

        this.saveAssets();
        this.closeModal();
    }

    deleteAsset(id) {
        if (confirm("هل أنت متأكد من رغبتك في حذف هذا الأصل الكوني نهائياً؟")) {
            this.assets = this.assets.filter(a => a.id !== id);
            this.saveAssets();
            if (this.currentTab === 'assets') {
                this.renderAssetsList();
            }
        }
    }

    // Tab 2: Render Asset Cards
    renderAssetsList() {
        this.assetsGrid.innerHTML = '';
        
        const filtered = this.assets.filter(a => {
            if (this.currentFilter === 'all') return true;
            return a.type === this.currentFilter;
        });

        if (filtered.length === 0) {
            this.assetsGrid.style.display = 'none';
            this.noAssetsState.style.display = 'block';
            return;
        }

        this.assetsGrid.style.display = 'grid';
        this.noAssetsState.style.display = 'none';

        filtered.forEach(asset => {
            const card = document.createElement('div');
            card.className = 'asset-card';
            
            // Build Relationship UI
            let relationHtml = '';

            // Link Creator
            if (asset.relatedCreator) {
                const creator = this.assets.find(a => a.id === asset.relatedCreator);
                if (creator) {
                    relationHtml += `<span class="relation-tag" style="background-color:#fef3c7; color:#b45309; border:1px solid rgba(217,119,6,0.15)">✍️ الرسام: ${creator.title}</span>`;
                }
            }

            if (asset.relatedScenario) {
                const parentScen = this.assets.find(a => a.id === asset.relatedScenario);
                if (parentScen) {
                    relationHtml += `<span class="relation-tag">📖 سيناريو: ${parentScen.title}</span>`;
                }
            }

            if (asset.relatedCharacters && asset.relatedCharacters.length > 0) {
                asset.relatedCharacters.forEach(cId => {
                    const char = this.assets.find(a => a.id === cId);
                    if (char) {
                        relationHtml += `<span class="relation-tag">👤 شخصية: ${char.title}</span>`;
                    }
                });
            }

            // Link Faction and Weapons for Character
            if (asset.type === 'character' && asset.relatedFaction) {
                let factionName = "";
                let weaponName = "";
                if (asset.relatedFaction === 'keepers') {
                    factionName = "حراس الأزمان (Time Keepers)";
                    weaponName = "قلم القياس الكوني (Stylus of Order)";
                } else if (asset.relatedFaction === 'erasers') {
                    factionName = "قوى المحو (The Erasers)";
                    weaponName = "ممحاة الفوضى (Oblivion Eraser)";
                } else if (asset.relatedFaction === 'awakened') {
                    factionName = "الشخصيات المستيقظة (The Awakened)";
                    weaponName = "الرسم الذاتي (Self-Redrawing)";
                }
                if (factionName) {
                    relationHtml += `<span class="relation-tag" style="background-color:#e0f2fe; color:#0369a1; border:1px solid rgba(2,132,199,0.15)">🛡️ الفصيل: ${factionName}</span>`;
                    relationHtml += `<span class="relation-tag" style="background-color:#f1f5f9; color:#334155; border:1px solid rgba(71,85,105,0.15)">⚔️ السلاح: ${weaponName}</span>`;
                }
            }

            // Link Interface Physics for Comic & Video
            if (['comic', 'video'].includes(asset.type) && asset.interfacePhysics) {
                let physicsName = "";
                if (asset.interfacePhysics === 'chromatic') {
                    physicsName = "القص اللوني (Chromatic Shear)";
                } else if (asset.interfacePhysics === 'gravity') {
                    physicsName = "عدم توافق الجاذبية (Gravity Mismatch)";
                } else if (asset.interfacePhysics === 'speech') {
                    physicsName = "فقاعات الكلام المادية (Physical Speech Bubbles)";
                }
                if (physicsName) {
                    relationHtml += `<span class="relation-tag" style="background-color:#fdf2f8; color:#be185d; border:1px solid rgba(219,39,119,0.15)">⚙️ فيزياء: ${physicsName}</span>`;
                }
            }

            const typeLabels = {
                creator: 'رسام كوني',
                scenario: 'سيناريو وقصة',
                character: 'تصميم شخصية',
                comic: 'قصة مصورة',
                video: 'فيديو متحرك',
                game: 'لعبة تحميل'
            };

            const statusLabels = {
                draft: 'قيد العمل',
                finished: 'منتهي وجاهز'
            };

            // Inject Creator Art Style or Tools if creator card
            let creatorDetailsHtml = "";
            if (asset.type === 'creator' && asset.subOptions) {
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🎨 <strong>الأسلوب:</strong> ${asset.subOptions.artStyle}</div>
                        <div style="margin-top:4px;">✍️ <strong>الأداة:</strong> ${asset.subOptions.tool}</div>
                    </div>
                `;
            } else if (asset.type === 'scenario' && asset.subOptions) {
                const layer = asset.subOptions.parallelLayer || "Layer 1 - الوجود المادي الفعلي";
                const fps = asset.subOptions.framerate || "24fps";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>📂 <strong>الطبقة الزمنية:</strong> ${layer}</div>
                        <div style="margin-top:4px;">⏱️ <strong>معدل الإطارات:</strong> ${fps}</div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="asset-card-type-bar type-${asset.type}"></div>
                <div class="asset-card-header">
                    <span class="asset-tag tag-${asset.type}">${typeLabels[asset.type]}</span>
                    <span class="asset-status-badge status-${asset.status}">${statusLabels[asset.status]}</span>
                </div>
                <div class="asset-card-body">
                    <h3>${asset.title}</h3>
                    ${creatorDetailsHtml}
                    <p class="asset-card-desc">${asset.desc || 'لا يوجد وصف متاح.'}</p>
                    ${relationHtml ? `<div class="asset-relations">${relationHtml}</div>` : ''}
                    
                    ${asset.usedPrompt ? `
                    <div class="used-prompt-collapse" style="margin-top: 10px; border-top: 1px dashed var(--border-color); padding-top: 8px;">
                        <button class="btn-toggle-prompt" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'" style="background:none; border:none; color:var(--color-accent); font-size:0.75rem; cursor:pointer; padding:0; font-weight:700; display:flex; align-items:center; gap:4px;">
                            <span>👁️</span> <span>عرض البرومبت المستخدم في التوليد</span>
                        </button>
                        <pre style="display:none; margin:8px 0 0 0; background:var(--bg-tertiary); padding:10px; border-radius:6px; font-size:0.75rem; white-space:pre-wrap; direction:rtl; text-align:right; border:1px solid var(--border-color); color:var(--text-secondary); max-height:150px; overflow-y:auto; font-family:var(--font-ar); line-height:1.5;">${asset.usedPrompt}</pre>
                    </div>
                    ` : ''}
                </div>
                <div class="asset-card-footer">
                    <a href="${asset.driveUrl}" target="_blank" class="drive-link-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        ملف Google Drive
                    </a>
                    <div class="asset-actions">
                        <button class="action-btn btn-edit" title="تعديل الأصل">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>
                        </button>
                        <button class="action-btn btn-delete" title="حذف الأصل">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;

            // Card Button Listeners
            card.querySelector('.btn-edit').addEventListener('click', () => this.openEditModal(asset));
            card.querySelector('.btn-delete').addEventListener('click', () => this.deleteAsset(asset.id));

            this.assetsGrid.appendChild(card);
        });
    }

    // Tab 3: Render AI Production Guide Details
    renderGuide(stageId) {
        let guideHtml = "";

        const guideData = {
            scenario: {
                title: "1. إنتاج السيناريوهات والقصص المكتوبة",
                reqs: "وجود رسام كوني واحد على الأقل لتحديد أسلوب عوالم القصة.",
                steps: [
                    {
                        title: "الخطوة الأولى: فتح مستند Google Docs",
                        desc: "افتح حساب Google Docs الخاص بك داخل باقة Google AI Pro وافتح ملفاً جديداً ليكون مرجع كتابتك."
                    },
                    {
                        title: "الخطوة الثانية: تشغيل موجه الذكاء الاصطناعي (Gemini Prompter)",
                        desc: "انسخ الموجه المتطور أدناه والصقه في محادثة Gemini Advanced مع إدخال تفاصيل قصتك للحصول على سيناريو يدمج مبادئ كون سكتشيك الفلسفية."
                    }
                ],
                prompt: `بصفتك خبيراً سردياً لكون سكتشيك (Sketchic World)، قم بكتابة سيناريو سينمائي تفصيلي لقصة تدور حول 'الصدام المرئي الأول'.
يجب أن يحتوي السيناريو على:
- مشهد يصف حدود بوابة التماس (Visual Clash Boundary) بين بعدين.
- حوار يوضح أسلوب الرسم المتباين وتفاعله فيزيائياً (مثل تصادم فقاعات كلامية مانجا مع درع زيتى كلاسيكى).
- كتابة القصة بهيكل المشاهد السينمائية (داخلي/خارجي - لقطات الكاميرا).`
            },
            character: {
                title: "2. تصميم ورسم شخصيات الأكوان المتباينة",
                reqs: "سيناريو مكتوب جاهز + تحديد الرسام الصانع (لتوريث أسلوب الرسم والفيزياء الكونية للشخصية).",
                steps: [
                    {
                        title: "الخطوة الأولى: تحديد النمط الفني للشخصية",
                        desc: "اختر أسلوب الرسم (مانجا، زيتي، كارتون قديم، رقمي ثلاثي الأبعاد) وافتح أحد برامج الرسم المفضلة لديك (Photoshop, Procreate)."
                    },
                    {
                        title: "الخطوة الثانية: موجه توليد المرجع المرئي (Gemini Image Generation / Imagen 3)",
                        desc: "إذا كنت تريد توليد مرجع فني بالذكاء الاصطناعي، انسخ الموجه التالي لتوليد شخصية تحترم القواعد الجمالية لكون سكتشيك."
                    }
                ],
                prompt: `A high-concept visual character design sheet for a Sketchic cinematic universe character.
Character Name: [اسم شخصيتك].
Visual Style: [النمط الفني، مثلاً: A 1930s classic rubber-hose cartoon style / Hyperrealistic oil painting].
Details: The character must preserve its distinct artistic strokes, textures, and lines, with clear outlines. Show on a pure neutral background for asset sheet.`
            },
            comic: {
                title: "3. إنتاج القصص المصورة ولوحات القصة (Comics & Storyboards)",
                reqs: "سيناريو معتمد + شخصيتين على الأقل تم تصميمهما بصرياً.",
                steps: [
                    {
                        title: "الخطوة الأولى: إعداد التقسيم الهندسي للوحات",
                        desc: "قم بتخطيط الكوادر (Panels). تذكر أن الصدام المرئي يجب أن يظهر كخطوط فاصلة حادة بين الأساليب، مثل كادر مرسوم بالرصاص يقف أمامه كادر ملون بالكامل."
                    },
                    {
                        title: "الخطوة الثانية: استخدام موجه تقسيم لوحات السيناريو",
                        desc: "استخدم Gemini لتوليد وصف دقيق لكل لوحة (Panel) بناءً على السيناريو الخاص بك."
                    }
                ],
                prompt: `بناءً على السيناريو المرفق، قم بتوليد مخطط تفصيلي لصفحة قصة مصورة (Comic Panel Guide):
- اللوحة 1: وصف كادر الشخصية كايو (الزيتية) بلقطة متوسطة.
- اللوحة 2: دخول الشخصية شين (المانجا) ومستوى التباين البصري واللوني في خط التماس.
- اللوحة 3: لقطة قريبة توضح تفاعل فيزيائي بين نمطين فنيين مختلفين دون اندماجهما.`
            },
            video: {
                title: "4. تحريك وإنتاج الفيديوهات السينمائية (Videos)",
                reqs: "سيناريو + لوحة قصة (Storyboard) جاهزة ومحددة التفاصيل.",
                steps: [
                    {
                        title: "الخطوة الأولى: تجميع الأصول الصوتية والبصرية",
                        desc: "قم بتجهيز الطبقات الفنية كملفات مستقلة. تذكر تطبيق سرعات الحركة المتفاوتة (60 إطاراً للشخصيات الكلاسيكية مقابل 12 أو 24 إطاراً لشخصيات المانجا والكارتون القديم)."
                    },
                    {
                        title: "الخطوة الثانية: موجه Gemini لتوليد الأوامر لبرامج التحريك الذكائي",
                        desc: "استخدم الموجه التالي لصياغة أوامر تفصيلية لتحريك الشخصيات في بيئات الذكاء الاصطناعي للفيديو."
                    }
                ],
                prompt: `Generate a detailed animation prompt for video generator tools (like Runway Gen-3 or Sora):
Subject: A cinematic scene showing a visual clash. One character rendered in high framerate oil paint medium interacts with another character rendered in sharp, hand-drawn black and white manga ink.
Motion: The manga character moves with snappy keyframed animation (12fps feel) while the oil paint knight moves smoothly (60fps feel). High contrast, gorgeous cinematic light.`
            },
            game: {
                title: "5. برمجة الألعاب الكونية القابلة للتحميل (Games)",
                reqs: "أصول شخصيات ثلاثية/ثنائية الأبعاد مرسومة + قصة محددة للمستويات.",
                steps: [
                    {
                        title: "الخطوة الأولى: اختيار محرك التطوير",
                        desc: "ننصح باستخدام Unity أو Godot لبرمجة اللعبة. احرص على استخدام شيدرات (Shaders) مختلفة لكل كاميرا أو لاعب لتمثيل تباين أسلوب الصدام المرئي في اللعبة."
                    },
                    {
                        title: "الخطوة الثانية: توليد موجه فني وبرمجي لهيكل المستوى الأول",
                        desc: "انسخ هذا الموجه واطلب من الذكاء الاصطناعي صياغة الكود أو الهيكل الأولي للمستوى الأول للعبة."
                    }
                ],
                prompt: `Write a game design doc and initial code structure in Godot GDScript for a 2D platformer game set in 'Sketchic'.
The mechanic: The player can toggle their rendering style between 'Manga Style' (allows jumping high, lightweight physics) and 'Oil Painting Style' (heavy weight, breaks floors, immune to wind).
Show how style shaders swap dynamically.`
            }
        };

        const currentGuide = guideData[stageId];

        let stepsHtml = "";
        currentGuide.steps.forEach((step, idx) => {
            stepsHtml += `
                <div class="guide-step-box">
                    <h4><span>📍</span> ${step.title}</h4>
                    <p>${step.desc}</p>
                </div>
            `;
        });

        guideHtml = `
            <div class="guide-header">
                <h3>${currentGuide.title}</h3>
                <p style="color:var(--text-tertiary);margin:5px 0 0 0;"><strong>المتطلبات السابقة:</strong> ${currentGuide.reqs}</p>
            </div>
            
            ${stepsHtml}

            <div class="guide-step-box">
                <h4><span>🤖</span> موجه الذكاء الاصطناعي المقترح لـ Gemini Advanced:</h4>
                <div class="prompt-copy-box">
                    <button class="btn-copy-prompt" id="btn-copy-guide-prompt">نسخ الأمر</button>
                    <pre class="prompt-text">${currentGuide.prompt}</pre>
                </div>
            </div>
        `;

        this.guideContentBody.innerHTML = guideHtml;

        // Copy button event listener
        document.getElementById('btn-copy-guide-prompt').addEventListener('click', () => {
            navigator.clipboard.writeText(currentGuide.prompt);
            const copyBtn = document.getElementById('btn-copy-guide-prompt');
            copyBtn.textContent = "تم النسخ! ✓";
            setTimeout(() => {
                copyBtn.textContent = "نسخ الأمر";
            }, 2000);
        });
    }

    // Tab 4: Render Public Portal Showcase
    renderSimulator() {
        const finishedAssets = this.assets.filter(a => a.status === 'finished');
        
        const creators = finishedAssets.filter(a => a.type === 'creator');
        const scenarios = finishedAssets.filter(a => a.type === 'scenario');
        const characters = finishedAssets.filter(a => a.type === 'character');
        const comics = finishedAssets.filter(a => a.type === 'comic');
        const videos = finishedAssets.filter(a => a.type === 'video');
        const games = finishedAssets.filter(a => a.type === 'game');

        if (finishedAssets.length === 0) {
            this.portalFrame.innerHTML = `
                <div class="portal-body">
                    <div class="portal-hero">
                        <h2>كون سكتشيك السينمائي (Sketchic Portal)</h2>
                        <p>مرحباً بك في البوابة الرسمية لاستكشاف عوالم سكتشيك الفنية التنافسية.</p>
                    </div>
                    <div class="portal-empty-state">
                        <h4>الموقع فارغ حالياً 🌐</h4>
                        <p>لتظهر الأصول هنا، قم بإضافتها وتغيير حالتها الإنتاجية إلى <strong>"منتهي" (Finished)</strong> من مستودع الأصول.</p>
                    </div>
                </div>
            `;
            return;
        }

        // Generate Creators Pantheon HTML
        let creatorsHtml = "";
        if (creators.length > 0) {
            creators.forEach(c => {
                const style = (c.subOptions && c.subOptions.artStyle) ? c.subOptions.artStyle : "أسلوب رسم متفرد";
                const tool = (c.subOptions && c.subOptions.tool) ? c.subOptions.tool : "أداة كونيّة";
                creatorsHtml += `
                    <div class="portal-card" style="border-top: 4px solid #f59e0b; background: linear-gradient(180deg, #ffffff 0%, #fffbeb 100%);">
                        <div class="portal-card-body">
                            <span class="portal-card-meta" style="color:#b45309; font-weight:700;">✍️ رسام كوني (The Drawer)</span>
                            <h4 style="margin: 10px 0 5px 0; font-size:1.2rem;">${c.title}</h4>
                            <div style="font-size:0.75rem; color:#d97706; margin-bottom: 10px;">
                                <span>🎨 الأسلوب الحاكم: ${style}</span><br>
                                <span style="margin-top:2px; display:inline-block;">✍️ الأداة: ${tool}</span>
                            </div>
                            <p style="font-size:0.8rem; line-height:1.5; color:#78350f;">${c.desc}</p>
                        </div>
                    </div>
                `;
            });
        }

        // Generate Character Profiles HTML
        let charsHtml = "";
        if (characters.length > 0) {
            characters.forEach(c => {
                let drawnByText = "";
                if (c.relatedCreator) {
                    const cr = this.assets.find(a => a.id === c.relatedCreator);
                    if (cr) {
                        drawnByText = `بريشة الرسام: ${cr.title}`;
                    }
                }
                
                let factionDetailsHtml = "";
                if (c.relatedFaction) {
                    let factionName = "";
                    let weaponName = "";
                    let factionEmoji = "🛡️";
                    if (c.relatedFaction === 'keepers') {
                        factionName = "حراس الأزمان (Time Keepers)";
                        weaponName = "قلم القياس الكوني";
                        factionEmoji = "📐";
                    } else if (c.relatedFaction === 'erasers') {
                        factionName = "قوى المحو (The Erasers)";
                        weaponName = "ممحاة الفوضى";
                        factionEmoji = "🧹";
                    } else if (c.relatedFaction === 'awakened') {
                        factionName = "الشخصيات المستيقظة (The Awakened)";
                        weaponName = "الرسم الذاتي";
                        factionEmoji = "👁️";
                    }
                    if (factionName) {
                        factionDetailsHtml = `
                            <div style="font-size:0.75rem; margin-top:6px; color:var(--text-secondary); display:flex; flex-direction:column; gap:2px; background:var(--bg-tertiary); padding:6px; border-radius:4px; border:1px solid var(--border-color);">
                                <span>${factionEmoji} <strong>الفصيل:</strong> ${factionName}</span>
                                <span>⚔️ <strong>السلاح:</strong> ${weaponName}</span>
                            </div>
                        `;
                    }
                }

                charsHtml += `
                    <div class="character-profile-card">
                        <div class="character-avatar">👤</div>
                        <div class="character-info">
                            <h4>${c.title}</h4>
                            ${drawnByText ? `<span style="font-size:0.75rem; color:#b45309; font-weight:700; margin-bottom:4px; display:block;">✍️ ${drawnByText}</span>` : ''}
                            <p style="margin-top:4px;">${c.desc}</p>
                            ${factionDetailsHtml}
                        </div>
                    </div>
                `;
            });
        } else {
            charsHtml = `<p class="portal-empty-state" style="padding:1rem;width:100%;">لم يتم إضافة أي شخصيات منتهية لعرضها بعد.</p>`;
        }

        // Generate Scenarios / Lore
        let scenariosHtml = "";
        if (scenarios.length > 0) {
            scenarios.forEach(s => {
                let layerText = s.subOptions ? (s.subOptions.parallelLayer || "Layer 1") : "Layer 1";
                let fpsText = s.subOptions ? (s.subOptions.framerate || "24fps") : "24fps";
                
                scenariosHtml += `
                    <div class="portal-card" style="grid-column: 1 / -1; border-top: 4px solid var(--color-accent)">
                        <div class="portal-card-body">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span class="portal-card-meta">📝 سيناريو رئيسي</span>
                                <span class="portal-card-meta" style="color:var(--color-accent); font-weight:bold;">📂 ${layerText} • ⏱️ ${fpsText}</span>
                            </div>
                            <h4 style="font-size:1.4rem;margin:10px 0;">${s.title}</h4>
                            <p>${s.desc}</p>
                            <div class="portal-card-action">
                                <a href="${s.driveUrl}" target="_blank" class="portal-btn portal-btn-primary">قراءة السيناريو الكامل على Google Docs</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Generate Comics
        let comicsHtml = "";
        if (comics.length > 0) {
            comics.forEach(c => {
                let physicsText = "";
                if (c.interfacePhysics) {
                    if (c.interfacePhysics === 'chromatic') {
                        physicsText = "فيزياء القص اللوني";
                    } else if (c.interfacePhysics === 'gravity') {
                        physicsText = "فيزياء عدم توافق الجاذبية";
                    } else if (c.interfacePhysics === 'speech') {
                        physicsText = "فيزياء فقاعات الكلام المادية";
                    }
                }
                comicsHtml += `
                    <div class="portal-card">
                        <div class="portal-card-img-placeholder">📚</div>
                        <div class="portal-card-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                                <span class="portal-card-meta">📚 قصة مصورة</span>
                                ${physicsText ? `<span class="portal-card-meta" style="color:var(--color-cyan); font-weight:bold;">⚙️ ${physicsText}</span>` : ''}
                            </div>
                            <h4>${c.title}</h4>
                            <p>${c.desc}</p>
                            <div style="font-size:0.75rem; color:var(--color-green); font-weight:bold; margin-bottom:12px; display:flex; align-items:center; gap:4px;">
                                <span>🛡️</span> <span>معايير ميثاق المخرج مطبقة بالكامل</span>
                            </div>
                            <div class="portal-card-action">
                                <a href="${c.driveUrl}" target="_blank" class="portal-btn portal-btn-outline">تصفح القصة المصورة</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Generate Videos
        let videosHtml = "";
        if (videos.length > 0) {
            videos.forEach(v => {
                let physicsText = "";
                if (v.interfacePhysics) {
                    if (v.interfacePhysics === 'chromatic') {
                        physicsText = "فيزياء القص اللوني";
                    } else if (v.interfacePhysics === 'gravity') {
                        physicsText = "فيزياء عدم توافق الجاذبية";
                    } else if (v.interfacePhysics === 'speech') {
                        physicsText = "فيزياء فقاعات الكلام المادية";
                    }
                }
                videosHtml += `
                    <div class="portal-card">
                        <div class="portal-card-img-placeholder" style="background:linear-gradient(135deg, #fee2e2, #fecaca)">🎬</div>
                        <div class="portal-card-body">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                                <span class="portal-card-meta">🎬 فيديو سينمائي</span>
                                ${physicsText ? `<span class="portal-card-meta" style="color:var(--color-cyan); font-weight:bold;">⚙️ ${physicsText}</span>` : ''}
                            </div>
                            <h4>${v.title}</h4>
                            <p>${v.desc}</p>
                            <div style="font-size:0.75rem; color:var(--color-green); font-weight:bold; margin-bottom:12px; display:flex; align-items:center; gap:4px;">
                                <span>🛡️</span> <span>معايير ميثاق المخرج مطبقة بالكامل</span>
                            </div>
                            <div class="portal-card-action">
                                <a href="${v.driveUrl}" target="_blank" class="portal-btn portal-btn-outline">تشغيل المقطع</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Generate Games
        let gamesHtml = "";
        if (games.length > 0) {
            games.forEach(g => {
                gamesHtml += `
                    <div class="portal-card">
                        <div class="portal-card-img-placeholder" style="background:linear-gradient(135deg, #d1fae5, #a7f3d0)">🎮</div>
                        <div class="portal-card-body">
                            <span class="portal-card-meta">🎮 لعبة للتحميل</span>
                            <h4>${g.title}</h4>
                            <p>${g.desc}</p>
                            <div style="font-size:0.75rem; color:var(--color-green); font-weight:bold; margin-bottom:12px; display:flex; align-items:center; gap:4px;">
                                <span>🛡️</span> <span>معايير ميثاق المخرج مطبقة بالكامل</span>
                            </div>
                            <div class="portal-card-action">
                                <a href="${g.driveUrl}" target="_blank" class="portal-btn portal-btn-primary">تحميل اللعبة من Drive</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        this.portalFrame.innerHTML = `
            <div class="portal-body">
                <!-- Portal Hero -->
                <div class="portal-hero">
                    <h2>بوابة أصول كون "سكتشيك" السينمائي</h2>
                    <p>المعرض العام المتفاعل لاستعراض فصول الميثاق وخطوط التماس الفنية.</p>
                </div>

                <!-- Interactive Visual Clash Showcase -->
                <div class="clash-showcase-container">
                    <h3 class="clash-title">تطبيق نظرية الصدام المرئي (Visual Clash Theory)</h3>
                    <div class="clash-split-view">
                        <div class="clash-panel clash-panel-manga">
                            <h3>MANGA DIMENSION</h3>
                            <p>أحادي اللون، خطوط حبر سوداء خشنة وحادة، وتعبيرات بصرية فائقة. يتحرك بسرعة 12 إطاراً في الثانية وبفيزياء خفيفة ومطاطية.</p>
                        </div>
                        <div class="clash-panel clash-panel-oil">
                            <h3>CLASSICAL OIL DIMENSION</h3>
                            <p>ألوان غنية مستوحاة من لوحات عصر النهضة، إضاءة ناعمة ووقورة وتدرجات ظلال تشياروسكورو. يتحرك بـ 60 إطاراً في الثانية وثقيل الحركة.</p>
                        </div>
                    </div>
                </div>

                <!-- Cosmic Creators Pantheon -->
                ${creators.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>بانثيون الرسامين الكونيين (Creators Pantheon)</h3>
                        <span class="section-tag" style="background-color:#d97706; color:#ffffff;">آلهة الخلق الفني</span>
                    </div>
                    <div class="portal-grid">
                        ${creatorsHtml}
                    </div>
                </div>
                ` : ''}

                <!-- Finished Scenarios -->
                ${scenarios.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>الحبكة وسرد القصص الكونية</h3>
                        <span class="section-tag">سرد وأحداث</span>
                    </div>
                    <div class="portal-grid">
                        ${scenariosHtml}
                    </div>
                </div>
                ` : ''}

                <!-- Character Profiles -->
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>دليل الشخصيات النشطة</h3>
                        <span class="section-tag">أبطال العوالم</span>
                    </div>
                    <div class="characters-flex">
                        ${charsHtml}
                    </div>
                </div>

                <!-- Comics Section -->
                ${comics.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>القصص المصورة والمسودات</h3>
                        <span class="section-tag">لوحات ثابتة</span>
                    </div>
                    <div class="portal-grid">
                        ${comicsHtml}
                    </div>
                </div>
                ` : ''}

                <!-- Videos Section -->
                ${videos.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>المقاطع والمشاهد السينمائية</h3>
                        <span class="section-tag">تحريك وصوت</span>
                    </div>
                    <div class="portal-grid">
                        ${videosHtml}
                    </div>
                </div>
                ` : ''}

                <!-- Games Section -->
                ${games.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>تجارب تفاعلية قابلة للتحميل</h3>
                        <span class="section-tag">لعب وتحميل</span>
                    </div>
                    <div class="portal-grid">
                        ${gamesHtml}
                    </div>
                </div>
                ` : ''}
                
                <footer style="text-align:center;padding:3rem 1.5rem;background-color:#ffffff;border-top:1px solid #e2e8f0;margin-top:4rem;font-size:0.85rem;color:#64748b;">
                    المعرض العام لكون سكتشيك السينمائي • جميع الحقوق محفوظة لخطوط الوجود الأولى © 2026
                </footer>
            </div>
        `;
    }

    publishToGithub() {
        const finishedAssets = this.assets.filter(a => a.status === 'finished');
        
        if (finishedAssets.length === 0) {
            alert("تنبيه: لا يوجد أي أصول منتهية (Finished) في مستودع الأصول لتصديرها. يرجى تعديل حالة أصل واحد على الأقل ليصبح 'منتهي وجاهز للعرض' قبل عملية النشر.");
            return;
        }

        // Change button visual state to saving
        const originalText = this.btnPublishGithub.innerHTML;
        this.btnPublishGithub.disabled = true;
        this.btnPublishGithub.innerHTML = `<span>⏳</span> <span>جاري التصدير...</span>`;

        fetch('/api/publish', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finishedAssets)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                if (data.pushed) {
                    alert("تم تصدير ونشر الأصول بنجاح وتحديثها على GitHub! 🎉\n\nتم رفع التحديثات مباشرة إلى مستودع GitHub الخاص بك، وستظهر صفحة الجمهور العامة المحدثة في غضون دقائق.");
                } else {
                    const errorMsg = data.error || 'تعذر التحديث التلقائي في GitHub.';
                    alert(`⚠️ تم تصدير الأصول محلياً بنجاح، ولكن فشل الرفع التلقائي إلى GitHub.\n\nالسبب:\n${errorMsg}\n\n💡 خطوات الإعداد الموصى بها:\n1. افتح منفذ الأوامر (Terminal) في مجلد المشروع:\n   \`c:\\Sketchic World\`\n2. اكتب: \`git init\` لتأهيل المجلد كمستودع Git (إذا لم يكن كذلك).\n3. اربطه بمستودع GitHub الخاص بك:\n   \`git remote add origin <رابط_مستودع_جيت_هوب>\`\n4. قم بإعداد بيانات الاعتماد الخاصة بك لرفع الملفات تلقائياً (Credentials).\n5. يمكنك النشر يدوياً الآن بتشغيل:\n   git add public_assets.json index.html portal.js style.css logo.jpg\n   git commit -m "Manual update"\n   git push -u origin main`);
                }
            } else {
                alert("حدث خطأ أثناء تصدير الملف: " + data.error);
            }
        })
        .catch(err => {
            console.error('Error publishing assets:', err);
            alert("فشل التصدير: تعذر الاتصال بالخادم المحلي لتحديث ملف public_assets.json. تأكد من أن الخادم يعمل.");
        })
        .finally(() => {
            this.btnPublishGithub.disabled = false;
            this.btnPublishGithub.innerHTML = originalText;
        });
    }
}

// Instantiate the App on window load
window.addEventListener('DOMContentLoaded', () => {
    window.app = new SketchicApp();
});
