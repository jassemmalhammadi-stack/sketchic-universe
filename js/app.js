/* ==========================================
   Sketchic Production Hub - Core Logic & SPA State (Updated)
   ========================================== */

// Default mock assets to seed the application initially
const MOCK_ASSETS = [];

// App State Manager
class SketchicApp {
    constructor() {
        // Force reset database once for a fresh startup as requested
        const initializedClean = localStorage.getItem('sketchic_clean_v4');
        if (!initializedClean) {
            localStorage.setItem('sketchic_assets', JSON.stringify([]));
            localStorage.setItem('sketchic_scenes', JSON.stringify([]));
            localStorage.setItem('sketchic_clean_v4', 'true');
        }

        this.assets = this.loadAssets();
        this.scenes = this.loadScenes();
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
        this.groupRelatedSource = document.getElementById('group-related-source');
        this.relatedSourceSelect = document.getElementById('asset-related-source');
        this.btnExtractAssets = document.getElementById('btn-extract-assets');
        this.aiExtractionPanel = document.getElementById('ai-extraction-panel');
        this.extractedAssetsList = document.getElementById('extracted-assets-list');
        
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

        // Manuals Elements
        this.btnManuals = document.getElementById('btn-manuals');

        // Simulator element
        this.portalFrame = document.getElementById('portal-frame');

        // Scene Builder Elements
        this.sceneForm = document.getElementById('scene-form');
        this.sceneIdInput = document.getElementById('scene-id');
        this.sceneTitleInput = document.getElementById('scene-title');
        this.sceneScenarioSelect = document.getElementById('scene-scenario');
        this.sceneCharactersContainer = document.getElementById('scene-characters-container');
        this.sceneComicSelect = document.getElementById('scene-comic');
        this.sceneVideoSelect = document.getElementById('scene-video');
        this.scenesTimelineList = document.getElementById('scenes-timeline-list');
        this.sceneConsistencyPromptText = document.getElementById('scene-consistency-prompt-text');
        this.btnCopyScenePrompt = document.getElementById('btn-copy-scene-prompt');
        this.clashPreviewStage = document.getElementById('clash-preview-stage');
        this.btnClearScene = document.getElementById('btn-clear-scene');
        this.sceneDialogueInput = document.getElementById('scene-dialogue');
        this.sceneAudioProfileSelect = document.getElementById('scene-audio-profile');
        this.btnAutoStoryboard = document.getElementById('btn-auto-storyboard');
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
        this.relatedScenarioSelect.addEventListener('change', () => {
            this.handleAssetTypeChange();
            this.updateSuggestedPrompt();
        });
        this.relatedSourceSelect.addEventListener('change', () => {
            this.updateSuggestedPrompt();
        });
        if (this.btnExtractAssets) {
            this.btnExtractAssets.addEventListener('click', () => this.extractAssetsFromSource());
        }
        this.assetStatusSelect.addEventListener('change', () => this.toggleChecklistDisplay());
        this.relatedFactionSelect.addEventListener('change', () => this.updateSuggestedPrompt());
        this.interfacePhysicsSelect.addEventListener('change', () => this.updateSuggestedPrompt());
        this.relatedCreatorSelect.addEventListener('change', () => this.updateSuggestedPrompt());

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

        // Scene form bindings
        if (this.sceneForm) {
            this.sceneForm.addEventListener('submit', (e) => this.handleSceneSubmit(e));
        }
        if (this.btnClearScene) {
            this.btnClearScene.addEventListener('click', () => this.clearSceneForm());
        }
        if (this.btnCopyScenePrompt) {
            this.btnCopyScenePrompt.addEventListener('click', () => {
                navigator.clipboard.writeText(this.sceneConsistencyPromptText.textContent);
                this.btnCopyScenePrompt.textContent = "تم النسخ!";
                setTimeout(() => {
                    this.btnCopyScenePrompt.textContent = "نسخ";
                }, 2000);
            });
        }
        if (this.sceneScenarioSelect) {
            this.sceneScenarioSelect.addEventListener('change', () => this.updateSceneConsistencyPrompt());
        }
        if (this.sceneDialogueInput) {
            this.sceneDialogueInput.addEventListener('input', () => this.updateClashPreview());
        }
        if (this.sceneAudioProfileSelect) {
            this.sceneAudioProfileSelect.addEventListener('change', () => {
                this.updateSceneConsistencyPrompt();
                this.updateClashPreview();
            });
        }
        if (this.btnAutoStoryboard) {
            this.btnAutoStoryboard.addEventListener('click', () => this.autoGenerateStoryboard());
        }
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
        } else if (tabId === 'scenes') {
            this.initSceneTabOptions();
            this.renderScenesList();
        } else if (tabId === 'simulator') {
            this.renderSimulator();
        } else if (tabId === 'dashboard') {
            this.updateStats();
            this.renderPipelineCounts();
        } else if (tabId === 'manuals') {
            // Manuals tab activated
        }
    }

    updateStats() {
        const total = this.assets.length;
        const draft = this.assets.filter(a => a.status === 'draft').length;
        const finished = this.assets.filter(a => a.status === 'finished').length;

        if (this.statTotal) this.statTotal.textContent = total;
        if (this.statDraft) this.statDraft.textContent = draft;
        if (this.statFinished) this.statFinished.textContent = finished;

        // Smart production recommendation based on counts
        const creators = this.assets.filter(a => a.type === 'creator' && a.status === 'finished');
        const scenarios = this.assets.filter(a => a.type === 'scenario' && a.status === 'finished');
        const environments = this.assets.filter(a => a.type === 'environment' && a.status === 'finished');
        const characters = this.assets.filter(a => a.type === 'character' && a.status === 'finished');
        const voices = this.assets.filter(a => a.type === 'voice' && a.status === 'finished');
        const musics = this.assets.filter(a => a.type === 'music' && a.status === 'finished');
        const comics = this.assets.filter(a => a.type === 'comic' && a.status === 'finished');
        const videos = this.assets.filter(a => a.type === 'video' && a.status === 'finished');
        const games = this.assets.filter(a => a.type === 'game' && a.status === 'finished');

        let recText = "";
        if (creators.length === 0) {
            recText = "✍️ ابدأ بصياغة أول رسام كوني! الرسامون هم الكيانات التي تصيغ الأساليب وتحدد فيزياء الوجود والمادة للشخصيات.";
        } else if (scenarios.length === 0) {
            recText = "📝 ابدأ بكتابة أول سيناريو لكون سكتشيك! لا يمكنك إنتاج بقية الأصول دون وجود سيناريو مكتوب لتقسيم القصة.";
        } else if (environments.length === 0) {
            recText = "🌌 ابدأ بتصميم عالم وبيئة رسم (Environment) لتوطيد جغرافية وقوانين موقعك الكوني.";
        } else if (characters.length === 0) {
            recText = "🎨 قم بتصميم شخصية كرتونية أو مانجا أولى وربطها برسام صانع لتحديد شكلها الفيزيائي.";
        } else if (voices.length === 0) {
            recText = "🎙️ حان الوقت لإنشاء أول ملف صوت كوني (Cosmic Voice Profile) للشخصيات باستخدام Gemini TTS لتكسبهم بعداً صوتياً متميزاً.";
        } else if (musics.length === 0) {
            recText = "🎵 خطوتك التالية هي توليد أول ملف موسيقى كوني (Cosmic Music Profile) عبر Suno/Udio لربطه بالسيناريو وتحديد نغمة العمل.";
        } else if (comics.length === 0) {
            recText = "📚 لديك سيناريوهات وشخصيات وأصوات وموسيقى جاهزة! الخطوة المثالية التالية هي صياغة أول قصة مصورة (Comic) أو لوحة سيناريو (Storyboard) لتمثيل الصدام.";
        } else if (videos.length === 0) {
            recText = "🎬 ممتاز! حان الوقت لإنتاج أول فيديو متحرك (Video) لتجسيد الحركة المتنافرة وتطبيق ميثاق الإطارات الكوني.";
        } else if (games.length === 0) {
            recText = "🎮 خطوتك المتقدمة التالية هي برمجة لعبة بسيطة قابلة للتحميل لعالم سكتشيك، كطريقة لتفاعلية الكون.";
        } else {
            recText = "🌐 واو! لديك أصول جاهزة في كل المراحل. قم بنشرها كلها وتحديث حالة الأصول لتراها منعكسة فوراً في موقعك العام.";
        }
        if (this.recBox) this.recBox.innerHTML = recText;
    }

    renderPipelineCounts() {
        const counts = {
            scenario: 0,
            environment: 0,
            character: 0,
            voice: 0,
            music: 0,
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
        this.editingAssetId = 'asset-' + Date.now(); // Pre-generate ID to support sub-asset linkage
        this.modalTitle.textContent = "إضافة أصل جديد";
        this.assetIdInput.value = "";
        this.assetForm.reset();
        this.prereqBox.style.display = "none";
        this.groupRelatedScenario.style.display = "none";
        this.groupRelatedSource.style.display = "none";
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
        if (this.aiExtractionPanel) this.aiExtractionPanel.style.display = "none";
        if (this.extractedAssetsList) this.extractedAssetsList.innerHTML = "";
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
        this.relatedSourceSelect.value = asset.relatedSource || "";

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

        if (this.aiExtractionPanel) this.aiExtractionPanel.style.display = "none";
        if (this.extractedAssetsList) this.extractedAssetsList.innerHTML = "";

        this.toggleChecklistDisplay();
        this.modal.classList.add('open');
    }

    closeModal() {
        this.modal.classList.remove('open');
        // Do not clear editingAssetId here if we need it, but it's safe to clear now
        this.editingAssetId = null;
        if (this.aiExtractionPanel) this.aiExtractionPanel.style.display = "none";
        if (this.extractedAssetsList) this.extractedAssetsList.innerHTML = "";
    }

    extractAssetsFromSource() {
        const sourceId = this.relatedSourceSelect.value;
        if (!sourceId) {
            alert("الرجاء اختيار مصدر سردي أولاً للاستكشاف!");
            return;
        }

        const source = this.assets.find(a => a.id === sourceId);
        if (!source) {
            alert("المصدر السردي المحدد غير موجود!");
            return;
        }

        const theme = (source.subOptions && source.subOptions.theme) || (source.subOptions && source.subOptions.sourceTheme) || "";
        const plot = (source.subOptions && source.subOptions.plot) || (source.subOptions && source.subOptions.sourcePlot) || "";
        const setting = (source.subOptions && source.subOptions.setting) || (source.subOptions && source.subOptions.sourceSetting) || "";

        // Generate proposed assets based on source content
        const proposed = [
            {
                type: 'creator',
                title: `الرسام الكوني لـ (${source.title})`,
                desc: `الرسام المسؤول عن تجسيد وتحديد الأسلوب الفني والأداة الكونية لـ: ${source.title}.`,
                subOptions: { artStyle: 'لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)', tool: 'فرشاة شعر السنجاب الغليظة المشبعة بالزيت' }
            },
            {
                type: 'character',
                title: `شخصية: البطل المستيقظ من (${source.title})`,
                desc: `شخصية قيادية مستوحاة من الصراع السردي: ${plot.substring(0, 100) || "صراع الأبعاد والفصائل الكونية"}...`,
                subOptions: { charClass: 'شخصية مستيقظة تدرك أنها مرسومة (Awakened)' },
                relatedFaction: 'awakened'
            },
            {
                type: 'environment',
                title: `بيئة: موقع صدام الأبعاد في (${source.title})`,
                desc: `موقع سينمائي ذو طابع فريد مستوحى من الخلفية المكانية: ${setting.substring(0, 100) || "خط التماس المباشر بين بوابات الرسم الحبرية الخشنة واللوحات الزيتية"}...`,
                subOptions: { envType: 'داخل لوحة قماشية مائعة (Fluid Canvas Interior)', clashDensity: 'متوسطة (تداخل الضوء والجاذبية)' }
            },
            {
                type: 'music',
                title: `ساوندتراك: لحن الأثير لـ (${source.title})`,
                desc: `مقطوعة موسيقية تصويرية تعبر عن المغزى المحوري: ${theme.substring(0, 100) || "صراع أبعاد الرسم المتنافرة"}...`,
                subOptions: { musicEngine: 'Suno AI', musicGenre: 'Epic Orchestral', musicTempo: 'Medium/Dramatic', musicInstruments: 'Acoustic Strings' }
            }
        ];

        this.extractedAssetsList.innerHTML = "";
        proposed.forEach((p, idx) => {
            const item = document.createElement('div');
            item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.8rem; margin-top: 4px;";
            
            const info = document.createElement('div');
            info.style.cssText = "display: flex; flex-direction: column; gap: 2px; text-align: right;";
            info.innerHTML = `<strong style="color:var(--text-primary)">${p.title}</strong><div style="font-size:0.7rem; color:var(--text-secondary);">${p.desc.substring(0, 70)}...</div>`;
            
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = "btn";
            btn.style.cssText = "background-color: var(--color-success); color: #fff; font-size: 0.72rem; padding: 4px 10px; border: none; cursor: pointer; border-radius: 3px; font-weight: bold;";
            btn.textContent = "اعتماد وإضافة";
            
            btn.addEventListener('click', () => {
                const newAssetId = 'asset-extracted-' + Date.now() + '-' + idx;
                const newAsset = {
                    id: newAssetId,
                    type: p.type,
                    title: p.title,
                    desc: p.desc,
                    driveUrl: "https://drive.google.com/drive/folders/extracted-mock-folder",
                    status: 'draft',
                    relatedScenario: this.editingAssetId,
                    relatedCreator: this.relatedCreatorSelect.value || "",
                    relatedSource: sourceId,
                    relatedFaction: p.relatedFaction || "",
                    relatedCharacters: [],
                    interfacePhysics: "",
                    directorChecklist: { noBlending: false, depthContrast: false, sonicDissonance: false },
                    usedPrompt: `توليد أصل مقترح من المصدر السردي: ${source.title}`,
                    subOptions: p.subOptions,
                    createdAt: new Date().toISOString()
                };
                
                this.assets.push(newAsset);
                this.saveAssets();
                
                btn.disabled = true;
                btn.style.backgroundColor = "var(--text-tertiary)";
                btn.textContent = "✅ تم الاعتماد";
            });

            item.appendChild(info);
            item.appendChild(btn);
            this.extractedAssetsList.appendChild(item);
        });

        this.aiExtractionPanel.style.display = "block";
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

    validateScenarioCompletion(scenarioId) {
        if (!scenarioId) return { complete: false, details: [] };
        
        const linkedAssets = this.assets.filter(a => a.relatedScenario === scenarioId);
        
        const finishedEnvironments = linkedAssets.filter(a => a.type === 'environment' && a.status === 'finished');
        const finishedCharacters = linkedAssets.filter(a => a.type === 'character' && a.status === 'finished');
        const finishedVoices = linkedAssets.filter(a => a.type === 'voice' && a.status === 'finished');
        const finishedMusic = linkedAssets.filter(a => a.type === 'music' && a.status === 'finished');
        
        const details = [
            { label: "🌌 تصميم البيئة والموقع (Environment)", status: finishedEnvironments.length > 0, count: finishedEnvironments.length },
            { label: "🎨 تصميم الشخصيات (Characters)", status: finishedCharacters.length >= 2, count: finishedCharacters.length, minNeeded: 2 },
            { label: "🎙️ أصوات الشخصيات (Voices)", status: finishedVoices.length > 0, count: finishedVoices.length },
            { label: "🎵 الموسيقى التصويرية (Music)", status: finishedMusic.length > 0, count: finishedMusic.length }
        ];
        
        const complete = details.every(d => d.status);
        return { complete, details };
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

        if (type === 'scenario' || type === 'creator') {
            this.groupRelatedSource.style.display = 'block';
        } else {
            this.groupRelatedSource.style.display = 'none';
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

        // Populate Related Source Dropdown
        const sources = this.assets.filter(a => a.type === 'source');
        this.relatedSourceSelect.innerHTML = '<option value="">لا يوجد مصدر سردي مرتبط (أو اختر مصدراً...)</option>';
        sources.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.title;
            this.relatedSourceSelect.appendChild(opt);
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
        
        if (type === 'source') {
            this.groupRelatedScenario.style.display = "none";
            this.groupRelatedCharacters.style.display = "none";
            this.groupRelatedCreator.style.display = "none";
            this.groupRelatedSource.style.display = "none";
            
            warningHtml = `
                <div class="prereq-title" style="color:var(--color-cyan)">📖 إرشاد المصدر السردي الأصلي</div>
                <p>قم بتوثيق الرواية أو القصة أو الفكرة الأساسية لكون سكتشيك. سيتم اشتقاق السيناريوهات واللوحات منها لاحقاً لضمان ثبات الهوية السردية.</p>
            `;
        } else if (type === 'creator') {
            this.groupRelatedScenario.style.display = "none";
            this.groupRelatedCharacters.style.display = "none";
            this.groupRelatedCreator.style.display = "none";
            this.groupRelatedSource.style.display = "block";
            
            const sources = this.assets.filter(a => a.type === 'source');
            if (sources.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: المصادر السردية مفقودة</div>
                    <p>أنت بحاجة لتسجيل مصدر سردي واحد على الأقل لربط الرسام الكوني به وتحديد أسلوب عوالمه.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title">✍️ إرشاد صياغة الرسام الكوني</div>
                    <p>حدد الأسلوب الفني الحاكم والأداة المميزة للرسام واربطه بالمصدر السردي. سيقوم النظام بتأصيل فيزيائه الكونية وتوزيعها تلقائياً.</p>
                `;
            }
        } else if (type === 'scenario') {
            this.groupRelatedScenario.style.display = "none";
            this.groupRelatedCharacters.style.display = "none";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedSource.style.display = "block";
            
            if (sources.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: المصادر السردية مفقودة</div>
                    <p>أنت بحاجة لتسجيل مصدر سردي واحد على الأقل (رواية أو قصة أصلية) للاشتقاق وكتابة السيناريو منه.</p>
                `;
            } else if (creators.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: لا يوجد رسامون</div>
                    <p>أنت بحاجة لتحديد رسام كوني واحد على الأقل ليقوم برسم وتجسيد الأسلوب الفني الأساسي لهذا السيناريو.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title">📝 إرشاد بناء السيناريو</div>
                    <p>السيناريو هو نواة العالم. اربط السيناريو بالرسام الكوني الحاكم والمصدر السردي لتحديد الأسلوب الفني وتوليد البرومبت المقترح.</p>
                `;
            }

            if (editData) {
                if (editData.relatedCreator) this.relatedCreatorSelect.value = editData.relatedCreator;
                if (editData.relatedSource) this.relatedSourceSelect.value = editData.relatedSource;
            }
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

        } else if (type === 'environment') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedCharacters.style.display = "none";

            if (creators.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: لا يوجد رسامون</div>
                    <p>أنت بحاجة لتحديد رسام كوني واحد على الأقل ليقوم برسم وتأصيل هذه البيئة وضبط تباينها الجمالي.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-cyan)">🌌 إرشاد تصميم العوالم والبيئات</div>
                    <p>اربط البيئة أو العالم بالسيناريو وبالرسام الصانع ليرث خواصه الجمالية وقوانين الفرشاة والخطوط تلقائياً.</p>
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

            const selectedScenId = editData ? editData.relatedScenario : this.relatedScenarioSelect.value;
            const validation = this.validateScenarioCompletion(selectedScenId);

            if (scenarios.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ متطلبات ناقصة لإنشاء القصة المصورة</div>
                    <p>لإضافة قصة مصورة تحتاج على الأقل إلى سيناريو واحد.</p>
                `;
            } else if (!selectedScenId) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ يرجى ربط وتحديد السيناريو أولاً</div>
                    <p>اختر السيناريو المرتبط لتفعيل فحص اكتمال الأصول (بوابات التثبيت البصرية).</p>
                `;
            } else if (!validation.complete) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                let checklistHtml = validation.details.map(d => {
                    let statusIcon = d.status ? "✅ جاهز" : "❌ مفقود/قيد العمل";
                    let color = d.status ? "var(--color-success)" : "var(--color-danger)";
                    let countInfo = d.minNeeded ? `(المتوفر: ${d.count} من ${d.minNeeded})` : `(المتوفر: ${d.count})`;
                    return `<li style="color:${color}; font-weight:bold; margin-bottom:4px;">${d.label}: ${statusIcon} ${countInfo}</li>`;
                }).join('');

                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ بوابة الإنتاج مغلقة: أصول السيناريو غير مكتملة!</div>
                    <p>لا يمكنك البدء بتشكيل لوحة القصة (Storyboard) إلا بعد استخراج وتجهيز كافة الأصول الأساسية المرتبطة بالسيناريو المختار:</p>
                    <ul style="padding-right: 1.2rem; margin-top: 6px; list-style-type: none;">
                        ${checklistHtml}
                    </ul>
                `;
            } else {
                this.prereqBox.className = "prereq-guide-box";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-success)">🎉 بوابة الإنتاج مفتوحة: كافة الأصول مكتملة!</div>
                    <p>أحسنت! جميع الشخصيات، والبيئات، والأصوات، والموسيقى جاهزة ومنتهية للسيناريو المختار. يمكنك الآن إطلاق وتصميم الـ Storyboard بأمان.</p>
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
        } else if (type === 'voice') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "none";
            this.groupRelatedCharacters.style.display = "block";

            if (characters.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: لا يوجد شخصيات</div>
                    <p>أنت بحاجة لتصميم شخصية واحدة على الأقل لربط الملف الصوتي بها.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-cyan)">🎙️ إرشاد الأصوات الكونية</div>
                    <p>صمم البصمة الصوتية التعبيرية واربطها بالشخصية والسيناريو لتفعيل الأداء الصوتي في باني المشاهد.</p>
                `;
            }

            if (editData) {
                if (editData.relatedScenario) this.relatedScenarioSelect.value = editData.relatedScenario;
            }
        } else if (type === 'music') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "none";
            this.groupRelatedFaction.style.display = "none";
            this.groupRelatedCharacters.style.display = "block";

            if (scenarios.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: لا يوجد سيناريوهات</div>
                    <p>أنت بحاجة لتأليف سيناريو واحد على الأقل لربط الملف الموسيقي به وتحديد النغمة الحاكمة.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-cyan)">🎵 إرشاد الموسيقى الكونية</div>
                    <p>صمم البصمة الموسيقية والساوندتراك، واربطها بالسيناريو والشخصيات لتحديد الألحان الحاكمة.</p>
                `;
            }

            if (editData) {
                if (editData.relatedScenario) this.relatedScenarioSelect.value = editData.relatedScenario;
            }
        }

        this.prereqBox.innerHTML = warningHtml;
        this.renderDynamicOptions(type, editData);
    }

    renderDynamicOptions(type, editData = null) {
        this.dynamicOptionsContainer.innerHTML = "";
        this.groupSuggestedPrompt.style.display = "block";

        let optionsHtml = "";

        if (type === 'source') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-sourceType">نوع المصدر السردي *</label>
                    <select id="opt-sourceType" required>
                        <option value="رواية كوكبية طويلة (Novel)">رواية كوكبية طويلة (Novel)</option>
                        <option value="قصة قصيرة (Short Story)">قصة قصيرة (Short Story)</option>
                        <option value="أسطورة شعبية أو فلكلور أبعاد (Folklore)">أسطورة شعبية أو فلكلور أبعاد (Folklore)</option>
                        <option value="مسودة فكرة أصلية (Concept Draft)">مسودة فكرة أصلية (Concept Draft)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-sourceAuthor">المؤلف السردي الأصلي *</label>
                    <input type="text" id="opt-sourceAuthor" placeholder="اسم الكاتب أو المرجع..." value="الكاتب الكوني الأول" required>
                </div>
                <div class="form-group">
                    <label for="opt-sourceWordCount">عدد الكلمات التقريبي *</label>
                    <input type="number" id="opt-sourceWordCount" placeholder="مثال: 5000..." value="1500" required>
                </div>
                <div class="form-group">
                    <label for="opt-sourceTheme">الفكرة والمغزى المحوري للقصة *</label>
                    <textarea id="opt-sourceTheme" rows="2" placeholder="اكتب الفكرة الفلسفية أو المغزى الرئيسي الحاكم للمصدر السردي..." required>صراع بين أبعاد الرسم المتنافرة وفكرة استحالة الاندماج الكامل للطبقات الزمنية البصرية</textarea>
                </div>
                <div class="form-group">
                    <label for="opt-sourcePlot">الحبكة الكونية والصراع الرئيسي *</label>
                    <textarea id="opt-sourcePlot" rows="2" placeholder="اكتب الحبكة الكونية والصراع الأساسي بين الشخصيات أو الفصائل..." required>استيقاظ شخصية من البعد ثنائي الأبعاد ومحاولتها الهرب إلى البعد الزيتي ثلاثي الأبعاد مما يؤدي لتداخل الأبعاد وتنافر الجاذبية والخطوط</textarea>
                </div>
                <div class="form-group">
                    <label for="opt-sourceSetting">البيئة الزمنية والمكانية المقترحة *</label>
                    <textarea id="opt-sourceSetting" rows="2" placeholder="صف الزمان والمكان السردي العام للمشاهد..." required>موقع أثري قديم يقع عند خط التماس المباشر بين بوابات الرسم الحبرية الخشنة واللوحات الزيتية المائعة</textarea>
                </div>
            `;
        } else if (type === 'creator') {
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
                    <label for="opt-scenarioSourceType">نوع المصدر السردي الأصلي (Source Type) *</label>
                    <select id="opt-scenarioSourceType" required>
                        <option value="رواية كوكبية طويلة (Cosmic Novel)">رواية كوكبية طويلة (Cosmic Novel)</option>
                        <option value="قصة قصيرة (Short Story)">قصة قصيرة (Short Story)</option>
                        <option value="أسطورة شعبية أو فلكلور أبعادي (Folklore)">أسطورة شعبية أو فلكلور أبعادي (Folklore)</option>
                        <option value="مسودة فكرة أو فكرة أصلية (Concept Draft)">مسودة فكرة أو فكرة أصلية (Concept Draft)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-scenarioSourceLink">رابط المستند المصدر (Source Link - Google Drive) *</label>
                    <input type="text" id="opt-scenarioSourceLink" placeholder="رابط مستند الرواية أو القصة الأصلية في Drive..." style="font-size: 0.8rem; width: 100%; box-sizing: border-box; padding: 6px; border-radius:4px; border:1px solid var(--border-color);" value="https://docs.google.com/document/d/source-story" required>
                </div>
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
        } else if (type === 'environment') {
            optionsHtml = `
                <div class="form-group">
                     <label for="opt-envType">طبيعة البيئة الكونية *</label>
                     <select id="opt-envType" required>
                         <option value="داخل لوحة قماشية مائعة (Fluid Canvas Interior)">داخل لوحة قماشية مائعة (Fluid Canvas Interior)</option>
                         <option value="جزيرة عائمة مبنية من قصاصات الصحف والورق">جزيرة عائمة مبنية من قصاصات الصحف والورق</option>
                         <option value="غرفة ذات بعدين محاطة بجدران خشبية كلاسيكية 3D">غرفة ذات بعدين محاطة بجدران خشبية كلاسيكية 3D</option>
                         <option value="مدينة سايبربانك مبنية بمتجهات هندسية حادة (Vector City)">مدينة سايبربانك مبنية بمتجهات هندسية حادة (Vector City)</option>
                     </select>
                </div>
                <div class="form-group">
                     <label for="opt-clashDensity">كثافة تداخل الأنماط في الموقع *</label>
                     <select id="opt-clashDensity" required>
                         <option value="منخفضة (حافة تماس رفيعة جداً)">منخفضة (حافة تماس رفيعة جداً)</option>
                         <option value="متوسطة (تداخل الضوء والجاذبية)">متوسطة (تداخل الضوء والجاذبية)</option>
                         <option value="عالية (تداخل الأبنية والأرضيات دون اندماج)">عالية (تداخل الأبنية والأرضيات دون اندماج)</option>
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
        } else if (type === 'voice') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-voiceEngine">محرك الصوت بالذكاء الاصطناعي (Voice Engine) *</label>
                    <select id="opt-voiceEngine" required>
                        <option value="gemini-3.1-flash-tts-preview">gemini-3.1-flash-tts-preview (توليد تعبيري مباشر في Google AI Studio)</option>
                        <option value="Gemini Live (صوت تفاعلي عاطفي فوري)">Gemini Live (صوت تفاعلي عاطفي فوري)</option>
                        <option value="NotebookLM Audio Overview (حوار ثنائي تفاعلي)">NotebookLM Audio Overview (حوار ثنائي تفاعلي)</option>
                        <option value="Google WaveNet/Neural TTS (تعليق سردي ملحمي)">Google WaveNet/Neural TTS (تعليق سردي ملحمي)</option>
                        <option value="Digital Glitch Voice (صوت معدني رقمي متقطع)">صوت معدني رقمي متقطع (Digital Glitch Voice)</option>
                    </select>
                </div>
                <div id="tts-preview-fields" style="display: block; border: 1px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); background: rgba(99, 102, 241, 0.03); margin-top: 10px;">
                    <div style="font-weight: bold; font-size: 0.82rem; color: var(--color-accent); margin-bottom: 8px;">⚙️ إعدادات نموذج Google AI Studio (Voice Settings):</div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label style="font-size: 0.75rem;">المشهد الصوتي الخلفي (Scene) *</label>
                        <input type="text" id="opt-voiceScene" placeholder="مثال: A quiet library / A bustling street at night..." style="font-size: 0.8rem; width: 100%; box-sizing: border-box; padding: 6px; border-radius:4px; border:1px solid var(--border-color);" value="A quiet drawing studio with scratching pencils">
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label style="font-size: 0.75rem;">سياق الكلام والعينة (Sample Context) *</label>
                        <input type="text" id="opt-voiceContext" placeholder="مثال: Whispering a secret / Speaker just finished a battle..." style="font-size: 0.8rem; width: 100%; box-sizing: border-box; padding: 6px; border-radius:4px; border:1px solid var(--border-color);" value="Explaining a secret cosmic drawing rule to a student">
                    </div>
                    <div class="form-group" style="margin-bottom: 8px;">
                        <label style="font-size: 0.75rem;">صوت المتحدث المختار (Speaker Settings) *</label>
                        <select id="opt-voiceSpeaker" style="font-size: 0.8rem; width: 100%; padding: 6px; border-radius:4px; border:1px solid var(--border-color);">
                            <option value="Algenib (Gravely, Lower pitch)">Algenib (Gravely, Lower pitch)</option>
                            <option value="Puck (Energetic, Mid pitch)">Puck (Energetic, Mid pitch)</option>
                            <option value="Charon (Calm, Deep voice)">Charon (Calm, Deep voice)</option>
                            <option value="Kore (Bright, Higher pitch)">Kore (Bright, Higher pitch)</option>
                            <option value="Fenrir (Dark, Growling tone)">Fenrir (Dark, Growling tone)</option>
                            <option value="Aoede (Melodic, Soft tone)">Aoede (Melodic, Soft tone)</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label style="font-size: 0.75rem;">مثال لأداء النص بالوسوم التعبيرية (Text with Expressive Tags) *</label>
                        <input type="text" id="opt-voiceTags" placeholder="مثال: [amused] That's a great idea! [laughs]" style="font-size: 0.8rem; width: 100%; box-sizing: border-box; padding: 6px; border-radius:4px; border:1px solid var(--border-color);" value="[thoughtful] Wait, are you saying... [sighs] we are all just drawing lines? [laughs]">
                    </div>
                </div>
            `;
        } else if (type === 'music') {
            optionsHtml = `
                <div class="form-group">
                    <label for="opt-musicEngine">محرك الموسيقى بالذكاء الاصطناعي (Music Engine) *</label>
                    <select id="opt-musicEngine" required>
                        <option value="Suno AI (توليد كامل اللحن مع الكلمات)">Suno AI (توليد كامل اللحن مع الكلمات)</option>
                        <option value="Udio AI (توليد أصوات خلفية كلاسيكية متميزة)">Udio AI (توليد أصوات خلفية كلاسيكية متميزة)</option>
                        <option value="Google Lyria / MusicLM (ألحان خلفية بيئية وتأثيرات)">Google Lyria / MusicLM (ألحان خلفية بيئية وتأثيرات)</option>
                        <option value="Custom Engine (محرك خاص)">Custom Engine (محرك خاص)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-musicGenre">النمط والمزاج الموسيقي (Genre & Vibe) *</label>
                    <select id="opt-musicGenre" required>
                        <option value="Epic Cosmic Orchestral (أوركسترا كونية ملحمية)">Epic Cosmic Orchestral (أوركسترا كونية ملحمية)</option>
                        <option value="Dark Ambient Synthwave (سينث-ويف غامض وبيئي)">Dark Ambient Synthwave (سينث-ويف غامض وبيئي)</option>
                        <option value="Renaissance Acoustic (ألحان ريفية كلاسيكية)">Renaissance Acoustic (ألحان ريفية كلاسيكية)</option>
                        <option value="Galactic Lo-fi (لو-فاي مجري مريح)">Galactic Lo-fi (لو-فاي مجري مريح)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-musicTempo">الإيقاع والسرعة (Tempo) *</label>
                    <select id="opt-musicTempo" required>
                        <option value="Slow / Solemn (بطيء ووقور)">Slow / Solemn (بطيء ووقور)</option>
                        <option value="Medium / Dramatic (متوسط ودرامي)">Medium / Dramatic (متوسط ودرامي)</option>
                        <option value="Fast / Action-packed (سريع وحركي)">Fast / Action-packed (سريع وحركي)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-musicInstruments">الآلات المهيمنة (Key Instruments) *</label>
                    <select id="opt-musicInstruments" required>
                        <option value="Acoustic Strings & Harp (أوتار كلاسيكية وهارب)">Acoustic Strings & Harp (أوتار كلاسيكية وهارب)</option>
                        <option value="Synthesizers & Analog Lead (سينث وألحان تناظرية)">Synthesizers & Analog Lead (سينث وألحان تناظرية)</option>
                        <option value="Epic Timpani & Brass (نحاسيات وملحميات)">Epic Timpani & Brass (نحاسيات وملحميات)</option>
                        <option value="Cosmic Pad & Ethereal Keys (بيانو كوني وألحان سماوية)">Cosmic Pad & Ethereal Keys (بيانو كوني وألحان سماوية)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-musicPrompt">واصفات مخصصة وسياق الأغنية (Custom Descriptors / Lyrics Vibe) *</label>
                    <input type="text" id="opt-musicPrompt" placeholder="مثال: Cinematic climax, space exploration, sudden transition..." style="font-size: 0.8rem; width: 100%; box-sizing: border-box; padding: 6px; border-radius:4px; border:1px solid var(--border-color);" value="Space opera climax with heavy vocal chorus and sharp synth drops">
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
                        <option value="Google Vids (توليد وتلخيص فيديوهات الأعمال الكونية)">Google Vids (توليد وتلخيص فيديوهات الأعمال الكونية)</option>
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

        // Toggle voice settings fields if voice engine is gemini-3.1-flash-tts-preview
        const voiceSelect = this.dynamicOptionsContainer.querySelector('#opt-voiceEngine');
        if (voiceSelect) {
            const toggleFields = () => {
                const isTTS = voiceSelect.value === 'gemini-3.1-flash-tts-preview';
                const fieldsDiv = this.dynamicOptionsContainer.querySelector('#tts-preview-fields');
                if (fieldsDiv) fieldsDiv.style.display = isTTS ? 'block' : 'none';
            };
            voiceSelect.addEventListener('change', toggleFields);
            toggleFields();
        }

        // Attach event listeners to update suggested prompt in real-time
        const selects = this.dynamicOptionsContainer.querySelectorAll('select');
        selects.forEach(sel => {
            sel.addEventListener('change', () => this.updateSuggestedPrompt());
        });

        const inputs = this.dynamicOptionsContainer.querySelectorAll('input');
        inputs.forEach(inp => {
            inp.addEventListener('input', () => this.updateSuggestedPrompt());
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

        if (type === 'source') {
            const sourceType = document.getElementById('opt-sourceType').value;
            const sourceAuthor = document.getElementById('opt-sourceAuthor').value;
            const sourceWordCount = document.getElementById('opt-sourceWordCount').value;
            prompt = `اكتب فكرة عامة وحبكة وسينوبسيس مفصل لمصدر سردي في كون سكتشيك السينمائي.
نوع المصدر: [${sourceType}].
المؤلف الكوني: [${sourceAuthor}].
الحجم المستهدف: [حدود ${sourceWordCount} كلمة].
يجب أن تركز القصة على الأبعاد المتوازية والصدام الفني البصري بين أبعاد الرسم المختلفة (الزيتي، الكارتون، الحبر، الغرافيت) وصراعات الفصائل الكونية في هذا الكون.`;
        } else if (type === 'creator') {
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
            
            let sourceInfo = "مصدر سردي كوني عام";
            if (this.relatedSourceSelect.value) {
                const sourceAsset = this.assets.find(a => a.id === this.relatedSourceSelect.value);
                if (sourceAsset && sourceAsset.subOptions) {
                    const sType = sourceAsset.subOptions.sourceType || "مصدر غير محدد";
                    const sAuthor = sourceAsset.subOptions.sourceAuthor || "مؤلف غير معروف";
                    sourceInfo = `${sType} للكاتب [${sAuthor}] بعنوان (${sourceAsset.title})`;
                }
            }
            
            let creatorStyle = "أسلوب رسم فني متباين";
            let creatorTool = "أداة رسم كوني مميزة";
            if (this.relatedCreatorSelect.value) {
                const creator = this.assets.find(a => a.id === this.relatedCreatorSelect.value);
                if (creator && creator.subOptions) {
                    creatorStyle = creator.subOptions.artStyle || creatorStyle;
                    creatorTool = creator.subOptions.tool || creatorTool;
                }
            }

            prompt = `بصفتك خبيراً سردياً لكون سكتشيك (Sketchic World)، قم بكتابة سيناريو سينمائي تفصيلي لقصة مشتقة من: [${sourceInfo}]، ومن تصنيف [${genre}] وبأسلوب [${style}]. 
يخضع هذا السيناريو لرؤية الرسام الكوني المرتبط ذي الأسلوب [${creatorStyle}] مستخدماً الأداة الكونية [${creatorTool}].
يتموضع هذا السيناريو في [${layer}] ويخضع لمعدل إطارات كوني قدره [${fps}].
يجب أن تركز القصة على صدام الأسلوب الفني في الكادر ووجود أبعاد مرسومة متداخلة دون اندماج، مع كتابة السيناريو بهيكل مشاهد سينمائية تفصيلية.`;
        } else if (type === 'environment') {
            const envType = document.getElementById('opt-envType').value;
            const clashDensity = document.getElementById('opt-clashDensity').value;
            
            let creatorStyle = "أسلوب رسم فني متباين";
            if (this.relatedCreatorSelect.value) {
                const creator = this.assets.find(a => a.id === this.relatedCreatorSelect.value);
                if (creator && creator.subOptions) {
                    creatorStyle = creator.subOptions.artStyle || creatorStyle;
                }
            }

            prompt = `لوحة تصميم بيئة سينمائية لموقع في عالم سكتشيك (Sketchic World).
طبيعة البيئة: [${envType}].
قواعد الأسلوب الموروثة من الرسام: مرسومة بدقة بأسلوب [${creatorStyle}].
كثافة التداخل الفني: [${clashDensity}].
التفاصيل: يجب أن تظهر المناظر الطبيعية والتضاريس والخصائص المعمارية مبنية بوضوح بملامس وقوام هذا الأسلوب الفني. إبراز حدود الصدام والتلامس البصري مع الأبعاد الأخرى. لقطة بزاوية واسعة.`;
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

            prompt = `ورقة تصميم شخصية بصرية احترافية لشخصية في كون سكتشيك السينمائي.
الدور السردي للشخصية: [${charClass}].
الفصيل الكوني: [${factionText}].
السلاح الكوني المميز: [${weaponText}].
قوانين الأسلوب الموروثة من الرسام: مرسومة بأسلوب [${styleText}] باستخدام [${toolText}].
التفاصيل: يجب أن تعرض ورقة تصميم الشخصية مظهراً نظيفاً وواضحاً للشخصية على خلفية محايدة، مع إبراز الخطوط والملامس وقوام ضربات الأداة الفنية الخاصة بهذا الرسام. قم بتوضيح شعار فصيلهم وسلاحهم المميز.`;
        } else if (type === 'voice') {
            const voiceEngine = document.getElementById('opt-voiceEngine').value;
            prompt = `موجه توليد ملف صوت تعبيري كوني مخصص لـ Google AI Studio (gemini-3.1-flash-tts-preview).
محرك الصوت: [${voiceEngine}].`;

            if (voiceEngine === 'gemini-3.1-flash-tts-preview') {
                const voiceScene = document.getElementById('opt-voiceScene').value;
                const voiceContext = document.getElementById('opt-voiceContext').value;
                const voiceSpeaker = document.getElementById('opt-voiceSpeaker').value;
                const voiceTags = document.getElementById('opt-voiceTags').value;
                prompt += `\n\nإعدادات الصوت المتعدد الوسائط في Google AI Studio:
- إعداد المشهد الخلفي: [${voiceScene}]
- سياق الكلام والأداء التعبيري: [${voiceContext}]
- المتحدث الصوتي المختار: [${voiceSpeaker}]
- النص الموجه بالأوسمة التعبيرية المباشرة: [${voiceTags}]`;
            }
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

            prompt = `توليد موجه فيديو عالي الجودة لأداة التوليد بالذكاء الاصطناعي [${tool}]:
المشهد: صدام بصري ديناميكي بين شخصيتين في كون سكتشيك. إحداهما متحركة بمعدل إطارات [${fps}] لإبراز الخصائص المتنافرة للرسم، مع إضاءة خلابة وظلال مسطحة ثنائية الأبعاد على الجانب الكرتوني، وتظليل واقعي ناعم على جانب اللوحة الزيتية.
تفاعل الفيزياء الكونية: إظهار ميكانيكية فيزياء التماس التالية أثناء العمل: [${physicsText}].
تباين عالي، إضاءة سينمائية ساحرة.`;
        } else if (type === 'music') {
            const engine = document.getElementById('opt-musicEngine').value;
            const genre = document.getElementById('opt-musicGenre').value;
            const tempo = document.getElementById('opt-musicTempo').value;
            const instruments = document.getElementById('opt-musicInstruments').value;
            const musicPrompt = document.getElementById('opt-musicPrompt').value;
            
            prompt = `توليد مقطع موسيقي تصويري كوني باستخدام [${engine}]:
أوسمة النمط الموسيقي: [النمط: ${genre}، السرعة: ${tempo}، الآلات: ${instruments}، الأجواء: سماوية، صدام بصري، سينمائي، لوحة صوتية مجسمة].
واصفات وتفاصيل اللحن: ${musicPrompt}

الهيكل اللحني المقترح للمقطع:
- [مقدمة]: نغمة كوكبية أثيرية تمهد لبداية خط التماس البصري.
- [تصاعد]: إدخال الأوتار وتصاعد حدة التوتر مع اقتراب الأسلوبين الفنيين من الصدام.
- [الذروة]: هبوط لحني ملحمي يجسد التنافر والصدام المادي لكون سكتشيك.
- [خاتمة]: نغمات متلاشية تمثل صدى الطبقات الزمنية المتوازية.`;
        } else if (type === 'game') {
            const gameGenre = document.getElementById('opt-gameGenre').value;
            const mechanic = document.getElementById('opt-mechanic').value;
            prompt = `كتابة مسودة تصميم لعبة وبنية أكواد Godot GDScript للعبة من تصنيف [${gameGenre}] تدور في كون سكتشيك.
الميكانيكية الرئيسية للعب هي: [${mechanic}]. اشرح كيف تقوم شيدرات الرندرة والأسلوب الفني بتغيير الخصائص الفيزيائية للاعب (الوزن، الجاذبية، وتفاعله مع البيئة).`;
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
        const relatedSource = this.relatedSourceSelect.value;
        
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
        const inputs = this.dynamicOptionsContainer.querySelectorAll('input');
        inputs.forEach(inp => {
            const key = inp.id.replace('opt-', '');
            subOptions[key] = inp.value;
        });
        const textareas = this.dynamicOptionsContainer.querySelectorAll('textarea');
        textareas.forEach(ta => {
            const key = ta.id.replace('opt-', '');
            subOptions[key] = ta.value;
        });

        if (!type || !title || !driveUrl) {
            alert("يرجى ملء جميع الحقول المطلوبة الكونية.");
            return;
        }

        // Strict Workflow Rule: No Creator without Narrative Source
        if (type === 'creator' && !relatedSource) {
            alert("خطأ: لا يمكن إنشاء أو حفظ الرسام الكوني بدون ربطه بمصدر سردي مرتبط!");
            return;
        }

        // Strict Workflow Rule: No Scenario without Narrative Source
        if (type === 'scenario' && !relatedSource) {
            alert("خطأ: لا يمكن إنشاء أو حفظ السيناريو بدون ربطه بمصدر سردي مرتبط!");
            return;
        }

        // Strict Workflow Rule: No Sub-assets without Scenario
        if (['character', 'environment', 'voice', 'music'].includes(type) && !relatedScenario) {
            alert("خطأ: لا يمكن إنشاء أو حفظ هذا الأصل بدون ربطه بسيناريو مفعل!");
            return;
        }

        // Validate Director's Checklist before saving as finished
        if (status === 'finished' && ['comic', 'video', 'game'].includes(type)) {
            if (type === 'comic') {
                const validation = this.validateScenarioCompletion(relatedScenario);
                if (!validation.complete) {
                    alert("خطأ: لا يمكن تحويل القصة المصورة (Comic/Storyboard) إلى حالة 'منتهي وجاهز' إلا بعد تجهيز وإنهاء كافة الأصول المرتبطة بالسيناريو المختار (البيئة، شخصيتين على الأقل، الأصوات، والموسيقى) أولاً!");
                    return;
                }
            }
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
                        relatedSource,
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
                relatedSource,
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

            if (asset.relatedSource) {
                const parentSource = this.assets.find(a => a.id === asset.relatedSource);
                if (parentSource) {
                    relationHtml += `<span class="relation-tag" style="background-color:#e2f0d9; color:#385723; border:1px solid rgba(56,87,35,0.15)">📖 المصدر: ${parentSource.title}</span>`;
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
                environment: 'عالم وبيئة',
                character: 'تصميم شخصية',
                voice: 'صوت كوني',
                music: 'موسيقى كونيّة',
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
            if (asset.type === 'source' && asset.subOptions) {
                const sourceType = asset.subOptions.sourceType || "رواية كوكبية طويلة";
                const author = asset.subOptions.sourceAuthor || "الكاتب الكوني الأول";
                const wordCount = asset.subOptions.sourceWordCount || "0";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>📖 <strong>نوع المصدر:</strong> ${sourceType}</div>
                        <div style="margin-top:4px;">✍️ <strong>المؤلف:</strong> ${author}</div>
                        <div style="margin-top:4px;">📊 <strong>عدد الكلمات:</strong> ${wordCount} كلمة</div>
                    </div>
                `;
            } else if (asset.type === 'creator' && asset.subOptions) {
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🎨 <strong>الأسلوب:</strong> ${asset.subOptions.artStyle}</div>
                        <div style="margin-top:4px;">✍️ <strong>الأداة:</strong> ${asset.subOptions.tool}</div>
                    </div>
                `;
            } else if (asset.type === 'environment' && asset.subOptions) {
                const envType = asset.subOptions.envType || "بيئة رسم كوني";
                const density = asset.subOptions.clashDensity || "متوسطة";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🌌 <strong>البيئة:</strong> ${envType}</div>
                        <div style="margin-top:4px;">💥 <strong>كثافة التداخل:</strong> ${density}</div>
                    </div>
                `;
            } else if (asset.type === 'scenario' && asset.subOptions) {
                const layer = asset.subOptions.parallelLayer || "Layer 1 - الوجود المادي الفعلي";
                const fps = asset.subOptions.framerate || "24fps";
                let sourceText = "لا يوجد مصدر مرتبط";
                if (asset.relatedSource) {
                    const sourceAsset = this.assets.find(a => a.id === asset.relatedSource);
                    if (sourceAsset) {
                        sourceText = `<a href="${sourceAsset.driveUrl}" target="_blank" style="color:var(--color-cyan); text-decoration:underline; font-weight:bold;">${sourceAsset.title} 🔗</a>`;
                    }
                }
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>📂 <strong>الطبقة الزمنية:</strong> ${layer}</div>
                        <div style="margin-top:4px;">⏱️ <strong>معدل الإطارات:</strong> ${fps}</div>
                        <div style="margin-top:4px;">📖 <strong>المصدر السردي:</strong> ${sourceText}</div>
                    </div>
                `;
            } else if (asset.type === 'character' && asset.subOptions) {
                const charClass = asset.subOptions.charClass || "دور غير محدد";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>👤 <strong>الدور السردي:</strong> ${charClass}</div>
                    </div>
                `;
            } else if (asset.type === 'voice' && asset.subOptions) {
                const voiceEngine = asset.subOptions.voiceEngine || "gemini-3.1-flash-tts-preview";
                const voiceSpeaker = asset.subOptions.voiceSpeaker || "Algenib";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🎙️ <strong>المحرك:</strong> ${voiceEngine}</div>
                        <div style="margin-top:4px;">🔊 <strong>المتحدث:</strong> ${voiceSpeaker}</div>
                    </div>
                `;
            } else if (asset.type === 'music' && asset.subOptions) {
                const musicEngine = asset.subOptions.musicEngine || "Suno AI";
                const musicGenre = asset.subOptions.musicGenre || "أوركسترا كوني";
                const musicTempo = asset.subOptions.musicTempo || "متوسط";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🎵 <strong>المحرك:</strong> ${musicEngine}</div>
                        <div style="margin-top:4px;">🎼 <strong>النمط:</strong> ${musicGenre} (${musicTempo})</div>
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
                        desc: "انسخ الموجه المتطور أدناه والصقه في محادثة Gemini Advanced مع إدخال تفاصيل قصتك للحصول على سيناريو يدمج مبادئ كون سكتشيك الفلسفية ويحدد أثر الرسام المرتبط."
                    }
                ],
                prompt: `بصفتك خبيراً سردياً لكون سكتشيك (Sketchic World)، قم بكتابة سيناريو سينمائي تفصيلي لقصة تدور حول 'الصدام المرئي الأول'.
يجب أن يحتوي السيناريو على:
- مشهد يصف حدود بوابة التماس (Visual Clash Boundary) بين بعدين.
- حوار يوضح أسلوب الرسم المتباين وتفاعله فيزيائياً (مثل تصادم فقاعات كلامية مانجا مع درع زيتى كلاسيكى).
- كتابة القصة بهيكل المشاهد السينمائية (داخلي/خارجي - لقطات الكاميرا).`
            },
            environment: {
                title: "2. تصميم وتأصيل العوالم والبيئات الكونية",
                reqs: "سيناريو مكتوب جاهز + تحديد الرسام الكوني الصانع (لتوريث أسلوب الرسم الافتراضي وقوانين الجاذبية).",
                steps: [
                    {
                        title: "الخطوة الأولى: تحديد طبيعة البيئة الجغرافية والجمالية",
                        desc: "اختر نوع البيئة (لوحة مائعة، جزيرة قصاصات ورق، مدينة سايبربانك) واضبط كثافة التداخل المطلوبة للتماس البصري."
                    },
                    {
                        title: "الخطوة الثانية: توليد موجه البيئة ثلاثي الأبعاد بالذكاء الاصطناعي (Imagen 3 / Midjourney)",
                        desc: "استخدم الموجه التالي لصياغة بيئة دقيقة تحتوي على الصدام البصري الفني المطلوب."
                    }
                ],
                prompt: `A beautiful wide-angle concept art design sheet for a Sketchic Cinematic Universe landscape.
Environment: [طبيعة البيئة، مثلاً: A floating island made of newspaper scraps / Fluid paint canvas landscape].
Art Style rules inherited from Creator: Drawn strictly in [الأسلوب الفني للرسام، مثلاً: Renaissance classical oil painting].
Clash Boundary: Show visual intersection and contrast with other styles near the edges. Epic lighting, cinematic rendering, neutral tone.`
            },
            character: {
                title: "3. تصميم ورسم شخصيات الأكوان المتباينة",
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
                title: "4. إنتاج القصص المصورة ولوحات القصة (Comics & Storyboards)",
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
                title: "5. تحريك وإنتاج الفيديوهات السينمائية (Videos)",
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
                title: "6. برمجة الألعاب الكونية القابلة للتحميل (Games)",
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
        const voices = finishedAssets.filter(a => a.type === 'voice');
        const musics = finishedAssets.filter(a => a.type === 'music');
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

        // Generate Voices Profiles HTML
        let voicesHtml = "";
        if (voices.length > 0) {
            voices.forEach(v => {
                let charText = "";
                if (v.relatedCharacters && v.relatedCharacters.length > 0) {
                    const chr = finishedAssets.find(a => a.id === v.relatedCharacters[0]) || this.assets.find(a => a.id === v.relatedCharacters[0]);
                    if (chr) {
                        charText = `صوت الشخصية: ${chr.title}`;
                    }
                }
                const engine = v.subOptions ? (v.subOptions.voiceEngine || "gemini-3.1-flash-tts-preview") : "gemini-3.1-flash-tts-preview";
                const speaker = v.subOptions ? (v.subOptions.voiceSpeaker || "Algenib") : "Algenib";
                const scene = v.subOptions ? (v.subOptions.voiceScene || "") : "";
                
                voicesHtml += `
                    <div class="portal-card" style="border-top: 4px solid var(--color-accent); background: linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%);">
                        <div class="portal-card-body">
                            <span class="portal-card-meta" style="color:var(--color-accent); font-weight:700;">🎙️ صوت كوني (Voice Profile)</span>
                            <h4 style="margin: 10px 0 5px 0; font-size:1.2rem;">${v.title}</h4>
                            ${charText ? `<span style="font-size:0.75rem; color:var(--text-secondary); font-weight:700; margin-bottom:4px; display:block;">👤 ${charText}</span>` : ''}
                            <div style="font-size:0.75rem; color:var(--color-accent); margin-bottom: 10px;">
                                <span>🤖 المحرك: ${engine}</span><br>
                                <span style="margin-top:2px; display:inline-block;">🔊 المتحدث: ${speaker}</span>
                                ${scene ? `<br><span style="margin-top:2px; display:inline-block;">🎬 المشهد: ${scene}</span>` : ''}
                            </div>
                            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-secondary);">${v.desc}</p>
                            <div class="portal-card-action">
                                <a href="${v.driveUrl}" target="_blank" class="portal-btn portal-btn-outline" style="border-color:var(--color-accent); color:var(--color-accent);">استماع للملف الصوتي</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Generate Music Profiles HTML
        let musicsHtml = "";
        if (musics.length > 0) {
            musics.forEach(m => {
                let scenarioText = "";
                if (m.relatedScenario) {
                    const sc = finishedAssets.find(a => a.id === m.relatedScenario) || this.assets.find(a => a.id === m.relatedScenario);
                    if (sc) {
                        scenarioText = `مرتبط بسيناريو: ${sc.title}`;
                    }
                }
                const engine = m.subOptions ? (m.subOptions.musicEngine || "Suno AI") : "Suno AI";
                const genre = m.subOptions ? (m.subOptions.musicGenre || "أوركسترا كوني") : "أوركسترا كوني";
                const tempo = m.subOptions ? (m.subOptions.musicTempo || "متوسط") : "متوسط";
                const instruments = m.subOptions ? (m.subOptions.musicInstruments || "أوتار وهارب") : "أوتار وهارب";
                
                musicsHtml += `
                    <div class="portal-card" style="border-top: 4px solid var(--color-cyan); background: linear-gradient(180deg, #ffffff 0%, #ecfeff 100%);">
                        <div class="portal-card-body">
                            <span class="portal-card-meta" style="color:var(--color-cyan); font-weight:700;">🎵 موسيقى كونيّة (Music Profile)</span>
                            <h4 style="margin: 10px 0 5px 0; font-size:1.2rem;">${m.title}</h4>
                            ${scenarioText ? `<span style="font-size:0.75rem; color:var(--text-secondary); font-weight:700; margin-bottom:4px; display:block;">📖 ${scenarioText}</span>` : ''}
                            <div style="font-size:0.75rem; color:var(--color-cyan); margin-bottom: 10px;">
                                <span>🤖 المحرك: ${engine}</span><br>
                                <span style="margin-top:2px; display:inline-block;">🎼 النمط: ${genre}</span><br>
                                <span style="margin-top:2px; display:inline-block;">⏱️ السرعة: ${tempo}</span><br>
                                <span style="margin-top:2px; display:inline-block;">🎸 الآلات: ${instruments}</span>
                            </div>
                            <p style="font-size:0.8rem; line-height:1.5; color:var(--text-secondary);">${m.desc}</p>
                            <div class="portal-card-action">
                                <a href="${m.driveUrl}" target="_blank" class="portal-btn portal-btn-outline" style="border-color:var(--color-cyan); color:var(--color-cyan);">استماع للساوندتراك</a>
                            </div>
                        </div>
                    </div>
                `;
            });
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

                <!-- Finished Cosmic Voices -->
                ${voices.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>المكتبة الصوتية والأصوات التعبيرية</h3>
                        <span class="section-tag" style="background-color:var(--color-accent); color:#fff;">أصوات ذكاء اصطناعي</span>
                    </div>
                    <div class="portal-grid">
                        ${voicesHtml}
                    </div>
                </div>
                ` : ''}

                <!-- Finished Cosmic Music -->
                ${musics.length > 0 ? `
                <div class="portal-section">
                    <div class="portal-section-header">
                        <h3>المكتبة الموسيقية والساوندتراك</h3>
                        <span class="section-tag" style="background-color:var(--color-cyan); color:#fff;">موسيقى وألحان كوكبية</span>
                    </div>
                    <div class="portal-grid">
                        ${musicsHtml}
                    </div>
                </div>
                ` : ''}

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

    loadScenes() {
        const stored = localStorage.getItem('sketchic_scenes');
        if (!stored) {
            return [];
        }
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error loading scenes", e);
            return [];
        }
    }

    saveScenes() {
        localStorage.setItem('sketchic_scenes', JSON.stringify(this.scenes));
        this.renderScenesList();
    }

    initSceneTabOptions() {
        if (!this.sceneScenarioSelect) return;
        const scenarios = this.assets.filter(a => a.type === 'scenario');
        const characters = this.assets.filter(a => a.type === 'character');
        const comics = this.assets.filter(a => a.type === 'comic');
        const videos = this.assets.filter(a => a.type === 'video');

        // Populate Scenario selector
        this.sceneScenarioSelect.innerHTML = '<option value="" disabled selected>اختر السيناريو...</option>';
        scenarios.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.title;
            this.sceneScenarioSelect.appendChild(opt);
        });

        // Populate Characters checkboxes
        this.sceneCharactersContainer.innerHTML = '';
        if (characters.length === 0) {
            this.sceneCharactersContainer.innerHTML = '<span style="font-size:0.8rem;color:var(--text-tertiary);">لا توجد شخصيات مصممة بعد.</span>';
        } else {
            characters.forEach(c => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                label.style.display = 'flex';
                label.style.alignItems = 'center';
                label.style.gap = '6px';
                label.style.cursor = 'pointer';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.value = c.id;
                cb.name = 'scene-chars';
                cb.addEventListener('change', () => {
                    this.updateSceneConsistencyPrompt();
                    this.updateClashPreview();
                });

                label.appendChild(cb);
                label.appendChild(document.createTextNode(`👤 ${c.title}`));
                this.sceneCharactersContainer.appendChild(label);
            });
        }

        // Populate Comic selector
        this.sceneComicSelect.innerHTML = '<option value="">(اختياري)</option>';
        comics.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = c.title;
            this.sceneComicSelect.appendChild(opt);
        });

        // Populate Video selector
        this.sceneVideoSelect.innerHTML = '<option value="">(اختياري)</option>';
        videos.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.id;
            opt.textContent = v.title;
            this.sceneVideoSelect.appendChild(opt);
        });
    }

    clearSceneForm() {
        this.sceneForm.reset();
        this.sceneIdInput.value = "";
        if (this.sceneDialogueInput) this.sceneDialogueInput.value = "";
        if (this.sceneAudioProfileSelect) this.sceneAudioProfileSelect.value = "default";
        const saveBtn = document.getElementById('btn-save-scene');
        if (saveBtn) saveBtn.textContent = "حفظ المشهد";
        this.updateSceneConsistencyPrompt();
        this.updateClashPreview();
    }

    handleSceneSubmit(e) {
        e.preventDefault();
        const id = this.sceneIdInput.value || 'scene-' + Date.now();
        const title = this.sceneTitleInput.value;
        const scenarioId = this.sceneScenarioSelect.value;
        
        // Get selected characters
        const charCbs = this.sceneCharactersContainer.querySelectorAll('input[name="scene-chars"]:checked');
        const characterIds = Array.from(charCbs).map(cb => cb.value);

        if (characterIds.length === 0) {
            alert("يرجى اختيار شخصية واحدة على الأقل للمشهد!");
            return;
        }

        const dialogue = this.sceneDialogueInput ? this.sceneDialogueInput.value : "";
        const audioProfile = this.sceneAudioProfileSelect ? this.sceneAudioProfileSelect.value : "default";

        const comicId = this.sceneComicSelect.value;
        const videoId = this.sceneVideoSelect.value;

        const sceneData = {
            id,
            title,
            scenarioId,
            characterIds,
            dialogue,
            audioProfile,
            comicId,
            videoId,
            createdAt: new Date().toISOString()
        };

        const existingIdx = this.scenes.findIndex(s => s.id === id);
        if (existingIdx > -1) {
            this.scenes[existingIdx] = sceneData;
        } else {
            this.scenes.push(sceneData);
        }

        this.saveScenes();
        this.clearSceneForm();
    }

    renderScenesList() {
        if (!this.scenesTimelineList) return;
        this.scenesTimelineList.innerHTML = "";
        
        if (this.scenes.length === 0) {
            this.scenesTimelineList.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--text-tertiary);font-size:0.85rem;border:1px dashed var(--border-color);border-radius:6px;">لا توجد مشاهد مضافة للخط الزمني بعد.</div>`;
            return;
        }

        this.scenes.forEach((s, idx) => {
            const scenario = this.assets.find(a => a.id === s.scenarioId);
            const chars = s.characterIds.map(cid => this.assets.find(a => a.id === cid)).filter(Boolean);
            const comic = this.assets.find(a => a.id === s.comicId);
            const video = this.assets.find(a => a.id === s.videoId);
            
            const card = document.createElement('div');
            card.className = "scene-timeline-card";
            card.innerHTML = `
                <div class="scene-card-header">
                    <div class="scene-card-info">
                        <h5>المشهد ${idx + 1}: ${s.title}</h5>
                    </div>
                    <div class="scene-card-actions">
                        <button class="action-btn btn-edit" title="تعديل">✏️</button>
                        <button class="action-btn btn-delete" title="حذف" style="color:var(--color-danger)">🗑️</button>
                    </div>
                </div>
                <div class="scene-tracks-display">
                    <div class="scene-track-row">
                        <span class="scene-track-label">🖼️ البصريات:</span>
                        <span class="scene-track-value">${video ? '🎬 ' + video.title : (comic ? '📚 ' + comic.title : 'لا يوجد أصل بصري مرتبط')}</span>
                    </div>
                    <div class="scene-track-row">
                        <span class="scene-track-label">💬 الحوار:</span>
                        <span class="scene-track-value">${s.dialogue || 'بدون حوار مكتوب'}</span>
                    </div>
                    <div class="scene-track-row">
                        <span class="scene-track-label">🔊 الصوتيات:</span>
                        <span class="scene-track-value">${this.getAudioProfileLabel(s.audioProfile)}</span>
                    </div>
                </div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => this.editScene(s.id));
            card.querySelector('.btn-delete').addEventListener('click', () => this.deleteScene(s.id));

            this.scenesTimelineList.appendChild(card);
        });
    }

    getAudioProfileLabel(profile) {
        switch(profile) {
            case 'retro-tape': return '🎬 خشخشة شريط سينمائي قديم';
            case 'digital-glitch': return '⚡ تشويش ونبضات إلكترونية رقمية';
            case 'orchestral-renaissance': return '🎻 كمان كلاسيكي ووقار أوركسترالي';
            default: return '🎙️ صوت استوديو افتراضي';
        }
    }

    editScene(id) {
        const scene = this.scenes.find(s => s.id === id);
        if (!scene) return;

        this.sceneIdInput.value = scene.id;
        this.sceneTitleInput.value = scene.title;
        this.sceneScenarioSelect.value = scene.scenarioId;

        // Reset and check character checkboxes
        const cbs = this.sceneCharactersContainer.querySelectorAll('input[name="scene-chars"]');
        cbs.forEach(cb => {
            cb.checked = scene.characterIds.includes(cb.value);
        });

        if (this.sceneDialogueInput) this.sceneDialogueInput.value = scene.dialogue || "";
        if (this.sceneAudioProfileSelect) this.sceneAudioProfileSelect.value = scene.audioProfile || "default";

        this.sceneComicSelect.value = scene.comicId || "";
        this.sceneVideoSelect.value = scene.videoId || "";

        const saveBtn = document.getElementById('btn-save-scene');
        if (saveBtn) saveBtn.textContent = "تحديث المشهد";
        this.updateSceneConsistencyPrompt();
        this.updateClashPreview();
    }

    deleteScene(id) {
        if (confirm("هل أنت متأكد من رغبتك في حذف هذا المشهد من الخط الزمني الكوني؟")) {
            this.scenes = this.scenes.filter(s => s.id !== id);
            this.saveScenes();
            this.clearSceneForm();
        }
    }

    updateSceneConsistencyPrompt() {
        if (!this.sceneConsistencyPromptText) return;

        const charCbs = this.sceneCharactersContainer.querySelectorAll('input[name="scene-chars"]:checked');
        const selectedCharIds = Array.from(charCbs).map(cb => cb.value);

        if (selectedCharIds.length === 0) {
            this.sceneConsistencyPromptText.textContent = "حدد شخصيتين على الأثل لتوليد برومبت اتساق المشهد...";
            return;
        }

        const chars = selectedCharIds.map(cid => this.assets.find(a => a.id === cid)).filter(Boolean);
        const scenario = this.assets.find(a => a.id === this.sceneScenarioSelect.value);
        const audioProfile = this.sceneAudioProfileSelect ? this.sceneAudioProfileSelect.value : "default";

        let promptText = `[Google Flow Scene Prompt - Dynamic Consistency]\n`;
        promptText += `Create a high-fidelity cinematic scene based on the scenario: "${scenario ? scenario.title : 'Generic Sketchic Scene'}"\n\n`;
        promptText += `CHARACTER CONSISTENCY GUIDELINES:\n`;
        
        chars.forEach(char => {
            const creator = this.assets.find(a => a.id === char.relatedCreator);
            const style = creator && creator.subOptions ? creator.subOptions.artStyle : 'Distinct Art Style';
            promptText += `- Character Name: ${char.title}\n  Description: ${char.desc}\n  Visual Style: Rendered strictly in: ${style}. Do not blend this character's aesthetic with other styles.\n\n`;
        });

        promptText += `VISUAL CLASH & CONTRAST (No-Blending Principle):\n`;
        promptText += `This scene features a direct interaction at the visual clash boundary. Each character must retain 100% of their unique medium, line quality, frame rate, and shading style. Do not blend the backgrounds or filters. Maintain chromatic shear at the point of contact.\n\n`;
        
        promptText += `AUDIO & SONIC DESIGN (Sonic Dissonance):\n`;
        promptText += `The background ambiance and audio track should align with the chosen profile: "${this.getAudioProfileLabel(audioProfile)}". The sounds generated for character interactions must audibly reflect their artistic medium (e.g. paper scraping for manga/pencil vs rich acoustic strings for oil paintings).`;

        this.sceneConsistencyPromptText.textContent = promptText;
    }

    updateClashPreview() {
        if (!this.clashPreviewStage) return;

        const charCbs = this.sceneCharactersContainer.querySelectorAll('input[name="scene-chars"]:checked');
        const selectedCharIds = Array.from(charCbs).map(cb => cb.value);

        if (selectedCharIds.length === 0) {
            this.clashPreviewStage.innerHTML = `
                <div class="clash-empty-state" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--text-tertiary); font-size: 0.9rem; text-align: center; padding: 1rem;">
                    حدد شخصيات المشهد لبدء محاكاة التصادم البصري ثنائي الأبعاد/ثلاثي الأبعاد...
                </div>
            `;
            return;
        }

        const chars = selectedCharIds.map(cid => this.assets.find(a => a.id === cid)).filter(Boolean);
        const userDialogue = this.sceneDialogueInput ? this.sceneDialogueInput.value : "";
        const audioProfile = this.sceneAudioProfileSelect ? this.sceneAudioProfileSelect.value : "default";
        
        let html = `<div class="clash-stage-grid"></div>`;
        
        // Render audio profile indicator badge on the preview stage
        html += `
            <div style="position: absolute; top: 10px; right: 10px; background: rgba(15, 23, 42, 0.85); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.65rem; z-index: 15; font-weight: bold; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 4px;">
                ${this.getAudioProfileLabel(audioProfile)}
            </div>
        `;

        html += `<div class="clash-characters-stage">`;

        chars.forEach((char, idx) => {
            const creator = this.assets.find(a => a.id === char.relatedCreator);
            const styleName = (creator && creator.subOptions && creator.subOptions.artStyle) ? creator.subOptions.artStyle : '';
            
            let spriteStyleClass = "clash-sprite-sketch"; // Fallback
            let dialogueText = userDialogue || "ما هذا البعد الغريب؟";
            
            // If user typed a custom dialogue, let's alternate who says it or show it in the first sprite, and show alternative style comments in the others
            if (userDialogue) {
                if (idx > 0) {
                    if (styleName.includes("مانجا") || styleName.includes("Manga") || styleName.includes("حبر")) {
                        dialogueText = "أسلوب المانجا الخاص بي لن يندمج! ⚡";
                    } else if (styleName.includes("زيتية") || styleName.includes("Renaissance") || styleName.includes("زيت")) {
                        dialogueText = "ألواني الكلاسيكية ثابتة ووقورة 🎨";
                    } else {
                        dialogueText = "خطوطي مهتزة وزائلة ✍️";
                    }
                }
            } else {
                if (styleName.includes("مانجا") || styleName.includes("Manga") || styleName.includes("حبر")) {
                    spriteStyleClass = "clash-sprite-manga";
                    dialogueText = "ضربة سكتشيك! ⚡";
                } else if (styleName.includes("زيتية") || styleName.includes("Renaissance") || styleName.includes("زيت")) {
                    spriteStyleClass = "clash-sprite-oil";
                    dialogueText = "يا لك من كائن وقور ذو خطوط خشنة!";
                } else if (styleName.includes("رصاص") || styleName.includes("Sketch") || styleName.includes("فحم")) {
                    spriteStyleClass = "clash-sprite-sketch";
                    dialogueText = "أخشى أن أمحى سريعاً...";
                }
            }

            if (styleName.includes("مانجا") || styleName.includes("Manga") || styleName.includes("حبر")) {
                spriteStyleClass = "clash-sprite-manga";
            } else if (styleName.includes("زيتية") || styleName.includes("Renaissance") || styleName.includes("زيت")) {
                spriteStyleClass = "clash-sprite-oil";
            } else if (styleName.includes("رصاص") || styleName.includes("Sketch") || styleName.includes("فحم")) {
                spriteStyleClass = "clash-sprite-sketch";
            }

            html += `
                <div class="clash-sprite ${spriteStyleClass}" data-name="${char.title}" style="animation-delay: ${idx * 0.3}s;">
                    <div class="clash-speech-bubble" style="animation-delay: ${idx * 0.5}s;">${dialogueText}</div>
                    <img src="logo.jpg" alt="${char.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;
        });

        html += `</div>`;
        this.clashPreviewStage.innerHTML = html;
    }

    autoGenerateStoryboard() {
        const scenarioId = this.sceneScenarioSelect.value;
        if (!scenarioId) {
            alert("يرجى اختيار سيناريو أولاً لتوليد لوحة العمل منه!");
            return;
        }
        const scenario = this.assets.find(a => a.id === scenarioId);
        const characters = this.assets.filter(a => a.type === 'character');
        
        if (characters.length < 2) {
            alert("يرجى تصميم شخصيتين على الأقل لتوليد لوحة عمل للصدام البصري!");
            return;
        }

        const charIds = characters.map(c => c.id);

        const generatedScenes = [
            {
                id: 'scene-gen-1-' + Date.now(),
                title: 'مقدمة اللقاء (Introduction of Clash)',
                scenarioId: scenarioId,
                characterIds: [charIds[0], charIds[1]],
                dialogue: "من أنت وكيف تملك هذه الحدود الحادة؟",
                audioProfile: 'retro-tape',
                comicId: "",
                videoId: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 'scene-gen-2-' + Date.now(),
                title: 'ذروة التنافر الضوئي (Chromatic Contact)',
                scenarioId: scenarioId,
                characterIds: [charIds[0], charIds[1]],
                dialogue: "الخطوط تتداخل والضوء ينقسم!",
                audioProfile: 'digital-glitch',
                comicId: "",
                videoId: "",
                createdAt: new Date().toISOString()
            },
            {
                id: 'scene-gen-3-' + Date.now(),
                title: 'توازن الأنماط النهائي (Aesthetic Truce)',
                scenarioId: scenarioId,
                characterIds: [charIds[0], charIds[1]],
                dialogue: "لن نندمج، بل سنعيش معاً في هذا التناقض.",
                audioProfile: 'orchestral-renaissance',
                comicId: "",
                videoId: "",
                createdAt: new Date().toISOString()
            }
        ];

        this.scenes = [...this.scenes, ...generatedScenes];
        this.saveScenes();
        alert("تم توليد لوحة عمل كاملة مكونة من 3 مشاهد بنجاح! 🎉");
    }
}

// Instantiate the App on window load
window.addEventListener('DOMContentLoaded', () => {
    window.app = new SketchicApp();
});
