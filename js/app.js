/* ==========================================
   Sketchic Production Hub - Core Logic & SPA State (Updated)
   ========================================== */

// Default mock assets to seed the application initially
const MOCK_ASSETS = [];

// App State Manager
class SketchicApp {
    constructor() {
        // Force reset database once for a fresh startup as requested
        const initializedClean = localStorage.getItem('sketchic_clean_v5');
        if (!initializedClean) {
            localStorage.setItem('sketchic_assets', JSON.stringify([]));
            localStorage.setItem('sketchic_scenes', JSON.stringify([]));
            localStorage.setItem('sketchic_clean_v5', 'true');
        }

        this.assets = this.loadAssets();
        this.scenes = this.loadScenes();
        this.currentTab = 'dashboard';
        this.currentFilter = 'all';
        this.editingAssetId = null;

        // Initialize Wizard State
        this.currentWizardStep = 1;
        this.wizardSessionData = {
            source: [],
            scenario: [],
            creator: [],
            character: [],
            environment: [],
            voice: [],
            music: [],
            comic: [],
            video: [],
            game: [],
            written: []
        };

        // Initialize UI Element Selectors
        this.initSelectors();
        
        // Bind Event Listeners
        this.bindEvents();

        // Initialize Google Drive Integration settings
        this.initGoogleDriveIntegration();

        // Initial Renders
        this.switchTab('dashboard');
        this.updateStats();
        this.renderPipelineCounts();
        this.renderGuide('scenario');
        this.initDirectorChat();
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
        if (this.directorMessage) {
            this.updateDirectorChat();
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
        this.btnSaveToDrive = document.getElementById('btn-save-to-drive');
        this.btnSaveToDrive = document.getElementById('btn-save-to-drive');

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

        // Wizard Elements
        this.wizardStepTitle = document.getElementById('wizard-step-title');
        this.wizardStepGuidance = document.getElementById('wizard-step-guidance');
        this.wizardFormFields = document.getElementById('wizard-form-fields');
        this.wizardPromptText = document.getElementById('wizard-prompt-text');
        this.btnWizardPrev = document.getElementById('btn-wizard-prev');
        this.btnWizardAi = document.getElementById('btn-wizard-ai');
        this.btnWizardNext = document.getElementById('btn-wizard-next');
        this.btnWizardCopyPrompt = document.getElementById('btn-wizard-copy-prompt');
        this.wizardStepper = document.getElementById('wizard-stepper');
        this.wizardSummaryView = document.getElementById('wizard-summary-view');
        this.wizardSummaryTableBody = document.getElementById('wizard-summary-table-body');
        this.btnWizardDownloadProject = document.getElementById('btn-wizard-download-project');
        this.btnWizardResetProject = document.getElementById('btn-wizard-reset-project');
        this.btnWipeDatabase = document.getElementById('btn-wipe-database');
        this.btnWipeGDrive = document.getElementById('btn-wipe-gdrive');
        this.wizardProjectTemplate = document.getElementById('wizard-project-template');
        this.wizardGlobalDriveUrl = document.getElementById('wizard-global-drive-url');
        this.btnWizardAutopilot = document.getElementById('btn-wizard-autopilot');
        this.wizardParentProject = document.getElementById('wizard-parent-project');
        this.btnWizardEndProject = document.getElementById('btn-wizard-end-project');
        this.btnWizardExtendProject = document.getElementById('btn-wizard-extend-project');

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
        this.sceneAudioProfileSelect = document.getElementById('scene-audio-profile');
        this.btnAutoStoryboard = document.getElementById('btn-auto-storyboard');
        this.btnGenerateEpisodePackage = document.getElementById('btn-generate-episode-package');

        // Dynamic Scene Frames Builder
        this.btnAddSceneFrame = document.getElementById('btn-add-scene-frame');
        this.sceneFramesContainer = document.getElementById('scene-frames-container');

        // Raw Script and Spell of Creation elements
        this.btnScriptTab = document.getElementById('btn-script');
        this.scriptInputText = document.getElementById('script-input-text');
        this.btnParseScript = document.getElementById('btn-parse-script');
        this.btnExportScriptScenes = document.getElementById('btn-export-script-scenes');
        this.scriptParsingStatus = document.getElementById('script-parsing-status');
        this.scriptEmptyResults = document.getElementById('script-empty-results');
        this.scriptSegmentedScenesList = document.getElementById('script-segmented-scenes-list');
        this.terminalSpellBox = document.getElementById('terminal-spell-box');
        this.terminalSpellContent = document.getElementById('terminal-spell-content');
        this.btnCopySpell = document.getElementById('btn-copy-spell');
        this.parsedScenes = []; // Cache to store parsed scenes
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
        
        // Google Vids Exporter Modal Bindings
        const btnCloseVids = document.getElementById('btn-close-vids-modal');
        if (btnCloseVids) {
            btnCloseVids.addEventListener('click', () => {
                document.getElementById('vids-export-modal').classList.remove('open');
            });
        }
        const btnCopyPrompts = document.getElementById('btn-copy-vids-prompts');
        if (btnCopyPrompts) {
            btnCopyPrompts.addEventListener('click', () => this.copyVidsText('prompts'));
        }
        const btnCopyVO = document.getElementById('btn-copy-vids-vo');
        if (btnCopyVO) {
            btnCopyVO.addEventListener('click', () => this.copyVidsText('vo'));
        }
        const btnDownloadCSV = document.getElementById('btn-download-vids-csv');
        if (btnDownloadCSV) {
            btnDownloadCSV.addEventListener('click', () => this.downloadVidsCSV());
        }
        const btnCopyVeo = document.getElementById('btn-copy-vids-veo');
        if (btnCopyVeo) {
            btnCopyVeo.addEventListener('click', () => this.copyVidsText('veo'));
        }
        const btnCopyFlowScript = document.getElementById('btn-copy-vids-flow-script');
        if (btnCopyFlowScript) {
            btnCopyFlowScript.addEventListener('click', () => this.copyVidsText('flow_script'));
        }

        // Form asset type change (Prerequisite triggers)
        this.assetTypeSelect.addEventListener('change', () => this.handleAssetTypeChange());
        this.relatedScenarioSelect.addEventListener('change', () => {
            this.handleAssetTypeChange();
            this.updateSuggestedPrompt();
            
            // Auto-populate Title and Narrative Source based on Scenario Selection
            const type = this.assetTypeSelect.value;
            const scenId = this.relatedScenarioSelect.value;
            if (scenId) {
                const scenAsset = this.assets.find(a => a.id === scenId);
                if (scenAsset) {
                    if (scenAsset.relatedSource) {
                        this.relatedSourceSelect.value = scenAsset.relatedSource;
                    }
                    if (!this.assetTitleInput.value.trim()) {
                        const typeLabels = {
                            'written': 'نص حوار لـ',
                            'character': 'شخصية لـ',
                            'prop': 'أداة لـ',
                            'environment': 'بيئة لـ',
                            'voice': 'صوت لـ',
                            'music': 'ساوندتراك لـ',
                            'comic': 'لوحة قصة لـ',
                            'video': 'فيديو لـ',
                            'game': 'لعبة لـ'
                        };
                        const label = typeLabels[type] || 'أصل لـ';
                        this.assetTitleInput.value = `${label} (${scenAsset.title})`;
                    }
                }
            }
        });
        this.relatedSourceSelect.addEventListener('change', () => {
            this.updateSuggestedPrompt();
            
            // Auto-populate Title based on Narrative Source Selection
            const type = this.assetTypeSelect.value;
            const sourceId = this.relatedSourceSelect.value;
            if (!sourceId) return;

            const sourceAsset = this.assets.find(a => a.id === sourceId);
            if (!sourceAsset) return;

            if (type === 'scenario' && (!this.assetTitleInput.value.trim() || this.assetTitleInput.value.startsWith("سيناريو"))) {
                this.assetTitleInput.value = `سيناريو: ${sourceAsset.title}`;
            } else if (type === 'creator' && (!this.assetTitleInput.value.trim() || this.assetTitleInput.value.startsWith("الرسام"))) {
                this.assetTitleInput.value = `الرسام الكوني لـ (${sourceAsset.title})`;
            }

            // Google Drive Actual Document Reading Integration
            if (this.isGDriveConnected && sourceAsset.driveUrl) {
                const fileId = this.parseGDriveFileId(sourceAsset.driveUrl);
                if (fileId) {
                    console.log("Fetching live document content from Google Drive for ID:", fileId);
                    this.fetchGoogleFileContent(fileId).then(content => {
                        if (content) {
                            const parsed = this.parseMarkdownSource(content);
                            
                            // Dynamically update in-memory cache
                            if (!sourceAsset.subOptions) sourceAsset.subOptions = {};
                            sourceAsset.subOptions.theme = parsed.theme;
                            sourceAsset.subOptions.plot = parsed.plot;
                            sourceAsset.subOptions.setting = parsed.setting;
                            sourceAsset.desc = parsed.desc;
                            
                            console.log("Successfully fetched and parsed document:", parsed);

                            // Pre-fill inputs if current form is editing/showing the source
                            if (this.editingAssetId === sourceAsset.id) {
                                const themeTA = document.getElementById('opt-sourceTheme');
                                if (themeTA) themeTA.value = parsed.theme;
                                const plotTA = document.getElementById('opt-sourcePlot');
                                if (plotTA) plotTA.value = parsed.plot;
                                const settingTA = document.getElementById('opt-sourceSetting');
                                if (settingTA) settingTA.value = parsed.setting;
                                this.assetDescTextarea.value = parsed.desc;
                            }
                        }
                    });
                }
            }
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

        if (this.btnSaveToDrive) {
            this.btnSaveToDrive.addEventListener('click', () => this.saveAssetToDrive());
        }

        if (this.btnGenerateEpisodePackage) {
            this.btnGenerateEpisodePackage.addEventListener('click', () => this.generateEpisodePackage());
        }

        // Form Submit
        this.assetForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Wizard Bindings
        if (this.btnWizardPrev) {
            this.btnWizardPrev.addEventListener('click', () => this.navigateWizard(-1));
        }
        if (this.btnWizardNext) {
            this.btnWizardNext.addEventListener('click', () => this.validateAndNextWizardStep());
        }
        if (this.btnWizardAi) {
            this.btnWizardAi.addEventListener('click', () => this.generateWizardStepWithAI());
        }
        if (this.btnWizardCopyPrompt) {
            this.btnWizardCopyPrompt.addEventListener('click', () => {
                navigator.clipboard.writeText(this.wizardPromptText.textContent);
                this.btnWizardCopyPrompt.textContent = "تم النسخ!";
                setTimeout(() => {
                    this.btnWizardCopyPrompt.textContent = "نسخ البرومبت";
                }, 2000);
            });
        }
        if (this.btnWizardDownloadProject) {
            this.btnWizardDownloadProject.addEventListener('click', () => this.downloadProjectSummaryMD());
        }
        if (this.btnWizardResetProject) {
            this.btnWizardResetProject.addEventListener('click', () => this.resetWizardSession());
        }
        if (this.btnWipeDatabase) {
            this.btnWipeDatabase.addEventListener('click', () => this.wipeAllDatabaseData());
        }
        if (this.btnWipeGDrive) {
            this.btnWipeGDrive.addEventListener('click', () => this.wipeGoogleDriveContents());
        }
        if (this.wizardProjectTemplate) {
            this.wizardProjectTemplate.addEventListener('change', () => {
                const steps = this.getTemplateSteps();
                if (!steps.includes(this.currentWizardStep)) {
                    this.currentWizardStep = steps[0];
                }
                this.renderWizardStep();
                this.updateWizardStepperUI();
            });
        }
        if (this.btnWizardAutopilot) {
            this.btnWizardAutopilot.addEventListener('click', () => this.runWizardAutopilot());
        }
        if (this.btnWizardEndProject) {
            this.btnWizardEndProject.addEventListener('click', () => this.endCurrentProject());
        }
        if (this.btnWizardExtendProject) {
            this.btnWizardExtendProject.addEventListener('click', () => this.extendCurrentProject());
        }

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
        if (this.btnAddSceneFrame) {
            this.btnAddSceneFrame.addEventListener('click', () => this.addSceneFrameRow());
        }
        if (this.sceneFramesContainer) {
            this.sceneFramesContainer.addEventListener('input', () => {
                this.updateSceneConsistencyPrompt();
                this.updateClashPreview();
            });
            this.sceneFramesContainer.addEventListener('change', () => {
                this.updateSceneConsistencyPrompt();
                this.updateClashPreview();
            });
        }
        if (this.btnAutoStoryboard) {
            this.btnAutoStoryboard.addEventListener('click', () => this.autoGenerateStoryboard());
        }
        if (this.btnParseScript) {
            this.btnParseScript.addEventListener('click', () => this.handleScriptParsing());
        }
        if (this.btnExportScriptScenes) {
            this.btnExportScriptScenes.addEventListener('click', () => this.exportParsedScenes());
        }
        if (this.btnCopySpell) {
            this.btnCopySpell.addEventListener('click', () => {
                navigator.clipboard.writeText(this.terminalSpellContent.innerText);
                this.btnCopySpell.textContent = "Copied!";
                setTimeout(() => { this.btnCopySpell.textContent = "Copy"; }, 2000);
            });
        }

        this.initDrawingTab();
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
        } else if (tabId === 'wizard') {
            this.initWizardTab();
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
        const writtens = this.assets.filter(a => a.type === 'written' && a.status === 'finished');
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
        } else if (writtens.length === 0) {
            recText = "📜 خطوتك التالية هي إنتاج أول أصل مكتوب ومخطوطة نصية (Written Texts) لتوثيق الحوارات ونصوص العالم بناءً على السيناريو المعتمد.";
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
            written: 0,
            environment: 0,
            character: 0,
            prop: 0,
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
        this.generatedSourceExtractedData = null;
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

        if (asset.type === 'source' && asset.subOptions) {
            this.generatedSourceExtractedData = {
                extractedCreator: asset.subOptions.extractedCreator || null,
                extractedCharacters: asset.subOptions.extractedCharacters || [],
                extractedEnvironments: asset.subOptions.extractedEnvironments || [],
                extractedMusic: asset.subOptions.extractedMusic || []
            };
        } else {
            this.generatedSourceExtractedData = null;
        }

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

        // Dynamic style and tool classification for the extracted Creator
        const searchText = (theme + " " + plot + " " + setting + " " + source.title).toLowerCase();
        const categories = [
            {
                artStyle: "لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)",
                tool: "فرشاة شعر السنجاب الغليظة المشبعة بالزيت",
                keywords: ["زيت", "oil", "نهضة", "renaissance", "زيتية", "فرشاة", "سنجاب"]
            },
            {
                artStyle: "مانجا يابانية تقليدية بحبر أسود حاد",
                tool: "ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)",
                keywords: ["مانجا", "manga", "حبر", "ink", "g-pen", "ريشة", "يابانية"]
            },
            {
                artStyle: "رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)",
                tool: "ممحاة مطاطية لمضاد المادة (Cosmic Eraser)",
                keywords: ["كارتون كلاسيكي", "ثلاثينات", "rubber hose", "eraser", "ممحاة", "ممحاه", "مطاطية", "كارتون"]
            },
            {
                artStyle: "رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)",
                tool: "قلم رصاص غرافيت فحم ناعم وقابل للمحو",
                keywords: ["رصاص", "graphite", "sketch", "تخطيطي", "فحم", "مخطط", "رسم تخطيطي"]
            },
            {
                artStyle: "رسوم رقمية حديثة ذات متجهات هندسية (Vectors)",
                tool: "قلم الألواح الرقمية اللاسلكي اللانهائي",
                keywords: ["رقمية", "metajat", "vectors", "digital", "ألواح", "لاسلكي", "هندسية"]
            }
        ];

        let bestCategory = categories[1]; // Default to Manga
        let maxScore = 0;
        categories.forEach(cat => {
            let score = 0;
            cat.keywords.forEach(kw => {
                if (searchText.includes(kw)) score += 1;
            });
            if (score > maxScore) {
                maxScore = score;
                bestCategory = cat;
            }
        });

        const artStyle = bestCategory.artStyle;
        const tool = bestCategory.tool;

        // Generate proposed assets based on source content
        const proposed = [];

        // 0. Scenario (سيناريو مقترح)
        if (this.assetTypeSelect.value !== 'scenario') {
            if (source.subOptions && source.subOptions.extractedScenario) {
                proposed.push({
                    type: 'scenario',
                    title: source.subOptions.extractedScenario.title,
                    desc: source.subOptions.extractedScenario.desc,
                    subOptions: {
                        scenarioSourceType: source.subOptions.extractedScenario.sourceType || "قصة قصيرة (Short Story)",
                        scenarioSourceLink: "https://docs.google.com/document/d/source-story",
                        genre: source.subOptions.extractedScenario.genre || "خيال علمي (Sci-Fi)",
                        style: source.subOptions.extractedScenario.style || "سرد تفصيلي بطيء ومكثف",
                        parallelLayer: source.subOptions.extractedScenario.parallelLayer || "Layer 1 - الوجود المادي الفعلي",
                        framerate: source.subOptions.extractedScenario.framerate || "24fps"
                    }
                });
            } else {
                const hasNovel = (source.title || "").includes("رواية") || (source.title || "").includes("Novel");
                const sourceType = hasNovel ? "رواية كوكبية طويلة (Cosmic Novel)" : "قصة قصيرة (Short Story)";
                const genre = (theme + plot).includes("خيال") ? "خيال علمي (Sci-Fi)" : "دراما الصدام المرئي (Visual Clash Drama)";
                proposed.push({
                    type: 'scenario',
                    title: `سيناريو: خط الحبكة لـ (${source.title})`,
                    desc: `السيناريو الحاكم والمقسم للحبكة الدرامية لـ: ${source.title}. المستوحى من الثيمة: ${theme.substring(0, 50) || "صراع الأبعاد"}...`,
                    subOptions: {
                        scenarioSourceType: sourceType,
                        scenarioSourceLink: "https://docs.google.com/document/d/source-story",
                        genre: genre,
                        style: "سرد تفصيلي بطيء ومكثف",
                        parallelLayer: "Layer 1 - الوجود المادي الفعلي",
                        framerate: "24fps"
                    }
                });
            }
        }

        // 1. Creator
        if (source.subOptions && source.subOptions.extractedCreator) {
            proposed.push({
                type: 'creator',
                title: source.subOptions.extractedCreator.title,
                desc: source.subOptions.extractedCreator.desc,
                subOptions: {
                    artStyle: source.subOptions.extractedCreator.artStyle,
                    tool: source.subOptions.extractedCreator.tool
                }
            });
        } else {
            proposed.push({
                type: 'creator',
                title: `الرسام الكوني لـ (${source.title})`,
                desc: `الرسام المسؤول عن تجسيد وتحديد الأسلوب الفني والأداة الكونية لـ: ${source.title}.`,
                subOptions: { artStyle: artStyle, tool: tool }
            });
        }

        // 2. Characters
        if (source.subOptions && Array.isArray(source.subOptions.extractedCharacters) && source.subOptions.extractedCharacters.length > 0) {
            source.subOptions.extractedCharacters.forEach(c => {
                proposed.push({
                    type: 'character',
                    title: c.title,
                    desc: c.desc,
                    subOptions: { charClass: c.class || 'شخصية مستيقظة تدرك أنها مرسومة (Awakened)' },
                    relatedFaction: c.faction || 'awakened'
                });
            });
        } else {
            proposed.push({
                type: 'character',
                title: `شخصية: البطل المستيقظ من (${source.title})`,
                desc: `شخصية قيادية مستوحاة من الصراع السردي: ${plot.substring(0, 100) || "صراع الأبعاد والفصائل الكونية"}...`,
                subOptions: { charClass: 'شخصية مستيقظة تدرك أنها مرسومة (Awakened)' },
                relatedFaction: 'awakened'
            });
        }

        // 3. Environments
        if (source.subOptions && Array.isArray(source.subOptions.extractedEnvironments) && source.subOptions.extractedEnvironments.length > 0) {
            source.subOptions.extractedEnvironments.forEach(e => {
                proposed.push({
                    type: 'environment',
                    title: e.title,
                    desc: e.desc,
                    subOptions: { 
                        envType: e.envType || 'داخل لوحة قماشية مائعة (Fluid Canvas Interior)', 
                        clashDensity: e.clashDensity || 'متوسطة (تداخل الضوء والجاذبية)' 
                    }
                });
            });
        } else {
            proposed.push({
                type: 'environment',
                title: `بيئة: موقع صدام الأبعاد في (${source.title})`,
                desc: `موقع سينمائي ذو طابع فريد مستوحى من الخلفية المكانية: ${setting.substring(0, 100) || "خط التماس المباشر بين بوابات الرسم الحبرية الخشنة واللوحات الزيتية"}...`,
                subOptions: { envType: 'داخل لوحة قماشية مائعة (Fluid Canvas Interior)', clashDensity: 'متوسطة (تداخل الضوء والجاذبية)' }
            });
        }

        // 4. Music
        if (source.subOptions && Array.isArray(source.subOptions.extractedMusic) && source.subOptions.extractedMusic.length > 0) {
            source.subOptions.extractedMusic.forEach(m => {
                proposed.push({
                    type: 'music',
                    title: m.title,
                    desc: m.desc,
                    subOptions: { 
                        musicEngine: 'Suno AI', 
                        musicGenre: m.genre || 'Epic Orchestral', 
                        musicTempo: m.tempo || 'Medium/Dramatic', 
                        musicInstruments: m.instruments || 'Acoustic Strings' 
                    }
                });
            });
        } else {
            proposed.push({
                type: 'music',
                title: `ساوندتراك: لحن الأثير لـ (${source.title})`,
                desc: `مقطوعة موسيقية تصويرية تعبر عن المغزى المحوري: ${theme.substring(0, 100) || "صراع أبعاد الرسم المتنافرة"}...`,
                subOptions: { musicEngine: 'Suno AI', musicGenre: 'Epic Orchestral', musicTempo: 'Medium/Dramatic', musicInstruments: 'Acoustic Strings' }
            });
        }

        // 5. Written Texts (written)
        if (source.subOptions && Array.isArray(source.subOptions.extractedWritten) && source.subOptions.extractedWritten.length > 0) {
            source.subOptions.extractedWritten.forEach(w => {
                proposed.push({
                    type: 'written',
                    title: w.title,
                    desc: w.desc,
                    subOptions: { 
                        writtenType: w.writtenType || 'حوار تفصيلي سينمائي', 
                        writtenLanguage: w.writtenLanguage || 'العربية الفصحى', 
                        writtenStyle: w.writtenStyle || 'شاعري غامض وفلسفي',
                        writtenText: w.text || w.desc || 'نص المخطوطة الكونية المقترح...'
                    }
                });
            });
        } else {
            proposed.push({
                type: 'written',
                title: `نص حوار كوني لـ (${source.title})`,
                desc: `مخطوطة حوارية تفصيلية مبنية على صراع الحبكة: ${plot.substring(0, 100) || "صراع الأبعاد والطبقات الزمنية البصرية"}...`,
                subOptions: { 
                    writtenType: 'حوار تفصيلي سينمائي', 
                    writtenLanguage: 'العربية الفصحى', 
                    writtenStyle: 'شاعري غامض وفلسفي',
                    writtenText: `نص حوار سينمائي مقترح مستوحى من صراع الحبكة: (${source.title}) وحبكة (${plot.substring(0, 150)}).`
                }
            });
        }

        // 6. Voices (voice)
        if (source.subOptions && Array.isArray(source.subOptions.extractedVoices) && source.subOptions.extractedVoices.length > 0) {
            source.subOptions.extractedVoices.forEach(v => {
                proposed.push({
                    type: 'voice',
                    title: v.title,
                    desc: v.desc,
                    subOptions: { 
                        voiceActor: v.actor || 'مؤدي ذكاء اصطناعي كوني', 
                        voicePitch: v.pitch || 'عميق ووقور (Deep/Resonant)', 
                        voiceAccent: v.accent || 'عربية فصحى درامية' 
                    }
                });
            });
        } else {
            proposed.push({
                type: 'voice',
                title: `صوت للشخصية البطلة من (${source.title})`,
                desc: `الأداء الصوتي واللكنة المقترحة للشخصية القيادية المستوحاة من: ${source.title}`,
                subOptions: { 
                    voiceActor: 'مؤدي ذكاء اصطناعي كوني', 
                    voicePitch: 'عميق ووقور (Deep/Resonant)', 
                    voiceAccent: 'عربية فصحى درامية' 
                }
            });
        }

        // 7. Comics (comic)
        if (source.subOptions && Array.isArray(source.subOptions.extractedComics) && source.subOptions.extractedComics.length > 0) {
            source.subOptions.extractedComics.forEach(c => {
                proposed.push({
                    type: 'comic',
                    title: c.title,
                    desc: c.desc,
                    subOptions: { 
                        comicEngine: c.engine || 'Midjourney v6', 
                        comicStyle: c.style || 'مانجا مظللة حبرية خشنة', 
                        comicPanelCount: c.panelCount || '4 لوحات' 
                    }
                });
            });
        } else {
            proposed.push({
                type: 'comic',
                title: `لوحة قصة لـ (${source.title})`,
                desc: `قصة مصورة تجسد اللحظة الحاسمة في صراع: ${plot.substring(0, 100) || "صراع الأبعاد والجاذبية والخطوط"}...`,
                subOptions: { 
                    comicEngine: 'Midjourney v6', 
                    comicStyle: 'مانجا مظللة حبرية خشنة', 
                    comicPanelCount: '4 لوحات' 
                }
            });
        }

        // 8. Videos (video)
        if (source.subOptions && Array.isArray(source.subOptions.extractedVideos) && source.subOptions.extractedVideos.length > 0) {
            source.subOptions.extractedVideos.forEach(v => {
                proposed.push({
                    type: 'video',
                    title: v.title,
                    desc: v.desc,
                    subOptions: { 
                        videoEngine: v.engine || 'Runway Gen-2', 
                        videoDuration: v.duration || '4 ثواني', 
                        videoFps: v.fps || '24' 
                    }
                });
            });
        } else {
            proposed.push({
                type: 'video',
                title: `مقطع سينمائي لـ (${source.title})`,
                desc: `فيديو متحرك قصير يعبر بصرياً عن بيئة: ${setting.substring(0, 100) || "موقع أثري يقع عند خط التماس المباشر بين بوابات الرسم الحبرية"}...`,
                subOptions: { 
                    videoEngine: 'Runway Gen-2', 
                    videoDuration: '4 ثواني', 
                    videoFps: '24' 
                }
            });
        }

        // 9. Games (game)
        if (source.subOptions && Array.isArray(source.subOptions.extractedGames) && source.subOptions.extractedGames.length > 0) {
            source.subOptions.extractedGames.forEach(g => {
                proposed.push({
                    type: 'game',
                    title: g.title,
                    desc: g.desc,
                    subOptions: { 
                        gameEngine: g.engine || 'Unity 2D', 
                        gameGenre: g.genre || 'منصات ولغز فيزيائي (Physics Platformer)', 
                        gamePlatform: g.platform || 'PC/Web' 
                    }
                });
            });
        } else {
            proposed.push({
                type: 'game',
                title: `لعبة أبعاد تفاعلية لـ (${source.title})`,
                desc: `لعبة تحميل مصغرة تفاعلية تحاكي موقع صدام الأبعاد في: ${setting.substring(0, 100) || "موقع أثري يقع عند خط التماس المباشر بين بوابات الرسم"}...`,
                subOptions: { 
                    gameEngine: 'Unity 2D', 
                    gameGenre: 'منصات ولغز فيزيائي (Physics Platformer)', 
                    gamePlatform: 'PC/Web' 
                }
            });
        }

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
                // 1. Save the current scenario first so progress and relationships are preserved
                const scenId = this.editingAssetId;
                const scenType = this.assetTypeSelect.value;
                const scenTitle = this.assetTitleInput.value.trim() || `سيناريو مستخلص من (${source.title})`;
                const scenDesc = this.assetDescTextarea.value.trim();
                const scenDriveUrl = this.assetDriveUrlInput.value.trim() || "https://drive.google.com/drive/folders/extracted-mock-folder";
                const scenStatus = this.assetStatusSelect.value;
                const scenRelatedSource = this.relatedSourceSelect.value;

                const scenSubOptions = {};
                const scenSelects = this.dynamicOptionsContainer.querySelectorAll('select');
                scenSelects.forEach(sel => {
                    const key = sel.id.replace('opt-', '');
                    scenSubOptions[key] = sel.value;
                });
                const scenInputs = this.dynamicOptionsContainer.querySelectorAll('input');
                scenInputs.forEach(inp => {
                    const key = inp.id.replace('opt-', '');
                    scenSubOptions[key] = inp.value;
                });
                const scenTextareas = this.dynamicOptionsContainer.querySelectorAll('textarea');
                scenTextareas.forEach(ta => {
                    const key = ta.id.replace('opt-', '');
                    scenSubOptions[key] = ta.value;
                });

                const isScenEditing = this.assets.some(a => a.id === scenId);
                if (isScenEditing) {
                    this.assets = this.assets.map(a => {
                        if (a.id === scenId) {
                            return {
                                ...a,
                                title: scenTitle,
                                desc: scenDesc,
                                driveUrl: scenDriveUrl,
                                status: scenStatus,
                                relatedSource: scenRelatedSource,
                                subOptions: scenSubOptions
                            };
                        }
                        return a;
                    });
                } else {
                    const newScen = {
                        id: scenId,
                        type: scenType,
                        title: scenTitle,
                        desc: scenDesc,
                        driveUrl: scenDriveUrl,
                        status: scenStatus,
                        relatedSource: scenRelatedSource,
                        relatedCreator: "",
                        relatedFaction: "",
                        relatedCharacters: [],
                        interfacePhysics: "",
                        directorChecklist: { noBlending: false, depthContrast: false, sonicDissonance: false },
                        usedPrompt: "",
                        subOptions: scenSubOptions,
                        createdAt: new Date().toISOString()
                    };
                    this.assets.push(newScen);
                }

                // 2. Create and add the new extracted asset
                const newAssetId = 'asset-extracted-' + Date.now() + '-' + idx;
                
                // Map the relatedScenario linkage: if parent is scenario, link to it; otherwise look up matched scenario
                let relatedScenarioId = "";
                if (scenType === 'scenario') {
                    relatedScenarioId = scenId;
                } else {
                    const matchedScenario = this.assets.find(a => a.type === 'scenario' && a.relatedSource === sourceId);
                    if (matchedScenario) {
                        relatedScenarioId = matchedScenario.id;
                    }
                }

                const newAsset = {
                    id: newAssetId,
                    type: p.type,
                    title: p.title,
                    desc: p.desc,
                    driveUrl: "https://drive.google.com/drive/folders/extracted-mock-folder",
                    status: 'draft',
                    relatedScenario: p.type === 'scenario' ? "" : relatedScenarioId,
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

        // 1. Capture current values of selectors and sub-options to prevent loss of state
        const prevScenario = editData ? editData.relatedScenario : this.relatedScenarioSelect.value;
        const prevSource = editData ? editData.relatedSource : this.relatedSourceSelect.value;
        const prevCreator = editData ? editData.relatedCreator : this.relatedCreatorSelect.value;
        const prevChars = editData ? (editData.relatedCharacters || []) : Array.from(this.charactersCheckboxContainer.querySelectorAll('input[name="related-chars"]:checked')).map(cb => cb.value);

        const currentSubOptions = {};
        if (this.dynamicOptionsContainer) {
            const selects = this.dynamicOptionsContainer.querySelectorAll('select');
            selects.forEach(sel => {
                const key = sel.id.replace('opt-', '');
                currentSubOptions[key] = sel.value;
            });
            const inputs = this.dynamicOptionsContainer.querySelectorAll('input');
            inputs.forEach(inp => {
                const key = inp.id.replace('opt-', '');
                currentSubOptions[key] = inp.value;
            });
            const textareas = this.dynamicOptionsContainer.querySelectorAll('textarea');
            textareas.forEach(ta => {
                const key = ta.id.replace('opt-', '');
                currentSubOptions[key] = ta.value;
            });
        }
        
        const mergedEditData = editData || {
            relatedScenario: prevScenario,
            relatedSource: prevSource,
            relatedCreator: prevCreator,
            relatedCharacters: prevChars,
            subOptions: currentSubOptions
        };

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

        if (type !== 'source') {
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
                if (mergedEditData.relatedCharacters && mergedEditData.relatedCharacters.includes(c.id)) {
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
        } else if (type === 'written') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCharacters.style.display = "none";
            this.groupRelatedCreator.style.display = "none";
            this.groupRelatedSource.style.display = "block";
            
            if (scenarios.length === 0) {
                this.prereqBox.className = "prereq-guide-box alert-important";
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-danger)">⚠️ تنبيه هام: السيناريوهات مفقودة</div>
                    <p>أنت بحاجة لتأليف سيناريو واحد على الأقل لربط النصوص والمخطوطات به.</p>
                `;
            } else {
                warningHtml = `
                    <div class="prereq-title" style="color:var(--color-cyan)">📜 إرشاد المخطوطات والنصوص المكتوبة</div>
                    <p>اكتب الحوارات التفصيلية، الأساطير Lore، ونصوص العالم واربطها بالسيناريو التابع لها.</p>
                `;
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
        } else if (type === 'comic') {
            this.groupRelatedScenario.style.display = "block";
            this.groupRelatedCreator.style.display = "block";
            this.groupRelatedCharacters.style.display = "block";

            const selectedScenId = mergedEditData.relatedScenario;
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

        if (type === 'source') {
            const btnGen = document.getElementById('btn-generate-source-ai');
            if (btnGen) {
                btnGen.addEventListener('click', () => this.generateSourceWithAI());
            }
        } else {
            const btnGen = document.getElementById('btn-generate-asset-ai');
            if (btnGen) {
                btnGen.addEventListener('click', () => this.generateAssetWithAI(type));
            }
        }
    }

    renderDynamicOptions(type, editData = null) {
        this.dynamicOptionsContainer.innerHTML = "";
        this.groupSuggestedPrompt.style.display = "block";

        let optionsHtml = "";

        if (type !== 'source') {
            optionsHtml += `
                <div style="margin-bottom:12px; display:flex; justify-content:flex-end; width:100%;">
                    <button type="button" id="btn-generate-asset-ai" class="btn" style="background-color: var(--color-accent); color: #fff; font-size: 0.8rem; font-weight: bold; padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; width: 100%; justify-content: center; margin-top: 5px;">
                        <span>🤖</span> <span>توليد وتعبئة تفاصيل الأصل بالذكاء الاصطناعي</span>
                    </button>
                </div>
            `;
        }

        if (type === 'source') {
            optionsHtml = `
                <div style="margin-bottom:12px; display:flex; justify-content:flex-end; width:100%;">
                    <button type="button" id="btn-generate-source-ai" class="btn" style="background-color: var(--color-accent); color: #fff; font-size: 0.8rem; font-weight: bold; padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; width: 100%; justify-content: center; margin-top: 5px;">
                        <span>🤖</span> <span>توليد قصة ومصدر سردي تلقائياً بالذكاء الاصطناعي</span>
                    </button>
                </div>
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
            
            if (this.editingAssetId) {
                const linked = this.assets.filter(a => a.relatedSource === this.editingAssetId && a.id !== this.editingAssetId);
                if (linked.length > 0) {
                    optionsHtml += `
                        <div class="form-group" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                            <label style="color: var(--color-success); font-weight: bold; display: flex; align-items: center; gap: 6px;">
                                <span>🔗</span> <span>الأصول المنتجة المرتبطة حالياً بهذا المصدر (${linked.length})</span>
                            </label>
                            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px; max-height: 200px; overflow-y: auto; padding-right: 2px;">
                    `;
                    const typesAr = {
                        'scenario': '🎬 سيناريو',
                        'creator': '🎨 رسام',
                        'character': '👤 شخصية',
                        'environment': '🏞️ بيئة',
                        'voice': '🗣️ صوت',
                        'music': '🎵 موسيقى',
                        'comic': '📚 قصة مصورة',
                        'video': '🎥 فيديو كوني',
                        'game': '🎮 لعبة كوكبية'
                    };
                    linked.forEach(la => {
                        const typeStr = typesAr[la.type] || la.type;
                        optionsHtml += `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary); padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.8rem;">
                                <span><strong>${la.title}</strong> (${typeStr})</span>
                                <span style="font-size: 0.72rem; padding: 2px 6px; border-radius: 3px; background: ${la.status === 'finished' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(127, 140, 141, 0.15)'}; color: ${la.status === 'finished' ? 'var(--color-success)' : 'var(--text-tertiary)'}; font-weight: bold;">
                                    ${la.status === 'finished' ? 'منتهي' : 'مسودة'}
                                </span>
                            </div>
                        `;
                    });
                    optionsHtml += `
                            </div>
                        </div>
                    `;
                }
            }
        } else if (type === 'creator') {
            optionsHtml += `
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
                <!-- Hybrid Creator Settings -->
                <div class="form-group" style="background: rgba(99, 102, 241, 0.05); padding: 10px; border-radius: 6px; border: 1px dashed var(--border-color); margin-top: 10px;">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-weight: bold; color: var(--color-accent);">
                        <input type="checkbox" id="opt-isHybrid" onchange="document.getElementById('hybrid-creator-fields').style.display = this.checked ? 'block' : 'none';" style="width: auto;">
                        <span>🧬 رسام مهجن (Hybrid Creator)</span>
                    </label>
                    <div id="hybrid-creator-fields" style="display: none; margin-top: 10px;">
                        <div class="form-group" style="margin-bottom: 8px;">
                            <label for="opt-secondaryStyle">الأسلوب الفني المهجن الثاني *</label>
                            <select id="opt-secondaryStyle">
                                <option value="لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)">لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)</option>
                                <option value="مانجا يابانية تقليدية بحبر أسود حاد" selected>مانجا يابانية تقليدية بحبر أسود حاد</option>
                                <option value="رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)">رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)</option>
                                <option value="رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)">رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)</option>
                                <option value="رسوم رقمية حديثة ذات متجهات هندسية (Vectors)">رسوم رقمية حديثة ذات متجهات هندسية (Vectors)</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="opt-blendRatio">نسبة الدمج والتهجين *</label>
                            <input type="range" id="opt-blendRatio" min="10" max="90" step="10" value="50" oninput="document.getElementById('blendRatio-val').textContent = this.value + '% / ' + (100 - this.value) + '%';">
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: bold; margin-top: 4px; color: var(--text-secondary);">
                                <span>الأسلوب الأساسي</span>
                                <span id="blendRatio-val">50% / 50%</span>
                                <span>الأسلوب المهجن الثاني</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'scenario') {
            optionsHtml += `
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
                    <label for="opt-styleName">اسم الأسلوب الفني للسيناريو (Style Name) *</label>
                    <input type="text" id="opt-styleName" placeholder="أدخل اسم الأسلوب الفني المميز (مثال: نيون سايبربانك الهجين)..." style="font-size: 0.8rem; width: 100%; box-sizing: border-box; padding: 6px; border-radius:4px; border:1px solid var(--border-color);" value="زيتي كلاسيكي مدمج مع خطوط حبر سوداء حادة" required>
                </div>
                <div class="form-group">
                    <label for="opt-styleDesc">وصف وتفاصيل الأسلوب الفني للسيناريو (Style Description) *</label>
                    <textarea id="opt-styleDesc" rows="2" placeholder="صف العناصر الجمالية والقواعد البصرية التي تميز هذا الأسلوب الفني للسيناريو..." required>ضربات فرشاة سميكة وملمس زيتي بارز في الخلفيات والظلال، مع خطوط تحديد رفيعة وحادة للشخصيات تظهر كأنها مرسومة بقلم G-Pen ياباني</textarea>
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
            optionsHtml += `
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
                <div class="form-group">
                     <label for="opt-envVisual">الوصف البصري والمعالم الجغرافية (Visual Description) *</label>
                     <textarea id="opt-envVisual" rows="2" placeholder="صف الجبال الملونة، الأبنية، التضاريس والخطوط الفنية..." required>هياكل صخرية هندسية تطفو وتذوب في سماء كحلية، مع خطوط تلامس مشعة باللون الفيروزي</textarea>
                </div>
                <div class="form-group">
                     <label for="opt-envTimeOfDay">الوقت والطقس الكوني (Time of Day & Cosmic Weather) *</label>
                     <input type="text" id="opt-envTimeOfDay" placeholder="مثال: غسق قرمزي، شفق كوني لانهائي، ليل فضي..." value="شفق قرمزي دائم يتداخل مع سديم سائل متساقط كالأمطار الزيتية" required>
                </div>
            `;
        } else if (type === 'character') {
            optionsHtml += `
                <div class="form-group">
                    <label for="opt-charClass">الدور السردي للشخصية *</label>
                    <select id="opt-charClass" required>
                        <option value="بطل القصة الرئيسي (Protagonist)">بطل القصة الرئيسي (Protagonist)</option>
                        <option value="الخصم أو الشرير الرئيسي (Antagonist)">الخصم أو الشرير الرئيسي (Antagonist)</option>
                        <option value="شخصية مستيقظة تدرك أنها مرسومة (Awakened)">شخصية مستيقظة تدرك أنها مرسومة (Awakened)</option>
                        <option value="حارس زمن يحمي طبقات اللوحة (Time Keeper)">حارس زمن يحمي طبقات اللوحة (Time Keeper)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-charVisual">الوصف البصري والملامح الجسدية (Visual Description) *</label>
                    <textarea id="opt-charVisual" rows="2" placeholder="أدخل الملامح الجسدية، لون العيون والشعر، الطول، تعابير الوجه..." required>شعر فضي قصير منسدل، عيون زرقاء متوهجة، قامة ممشوقة بملامح حادة</textarea>
                </div>
                <div class="form-group">
                    <label for="opt-charKingdom">المملكة الكونية ومصفوفة الفيزياء (Cosmic Matrix Realm) *</label>
                    <select id="opt-charKingdom" required>
                        <option value="Ink Metropolis (متروبوليس الحبر - Manga)">متروبوليس الحبر (خطوط حادة، حركة 12fps، مونوكروم)</option>
                        <option value="Canvas Empire (إمبراطورية القماش - Classical Oil)">إمبراطورية القماش (خطوط منعدمة، حركة 60fps لزجة، تشياروسكورو)</option>
                        <option value="Graphite Kingdom (مملكة الغرافيت - Charcoal/Pencil)">مملكة الغرافيت (خطوط هشة مرنة، تتطاير بالريح، رمادي شاحب)</option>
                        <option value="Digital Expanse (المدى الرقمي - Pixel/Neon)">المدى الرقمي (متجهات رياضية، انتقال آني، ألوان مسطحة)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-charGravity">الجاذبية الجمالية والكتلة الوجودية (Aesthetic Gravity & Mass) *</label>
                    <select id="opt-charGravity" required>
                        <option value="هشة وخفيفة للغاية (تتأثر بالرياح وسريعة المحو - Graphite/Charcoal)">هشة وخفيفة للغاية (تتأثر بالرياح وسريعة المحو)</option>
                        <option value="ثقيلة وكثيفة للغاية (تمتلك عطالة وتفرض عمقاً ثلاثياً - Classical Oil/Impasto)">ثقيلة وكثيفة للغاية (تمتلك عطالة وتفرض عمقاً ثلاثياً)</option>
                        <option value="رقمية متزنة ثابتة (محكومة بإحداثيات رياضية - Digital Vectors)">رقمية متزنة ثابتة (محكومة بإحداثيات رياضية)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-charClothing">الملابس والإكسسوارات المرافقة (Clothing & Accessories) *</label>
                    <textarea id="opt-charClothing" rows="2" placeholder="أدخل تفاصيل الملابس، الدروع، الأوشحة، أو الخواتم المميزة..." required>سترة جلدية سوداء طويلة ذات أطراف كربونية، وشاح أحمر ممزق، وخاتم فضي قديم</textarea>
                </div>
            `;
        } else if (type === 'prop') {
            optionsHtml += `
                <div class="form-group">
                    <label for="opt-propType">نوع الأداة/المقتنى الكوني *</label>
                    <select id="opt-propType" required>
                        <option value="سلاح أبعادي (Dimensional Weapon)">سلاح أبعادي (Dimensional Weapon)</option>
                        <option value="تميمة سحرية/أثرية (Cosmic Relic/Amulet)">تميمة سحرية/أثرية (Cosmic Relic/Amulet)</option>
                        <option value="أداة فنية متحولة (Transformative Art Tool)">أداة فنية متحولة (Transformative Art Tool)</option>
                        <option value="جهاز رصد وتنقيب (Sensor/Detector)">جهاز رصد وتنقيب (Sensor/Detector)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-propVisual">الوصف البصري والملامح المادية للـ Prop (Visual Description) *</label>
                    <textarea id="opt-propVisual" rows="2" placeholder="صف مظهر المقتنى، لونه، خاماته وقوامه البصري..." required>درع بلوري متوهج ذو نقوش فيروزية تشع بنبضات خافتة، مع حواف مكسورة تظهر كمسودة رصاص</textarea>
                </div>
                <div class="form-group">
                    <label for="opt-propKingdom">المملكة الكونية ومصفوفة الفيزياء (Cosmic Matrix Realm) *</label>
                    <select id="opt-propKingdom" required>
                        <option value="Ink Metropolis (متروبوليس الحبر - Manga)">متروبوليس الحبر (خطوط حادة، حركة 12fps، مونوكروم)</option>
                        <option value="Canvas Empire (إمبراطورية القماش - Classical Oil)">إمبراطورية القماش (خطوط منعدمة، حركة 60fps لزجة، تشياروسكورو)</option>
                        <option value="Graphite Kingdom (مملكة الغرافيت - Charcoal/Pencil)">مملكة الغرافيت (خطوط هشة مرنة، تتطاير بالريح، رمادي شاحب)</option>
                        <option value="Digital Expanse (المدى الرقمي - Pixel/Neon)">المدى الرقمي (متجهات رياضية، انتقال آني، ألوان مسطحة)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-propGravity">الجاذبية الجمالية والكتلة الوجودية (Aesthetic Gravity & Mass) *</label>
                    <select id="opt-propGravity" required>
                        <option value="هشة وخفيفة للغاية (تتأثر بالرياح وسريعة المحو - Graphite/Charcoal)">هشة وخفيفة للغاية (تتأثر بالرياح وسريعة المحو)</option>
                        <option value="ثقيلة وكثيفة للغاية (تمتلك عطالة وتفرض عمقاً ثلاثياً - Classical Oil/Impasto)">ثقيلة وكثيفة للغاية (تمتلك عطالة وتفرض عمقاً ثلاثياً)</option>
                        <option value="رقمية متزنة ثابتة (محكومة بإحداثيات رياضية - Digital Vectors)">رقمية متزنة ثابتة (محكومة بإحداثيات رياضية)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-propUsage">متطلبات وطريقة الاستخدام السردي *</label>
                    <textarea id="opt-propUsage" rows="2" placeholder="صف كيفية عمل الأداة وقواعد فيزيائها المتنافرة عند خط التماس البصري..." required>تتطلب تركيزاً ذهنياً عالياً وتقوم بقص النسيج الضوئي بين طبقتين فنيتين عند التلويح بها</textarea>
                </div>
            `;
        } else if (type === 'voice') {
            optionsHtml += `
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
            optionsHtml += `
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
            optionsHtml += `
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
            optionsHtml += `
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
        } else if (type === 'written') {
            optionsHtml += `
                <div class="form-group">
                    <label for="opt-writtenType">نوع المخطوط المكتوب *</label>
                    <select id="opt-writtenType" required>
                        <option value="حوار تفصيلي سينمائي">حوار تفصيلي سينمائي</option>
                        <option value="تاريخ كوني وأساطير (Lore)">تاريخ كوني وأساطير (Lore)</option>
                        <option value="وثيقة تصميم وتوصيف للعالم">وثيقة تصميم وتوصيف للعالم</option>
                        <option value="وصف الكيانات والعناصر الكونية">وصف الكيانات والعناصر الكونية</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-writtenLanguage">اللغة المستهدفة *</label>
                    <input type="text" id="opt-writtenLanguage" placeholder="مثال: العربية الفصحى..." value="العربية الفصحى" required>
                </div>
                <div class="form-group">
                    <label for="opt-writtenStyle">الأسلوب التعبيري البلاغي *</label>
                    <select id="opt-writtenStyle" required>
                        <option value="ملحمي وجاد">ملحمي وجاد</option>
                        <option value="شاعري غامض وفلسفي">شاعري غامض وفلسفي</option>
                        <option value="سردي مباشر ووصفي">سردي مباشر ووصفي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="opt-writtenText">المخطوطة / النص المكتوب التفصيلي *</label>
                    <textarea id="opt-writtenText" rows="6" placeholder="اكتب هنا النص أو الحوار أو المخطوطة التفصيلية التي تغذي العمل..." required></textarea>
                </div>
            `;
        } else if (type === 'game') {
            optionsHtml += `
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
                if (sel) {
                    if (sel.type === 'checkbox') {
                        sel.checked = !!editData.subOptions[key];
                        if (sel.onchange) sel.onchange();
                    } else {
                        sel.value = editData.subOptions[key];
                    }
                }
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

        const valOf = (id, fallback = "") => {
            const el = document.getElementById(id);
            return el ? el.value : fallback;
        };

        let prompt = "";

        if (type === 'source') {
            const sourceType = valOf('opt-sourceType', 'رواية كوكبية طويلة (Novel)');
            const sourceAuthor = valOf('opt-sourceAuthor', 'الكاتب الكوني الأول');
            const sourceWordCount = valOf('opt-sourceWordCount', '1000');
            prompt = `اكتب فكرة عامة وحبكة وسينوبسيس مفصل لمصدر سردي في كون سكتشيك السينمائي.
نوع المصدر: [${sourceType}].
المؤلف الكوني: [${sourceAuthor}].
الحجم المستهدف: [حدود ${sourceWordCount} كلمة].
يجب أن تركز القصة على الأبعاد المتوازية والصدام الفني البصري بين أبعاد الرسم المختلفة (الزيتي، الكارتون، الحبر، الغرافيت) وصراعات الفصائل الكونية في هذا الكون.`;
        } else if (type === 'creator') {
            const artStyle = valOf('opt-artStyle', 'لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)');
            const tool = valOf('opt-tool', 'فرشاة شعر السنجاب الغليظة المشبعة بالزيت');
            prompt = `اكتب ملفاً تعريفياً سردياً وأدبياً لرسام كوني في كون سكتشيك السينمائي يسمى [اسم الرسام].
الأسلوب الفني الحاكم لرسوماته وعالمه: [${artStyle}].
الأداة الكونية الخاصة التي يرسم بها: [${tool}].
اشرح صراعه الفلسفي وكيف تنعكس ضربات أداته وقوانينها الفيزيائية على رسوماته وعوالمه التي يرسمها.`;
        } else if (type === 'scenario') {
            const genre = valOf('opt-genre', 'خيال علمي (Sci-Fi)');
            const style = valOf('opt-style', 'سرد تفصيلي بطيء ومكثف');
            const styleName = valOf('opt-styleName', 'زيتي كلاسيكي مدمج مع خطوط حبر سوداء حادة');
            const styleDesc = valOf('opt-styleDesc', 'ضربات فرشاة سميكة وملمس زيتي بارز...');
            const layer = valOf('opt-parallelLayer', 'Layer 1 - الوجود المادي الفعلي');
            const fps = valOf('opt-framerate', '24fps');
            
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
يخضع هذا السيناريو لأسلوب فني حاكم مميز: [${styleName}] مع القواعد والوصف الجمالي: [${styleDesc}].
يخضع هذا السيناريو أيضاً لرؤية الرسام الكوني ذي الأسلوب [${creatorStyle}] مستخدماً الأداة الكونية [${creatorTool}].
يتموضع هذا السيناريو في [${layer}] ويخضع لمعدل إطارات كوني قدره [${fps}].
يجب الحفاظ بشكل صارم على مبدأ ممنوع الدمج الفني (No Blending) والقص اللوني والتنافر الضوئي (Chromatic Shear) بحيث تحتفظ كل شخصية وكل عنصر بهويته الفنية بنسبة 100% دون امتزاج عند خط التماس البصري.`;
        } else if (type === 'environment') {
            const envType = valOf('opt-envType', 'داخل لوحة قماشية مائعة (Fluid Canvas Interior)');
            const clashDensity = valOf('opt-clashDensity', 'متوسطة (تداخل الضوء والجاذبية)');
            
            let creatorStyle = "أسلوب رسم فني متباين";
            if (this.relatedCreatorSelect.value) {
                const creator = this.assets.find(a => a.id === this.relatedCreatorSelect.value);
                if (creator && creator.subOptions) {
                    creatorStyle = creator.subOptions.artStyle || creatorStyle;
                }
            }

            const envVisual = valOf('opt-envVisual', 'هياكل صخرية هندسية تطفو وتذوب');
            const envTimeOfDay = valOf('opt-envTimeOfDay', 'شفق قرمزي دائم');

            prompt = `لوحة تصميم بيئة سينمائية لموقع في عالم سكتشيك (Sketchic World).
طبيعة البيئة الكونية: [${envType}].
الوصف البصري والملامح: [${envVisual}].
الوقت والطقس الكوني: [${envTimeOfDay}].
قواعد الأسلوب الموروثة من الرسام: مرسومة بدقة بأسلوب [${creatorStyle}].
كثافة التداخل الفني: [${clashDensity}].
التفاصيل: يجب أن تظهر المناظر الطبيعية والتضاريس والخصائص المعمارية مبنية بوضوح بملامس وقوام هذا الأسلوب الفني. إبراز حدود الصدام والتلامس البصري مع الأبعاد الأخرى. لقطة بزاوية واسعة.`;
        } else if (type === 'character') {
            const charClass = valOf('opt-charClass', 'شخصية مستيقظة تدرك أنها مرسومة (Awakened)');
            
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

            const charVisual = valOf('opt-charVisual', 'ملامح حادة مميزة');
            const charClothing = valOf('opt-charClothing', 'زي قتالي متناسق');
            const charKingdom = valOf('opt-charKingdom', 'Ink Metropolis (متروبوليس الحبر - Manga)');
            const charGravity = valOf('opt-charGravity', 'غير محدد');

            prompt = `ورقة تصميم شخصية بصرية احترافية لشخصية في كون سكتشيك السينمائي.
الدور السردي للشخصية: [${charClass}].
الفصيل الكوني: [${factionText}].
المملكة ومصفوفة الفيزياء: [${charKingdom}].
الجاذبية الجمالية والكتلة الوجودية: [${charGravity}].
السلاح الكوني المميز: [${weaponText}].
الملامح والوصف الجسدي: [${charVisual}].
الملابس والإكسسوارات المميزة: [${charClothing}].
قوانين الأسلوب الموروثة من الرسام: مرسومة بأسلوب [${styleText}] باستخدام [${toolText}].
التفاصيل: يجب أن تعكس الشخصية خصائص كتلتها وجاذبيتها الجمالية ونمط حركتها (مثال: 12fps لشخصيات الحبر مقابل 60fps لزج لشخصيات الزيت) وتلتزم بقاعدة ممنوع الدمج الفني (No Blending) عند التماس.`;
        } else if (type === 'prop') {
            const propType = valOf('opt-propType', 'سلاح أبعادي (Dimensional Weapon)');
            const propVisual = valOf('opt-propVisual', 'درع بلوري متوهج');
            const propUsage = valOf('opt-propUsage', 'تتطلب تركيزاً ذهنياً عالياً');
            const propKingdom = valOf('opt-propKingdom', 'Ink Metropolis (متروبوليس الحبر - Manga)');
            const propGravity = valOf('opt-propGravity', 'غير محدد');
            
            let styleText = "أسلوب رسم فني متباين";
            if (this.relatedCreatorSelect.value) {
                const creator = this.assets.find(a => a.id === this.relatedCreatorSelect.value);
                if (creator && creator.subOptions) {
                    styleText = creator.subOptions.artStyle || styleText;
                }
            }
            
            prompt = `ورقة تصميم أصل فني بصرية (Prop Design Sheet) لأداة كوكبية في كون سكتشيك.
نوع الأداة: [${propType}].
المملكة ومصفوفة الفيزياء للـ Prop: [${propKingdom}].
الجاذبية الجمالية والكتلة الوجودية: [${propGravity}].
الوصف البصري والملامح: [${propVisual}].
قواعد الاستخدام والفيزياء: [${propUsage}].
قوانين الأسلوب الموروثة من الرسام: مرسومة بأسلوب [${styleText}].
التفاصيل: يجب توضيح كيف تؤثر الكتلة الوجودية والجاذبية الجمالية للـ Prop على شكلها وحركتها السردية، مع الحفاظ على خط تماس متوهج (Clash Boundary) غير مدموج.`;
        } else if (type === 'voice') {
            const voiceEngine = valOf('opt-voiceEngine', 'gemini-3.1-flash-tts-preview');
            prompt = `موجه توليد ملف صوت تعبيري كوني مخصص لـ Google AI Studio (gemini-3.1-flash-tts-preview).
محرك الصوت: [${voiceEngine}].`;

            if (voiceEngine === 'gemini-3.1-flash-tts-preview') {
                const voiceScene = valOf('opt-voiceScene', '');
                const voiceContext = valOf('opt-voiceContext', '');
                const voiceSpeaker = valOf('opt-voiceSpeaker', 'Algenib');
                const voiceTags = valOf('opt-voiceTags', '');
                prompt += `\n\nإعدادات الصوت المتعدد الوسائط في Google AI Studio:
- إعداد المشهد الخلفي: [${voiceScene}]
- سياق الكلام والأداء التعبيري: [${voiceContext}]
- المتحدث الصوتي المختار: [${voiceSpeaker}]
- النص الموجه بالأوسمة التعبيرية المباشرة: [${voiceTags}]`;
            }
        } else if (type === 'comic') {
            const format = valOf('opt-format', 'ويب تون طولي للموبايل (Vertical Webtoon)');
            const color = valOf('opt-color', 'قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)');
            
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
            const tool = valOf('opt-tool', 'Runway Gen-3 Alpha');
            const fps = valOf('opt-fps', 'مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)');
            
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
            const engine = valOf('opt-musicEngine', 'Suno AI');
            const genre = valOf('opt-musicGenre', 'Epic Orchestral');
            const tempo = valOf('opt-musicTempo', 'Medium/Dramatic');
            const instruments = valOf('opt-musicInstruments', 'Acoustic Strings');
            const musicPrompt = valOf('opt-musicPrompt', '');
            
            prompt = `توليد مقطع موسيقي تصويري كوني باستخدام [${engine}]:
أوسمة النمط الموسيقي: [النمط: ${genre}، السرعة: ${tempo}، الآلات: ${instruments}، الأجواء: سماوية، صدام بصري، سينمائي، لوحة صوتية مجسمة].
واصفات وتفاصيل اللحن: ${musicPrompt}

الهيكل اللحني المقترح للمقطع:
- [مقدمة]: نغمة كوكبية أثيرية تمهد لبداية خط التماس البصري.
- [تصاعد]: إدخال الأوتار وتصاعد حدة التوتر مع اقتراب الأسلوبين الفنيين من الصدام.
- [الذروة]: هبوط لحني ملحمي يجسد التنافر والصدام المادي لكون سكتشيك.
- [خاتمة]: نغمات متلاشية تمثل صدى الطبقات الزمنية المتوازية.`;
        } else if (type === 'written') {
            const wrType = valOf('opt-writtenType', 'حوار تفصيلي سينمائي');
            const wrLang = valOf('opt-writtenLanguage', 'العربية الفصحى');
            const wrStyle = valOf('opt-writtenStyle', 'ملحمي وجاد');
            const wrText = valOf('opt-writtenText', '');

            prompt = `تحسين وتأصيل المخطوطة الأدبية التالية ذات النوع [${wrType}] باللغة [${wrLang}] وبأسلوب [${wrStyle}]:

المخطوطة الحالية:
"""
${wrText}
"""

التعليمات:
1. صياغة النص بأسلوب بلاغي يعكس تباين الأبعاد والتصادم الفني المميز لكون سكتشيك البصري.
2. إذا كان حواراً، أضف إشارات سينمائية توضح لغة الجسد، وانفعالات الشخصية المكتوبة مقابل الشخصية الزيتية/الكلاسيكية.
3. عزز الغموض والعمق الفلسفي للصراع الجمالي بين ضربات الفرشاة وخطوط الحبر.`;
        } else if (type === 'game') {
            const gameGenre = valOf('opt-gameGenre', 'لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)');
            const mechanic = valOf('opt-mechanic', 'بوابات تغيير أبعاد الرسم لحل الألغاز الكونية');
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
            subOptions[key] = inp.type === 'checkbox' ? inp.checked : inp.value;
        });
        const textareas = this.dynamicOptionsContainer.querySelectorAll('textarea');
        textareas.forEach(ta => {
            const key = ta.id.replace('opt-', '');
            subOptions[key] = ta.value;
        });

        if (type === 'source' && this.generatedSourceExtractedData) {
            subOptions.extractedCreator = this.generatedSourceExtractedData.extractedCreator;
            subOptions.extractedCharacters = this.generatedSourceExtractedData.extractedCharacters;
            subOptions.extractedEnvironments = this.generatedSourceExtractedData.extractedEnvironments;
            subOptions.extractedMusic = this.generatedSourceExtractedData.extractedMusic;
        }

        if (!type || !title) {
            alert("يرجى ملء الحقول المطلوبة الأساسية (النوع والعنوان).");
            return;
        }

        let finalDriveUrl = driveUrl;
        if (!finalDriveUrl) {
            const folderMapping = {
                'source': '00_Source_Materials',
                'scenario': '01_Scenarios',
                'creator': '02_Creators_Paintings',
                'character': '03_Characters_Assets',
                'environment': '04_Environments_Assets',
                'voice': '05_Voices_Audios',
                'music': '06_Cosmic_Soundtracks',
                'comic': '07_Comics_Storyboards',
                'video': '08_Videos_Cinematics',
                'game': '09_Downloadable_Games',
                'written': '10_Written_Texts',
                'prop': '11_Props_Assets'
            };
            const folderName = folderMapping[type] || 'General_Assets';
            const safeTitle = title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
            finalDriveUrl = `https://drive.google.com/drive/folders/Sketchic_Universe_Root/${folderName}/${safeTitle}`;
        }

        // Strict Workflow Rule: No Creator without Narrative Source
        if (type === 'creator' && !relatedSource) {
            const proceed = confirm("تنبيه: لم تقم بربط الرسام بمصدر سردي بعد. هل ترغب في حفظه كمسودة بدون ربط مؤقتاً؟");
            if (!proceed) return;
        }

        // Strict Workflow Rule: No Scenario without Narrative Source
        if (type === 'scenario' && !relatedSource) {
            const proceed = confirm("تنبيه: لم تقم بربط السيناريو بمصدر سردي بعد. هل ترغب في حفظه كمسودة بدون ربط مؤقتاً؟");
            if (!proceed) return;
        }

        // Strict Workflow Rule: No Sub-assets without Scenario
        if (['character', 'environment', 'voice', 'music', 'prop'].includes(type) && !relatedScenario) {
            const proceed = confirm(`تنبيه: لم تقم بربط هذا الأصل (${type}) بسيناريو مفعّل بعد. هل ترغب في حفظه كمسودة بدون ربط مؤقتاً؟`);
            if (!proceed) return;
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

        const isEditing = this.assets.some(a => a.id === this.editingAssetId);
        if (isEditing) {
            // Edit mode
            this.assets = this.assets.map(a => {
                if (a.id === this.editingAssetId) {
                    return {
                        ...a,
                        type,
                        title,
                        desc,
                        driveUrl: finalDriveUrl,
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
                id: this.editingAssetId || ('asset-' + Date.now()),
                type,
                title,
                desc,
                driveUrl: finalDriveUrl,
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
                written: 'نصوص ومخطوطات',
                environment: 'عالم وبيئة',
                character: 'تصميم شخصية',
                prop: 'أداة ومقتنى كوني',
                voice: 'صوت كوني',
                music: 'موسيقى كونيّة',
                comic: 'قصة مصورة',
                video: 'فيديو متحرك',
                game: 'لعبة تحميل',
                project_summary: 'مشروع متكامل'
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
                const isHybrid = asset.subOptions.isHybrid;
                const secStyle = asset.subOptions.secondaryStyle || "";
                const blend = asset.subOptions.blendRatio || 50;
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🎨 <strong>الأسلوب:</strong> ${asset.subOptions.artStyle}</div>
                        <div style="margin-top:4px;">✍️ <strong>الأداة:</strong> ${asset.subOptions.tool}</div>
                        ${isHybrid ? `
                            <div style="margin-top:4px; color: var(--color-accent); font-weight: bold; border-top: 1px dashed var(--border-color); padding-top:4px; font-size: 0.72rem;">
                                🧬 <strong>أسلوب هجين:</strong> ${blend}% أساسي / ${100 - blend}% ${secStyle.split(' (')[0]}
                            </div>
                        ` : ''}
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
                const styleName = asset.subOptions.styleName || "زيتي كلاسيكي مدمج مع خطوط حبر سوداء حادة";
                const styleDesc = asset.subOptions.styleDesc || "ضربات فرشاة سميكة وملمس زيتي بارز في الخلفيات والظلال، مع خطوط تحديد رفيعة وحادة للشخصيات تظهر كأنها مرسومة بقلم G-Pen ياباني";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>📂 <strong>الطبقة الزمنية:</strong> ${layer}</div>
                        <div style="margin-top:4px;">⏱️ <strong>معدل الإطارات:</strong> ${fps}</div>
                        <div style="margin-top:4px;">📖 <strong>المصدر السردي:</strong> ${sourceText}</div>
                        <div style="margin-top:4px; border-top:1px dashed var(--border-color); padding-top:4px; margin-top:4px;">🎨 <strong>الأسلوب الفني:</strong> ${styleName}</div>
                        <div style="margin-top:4px; font-size:0.75rem; color:var(--text-secondary); line-height:1.4;">📝 <strong>وصف الأسلوب:</strong> ${styleDesc}</div>
                    </div>
                `;
            } else if (asset.type === 'character' && asset.subOptions) {
                const charClass = asset.subOptions.charClass || "دور غير محدد";
                const charKingdom = asset.subOptions.charKingdom || "متروبوليس الحبر (Manga)";
                const charGravity = asset.subOptions.charGravity || "غير محدد";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>👤 <strong>الدور السردي:</strong> ${charClass}</div>
                        <div style="margin-top:4px;">🪐 <strong>المملكة ومصفوفة الفيزياء:</strong> ${charKingdom}</div>
                        <div style="margin-top:4px;">⚖️ <strong>الجاذبية والكتلة:</strong> ${charGravity}</div>
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
            } else if (asset.type === 'written' && asset.subOptions) {
                const wrType = asset.subOptions.writtenType || "نص سردي";
                const wrLang = asset.subOptions.writtenLanguage || "العربية الفصحى";
                const wrStyle = asset.subOptions.writtenStyle || "ملحمي وجاد";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>📜 <strong>نوع النص:</strong> ${wrType}</div>
                        <div style="margin-top:4px;">🌐 <strong>اللغة:</strong> ${wrLang} (${wrStyle})</div>
                    </div>
                `;
            } else if (asset.type === 'prop' && asset.subOptions) {
                const propType = asset.subOptions.propType || "أداة ومقتنى كوني";
                const propKingdom = asset.subOptions.propKingdom || "متروبوليس الحبر (Manga)";
                const propGravity = asset.subOptions.propGravity || "غير محدد";
                creatorDetailsHtml = `
                    <div style="font-size:0.8rem; background-color:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:6px; padding:8px; margin-bottom:10px;">
                        <div>🛡️ <strong>نوع المقتنى:</strong> ${propType}</div>
                        <div style="margin-top:4px;">🪐 <strong>المملكة ومصفوفة الفيزياء:</strong> ${propKingdom}</div>
                        <div style="margin-top:4px;">⚖️ <strong>الجاذبية والكتلة:</strong> ${propGravity}</div>
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
                    
                    ${(asset.type === 'project_summary' || asset.type === 'scenario') ? `
                    <div style="margin-top: 10px; margin-bottom: 10px; display: flex; gap: 8px;">
                        ${asset.type === 'project_summary' && asset.content ? `
                        <button class="btn btn-secondary btn-download-md" style="flex: 1; font-size:0.75rem; padding: 6px 8px; display:inline-flex; justify-content:center; gap:4px; background-color: var(--color-accent-light); color: var(--color-accent); border: 1px solid rgba(99, 102, 241, 0.2); font-weight: bold; cursor: pointer;">
                            📥 مستند الـ MD
                        </button>
                        <button class="btn btn-secondary btn-view-summary" style="flex: 1; font-size:0.75rem; padding: 6px 8px; display:inline-flex; justify-content:center; gap:4px; background-color: var(--color-cyan-light); color: var(--color-cyan); border: 1px solid rgba(6, 182, 212, 0.2); font-weight: bold; cursor: pointer;">
                            📊 جدول الأصول
                        </button>
                        ` : ''}
                        ${asset.type === 'scenario' ? `
                        <button class="btn btn-secondary btn-generate-assets" style="flex: 1; font-size:0.75rem; padding: 6px 8px; display:inline-flex; justify-content:center; gap:4px; background-color: var(--color-accent-light); color: var(--color-accent); border: 1px solid rgba(99, 102, 241, 0.2); font-weight: bold; cursor: pointer;">
                            ✨ توليد أصول
                        </button>
                        ` : ''}
                        <button class="btn btn-secondary btn-export-vids" style="flex: 1; font-size:0.75rem; padding: 6px 8px; display:inline-flex; justify-content:center; gap:4px; background-color: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); font-weight: bold; cursor: pointer;">
                            🎬 لـ Google Vids
                        </button>
                    </div>
                    ` : ''}

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

            const btnVids = card.querySelector('.btn-export-vids');
            if (btnVids) {
                btnVids.addEventListener('click', () => this.openVidsExportModal(asset.id));
            }

            const btnGenAssets = card.querySelector('.btn-generate-assets');
            if (btnGenAssets) {
                btnGenAssets.addEventListener('click', () => this.generateAssetsFromScenario(asset));
            }

            if (asset.type === 'project_summary') {
                const btnDownload = card.querySelector('.btn-download-md');
                if (btnDownload) {
                    btnDownload.addEventListener('click', () => {
                        const blob = new Blob([asset.content], { type: 'text/markdown;charset=utf-8;' });
                        const link = document.createElement("a");
                        link.setAttribute("href", URL.createObjectURL(blob));
                        link.setAttribute("download", `${asset.title.replace(/[\/\\:*?"<>|]/g, '_')}.md`);
                        link.click();
                    });
                }
                const btnViewSummary = card.querySelector('.btn-view-summary');
                if (btnViewSummary) {
                    btnViewSummary.addEventListener('click', () => this.showProjectDetailsModal(asset));
                }
            }

            this.assetsGrid.appendChild(card);
        });
    }

    generateAssetsFromScenario(scenario) {
        if (!confirm(`🤖 هل تريد من الذكاء الاصطناعي تحليل هذا السيناريو وتوليد الأصول المناسبة له (رسام، شخصية، بيئة، وأداة) وتسكينها في مشروعك تلقائياً؟`)) {
            return;
        }

        // Show a loading indicator/toast
        const toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#0f172a; color:#fff; border:1px solid var(--color-cyan); padding:15px 25px; border-radius:8px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.5); z-index:9999; font-family:var(--font-ar); direction:rtl;";
        toast.innerHTML = `⏳ جاري تحليل السيناريو واستخلاص الأصول الفنية الكونية...`;
        document.body.appendChild(toast);

        setTimeout(() => {
            const desc = scenario.desc || "";
            const title = scenario.title || "";

            // Keyword analysis logic to make generation feel smart and customized
            let artStyle = "لوحة زيتية كلاسيكية مع حبر مانجا";
            let tool = "فرشاة مائية وأقلام جافة ملونة";
            let creatorName = "الرسام الكوني المكتشف";
            if (desc.includes("مانجا") || desc.includes("manga") || desc.includes("ياباني")) {
                artStyle = "رسم حبر مانجا ياباني تقليدي بظلال متباينة";
                tool = "قلم حبر مانجا زجاجي (G-Pen)";
                creatorName = "الرسام كينجي (Kenji)";
            } else if (desc.includes("زيت") || desc.includes("لوحة") || desc.includes("رسم زيتي")) {
                artStyle = "لوحة قماشية زيتية من عصر النهضة الإيطالي";
                tool = "فرشاة زيتية عريضة وسكين ألوان ملمسية";
                creatorName = "الرسامة فيرونيكا (Veronica)";
            } else if (desc.includes("سايبر") || desc.includes("مستقبل") || desc.includes("تكنولوجيا")) {
                artStyle = "فن سايبربانك رقمي بمتجهات هندسية وألوان نيون متوهجة";
                tool = "رسم رقمي مسطح (Vector Graphics)";
                creatorName = "المصمم نيوم (Neon)";
            } else if (desc.includes("قصاصات") || desc.includes("ورق") || desc.includes("كولاج")) {
                artStyle = "فن كولاج يدوي مبني من قصاصات الصحف والورق المقوى";
                tool = "مقص وغراء يدوي وألوان خشبية";
                creatorName = "الرسامة كولاجيا (Collagia)";
            }

            // Create Creator Asset
            const creatorId = 'extracted-creator-' + Date.now();
            const creatorAsset = {
                id: creatorId,
                type: 'creator',
                title: `الرسام: ${creatorName}`,
                desc: `رسام كوني مستخلص تلقائياً من سيناريو [${title}]، يمثل الهوية البصرية والقوانين الفنية الحاكمة للبعد.`,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                subOptions: {
                    artStyle: artStyle,
                    tool: tool,
                    isHybrid: false
                },
                createdAt: new Date().toISOString()
            };

            // Extract or invent Character Name
            let charName = "البطل المجهول (Unnamed Hero)";
            let charClass = "شخصية مستيقظة تدرك أنها مرسومة (Awakened)";
            let charVisual = "ملامح حادة، عيون متوهجة تعكس ألوان الطيف، تعبير مصمم وجاد";
            let charClothing = "سترة سفر طويلة، وشاح متقلب الألوان، دلاية فضية دائرية";

            if (desc.includes("حارس") || desc.includes("الأزمان")) {
                charName = "الحارس كيرون (Chiron)";
                charClass = "حراس الأزمان (Time Keepers) - حماة هيكل الطبقات";
                charVisual = "لحية بيضاء خفيفة، ملامح تدل على الحكمة، عيون بلون شفق الأزمان الفضي";
                charClothing = "رداء طويل مطرز بحلقات زمنية برونزية، خاتم ساعة رملية في اليد اليمنى";
            } else if (desc.includes("ممحاة") || desc.includes("فوضى") || desc.includes("محو")) {
                charName = "الماحي كايوس (Chaos)";
                charClass = "قوى المحو (The Erasers) - غلاة التصفير الفني";
                charVisual = "ملامح مبهمة وغير مكتملة الخطوط، وجه مغطى بظلال حبرية كثيفة متطايرة";
                charClothing = "سترة سوداء بلا حواف محددة، حزام يحمل أقلام رصاص فحمية ثقيلة";
            } else if (desc.includes("بطل") || desc.includes("مستيقظ") || desc.includes("مكتشف")) {
                charName = "المستكشف أطلس (Atlas)";
                charClass = "الشخصيات المستيقظة (The Awakened) - الساعون لمعرفة الحقيقة";
                charVisual = "عيون زرقاء متوهجة بالكامل، شعر رصاصي متطاير كقصاصات الورق، ملامح مستفسرة";
                charClothing = "معطف جلد مغطى برموز هندسية، حقيبة كتف فنية بها أوراق رسم ومساطر قياس";
            }

            // Create Character Asset
            const charId = 'extracted-char-' + Date.now();
            const charAsset = {
                id: charId,
                type: 'character',
                title: charName,
                desc: `شخصية مستخلصة تلقائياً من سيناريو [${title}]، تتجسد في البعد الفني وتتفاعل مع خط التماس البصري.`,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                relatedCreator: creatorId,
                subOptions: {
                    charClass: charClass,
                    optCharVisual: charVisual,
                    optCharClothing: charClothing
                },
                createdAt: new Date().toISOString()
            };

            // Extract Environment
            let envName = "البوابة البصرية المجهولة";
            let envType = "داخل لوحة قماشية مائعة (Fluid Canvas Interior)";
            let envVisual = "جبال وتضاريس دائرية تنساب كألوان مائية، مع سماء كحلية مليئة بالنجوم السائلة";
            let envTime = "شفق قرمزي دائم يتداخل مع سديم سائل متساقط كالأمطار الزيتية";

            if (desc.includes("مدينة") || desc.includes("سايبر")) {
                envName = "مدينة المتجهات (Vector City)";
                envType = "مدينة سايبربانك مبنية بمتجهات هندسية حادة (Vector City)";
                envVisual = "ناطحات سحاب مثلثة حادة، جسور ضوئية مستقيمة، متجهات حبرية سوداء في الأفق";
                envTime = "ليل فضي دائم تشعه اللوحات الإعلانية النيونية الفيروزية";
            } else if (desc.includes("جزيرة") || desc.includes("ورق")) {
                envName = "جزيرة القصاصات العائمة";
                envType = "جزيرة عائمة مبنية من قصاصات الصحف والورق";
                envVisual = "تضاريس وعشب مقصوص من صحف قديمة مطبوعة، أشجار كارتونية بخطوط تحديد سميكة";
                envTime = "شروق دافئ يظهر نسيج السطح الورقي المخطط للخلفية الكونية";
            }

            // Create Environment Asset
            const envId = 'extracted-env-' + Date.now();
            const envAsset = {
                id: envId,
                type: 'environment',
                title: envName,
                desc: `بيئة وموقع جغرافي تم استخلاصه تلقائياً من سيناريو [${title}] لتجسيد الأحداث بصرياً.`,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                relatedCreator: creatorId,
                subOptions: {
                    envType: envType,
                    clashDensity: "متوسطة (تداخل الضوء والجاذبية)",
                    optEnvVisual: envVisual,
                    optEnvTimeOfDay: envTime
                },
                createdAt: new Date().toISOString()
            };

            // Create Prop
            let propName = "الأداة الكونية المكتشفة";
            let propType = "أداة فنية متحولة (Transformative Art Tool)";
            let propVisual = "ريشة كتابة نحاسية قديمة يتوهج رأسها بنور سديمي أزرق متحول";
            let propUsage = "تستخدم لإعادة رسم التضاريس والخطوط المشوهة حول شق التماس البصري";

            if (desc.includes("سيف") || desc.includes("سلاح")) {
                propName = "السيف الأبعادي (Dimensional Blade)";
                propType = "سلاح أبعادي (Dimensional Weapon)";
                propVisual = "نصل حاد مائل بلوري يظهر كخط قلم رصاص خشن يقطع نسيج الفضاء الملون";
                propUsage = "يقطع النسيج الضوئي للبعد الفني لفتح بوابات تلامس مؤقتة مع أبعاد أخرى";
            } else if (desc.includes("قلم") || desc.includes("فرشاة")) {
                propName = "قلم القياس الكوني (Stylus of Order)";
                propType = "أداة فنية متحولة (Transformative Art Tool)";
                propVisual = "قلم رصاص عملاق ذو نقوش فيروزية تشع بنبضات خافتة، مع حافة مكسورة تظهر كمسودة رصاص";
                propUsage = "يعيد رسم الخطوط الخارجية للشخصيات والأبنية وتثبيت الطبقات الفنية المنهارة";
            } else if (desc.includes("تميمة") || desc.includes("أثر")) {
                propName = "التميمة الأثرية (Cosmic Amulet)";
                propType = "تميمة سحرية/أثرية (Cosmic Relic/Amulet)";
                propVisual = "حجر دائري مسطح منقوش عليه شروخ ذهبية تتدفق منها ألوان مائية حية";
                propUsage = "يمتص الطاقة التنافرية عند نقاط تصادم الأبعاد لحماية حامل التميمة من المحو البصري";
            }

            // Create Prop Asset
            const propId = 'extracted-prop-' + Date.now();
            const propAsset = {
                id: propId,
                type: 'prop',
                title: propName,
                desc: `مقتنى وأداة كوكبية مستخلصة تلقائياً من سيناريو [${title}]، مستخدمة في الصراع السردي.`,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                subOptions: {
                    propType: propType,
                    optPropVisual: propVisual,
                    optPropUsage: propUsage
                },
                createdAt: new Date().toISOString()
            };

            // Link newly generated assets into current lists
            this.assets.push(creatorAsset, charAsset, envAsset, propAsset);
            
            // Link Scenario back to the newly created assets
            scenario.relatedCreator = creatorId;
            scenario.relatedCharacters = [charId];
            scenario.relatedEnvironments = [envId];

            this.saveAssets();
            this.renderAssetsList();
            
            toast.style.background = "#15803d";
            toast.innerHTML = `✅ تم توليد وتعبئة الأصول بنجاح!<br>✍️ الرسام: ${creatorName}<br>👤 الشخصية: ${charName}<br>🌌 البيئة: ${envName}<br>🛡️ الأداة: ${propName}`;
            
            setTimeout(() => {
                toast.remove();
            }, 5000);
        }, 1500);
    }

    showProjectDetailsModal(asset) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay open';
        modal.style.zIndex = '300';
        
        const sessionData = asset.wizardSessionData || {};
        
        let rowsHtml = '';
        const toolMap = {
            source: "Gemini / ChatGPT",
            scenario: "Gemini / ChatGPT",
            written: "Gemini / ChatGPT",
            creator: "Midjourney",
            character: "Midjourney v6",
            environment: "Midjourney v6",
            voice: "Google TTS",
            music: "Suno AI",
            comic: "Midjourney",
            video: "Runway Gen-3",
            game: "Unity 2D"
        };
        const outputMap = {
            source: "مستند قصة سردي",
            scenario: "سيناريو تفصيلي",
            written: "مخطوطة حوار",
            creator: "دليل أسلوب فني",
            character: "لوحة تصميم شخصية",
            environment: "لوحة تصميم بيئة",
            voice: "ملف صوتي تعبيري",
            music: "ساوندتراك خلفي",
            comic: "قصة مصورة",
            video: "لقطة متحركة",
            game: "لعبة مصغرة WebGL"
        };
        const formatMap = {
            source: "MD (.md)",
            scenario: "MD (.md)",
            written: "MD (.md)",
            creator: "PDF / MD",
            character: "PNG (.png)",
            environment: "PNG (.png)",
            voice: "MP3 (.mp3)",
            music: "MP3 (.mp3)",
            comic: "PDF / PNG",
            video: "MP4 (.mp4)",
            game: "ZIP (.zip)"
        };
        const arabicTypes = {
            source: "📖 مصدر سردي",
            scenario: "📝 سيناريو",
            written: "📜 مخطوطة",
            creator: "🎨 رسام",
            character: "👤 شخصية",
            environment: "🌌 بيئة",
            voice: "🎙️ صوت",
            music: "🎵 موسيقى",
            comic: "📚 قصة مصورة",
            video: "🎬 فيديو",
            game: "🎮 لعبة"
        };

        Object.keys(sessionData).forEach(t => {
            const ids = sessionData[t] || [];
            ids.forEach(id => {
                const subAsset = this.assets.find(a => a.id === id);
                if (subAsset) {
                    rowsHtml += `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <strong>${arabicTypes[t] || t}</strong><br>
                                <span style="font-size:0.75rem; color:var(--color-cyan);">${subAsset.title}</span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${subAsset.usedPrompt || ''}">
                                ${subAsset.usedPrompt || 'لا يوجد برومبت'}
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">${toolMap[t] || ''}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">${outputMap[t] || ''}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: bold; color: var(--color-green);">${formatMap[t] || ''}</td>
                        </tr>
                    `;
                }
            });
        });

        if (!rowsHtml) {
            rowsHtml = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-tertiary);">لا توجد أصول مرتبطة بهذا المشروع في الذاكرة المحلية حالياً.</td></tr>`;
        }

        modal.innerHTML = `
            <div class="modal-card" style="max-width: 900px; width: 95%;">
                <div class="modal-header">
                    <h3>📊 ملخص أصول المشروع: ${asset.title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">×</button>
                </div>
                <div style="padding: 20px; overflow-y: auto; max-height: 70vh;">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 0.85rem; background: var(--bg-primary);">
                            <thead>
                                <tr style="background-color: var(--bg-tertiary); border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 12px; border: 1px solid var(--border-color); color: var(--color-cyan); text-align: right;">نوع الأصل والاسم</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color); color: var(--color-cyan); text-align: right;">البرومبت المقترح للتوليد</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color); color: var(--color-cyan); text-align: right;">الأداة المستهدفة (Tool)</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color); color: var(--color-cyan); text-align: right;">الناتج المتوقع (Expected Output)</th>
                                    <th style="padding: 12px; border: 1px solid var(--border-color); color: var(--color-cyan); text-align: right;">صيغة الملف (Format)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style="padding: 15px; border-top:1px solid var(--border-color); display:flex; justify-content: flex-end; background:var(--bg-secondary);">
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">إغلاق</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
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

        // Populate Creators dropdown in Episode Planner
        const planCreatorSelect = document.getElementById('plan-creator-select');
        if (planCreatorSelect) {
            const creators = this.assets.filter(a => a.type === 'creator');
            planCreatorSelect.innerHTML = '<option value="">-- اختر رساماً --</option>';
            creators.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.textContent = `✍️ ${c.title}`;
                planCreatorSelect.appendChild(opt);
            });
        }

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

        // Initialize frames container with one default frame if empty
        if (this.sceneFramesContainer && this.sceneFramesContainer.children.length === 0) {
            this.addSceneFrameRow();
        }
    }

    addSceneFrameRow(desc = "", dialogue = "", refAssetIds = []) {
        if (!this.sceneFramesContainer) return;
        const index = this.sceneFramesContainer.children.length + 1;
        
        const row = document.createElement('div');
        row.className = "scene-frame-row";
        row.style.cssText = "border: 1px solid var(--border-color); padding: 10px; border-radius: 6px; background: var(--bg-secondary); margin-bottom: 5px; position: relative;";
        
        // Populate options with all assets
        let optionsHtml = "";
        const typeLabels = {
            character: "👤 شخصية",
            environment: "🌌 بيئة",
            prop: "🛡️ أداة ومقتنى"
        };
        const filterTypes = ['character', 'environment', 'prop'];
        this.assets.forEach(asset => {
            if (filterTypes.includes(asset.type)) {
                const label = typeLabels[asset.type] || asset.type;
                const isSelected = refAssetIds.includes(asset.id) ? "selected" : "";
                optionsHtml += `<option value="${asset.id}" ${isSelected}>[${label}] ${asset.title}</option>`;
            }
        });

        row.innerHTML = `
            <button type="button" class="btn-remove-frame" style="position: absolute; left: 8px; top: 8px; background: transparent; border: none; color: var(--color-danger); cursor: pointer; font-size: 0.9rem; font-weight: bold;">✕</button>
            <div style="font-size: 0.8rem; font-weight: bold; margin-bottom: 5px; color: var(--color-cyan);">الإطار #<span class="frame-idx">${index}</span></div>
            
            <div class="form-group" style="margin-bottom: 8px;">
                <input type="text" class="frame-desc" placeholder="وصف الإطار البصري للقطة (Frame Description)..." value="${desc}" style="width:100%; font-size:0.8rem; padding:6px; background:var(--bg-primary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; box-sizing:border-box;" required>
            </div>
            
            <div class="form-group" style="margin-bottom: 8px;">
                <input type="text" class="frame-dialogue" placeholder="الحوار والترجمة (Dialogue & Subtitles)..." value="${dialogue}" style="width:100%; font-size:0.8rem; padding:6px; background:var(--bg-primary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; box-sizing:border-box;">
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-size: 0.72rem; display: block; margin-bottom: 2px; color: var(--text-secondary); font-weight:bold;">الأصول المرجعية للإطار (Reference Assets):</label>
                <select class="frame-assets" multiple style="width:100%; font-size:0.75rem; padding:3px; background:var(--bg-primary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; height: 60px; box-sizing:border-box;">
                    ${optionsHtml}
                </select>
            </div>
        `;

        // Bind remove button
        const removeBtn = row.querySelector('.btn-remove-frame');
        removeBtn.addEventListener('click', () => {
            row.remove();
            this.updateFrameIndices();
            this.updateSceneConsistencyPrompt();
            this.updateClashPreview();
        });

        this.sceneFramesContainer.appendChild(row);
        this.updateSceneConsistencyPrompt();
        this.updateClashPreview();
    }

    updateFrameIndices() {
        if (!this.sceneFramesContainer) return;
        const rows = this.sceneFramesContainer.querySelectorAll('.scene-frame-row');
        rows.forEach((row, i) => {
            const idxSpan = row.querySelector('.frame-idx');
            if (idxSpan) idxSpan.textContent = i + 1;
        });
    }

    generateEpisodePackage() {
        const creatorId = document.getElementById('plan-creator-select')?.value;
        const stage = document.getElementById('plan-arc-stage')?.value;
        
        if (!creatorId) {
            alert("⚠️ يرجى اختيار رسام كوني لتحديد النمط الفني الحاكم للحلقة.");
            return;
        }

        const creator = this.assets.find(a => a.id === creatorId);
        if (!creator) return;

        const artStyle = creator.subOptions?.artStyle || "لوحة زيتية كلاسيكية";
        const tool = creator.subOptions?.tool || "فرشاة زيتية";
        
        const characterList = this.assets.filter(a => a.type === 'character' && a.relatedCreator === creatorId);
        const environmentList = this.assets.filter(a => a.type === 'environment' && a.relatedCreator === creatorId);
        
        let charName = characterList.length > 0 ? characterList[0].title : "بطل غامض";
        let envName = environmentList.length > 0 ? environmentList[0].title : "البوابة البصرية المجهولة";

        let synopsis = "";
        let promptChar = "";
        let promptEnv = "";
        let voiceScript = "";
        let promptVideo = "";

        if (stage === 'intro') {
            synopsis = `الحلقة 1 (المغامرة والتعايش): يعيش البطل [${charName}] مغامرة عادية في موطنه [${envName}] بأسلوب [${artStyle}] مع المشاهد، محاولاً حماية بوابته دون إدراك طبيعة العالم المرسومة.`;
            promptChar = `A cinematic character design sheet of ${charName}, drawn strictly in the style of ${artStyle} using ${tool}. Full body view, high details, neutral background, Google Imagen 3 style.`;
            promptEnv = `A wide angle cinematic landscape concept art of ${envName}, painted in the style of ${artStyle}. Visualizing a rich environment with warm lighting, detailed textures, 16:9 aspect ratio.`;
            voiceScript = `[${charName}]: "هذا العالم يبدو هادئاً اليوم.. أشعر بانسجام غريب بين ضربات الضوء وظلال الجبال من حولنا."`;
            promptVideo = `Cinematic slow panning video shot of ${charName} walking through ${envName}. Hand-drawn style of ${artStyle}, smooth physical motion, Google Veo, 24fps.`;
        } else if (stage === 'glitch') {
            synopsis = `الحلقة 2 (الشق البصري): يبدأ البطل [${charName}] بملاحظة عيوب بصرية غريبة في بيئة [${envName}]، مثل خطوط رسم متناثرة في الأفق أو أصباغ تسقط من السماء، مما يثير شكوكه حول طبيعة واقعه.`;
            promptChar = `A cinematic character design sheet of ${charName} looking worried and puzzled, style of ${artStyle}, with subtle sketches and unfinished lines visible on the edges.`;
            promptEnv = `A wide angle cinematic landscape of ${envName} in the style of ${artStyle}, but showing a visible visual glitch: a portion of the sky is tearing to reveal a blank white paper backing, pencil grid lines showing.`;
            voiceScript = `[${charName}]: "انظر هناك!.. السماء لا تبدو حقيقية.. تلك ضربات فرشاة عملاقة وليست سحباً! ما هذا الجدار الذي يمنعنا من العبور؟"`;
            promptVideo = `A slow tilt up camera movement video showing ${charName} pointing at the sky where paint is melting. Style of ${artStyle}, dramatic visual clash effect, Google Veo.`;
        } else if (stage === 'journey') {
            synopsis = `الحلقة 3 (السفر لحافة الكانفاس): يقرر [${charName}] السفر لـ [${envName}] للبحث عن حافة العالم (إطار اللوحة الكونية) وتحدي حراس الأبعاد الذين يمنعونه من الوصول لمعرفة الحقيقة.`;
            promptChar = `Action shot of ${charName} running/fighting, determined look, style of ${artStyle}, outline glowing with raw graphite lines.`;
            promptEnv = `A dramatic wide shot of a boundary clash at the edge of the canvas. The rich ${artStyle} landscape is colliding with blank white margins, showcasing pencil sketch guidelines and color palettes.`;
            voiceScript = `[${charName}]: "سأصل إلى نهاية هذا العالم.. حتى لو كان ذلك يعني كسر الحدود التي تحبس خطوطي وألواني!"`;
            promptVideo = `Cinematic tracking shot of ${charName} running towards a blinding white void where the style of ${artStyle} dissolves. High energy, Google Veo.`;
        } else if (stage === 'encounter') {
            synopsis = `الحلقة 4 (اللقاء بالرسام): البطل [${charName}] يخترق جدار الإطار تماماً ليجد نفسه أمام يد الرسام الضخمة التي تحرك الفرشاة، مواجهاً صانعه مباشرة في لحظة فلسفية مهيبة.`;
            promptChar = `A character model sheet of ${charName} looking at a giant human hand holding a brush. Interaction between a 2D drawn character and real-world elements, style of ${artStyle}.`;
            promptEnv = `An epic surreal space showing a giant canvas with the world of ${envName} drawn on it, surrounded by giant paint bottles, pencils and a giant wooden table.`;
            voiceScript = `[${charName}]: "إذاً.. أنت صانعي؟ كل هذه المعارك.. كل هذه الآلام.. كانت مجرد حركة لفرشاتك على هذه اللوحة القماشية؟"`;
            promptVideo = `Surreal shot of a giant hand brushing paint to recreate the arm of ${charName}. Perfect blend of 2D drawn style of ${artStyle} and realistic workspace background, Google Veo.`;
        }

        document.getElementById('episode-package-title').textContent = `📊 حزمة الحلقة المولدة: ${creator.title} - المرحلة ${stage === 'intro' ? '1' : stage === 'glitch' ? '2' : stage === 'journey' ? '3' : '4'}`;
        document.getElementById('episode-package-desc').textContent = synopsis;
        document.getElementById('episode-prompt-char').textContent = promptChar;
        document.getElementById('episode-prompt-env').textContent = promptEnv;
        document.getElementById('episode-prompt-voice').textContent = voiceScript;
        document.getElementById('episode-prompt-video').textContent = promptVideo;
        
        document.getElementById('episode-package-result').style.display = 'block';
    }

    clearSceneForm() {
        this.sceneForm.reset();
        this.sceneIdInput.value = "";
        if (this.sceneFramesContainer) {
            this.sceneFramesContainer.innerHTML = "";
            this.addSceneFrameRow();
        }
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

        // Harvest frames
        let frames = [];
        if (this.sceneFramesContainer) {
            const frameRows = this.sceneFramesContainer.querySelectorAll('.scene-frame-row');
            frames = Array.from(frameRows).map(row => {
                const desc = row.querySelector('.frame-desc').value.trim();
                const dialogue = row.querySelector('.frame-dialogue').value.trim();
                const assetsSelect = row.querySelector('.frame-assets');
                const refAssetIds = Array.from(assetsSelect.selectedOptions).map(opt => opt.value);
                return { desc, dialogue, refAssetIds };
            });
        }
        if (frames.length === 0) {
            frames.push({
                desc: "مشهد عام لكون سكتشيك",
                dialogue: dialogue,
                refAssetIds: characterIds
            });
        }

        const sceneData = {
            id,
            title,
            scenarioId,
            characterIds,
            dialogue,
            audioProfile,
            comicId,
            videoId,
            frames,
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
            
            let framesHtml = "";
            if (s.frames && s.frames.length > 0) {
                framesHtml += `
                    <div style="margin-top:8px; border-top:1px dashed var(--border-color); padding-top:8px;">
                        <span class="scene-track-label" style="font-weight:bold; color:var(--color-cyan);">🖼️ لقطات وإطارات المشهد (${s.frames.length}):</span>
                        <div style="display:flex; flex-direction:column; gap:6px; margin-top:5px;">
                `;
                s.frames.forEach((f, fIdx) => {
                    const frameAssets = (f.refAssetIds || []).map(aid => this.assets.find(a => a.id === aid)).filter(Boolean);
                    const assetsStr = frameAssets.map(a => `${a.type === 'character' ? '👤' : (a.type === 'environment' ? '🌌' : '🛡️')} ${a.title}`).join('، ');
                    
                    framesHtml += `
                        <div style="font-size:0.75rem; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:4px; padding:6px;">
                            <div style="font-weight:bold; color:var(--color-accent);">اللقطة #${fIdx + 1}</div>
                            <div style="margin-top:2px;"><strong>الوصف البصري:</strong> ${f.desc}</div>
                            ${f.dialogue ? `<div style="margin-top:2px; color:var(--text-secondary);"><strong>الحوار والترجمة:</strong> ${f.dialogue}</div>` : ''}
                            ${assetsStr ? `<div style="margin-top:2px; font-size:0.7rem; color:var(--color-cyan);"><strong>الأصول المشاركة:</strong> ${assetsStr}</div>` : ''}
                        </div>
                    `;
                });
                framesHtml += `
                        </div>
                    </div>
                `;
            }

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
                        <span class="scene-track-label">🎬 لوحة العمل (Storyboard):</span>
                        <span class="scene-track-value">${comic ? '📚 ' + comic.title : 'غير مرتبط بلوحة عمل'}</span>
                    </div>
                    <div class="scene-track-row">
                        <span class="scene-track-label">🎞️ فيديو اللقطة:</span>
                        <span class="scene-track-value">${video ? '🎬 ' + video.title : 'لا يوجد فيديو مرتبط'}</span>
                    </div>
                    <div class="scene-track-row">
                        <span class="scene-track-label">🔊 الصوتيات:</span>
                        <span class="scene-track-value">${this.getAudioProfileLabel(s.audioProfile)}</span>
                    </div>
                    ${framesHtml}
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

        // Clear and load frames
        if (this.sceneFramesContainer) {
            this.sceneFramesContainer.innerHTML = "";
            if (scene.frames && scene.frames.length > 0) {
                scene.frames.forEach(f => {
                    this.addSceneFrameRow(f.desc, f.dialogue, f.refAssetIds || []);
                });
            } else {
                this.addSceneFrameRow("مشهد كوني عام", scene.dialogue || "", scene.characterIds || []);
            }
        }
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

        // Harvest frames list
        let frames = [];
        if (this.sceneFramesContainer) {
            const frameRows = this.sceneFramesContainer.querySelectorAll('.scene-frame-row');
            frames = Array.from(frameRows).map((row, i) => {
                const desc = row.querySelector('.frame-desc').value.trim();
                const dialogue = row.querySelector('.frame-dialogue').value.trim();
                const assetsSelect = row.querySelector('.frame-assets');
                const refAssetIds = Array.from(assetsSelect.selectedOptions).map(opt => opt.value);
                return { idx: i + 1, desc, dialogue, refAssetIds };
            });
        }

        let promptText = `[Google Flow Scene Prompt - Dynamic Consistency]\n`;
        promptText += `Create a high-fidelity cinematic scene based on the scenario: "${scenario ? scenario.title : 'Generic Sketchic Scene'}"\n\n`;
        promptText += `CHARACTER CONSISTENCY GUIDELINES:\n`;
        
        chars.forEach(char => {
            const creator = this.assets.find(a => a.id === char.relatedCreator);
            const style = creator && creator.subOptions ? creator.subOptions.artStyle : 'Distinct Art Style';
            promptText += `- Character Name: ${char.title}\n  Description: ${char.desc}\n  Visual Style: Rendered strictly in: ${style}. Do not blend this character's aesthetic with other styles.\n\n`;
        });

        if (frames.length > 0) {
            promptText += `STORYBOARD FRAMES SEQUENCE:\n`;
            frames.forEach(f => {
                const frameAssets = f.refAssetIds.map(aid => this.assets.find(a => a.id === aid)).filter(Boolean);
                const assetsStr = frameAssets.map(a => a.title).join(', ');
                promptText += `- Frame #${f.idx}: [Visual Description: ${f.desc}] | [Dialogue: ${f.dialogue || 'None'}] ${assetsStr ? `| [Featured Assets: ${assetsStr}]` : ''}\n`;
            });
            promptText += `\n`;
        }

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
        let userDialogue = "";
        if (this.sceneFramesContainer) {
            const firstDialogueInput = this.sceneFramesContainer.querySelector('.frame-dialogue');
            if (firstDialogueInput) userDialogue = firstDialogueInput.value.trim();
        }
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

            const charKingdom = char.subOptions ? char.subOptions.charKingdom || "" : "";
            if (styleName.includes("مانجا") || styleName.includes("Manga") || styleName.includes("حبر") || charKingdom.includes("Manga") || charKingdom.includes("Ink")) {
                spriteStyleClass = "clash-sprite-manga";
            } else if (styleName.includes("زيتية") || styleName.includes("Renaissance") || styleName.includes("زيت") || charKingdom.includes("Oil") || charKingdom.includes("Canvas")) {
                spriteStyleClass = "clash-sprite-oil";
            } else if (styleName.includes("رصاص") || styleName.includes("Sketch") || styleName.includes("فحم") || charKingdom.includes("Pencil") || charKingdom.includes("Graphite")) {
                spriteStyleClass = "clash-sprite-sketch";
            } else if (styleName.includes("رقمي") || styleName.includes("Digital") || styleName.includes("نيون") || styleName.includes("Vector") || charKingdom.includes("Digital") || charKingdom.includes("Expanse")) {
                spriteStyleClass = "clash-sprite-digital";
            }

            html += `
                <div class="clash-sprite ${spriteStyleClass}" data-name="${char.title}" style="animation-delay: ${idx * 0.3}s;">
                    <div class="clash-speech-bubble" style="animation-delay: ${idx * 0.5}s;">${dialogueText}</div>
                    <img src="logo.jpg" alt="${char.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;
        });

        if (chars.length >= 2) {
            // Render the glowing boundary separator line from the Playbook
            html += `
                <div class="clash-boundary-glow" style="
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 4px;
                    background: linear-gradient(180deg, #22d3ee, #ec4899, #f59e0b);
                    box-shadow: 0 0 15px #22d3ee, 0 0 30px #ec4899;
                    z-index: 5;
                    transform: translateX(-50%);
                    animation: boundaryPulse 2s infinite ease-in-out;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: #0f172a;
                        border: 1px solid var(--border-color);
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 0.6rem;
                        color: #fff;
                        font-weight: bold;
                        white-space: nowrap;
                        box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    ">⚡ غشاء التماس الكوني</div>
                </div>
            `;
        }

        html += `</div>`;
        this.clashPreviewStage.innerHTML = html;
    }

    handleScriptParsing() {
        const scriptText = this.scriptInputText.value.trim() || this.scriptInputText.placeholder;
        
        this.scriptParsingStatus.style.display = 'block';
        this.scriptEmptyResults.style.display = 'none';
        this.scriptSegmentedScenesList.style.display = 'none';
        this.terminalSpellBox.style.display = 'none';
        this.btnExportScriptScenes.style.display = 'none';

        setTimeout(() => {
            this.parsedScenes = [
                {
                    title: "المشهد الأول: تشققات البعد الحبري",
                    narration: "زين، مدقق خطي في متروبوليس الحبر، يتجول بين أزقة المدينة المونوكرومية الحادة ثنائية الأبعاد.",
                    action: "يلاحظ زين السماء الورقية المسطحة تبدأ في التصدع وتتساقط منها جسيمات فحمية خفيفة.",
                    charPhysics: "الشخصية (زين) بأسلوب مانجا 2D خطي نقي يتحرك بمعدل 12 إطاراً في الثانية (12fps).",
                    envPhysics: "بيئة متروبوليس الحبر ثنائية الأبعاد تماماً وبخطوط تحديد حادة 100% Opacity."
                },
                {
                    title: "المشهد الثاني: الصدام والسيولة الزيتية",
                    narration: "من بين التشققات في السماء الورقية، تسقط بقعة زيتية قرمزية ثقيلة ولزجة على الأرضية المخططة.",
                    action: "البقعة تبدأ في الانتشار، مشوهة خطوط الحبر الخارجية، ومثيرة قوى المحو البصري.",
                    charPhysics: "الشخصية وسوائل الصدام الزيتي تتحرك بانسيابية ناعمة ولزجة بمعدل 60 إطاراً في الثانية (60fps).",
                    envPhysics: "بيئة التماس البصري تحتوي على خطوط تماس متوهجة تمنع امتزاج ألوان النهضة مع الحبر."
                }
            ];

            this.renderParsedScenes();
        }, 1500);
    }

    renderParsedScenes() {
        this.scriptParsingStatus.style.display = 'none';
        this.scriptSegmentedScenesList.style.display = 'flex';
        this.btnExportScriptScenes.style.display = 'block';
        this.scriptSegmentedScenesList.innerHTML = "";

        this.parsedScenes.forEach((scene, index) => {
            const card = document.createElement('div');
            card.className = "card";
            card.style.cssText = "border: 1px solid var(--border-color); background: var(--bg-secondary); padding: 12px; margin-bottom: 8px; border-radius: 6px;";
            card.innerHTML = `
                <div style="font-weight: bold; font-size: 0.92rem; color: var(--color-cyan); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                    <span>${scene.title}</span>
                    <input type="checkbox" checked data-index="${index}" style="cursor: pointer;">
                </div>
                <div style="font-size: 0.8rem; line-height: 1.5; color: var(--text-secondary);">
                    <div style="margin-bottom: 4px;">📖 <strong>السرد:</strong> ${scene.narration}</div>
                    <div style="margin-bottom: 4px;">🎬 <strong>الحركة:</strong> ${scene.action}</div>
                    <div style="margin-top: 6px; border-top: 1px dashed var(--border-color); padding-top: 6px; font-size: 0.72rem; color: var(--color-accent);">
                        <div>⚡ <strong>فيزياء الشخصية:</strong> ${scene.charPhysics}</div>
                        <div>🌌 <strong>فيزياء البيئة:</strong> ${scene.envPhysics}</div>
                    </div>
                </div>
            `;
            this.scriptSegmentedScenesList.appendChild(card);
        });

        // Formulate and display the Spell of Creation terminal prompt
        this.terminalSpellBox.style.display = 'block';
        
        // Dynamically color code the terminal contents using HTML spans for maximum premium feeling
        this.terminalSpellContent.innerHTML = `
<span style="color: #4ade80;">Animate the attached images sequentially</span>
<span style="color: #fb7185;">Enforce strict Sketchic Physics</span>
<span style="color: #38bdf8;">The character on the left must remain pure 2D Manga line art moving at 12fps</span>
<span style="color: #f59e0b;">The environment and character on the right must be thick Renaissance Impasto oil moving smoothly at 60fps</span>
<span style="color: #c084fc;">Preserve the glowing visual clash boundary between them</span>
<span style="color: #f43f5e; font-weight: bold;">Absolutely NO blending of styles</span>
        `;
    }

    exportParsedScenes() {
        const cbs = this.scriptSegmentedScenesList.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIndices = Array.from(cbs).map(cb => parseInt(cb.dataset.index));

        if (selectedIndices.length === 0) {
            alert("يرجى اختيار مشهد واحد على الأقل للتصدير!");
            return;
        }

        // Get or create a Scenario to link scenes
        let scenario = this.assets.find(a => a.type === 'scenario');
        if (!scenario) {
            scenario = {
                id: 'scen-' + Date.now(),
                type: 'scenario',
                title: 'سيناريو مستخلص من النص الخام',
                desc: this.scriptInputText.value.substring(0, 150) + "...",
                status: 'finished',
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                subOptions: {
                    parallelLayer: "Layer 1 - الوجود المادي الفعلي",
                    framerate: "24fps",
                    styleName: "زيتي كلاسيكي مدمج مع خطوط حبر سوداء حادة",
                    styleDesc: "ضربات فرشاة سميكة وملمس زيتي بارز..."
                },
                createdAt: new Date().toISOString()
            };
            this.assets.push(scenario);
            this.saveAssets();
        }

        // Build Scene object structures
        selectedIndices.forEach(idx => {
            const parsed = this.parsedScenes[idx];
            const newScene = {
                id: 'scene-script-' + idx + '-' + Date.now(),
                title: parsed.title,
                scenarioId: scenario.id,
                characterIds: [],
                dialogue: parsed.narration,
                audioProfile: 'retro-tape',
                comicId: "",
                videoId: "",
                frames: [
                    {
                        desc: parsed.action,
                        dialogue: parsed.narration,
                        refAssetIds: []
                    }
                ]
            };
            this.scenes.push(newScene);
        });

        this.saveScenes();
        this.clearSceneForm();
        this.renderScenesList();
        
        alert(`📥 تم تصدير ${selectedIndices.length} مشهد بنجاح إلى باني المشاهد المتسقة! يمكنك تعديل تفاصيلها والتحقق من التناسق الآن.`);
        this.switchTab('scenes');
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
                frames: [
                    {
                        desc: "شخصيتان تقتربان من بعضهما عند شق بعدي غامض يظهر ملامح أساليبهما الفنية المختلفة بوضوح",
                        dialogue: "من أنت وكيف تملك هذه الحدود الحادة؟",
                        refAssetIds: [charIds[0], charIds[1]]
                    }
                ],
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
                frames: [
                    {
                        desc: "تداخل بصري مباشر عند الحواف، ضربات فرشاة زيتية تتنافر مع خطوط قلم جافة وحبر مانجا حاد",
                        dialogue: "الخطوط تتداخل والضوء ينقسم!",
                        refAssetIds: [charIds[0], charIds[1]]
                    }
                ],
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
                frames: [
                    {
                        desc: "استقرار المشهد على كادر يجمعهما جنباً إلى جنب دون دمج للنمطين، مما يخلق توازناً فنياً متناغماً ومتنافراً بالوقت ذاته",
                        dialogue: "لن نندمج، بل سنعيش معاً في هذا التناقض.",
                        refAssetIds: [charIds[0], charIds[1]]
                    }
                ],
                createdAt: new Date().toISOString()
            }
        ];

        this.scenes = [...this.scenes, ...generatedScenes];
        this.saveScenes();
        alert("تم توليد لوحة عمل كاملة مكونة من 3 مشاهد بنجاح! 🎉");
    }

    generateSourceWithAI() {
        const concepts = [
            {
                title: "بوابة الألوان المفقودة (The Gate of Lost Colors)",
                type: "رواية كوكبية طويلة (Novel)",
                author: "أرييل الحبر الأعظم",
                wordCount: "4200",
                theme: "صراع الوجود المطلق بين أسلوب المانجا الحركي سريع الإطارات (12fps) ذي الحدود الحبرية الخشنة، والرسم الزيتي الواقعي بطيء الحركة لعصر النهضة (60fps) ذي التظليل الناعم والعمق الملموس. يمثل التباين بين ضربات فرشاة شعر السنجاب المشبعة بالزيت وخطوط ريشة الـ G-Pen الحادة.",
                plot: "يكتشف رسام كوني كائناً هجيناً (المستيقظ الأول) مرسوماً بخطوط حبر سوداء سائلة يتسرب خفية لداخل لوحة زيتية مقدسة لعصر النهضة. هذا التماس الجمالي يهدد بتسييل معالم الشخصيات الزيتية وتحويل الأبعاد إلى بقايا حبرية مائعة. يتدخل حراس الأزمان مستخدمين أقلام القياس الكونية لإصلاح الحدود وإعادة عزل الأبعاد قبل حدوث الانهيار الكلي للجاذبية الجمالية للكون.",
                setting: "المكتبة العتيقة الواقعة عند الحد الفاصل لمرسم الأبعاد السبعة (نقطة التماس المادي والخطوط الحبرية ثنائية الأبعاد مع البيئة ثلاثية الأبعاد).",
                desc: "ملحمة فنية تعكس الصدام البصري المباشر وقوانين الفيزياء المتنافرة عند التقاط الحبر بالزيت، وتعتبر بمثابة وثيقة التخطيط الأساسية لبناء كافة الأصول اللاحقة.",
                extractedCreator: {
                    title: "الرسام الكوني أرييل",
                    desc: "الرسام المسؤول عن تجسيد الصدام البصري المباشر بين الحبر السائل والزيت الكلاسيكي.",
                    artStyle: "لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)",
                    tool: "فرشاة شعر السنجاب الغليظة المشبعة بالزيت"
                },
                extractedCharacters: [
                    {
                        title: "المستيقظ المائي (الرسم المائع)",
                        desc: "كائن هجين مرسوم بخطوط حبر سائلة سوداء يتسرب لداخل اللوحة الزيتية ويدرك أنه مرسوم داخل كون سكتشيك البصري.",
                        faction: "awakened",
                        class: "شخصية مستيقظة تدرك أنها مرسومة (Awakened)"
                    },
                    {
                        title: "الكاردينال الزيتي الحارس",
                        desc: "حارس فني كلاسيكي من عصر النهضة يحاول الحفاظ على ثبات الألوان واستقرار الأبعاد ومنع تدفق الحبر السائل.",
                        faction: "order",
                        class: "حامي التماثل والتقاليد الفنية الكلاسيكية (Classic)"
                    }
                ],
                extractedEnvironments: [
                    {
                        title: "برج القماش الزيتي المائع",
                        desc: "برج كوني شاهق تذوب جدرانه وتتداخل مع خطوط حبر خشنة سوداء بفعل التماس البصري بين أبعاد الرسم المتنافرة.",
                        envType: "داخل لوحة قماشية مائعة (Fluid Canvas Interior)",
                        clashDensity: "عالية جداً (ثقوب أبعاد مائعة)"
                    },
                    {
                        title: "مرسم الأبعاد السبعة",
                        desc: "المساحة اللانهائية التي تتصادم فيها أدوات الرسم الكونية وتنشأ منها بوابات الألوان البصرية المفقودة.",
                        envType: "فضاء البعد البصري السابع (Seven Dimension Atelier)",
                        clashDensity: "متوسطة (تداخل الضوء والجاذبية)"
                    }
                ],
                extractedMusic: [
                    {
                        title: "لحن كمان كلاسيكي حاد يتداخل مع تشويش رقمي",
                        desc: "أوتار كمان أوركسترالي كلاسيكي بطيء يعبر عن التقاليد، ثم يتداخل بشكل متنافر مع نبضات تشويش رقمي وصخب حاد ليعكس التنافر الصوتي والبصري للكون.",
                        genre: "Epic Classical / Noise Clash",
                        tempo: "Slow/Dramatic",
                        instruments: "Violin, Cello, Analog Distortion"
                    }
                ]
            },
            {
                title: "أصداء الغرافيت الكونية (Cosmic Graphite Echoes)",
                type: "قصة قصيرة (Short Story)",
                author: "سارة الفحمية",
                wordCount: "2500",
                theme: "مقاومة المحو والتلاشي الكوني للوجود البصري للأصول الفنية، وصراع الخطوط المتربة الخفيفة ضد ممحاة الفوضى الكونية التي تزيل حواف البنايات وتحيل الأشكال إلى فراغ أبيض مطبق.",
                plot: "يحاول حارس من حراس الأزمان (سيد الغرافيت) حماية ما تبقى من مدينة كارتونية كلاسيكية (Rubber Hose) من موجات ممحاة الفوضى المطلقة التي تمسح خطوط التظليل الخارجي للمدينة وتتسبب في سقوط الشخصيات في العدم. يبتكر الحارس أسلوب الرسم الذاتي (Self-Redrawing) لإعادة بناء حدود الأبعاد يدوياً قبل أن يختفي الأسلوب الفني للمدينة بالكامل.",
                setting: "شوارع مدينة الرصاص المتربة الواقعة في الطبقة الثالثة (Wireframe) من مخططات الهيكل الكوني العام.",
                desc: "دراسة قصصية مشوقة عن صراع البقاء ومحاولة إعادة الرسم الذاتي للأبعاد لإنقاذ خطوط الوجود الأولى من خطر الممحاة الكونية.",
                extractedCreator: {
                    title: "الرسامة الكونية سارة",
                    desc: "الرسامة المتخصصة بالغرافيت الكوني والمشرفة على خطوط الظلال المهددة بالمحو التام.",
                    artStyle: "رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)",
                    tool: "قلم رصاص غرافيت فحم ناعم وقابل للمحو"
                },
                extractedCharacters: [
                    {
                        title: "سيد الغرافيت الحامي",
                        desc: "حارس أزمان يحمي الخطوط الأولى المتبقية للمدينة ومخططات الهيكل الكوني العام من المحو.",
                        faction: "order",
                        class: "حامي التماثل والتقاليد الفنية الكلاسيكية (Classic)"
                    },
                    {
                        title: "كائن الممحاة الفوضوي",
                        desc: "وحش هلامي يلتهم الحدود البصرية ويزيل الحواف الخارجية للبنايات ويحيل الأشكال لفراغ أبيض مطبق.",
                        faction: "chaos",
                        class: "كيان هجين غير متناسق ومهدد للاستقرار (Clash)"
                    }
                ],
                extractedEnvironments: [
                    {
                        title: "شوارع مدينة الرصاص المتربة",
                        desc: "شوارع خالية مرسومة بالكامل بخطوط غرافيت رقيقة تتطاير ذراتها مع ممحاة الفوضى الكونية.",
                        envType: "مدينة كروية عائمة (Floating Spherical City)",
                        clashDensity: "منخفضة (حواف باهتة)"
                    },
                    {
                        title: "بوابة الفراغ الأبيض الممحو",
                        desc: "فجوة مكانية بيضاء مطلقة لا تحتوي على أي خطوط أو ظلال سقطت بفعل ممحاة الفوضى الكونية.",
                        envType: "فراغ البعد الممسوح (Null White Space)",
                        clashDensity: "عالية جداً (ثقوب أبعاد مائعة)"
                    }
                ],
                extractedMusic: [
                    {
                        title: "أصداء الغرافيت الورقية وإيقاع السيكوانسر الكوني",
                        desc: "إيقاع سينث-ويف غامض ومتكرر يتداخل مع مؤثرات صوتية ورقية لخطوط قلم رصاص تحتك بالورق بعنف.",
                        genre: "Lo-Fi Industrial / Synthwave",
                        tempo: "Medium/Dramatic",
                        instruments: "Paper Scratch FX, Analog Synth, Drum Machine"
                    }
                ]
            },
            {
                title: "عازفة الحبر المائي والأوتار (The Watercolor Violinist)",
                type: "مسودة فكرة أصلية (Concept Draft)",
                author: "بافلو السكتش البصري",
                wordCount: "1800",
                theme: "التنافر السمعي والبصري عند تصادم الأبعاد السمعية والموسيقى المولدة بالذكاء الاصطناعي مع الكيانات الورقية المرسومة يدوياً بالقلم الفحم.",
                plot: "عازفة كمان مرسومة بالرصاص الخفيف تجد نفسها محاصرة داخل لوحة زيتية كثيفة ولزجة. تكتشف أن نغمات كمانها الحادة والاهتزازات الصوتية تستطيع تمزيق كثافة الألوان الزيتية وفتح شقوق في اللوحة للعبور نحو عالمها الخفيف ثنائي الأبعاد، مما يؤدي لنشوء ظلال وانعكاسات متمردة في المشاهد.",
                setting: "المسرح المعلق للطبقة الثانية من الظلال والأصداء المتقطعة لكون سكتشيك البصري.",
                desc: "مسودة فكرة تأسيسية لاستكشاف التداخل البصري والسمعي العميق والتماس المباشر بين الموسيقى والرسامين الكونيين.",
                extractedCreator: {
                    title: "الرسام الكوني بافلو",
                    desc: "الرسام الكوني المتخصص في دمج الحبر المائي مع النوتات الموسيقية والأثير الصوتي.",
                    artStyle: "مانجا يابانية تقليدية بحبر أسود حاد",
                    tool: "ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)"
                },
                extractedCharacters: [
                    {
                        title: "عازفة الأوتار الرصاصية",
                        desc: "فتاة مرسومة بالفحم والغرافيت الخفيف تعزف نغمات كمان حادة لفتح بوابات الأبعاد والهرب من اللوحة اللزجة.",
                        faction: "awakened",
                        class: "شخصية مستيقظة تدرك أنها مرسومة (Awakened)"
                    },
                    {
                        title: "ظلال الألوان المتمردة",
                        desc: "كيانات مائية ملونة ولزجة تتشكل عشوائياً من ضربات الفرشاة وتتصادم مع عازفة الأوتار لعرقلتها.",
                        faction: "chaos",
                        class: "كيان هجين غير متناسق ومهدد للاستقرار (Clash)"
                    }
                ],
                extractedEnvironments: [
                    {
                        title: "مسرح الألوان السائل",
                        desc: "مسرح موسيقي تتغير أرضيته باستمرار كبقعة حبر مائي تسقط في ماء نقي بفعل الاهتزازات الصوتية.",
                        envType: "داخل لوحة قماشية مائعة (Fluid Canvas Interior)",
                        clashDensity: "متوسطة (تداخل الضوء والجاذبية)"
                    },
                    {
                        title: "بوابة الأثير الموسيقية المعلقة",
                        desc: "جسر من نغمات الضوء المعلقة بالأثير يربط بين اللوحة الزيتية والبعد الورقي ثنائي الأبعاد.",
                        envType: "مسرح معلق بالفضاء (Suspended Ether Stage)",
                        clashDensity: "منخفضة (حواف باهتة)"
                    }
                ],
                extractedMusic: [
                    {
                        title: "سيمفونية الأثير المائي المكسور",
                        desc: "عزف منفرد ملحمي بكمان آكوستيك ذو نغمات حادة وتأثيرات الصدى والتردد المتقطع لتمزيق الألوان.",
                        genre: "Epic Orchestral / Acoustic Solo",
                        tempo: "Fast/Intense",
                        instruments: "Solo Violin, Ambient Reverb, Sub-bass"
                    }
                ]
            }
        ];

        const random = concepts[Math.floor(Math.random() * concepts.length)];

        this.assetTitleInput.value = random.title;
        this.assetDescTextarea.value = random.desc;
        
        const typeSelect = document.getElementById('opt-sourceType');
        if (typeSelect) typeSelect.value = random.type;

        const authorInput = document.getElementById('opt-sourceAuthor');
        if (authorInput) authorInput.value = random.author;

        const wcInput = document.getElementById('opt-sourceWordCount');
        if (wcInput) wcInput.value = random.wordCount;

        const themeTA = document.getElementById('opt-sourceTheme');
        if (themeTA) themeTA.value = random.theme;

        const plotTA = document.getElementById('opt-sourcePlot');
        if (plotTA) plotTA.value = random.plot;

        const settingTA = document.getElementById('opt-sourceSetting');
        if (settingTA) settingTA.value = random.setting;

        this.generatedSourceExtractedData = {
            extractedCreator: random.extractedCreator,
            extractedCharacters: random.extractedCharacters,
            extractedEnvironments: random.extractedEnvironments,
            extractedMusic: random.extractedMusic
        };

        this.updateSuggestedPrompt();
        alert(`🤖 تم توليد المصدر السردي بالكامل بنجاح!\n\nالفكرة التأسيسية المقترحة: "${random.title}".\nتم صياغة حبكة وثيمة غنية تحتوي على خطط الأصول والشخصيات المستهدفة لتغذي كامل أقسام الكون. يمكنك حفظها مباشرة الآن!`);
    }

    saveAssetToDrive() {
        const title = this.assetTitleInput.value.trim();
        const type = this.assetTypeSelect.value;
        if (!title) {
            alert("يرجى إدخال عنوان للأصل أولاً لتتمكن من حفظه في Google Drive.");
            return;
        }

        const folderMapping = {
            'source': '00_Source_Materials',
            'scenario': '01_Scenarios',
            'creator': '02_Creators_Paintings',
            'character': '03_Characters_Assets',
            'environment': '04_Environments_Assets',
            'voice': '05_Voices_Audios',
            'music': '06_Cosmic_Soundtracks',
            'comic': '07_Comics_Storyboards',
            'video': '08_Videos_Cinematics',
            'game': '09_Downloadable_Games',
            'written': '10_Written_Texts',
            'project_summary': 'Sketchic_Projects'
        };

        const folderName = folderMapping[type] || 'General_Assets';
        const safeTitle = title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_');
        const simulatedUrl = `https://drive.google.com/drive/folders/Sketchic_Universe_Root/${folderName}/${safeTitle}`;

        let mdContent = `# ${title}\n\n`;
        mdContent += `* **نوع الأصل:** ${type}\n`;
        mdContent += `* **تاريخ الإنشاء:** ${new Date().toLocaleDateString('ar-EG')}\n\n`;
        mdContent += `## التفاصيل والوصف\n${this.assetDescTextarea.value.trim() || 'لا يوجد وصف.'}\n\n`;

        if (type === 'source') {
            const sourceType = document.getElementById('opt-sourceType').value;
            const sourceAuthor = document.getElementById('opt-sourceAuthor').value;
            const sourceWordCount = document.getElementById('opt-sourceWordCount').value;
            const sourceTheme = document.getElementById('opt-sourceTheme').value;
            const sourcePlot = document.getElementById('opt-sourcePlot').value;
            const sourceSetting = document.getElementById('opt-sourceSetting').value;

            mdContent += `* **نوع المصدر السردي:** ${sourceType}\n`;
            mdContent += `* **المؤلف السردي الأصلي:** ${sourceAuthor}\n`;
            mdContent += `* **عدد الكلمات التقريبي:** ${sourceWordCount}\n\n`;
            
            mdContent += `## الفكرة والمغزى\n${sourceTheme}\n\n`;
            mdContent += `## الحبكة الكونية\n${sourcePlot}\n\n`;
            mdContent += `## البيئة الزمنية\n${sourceSetting}\n\n`;

            const extData = this.generatedSourceExtractedData || (this.editingAssetId ? (this.assets.find(a => a.id === this.editingAssetId)?.subOptions) : null);
            if (extData) {
                const ec = extData.extractedCreator;
                const ech = extData.extractedCharacters;
                const eenv = extData.extractedEnvironments;
                const em = extData.extractedMusic;

                mdContent += `## خطة استخلاص الأصول\n\n`;
                if (ec) {
                    mdContent += `### الرسام الكوني\n`;
                    mdContent += `* **العنوان:** ${ec.title}\n`;
                    mdContent += `* **الأسلوب:** ${ec.artStyle}\n`;
                    mdContent += `* **الأداة الكونية:** ${ec.tool}\n`;
                    mdContent += `* **الوصف:** ${ec.desc}\n\n`;
                }
                if (ech && ech.length > 0) {
                    mdContent += `### الشخصيات المستهدفة\n`;
                    ech.forEach(c => {
                        mdContent += `* **شخصية**: ${c.title} - ${c.desc} (${c.faction}, ${c.class})\n`;
                    });
                    mdContent += `\n`;
                }
                if (eenv && eenv.length > 0) {
                    mdContent += `### البيئات المستهدفة\n`;
                    eenv.forEach(e => {
                        mdContent += `* **بيئة**: ${e.title} - ${e.desc} (${e.envType}, ${e.clashDensity})\n`;
                    });
                    mdContent += `\n`;
                }
                if (em && em.length > 0) {
                    mdContent += `### المؤثرات الصوتية والموسيقى\n`;
                    em.forEach(m => {
                        mdContent += `* **ساوندتراك**: ${m.title} - ${m.desc} (${m.genre}, ${m.tempo}, ${m.instruments})\n`;
                    });
                    mdContent += `\n`;
                }
            }
            
            const assetId = this.editingAssetId;
            if (assetId) {
                const linkedAssets = this.assets.filter(a => a.relatedSource === assetId && a.id !== assetId);
                if (linkedAssets.length > 0) {
                    mdContent += `## الأصول المنتجة والمنفذة فعلياً\n\n`;
                    const typesAr = {
                        'scenario': 'سيناريو',
                        'creator': 'رسام',
                        'character': 'شخصية',
                        'environment': 'بيئة',
                        'voice': 'صوت',
                        'music': 'موسيقى',
                        'comic': 'قصة مصورة',
                        'video': 'فيديو كوني',
                        'game': 'لعبة كوكبية'
                    };
                    linkedAssets.forEach(la => {
                        const typeStr = typesAr[la.type] || la.type;
                        mdContent += `* **[${typeStr}]** [${la.title}](${la.driveUrl || '#'}) - الحالة: *${la.status === 'finished' ? 'منتهي' : 'مسودة'}*\n`;
                    });
                    mdContent += `\n`;
                }
            }
        } else {
            const selects = this.dynamicOptionsContainer.querySelectorAll('select');
            selects.forEach(sel => {
                const label = sel.previousElementSibling ? sel.previousElementSibling.textContent : sel.id;
                mdContent += `* **${label}:** ${sel.value}\n`;
            });
            const inputs = this.dynamicOptionsContainer.querySelectorAll('input');
            inputs.forEach(inp => {
                const label = inp.previousElementSibling ? inp.previousElementSibling.textContent : inp.id;
                mdContent += `* **${label}:** ${inp.value}\n`;
            });
            const textareas = this.dynamicOptionsContainer.querySelectorAll('textarea');
            textareas.forEach(ta => {
                const label = ta.previousElementSibling ? ta.previousElementSibling.textContent : ta.id;
                mdContent += `\n### ${label}\n${ta.value}\n`;
            });
        }

        if (this.isGDriveConnected) {
            this.saveFileToGDrive(folderName, safeTitle, mdContent);
        } else {
            const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${folderName}_${safeTitle}.md`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.assetDriveUrlInput.value = simulatedUrl;

            alert(`🎉 تم محاكاة حفظ الملف بنجاح!\n\nتم تصدير ملف الوثيقة (${folderName}_${safeTitle}.md) وتحميله على جهازك.\nتم ربط المسار الافتراضي تلقائياً في خانة Google Drive:\n${simulatedUrl}`);
        }
    }

    generateAssetWithAI(type) {
        let scenarioTitle = "";
        let sourceTitle = "";
        let theme = "";
        let plot = "";
        let setting = "";

        const scenarioId = this.relatedScenarioSelect.value;
        const scenarioAsset = this.assets.find(a => a.id === scenarioId);
        if (scenarioAsset) {
            scenarioTitle = scenarioAsset.title;
            const sourceId = scenarioAsset.relatedSource;
            const sourceAsset = this.assets.find(a => a.id === sourceId);
            if (sourceAsset) {
                sourceTitle = sourceAsset.title;
                theme = (sourceAsset.subOptions && (sourceAsset.subOptions.theme || sourceAsset.subOptions.sourceTheme)) || "";
                plot = (sourceAsset.subOptions && (sourceAsset.subOptions.plot || sourceAsset.subOptions.sourcePlot)) || "";
                setting = (sourceAsset.subOptions && (sourceAsset.subOptions.setting || sourceAsset.subOptions.sourceSetting)) || "";
            }
        }

        const sourceIdDirect = this.relatedSourceSelect.value;
        const sourceAssetDirect = this.assets.find(a => a.id === sourceIdDirect);
        if (sourceAssetDirect) {
            sourceTitle = sourceAssetDirect.title;
            theme = (sourceAssetDirect.subOptions && (sourceAssetDirect.subOptions.theme || sourceAssetDirect.subOptions.sourceTheme)) || "";
            plot = (sourceAssetDirect.subOptions && (sourceAssetDirect.subOptions.plot || sourceAssetDirect.subOptions.sourcePlot)) || "";
            setting = (sourceAssetDirect.subOptions && (sourceAssetDirect.subOptions.setting || sourceAssetDirect.subOptions.sourceSetting)) || "";
        }

        if (type === 'creator') {
            const searchText = (theme + " " + plot + " " + setting + " " + scenarioTitle + " " + sourceTitle).toLowerCase();
            
            // Define categories, their options, and keywords
            const categories = [
                {
                    artStyle: "لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)",
                    tool: "فرشاة شعر السنجاب الغليظة المشبعة بالزيت",
                    keywords: ["زيت", "oil", "نهضة", "renaissance", "زيتية", "فرشاة", "سنجاب"]
                },
                {
                    artStyle: "مانجا يابانية تقليدية بحبر أسود حاد",
                    tool: "ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)",
                    keywords: ["مانجا", "manga", "حبر", "ink", "g-pen", "ريشة", "يابانية"]
                },
                {
                    artStyle: "رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)",
                    tool: "ممحاة مطاطية لمضاد المادة (Cosmic Eraser)",
                    keywords: ["كارتون كلاسيكي", "ثلاثينات", "rubber hose", "eraser", "ممحاة", "ممحاه", "مطاطية", "كارتون"]
                },
                {
                    artStyle: "رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)",
                    tool: "قلم رصاص غرافيت فحم ناعم وقابل للمحو",
                    keywords: ["رصاص", "graphite", "sketch", "تخطيطي", "فحم", "مخطط", "رسم تخطيطي"]
                },
                {
                    artStyle: "رسوم رقمية حديثة ذات متجهات هندسية (Vectors)",
                    tool: "قلم الألواح الرقمية اللاسلكي اللانهائي",
                    keywords: ["رقمية", "متجهات", "vectors", "digital", "ألواح", "لاسلكي", "هندسية"]
                }
            ];

            // Count keyword matches for each category
            let bestCategory = categories[1]; // Default to Manga
            let maxScore = 0;

            categories.forEach(cat => {
                let score = 0;
                cat.keywords.forEach(kw => {
                    if (searchText.includes(kw)) {
                        score += 1;
                    }
                });
                if (score > maxScore) {
                    maxScore = score;
                    bestCategory = cat;
                }
            });

            if (maxScore === 0) {
                const choice = prompt(
                    "لم يتم العثور على أسلوب فني محدد في المصدر السردي.\n" +
                    "يرجى اختيار أحد الأساليب والفرش الكونية التالية بكتابة رقمه (1-5):\n\n" +
                    "1. لوحة زيتية كلاسيكية من عصر النهضة (Renaissance) & فرشاة شعر السنجاب\n" +
                    "2. مانجا يابانية تقليدية بحبر أسود حاد & ريشة الرسم المعدنية (G-Pen)\n" +
                    "3. رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose) & ممحاة مضاد المادة\n" +
                    "4. رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch) & قلم رصاص غرافيت فحم\n" +
                    "5. رسوم رقمية حديثة ذات متجهات هندسية (Vectors) & قلم الألواح الرقمية اللاسلكي\n\n" +
                    "اكتب رقم الخيار:"
                );
                
                const selectedIdx = parseInt(choice) - 1;
                if (selectedIdx >= 0 && selectedIdx < categories.length) {
                    bestCategory = categories[selectedIdx];
                } else {
                    alert("اختيار غير صالح. تم تطبيق خيار المانجا كخيار افتراضي.");
                }
            }

            const artStyle = bestCategory.artStyle;
            const tool = bestCategory.tool;

            this.assetTitleInput.value = sourceTitle ? `الرسام الكوني لـ (${sourceTitle})` : "الرسام الكوني الحالم";
            this.assetDescTextarea.value = sourceTitle 
                ? `الرسام الكلاسيكي المسؤول عن تجسيد وتأطير فيزياء الأسلوب الفني لـ: ${sourceTitle}.` 
                : "رسام كوني غامض يقوم بتجسيد ضربات الفرشاة وتصادم أبعاد الرسم.";
            
            const styleSel = document.getElementById('opt-artStyle');
            if (styleSel) styleSel.value = artStyle;
            const toolSel = document.getElementById('opt-tool');
            if (toolSel) toolSel.value = tool;

        } else if (type === 'scenario') {
            const hasNovel = (sourceTitle).includes("رواية") || (sourceTitle).includes("Novel");
            const sourceType = hasNovel ? "رواية كوكبية طويلة (Cosmic Novel)" : "قصة قصيرة (Short Story)";
            const genre = (theme + plot).includes("خيال") ? "خيال علمي (Sci-Fi)" : "دراما الصدام المرئي (Visual Clash Drama)";
            const style = (plot).includes("حركة") ? "سرد حركي سريع ومليء بالإثارة" : "سرد فلسفي ميتافيزيقي";

            this.assetTitleInput.value = sourceTitle ? `سيناريو: صراع الأبعاد في (${sourceTitle})` : "سيناريو اللقاء الأول";
            this.assetDescTextarea.value = plot 
                ? `سيناريو تفصيلي يعكس العقدة الجوهرية للمصدر: ${plot.substring(0, 150)}...`
                : "سيناريو تجريبي يصف لحظة تصادم الأبعاد الفنية عند التماس المباشر.";

            const stSel = document.getElementById('opt-scenarioSourceType');
            if (stSel) stSel.value = sourceType;
            const linkIn = document.getElementById('opt-scenarioSourceLink');
            if (linkIn) linkIn.value = sourceAssetDirect ? sourceAssetDirect.driveUrl : "https://docs.google.com/document/d/source-story";
            const genSel = document.getElementById('opt-genre');
            if (genSel) genSel.value = genre;
            const stySel = document.getElementById('opt-style');
            if (stySel) stySel.value = style;
            const layerSel = document.getElementById('opt-parallelLayer');
            if (layerSel) layerSel.value = "Layer 1 - الوجود المادي الفعلي";
            const fpsSel = document.getElementById('opt-framerate');
            if (fpsSel) fpsSel.value = "24fps";

        } else if (type === 'character') {
            const charClass = (plot).includes("مستيقظ") || (plot).includes("وعي") 
                ? "شخصية مستيقظة تدرك أنها مرسومة (Awakened)" 
                : "بطل القصة الرئيسي (Protagonist)";
            const faction = charClass.includes("Awakened") ? "awakened" : "keepers";

            this.assetTitleInput.value = scenarioTitle ? `شخصية: بطل (${scenarioTitle})` : "الشخصية المستيقظة الأولى";
            this.assetDescTextarea.value = plot 
                ? `شخصية محورية تنحدر من الصراع السردي: ${plot.substring(0, 100)}...`
                : "شخصية قيادية تملك القدرة على عبور حواف التماس الفني بين الأبعاد.";

            const classSel = document.getElementById('opt-charClass');
            if (classSel) classSel.value = charClass;
            this.relatedFactionSelect.value = faction;

        } else if (type === 'environment') {
            const hasPaper = (setting + plot).includes("ورق") || (setting + plot).includes("جريد");
            const envType = hasPaper 
                ? "جزيرة عائمة مبنية من قصاصات الصحف والورق" 
                : "داخل لوحة قماشية مائعة (Fluid Canvas Interior)";

            this.assetTitleInput.value = scenarioTitle ? `بيئة: ${scenarioTitle}` : "موقع تماس الأبعاد الكونية";
            this.assetDescTextarea.value = setting 
                ? `بيئة درامية مخصصة للسيناريو مستوحاة من: ${setting.substring(0, 120)}`
                : "بيئة هجينة تتداخل فيها الخطوط والكتل والجاذبية بدون اندماج.";

            const envSel = document.getElementById('opt-envType');
            if (envSel) envSel.value = envType;
            const clashSel = document.getElementById('opt-clashDensity');
            if (clashSel) clashSel.value = "متوسطة (تداخل الضوء والجاذبية)";

        } else if (type === 'music') {
            const hasAction = (plot + scenarioTitle).includes("حركة") || (plot + scenarioTitle).includes("صراع");
            const genre = hasAction ? "Epic Cosmic Orchestral (أوركسترا كونية ملحمية)" : "Dark Ambient Synthwave (سينث-ويف غامض وبيئي)";
            const tempo = hasAction ? "Fast / Action-packed (سريع وحركي)" : "Medium / Dramatic (متوسط ودرامي)";
            const instruments = hasAction ? "Epic Timpani & Brass (نحاسيات وملحميات)" : "Cosmic Pad & Ethereal Keys (بيانو كوني وألحان سماوية)";

            this.assetTitleInput.value = scenarioTitle ? `ساوندتراك: ملحمة (${scenarioTitle})` : "اللحن الكوني المتنافر";
            this.assetDescTextarea.value = theme 
                ? `ساوندتراك وموسيقى تصويرية تعزز ثيمة: ${theme.substring(0, 100)}`
                : "موسيقى تصويرية تجمع بين آلات وترية دافئة وتأثيرات رقمية حادة لتمثيل تصادم الأبعاد.";

            const engineSel = document.getElementById('opt-musicEngine');
            if (engineSel) engineSel.value = "Suno AI (توليد كامل اللحن مع الكلمات)";
            const genreSel = document.getElementById('opt-musicGenre');
            if (genreSel) genreSel.value = genre;
            const tempoSel = document.getElementById('opt-musicTempo');
            if (tempoSel) tempoSel.value = tempo;
            const instSel = document.getElementById('opt-musicInstruments');
            if (instSel) instSel.value = instruments;
            const promptInput = document.getElementById('opt-musicPrompt');
            if (promptInput) promptInput.value = hasAction ? "Epic orchestral strings, aggressive timpani, synthetic glitch undertone" : "Atmospheric space ambient pads, slow dramatic violin chords";

        } else if (type === 'voice') {
            this.assetTitleInput.value = scenarioTitle ? `صوت: بطل المشاهد لـ (${scenarioTitle})` : "الملف الصوتي الافتراضي";
            this.assetDescTextarea.value = "بصمة صوتية مستخرجة بمحركات Google AI Studio للتعبير عن خطوط الحوار الكونية للشخصية.";
            
            const engSel = document.getElementById('opt-voiceEngine');
            if (engSel) engSel.value = "gemini-3.1-flash-tts-preview";
            const sceneInput = document.getElementById('opt-voiceScene');
            if (sceneInput) sceneInput.value = setting ? `In the location: ${setting.substring(0, 50)}` : "A quiet drawing studio";
            const contextInput = document.getElementById('opt-voiceContext');
            if (contextInput) contextInput.value = plot ? `Struggling in: ${plot.substring(0, 50)}` : "Speaking thoughtfully";
            const speakerSel = document.getElementById('opt-voiceSpeaker');
            if (speakerSel) speakerSel.value = "Charon (Calm, Deep voice)";
        } else if (type === 'written') {
            this.assetTitleInput.value = scenarioTitle ? `مخطوطة: حوار وأساطير لـ (${scenarioTitle})` : "مخطوطة الأبعاد الكونية الأولى";
            this.assetDescTextarea.value = `نصوص تفصيلية وحوارات كوكبية تعبر عن صراع الأبعاد الحاكم لسيناريو: "${scenarioTitle || 'الكون'}".`;

            const typeSel = document.getElementById('opt-writtenType');
            const langInput = document.getElementById('opt-writtenLanguage');
            const styleSel = document.getElementById('opt-writtenStyle');
            const textTA = document.getElementById('opt-writtenText');

            if (typeSel) typeSel.value = scenarioTitle ? "حوار تفصيلي سينمائي" : "تاريخ كوني وأساطير (Lore)";
            if (langInput) langInput.value = "العربية الفصحى";
            
            let chosenStyle = "ملحمي وجاد";
            let scriptText = "مخطوطة كوكبية عامة تسرد أساطير الطبقات السبع وعوالم الرسم المتنافرة لكون سكتشيك.";

            const lowerSearch = (theme + " " + plot + " " + setting + " " + sourceTitle).toLowerCase();
            if (lowerSearch.includes("زيت") || lowerSearch.includes("renaissance") || lowerSearch.includes("كمان") || lowerSearch.includes("violin")) {
                chosenStyle = "شاعري غامض وفلسفي";
                if (lowerSearch.includes("كمان") || lowerSearch.includes("violin") || lowerSearch.includes("مائي")) {
                    scriptText = `[عازفة الأوتار الرصاصية]: "نغمات كماني ليست صوتاً عابراً يا هذا، إنها ريشة حادة تمزق سماكة ألوانكم الزيتية وتفتح شقوقاً للعبور!"\n\n[كيان الألوان المتمردة]: "كلما عزفتِ نغمة أشد حدة، سالت أصباغنا وامتزجت ظلالنا... لا مفر لكِ من الغرق في بحر الأثير اللوني!"`;
                } else {
                    scriptText = `[الكاردينال الزيتي]: "حدودك الحبرية الخشنة يا مستيقظ تمزق نعومة تظليلي الكلاسيكي وتفسد طهارة عصر النهضة!"\n\n[المستيقظ المائي]: "بل أنا أحرركم من الجمود! خطوط حبري السائلة ستمنحكم الحياة والحركة حتى لو تسيّلت معالم قماشكم!"`;
                }
            } else if (lowerSearch.includes("رصاص") || lowerSearch.includes("غرافيت") || lowerSearch.includes("graphite") || lowerSearch.includes("ممحاة")) {
                chosenStyle = "سردي مباشر ووصفي";
                scriptText = `[سيد الغرافيت الحامي]: "ممحاة الفوضى تقترب، تمسح حواف البنايات وتسقط الأبعاد في الفراغ! يجب أن نعيد رسم أنفسنا فوراً!"\n\n[كائن الممحاة]: "الرسم مجرد وهم مؤقت يا سيد الغرافيت... المحو المطلق هو المصير الحتمي لكافة الأصول والوجود البصري!"`;
            }

            if (styleSel) styleSel.value = chosenStyle;
            if (textTA) textTA.value = scriptText;
        } else {
            this.assetTitleInput.value = `أصل ${type} التابع لـ ${scenarioTitle || 'الكون'}`;
            this.assetDescTextarea.value = `أصل إنتاج تم توليده تلقائياً لدعم تشكيل وتجسيد الكون السينمائي.`;
        }

        this.updateSuggestedPrompt();
        alert(`🤖 تم توليد وتعبئة تفاصيل الأصل (${type}) بنجاح! تم قراءة البيانات وتطويعها سياقياً ${scenarioTitle ? `بناءً على سيناريو: "${scenarioTitle}"` : 'تلقائياً كخيار بديل لعدم توفر مصدر سردي'}.`);
    }

    initGoogleDriveIntegration() {
        this.gdriveStatusBadge = document.getElementById('gdrive-status-badge');
        this.btnGDriveConnect = document.getElementById('btn-gdrive-connect');
        this.btnGDriveDisconnect = document.getElementById('btn-gdrive-disconnect');
        this.btnToggleGDriveSettings = document.getElementById('btn-toggle-gdrive-settings');
        this.gdriveConfigPanel = document.getElementById('gdrive-config-panel');
        this.gdriveClientId = document.getElementById('gdrive-client-id');
        this.gdriveApiKey = document.getElementById('gdrive-api-key');
        this.btnSaveGDriveConfig = document.getElementById('btn-save-gdrive-config');
        this.gdriveRootIndicator = document.getElementById('gdrive-root-indicator');

        // State variables
        this.gdriveClientIdVal = localStorage.getItem('sketchic_gdrive_client_id') || "";
        this.gdriveApiKeyVal = localStorage.getItem('sketchic_gdrive_api_key') || "";
        this.gdriveAccessToken = localStorage.getItem('sketchic_gdrive_access_token') || "";
        this.isGDriveConnected = false;
        this.gapiInited = false;
        this.gisInited = false;

        // Fill fields
        if (this.gdriveClientId) this.gdriveClientId.value = this.gdriveClientIdVal;
        if (this.gdriveApiKey) this.gdriveApiKey.value = this.gdriveApiKeyVal;

        // Bind events
        if (this.btnToggleGDriveSettings) {
            this.btnToggleGDriveSettings.addEventListener('click', () => {
                const isHidden = this.gdriveConfigPanel.style.display === 'none';
                this.gdriveConfigPanel.style.display = isHidden ? 'block' : 'none';
            });
        }

        if (this.btnSaveGDriveConfig) {
            this.btnSaveGDriveConfig.addEventListener('click', () => {
                const cid = this.gdriveClientId.value.trim();
                const key = this.gdriveApiKey.value.trim();
                if (!cid || !key) {
                    alert("يرجى إدخال Client ID و API Key معاً لحفظ الإعدادات.");
                    return;
                }
                localStorage.setItem('sketchic_gdrive_client_id', cid);
                localStorage.setItem('sketchic_gdrive_api_key', key);
                this.gdriveClientIdVal = cid;
                this.gdriveApiKeyVal = key;
                alert("تم حفظ إعدادات جوجل درايف بنجاح في جهازك. يرجى تجربة الاتصال الآن!");
                this.gdriveConfigPanel.style.display = 'none';
                this.loadGoogleAPILibraries();
            });
        }

        if (this.btnGDriveConnect) {
            this.btnGDriveConnect.addEventListener('click', () => this.connectGoogleDrive());
        }

        if (this.btnGDriveDisconnect) {
            this.btnGDriveDisconnect.addEventListener('click', () => this.disconnectGoogleDrive());
        }

        // Try load libraries on start if config exists
        if (this.gdriveClientIdVal && this.gdriveApiKeyVal) {
            setTimeout(() => this.loadGoogleAPILibraries(), 1000);
        }
    }

    loadGoogleAPILibraries() {
        if (typeof gapi === 'undefined' || typeof google === 'undefined') {
            console.log("Waiting for Google API scripts to load...");
            setTimeout(() => this.loadGoogleAPILibraries(), 1000);
            return;
        }

        gapi.load('client', () => {
            gapi.client.init({
                apiKey: this.gdriveApiKeyVal,
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
            }).then(() => {
                console.log("GAPI client initialized.");
                this.gapiInited = true;
                
                // If we have a stored token, load it
                if (this.gdriveAccessToken) {
                    gapi.client.setToken({ access_token: this.gdriveAccessToken });
                    this.isGDriveConnected = true;
                    this.updateGDriveStatusUI();
                }
            }).catch(err => {
                console.error("Error initializing GAPI client", err);
            });
        });

        // Initialize GIS Client
        try {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: this.gdriveClientIdVal,
                scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly',
                callback: (resp) => {
                    if (resp.error !== undefined) {
                        throw (resp);
                    }
                    this.gdriveAccessToken = resp.access_token;
                    localStorage.setItem('sketchic_gdrive_access_token', resp.access_token);
                    this.isGDriveConnected = true;
                    this.updateGDriveStatusUI();
                },
            });
            this.gisInited = true;
        } catch (e) {
            console.error("Error initializing Google Identity Services Token client", e);
        }
    }

    connectGoogleDrive() {
        if (!this.gdriveClientIdVal || !this.gdriveApiKeyVal) {
            alert("⚠️ يرجى النقر على زر 'الإعدادات' وإدخال الـ Client ID والـ API Key أولاً!");
            this.gdriveConfigPanel.style.display = 'block';
            return;
        }

        if (this.tokenClient) {
            this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            this.loadGoogleAPILibraries();
            setTimeout(() => {
                if (this.tokenClient) {
                    this.tokenClient.requestAccessToken({ prompt: 'consent' });
                } else {
                    alert("تعذر تهيئة مكتبة Google Auth. يرجى التحقق من اتصال الإنترنت ومن إعدادات المفاتيح.");
                }
            }, 1500);
        }
    }

    disconnectGoogleDrive() {
        if (this.isGDriveConnected) {
            try {
                google.accounts.oauth2.revokeToken(this.gdriveAccessToken, () => {
                    console.log("Token revoked.");
                });
            } catch (e) {}
            this.gdriveAccessToken = "";
            localStorage.removeItem('sketchic_gdrive_access_token');
            this.isGDriveConnected = false;
            this.updateGDriveStatusUI();
            alert("تم قطع الاتصال بحساب Google Drive بنجاح.");
        }
    }

    updateGDriveStatusUI() {
        if (this.isGDriveConnected) {
            if (this.gdriveStatusBadge) {
                this.gdriveStatusBadge.textContent = "متصل";
                this.gdriveStatusBadge.style.backgroundColor = "var(--color-success)";
            }
            if (this.btnGDriveConnect) this.btnGDriveConnect.style.display = "none";
            if (this.btnGDriveDisconnect) this.btnGDriveDisconnect.style.display = "block";
            if (this.gdriveRootIndicator) {
                this.gdriveRootIndicator.textContent = "متصل بالدرايف الفعلي 🟢";
                this.gdriveRootIndicator.style.color = "var(--color-success)";
            }
        } else {
            if (this.gdriveStatusBadge) {
                this.gdriveStatusBadge.textContent = "غير متصل";
                this.gdriveStatusBadge.style.backgroundColor = "var(--color-danger)";
            }
            if (this.btnGDriveConnect) {
                this.btnGDriveConnect.style.display = "block";
                this.btnGDriveConnect.innerHTML = `<span>🔗</span> <span>تسجيل الدخول والربط</span>`;
            }
            if (this.btnGDriveDisconnect) this.btnGDriveDisconnect.style.display = "none";
            if (this.gdriveRootIndicator) {
                this.gdriveRootIndicator.textContent = "مجلد افتراضي (Offline)";
                this.gdriveRootIndicator.style.color = "var(--text-tertiary)";
            }
        }
    }

    async getOrCreateFolder(folderName, parentId = null) {
        let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
        if (parentId) {
            query += ` and '${parentId}' in parents`;
        }
        
        try {
            const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&spaces=drive`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.gdriveAccessToken}`
                }
            });
            
            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`Google API list folders error: ${response.status} - ${errBody}`);
            }
            
            const data = await response.json();
            const files = data.files;
            
            if (files && files.length > 0) {
                return files[0].id;
            } else {
                const folderMetadata = {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder'
                };
                if (parentId) {
                    folderMetadata.parents = [parentId];
                }
                
                const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.gdriveAccessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(folderMetadata)
                });
                
                if (!createResponse.ok) {
                    const errBody = await createResponse.text();
                    throw new Error(`Google API create folder error: ${createResponse.status} - ${errBody}`);
                }
                
                const folder = await createResponse.json();
                return folder.id;
            }
        } catch (err) {
            console.error("Error in getOrCreateFolder for: " + folderName, err);
            throw err;
        }
    }

    async uploadFileToGDrive(folderName, safeTitle, mdContent) {
        try {
            const rootId = await this.getOrCreateFolder("Sketchic_Universe_Root");
            const subFolderId = await this.getOrCreateFolder(folderName, rootId);
            
            const fileName = `${safeTitle}.md`;
            const fileQuery = `name = '${fileName}' and '${subFolderId}' in parents and trashed = false`;
            
            const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fileQuery)}&fields=files(id)&spaces=drive`;
            const searchResponse = await fetch(listUrl, {
                headers: {
                    'Authorization': `Bearer ${this.gdriveAccessToken}`
                }
            });
            
            if (!searchResponse.ok) throw new Error("Search file failed");
            const searchData = await searchResponse.json();
            const existingFiles = searchData.files;
            
            const boundary = '314159265358979323846';
            const delimiter = "\r\n--" + boundary + "\r\n";
            const close_delim = "\r\n--" + boundary + "--";
            
            const contentType = 'text/markdown';
            const metadata = {
                'name': fileName,
                'mimeType': contentType
            };
            
            if (!existingFiles || existingFiles.length === 0) {
                metadata.parents = [subFolderId];
            }
            
            const multipartRequestBody =
                delimiter +
                'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n\r\n' +
                mdContent +
                close_delim;

            let uploadUrl;
            let method;
            if (existingFiles && existingFiles.length > 0) {
                const fileId = existingFiles[0].id;
                uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
                method = 'PATCH';
            } else {
                uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
                method = 'POST';
            }

            const uploadResponse = await fetch(uploadUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.gdriveAccessToken}`,
                    'Content-Type': `multipart/related; boundary=${boundary}`
                },
                body: multipartRequestBody
            });

            if (!uploadResponse.ok) {
                const errBody = await uploadResponse.text();
                throw new Error(`Upload file failed: ${uploadResponse.status} - ${errBody}`);
            }

            const uploadedFile = await uploadResponse.json();
            const fileId = uploadedFile.id;
            
            const detailsResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`, {
                headers: {
                    'Authorization': `Bearer ${this.gdriveAccessToken}`
                }
            });
            
            if (!detailsResponse.ok) throw new Error("Fetch webViewLink failed");
            const detailsData = await detailsResponse.json();
            return detailsData.webViewLink;
        } catch (err) {
            console.error("Failed to upload to Google Drive", err);
            return null;
        }
    }

    async saveFileToGDrive(folderName, safeTitle, mdContent) {
        if (!this.btnSaveToDrive) return;
        const originalText = this.btnSaveToDrive.innerHTML;
        this.btnSaveToDrive.disabled = true;
        this.btnSaveToDrive.innerHTML = `<span>⏳</span> <span>جاري الحفظ في Drive...</span>`;

        try {
            const webViewLink = await this.uploadFileToGDrive(folderName, safeTitle, mdContent);
            if (!webViewLink) {
                throw new Error("Upload failed");
            }
            this.assetDriveUrlInput.value = webViewLink;
            alert(`🎉 تم حفظ الملف بنجاح وتحديثه مباشرة على Google Drive! \n\nالرابط الفعلي للملف:\n${webViewLink}`);
        } catch (err) {
            console.error("Failed to save to Google Drive", err);
            alert("⚠️ فشل الاتصال/الحفظ الفعلي في Google Drive. يرجى مراجعة صلاحيات الحساب أو الـ API Key الخاص بك. سنقوم بتحميل الملف محلياً كحل بديل.");
            
            const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${folderName}_${safeTitle}.md`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            this.btnSaveToDrive.disabled = false;
            this.btnSaveToDrive.innerHTML = originalText;
        }
    }

    async fetchGoogleFileContent(fileId) {
        try {
            const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.gdriveAccessToken}`
                }
            });
            if (!response.ok) throw new Error(`Status ${response.status}`);
            return await response.text();
        } catch (err) {
            console.error("Error fetching file content from Google Drive: " + fileId, err);
            return null;
        }
    }

    parseGDriveFileId(url) {
        if (!url) return null;
        const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (matches && matches[1]) {
            return matches[1];
        }
        const parts = url.split('/');
        for (let part of parts) {
            if (part.length >= 25 && /^[a-zA-Z0-9-_]+$/.test(part)) {
                return part;
            }
        }
        return null;
    }

    parseMarkdownSource(mdText) {
        const result = {
            theme: "",
            plot: "",
            setting: "",
            desc: "",
            extractedCreator: null,
            extractedCharacters: [],
            extractedEnvironments: [],
            extractedMusic: []
        };

        const lines = mdText.split('\n');
        let inDesc = false;
        let descLines = [];
        
        let currentSection = ""; // "creator", "characters", "environments", "music"

        lines.forEach(line => {
            const cleanLine = line.trim();
            if (cleanLine.startsWith('## التفاصيل والوصف')) {
                inDesc = true;
                return;
            }
            if (inDesc && (cleanLine.startsWith('*') || cleanLine.startsWith('#'))) {
                inDesc = false;
            }
            if (inDesc) {
                descLines.push(cleanLine);
                return;
            }

            if (cleanLine.includes('الفكرة والمغزى') || cleanLine.includes('theme') || cleanLine.includes('المغزى المحوري')) {
                const parts = cleanLine.split('**');
                result.theme = parts[parts.length - 1]?.replace(/^[:\s*\-]+/, '') || "";
            } else if (cleanLine.includes('الحبكة الكونية') || cleanLine.includes('plot') || cleanLine.includes('الصراع الرئيسي')) {
                const parts = cleanLine.split('**');
                result.plot = parts[parts.length - 1]?.replace(/^[:\s*\-]+/, '') || "";
            } else if (cleanLine.includes('البيئة الزمنية') || cleanLine.includes('setting') || cleanLine.includes('البيئة')) {
                const parts = cleanLine.split('**');
                result.setting = parts[parts.length - 1]?.replace(/^[:\s*\-]+/, '') || "";
            }

            // Section tracking
            if (cleanLine.startsWith('### الرسام الكوني') || cleanLine.includes('Creator')) {
                currentSection = "creator";
                result.extractedCreator = { title: "", desc: "", artStyle: "", tool: "" };
            } else if (cleanLine.startsWith('### الشخصيات المستهدفة') || cleanLine.includes('Characters')) {
                currentSection = "characters";
            } else if (cleanLine.startsWith('### البيئات المستهدفة') || cleanLine.includes('Environments')) {
                currentSection = "environments";
            } else if (cleanLine.startsWith('### المؤثرات الصوتية والموسيقى') || cleanLine.includes('Soundscape') || cleanLine.includes('Music')) {
                currentSection = "music";
            } else if (cleanLine.startsWith('## ') || cleanLine.startsWith('# ')) {
                currentSection = "";
            }

            // Parsing sections
            if (currentSection === "creator" && (cleanLine.startsWith('*') || cleanLine.startsWith('-'))) {
                if (cleanLine.includes('العنوان:')) {
                    result.extractedCreator.title = cleanLine.replace(/.*?العنوان:\s*\*\*/, '').replace(/\*\*/, '').trim();
                } else if (cleanLine.includes('الأسلوب:')) {
                    result.extractedCreator.artStyle = cleanLine.replace(/.*?الأسلوب:\s*\*\*/, '').replace(/\*\*/, '').trim();
                } else if (cleanLine.includes('الأداة الكونية:')) {
                    result.extractedCreator.tool = cleanLine.replace(/.*?الأداة الكونية:\s*\*\*/, '').replace(/\*\*/, '').trim();
                } else if (cleanLine.includes('الوصف:')) {
                    result.extractedCreator.desc = cleanLine.replace(/.*?الوصف:\s*\*\*/, '').replace(/\*\*/, '').trim();
                }
            } else if (currentSection === "characters" && (cleanLine.startsWith('*') || cleanLine.startsWith('-'))) {
                const text = cleanLine.replace(/^[\*\-\s]+/, '');
                const match = text.match(/\*\*(.*?)\*\*:\s*(.*?)\s*-\s*(.*?)\s*\((.*?),\s*(.*?)\)/) || text.match(/\*\*(.*?)\*\*:\s*(.*?)\s*-\s*(.*)/);
                if (match) {
                    result.extractedCharacters.push({
                        title: match[2]?.trim() || "شخصية مستهدفة",
                        desc: match[3]?.trim() || "شخصية مستخلصة من المصدر",
                        faction: match[4]?.trim() || "awakened",
                        class: match[5]?.trim() || "شخصية مستيقظة تدرك أنها مرسومة (Awakened)"
                    });
                }
            } else if (currentSection === "environments" && (cleanLine.startsWith('*') || cleanLine.startsWith('-'))) {
                const text = cleanLine.replace(/^[\*\-\s]+/, '');
                const match = text.match(/\*\*(.*?)\*\*:\s*(.*?)\s*-\s*(.*?)\s*\((.*?),\s*(.*?)\)/) || text.match(/\*\*(.*?)\*\*:\s*(.*?)\s*-\s*(.*)/);
                if (match) {
                    result.extractedEnvironments.push({
                        title: match[2]?.trim() || "بيئة مستهدفة",
                        desc: match[3]?.trim() || "بيئة مستخلصة من المصدر",
                        envType: match[4]?.trim() || "داخل لوحة قماشية مائعة (Fluid Canvas Interior)",
                        clashDensity: match[5]?.trim() || "متوسطة (تداخل الضوء والجاذبية)"
                    });
                }
            } else if (currentSection === "music" && (cleanLine.startsWith('*') || cleanLine.startsWith('-'))) {
                const text = cleanLine.replace(/^[\*\-\s]+/, '');
                const match = text.match(/\*\*(.*?)\*\*:\s*(.*?)\s*-\s*(.*?)\s*\((.*?),\s*(.*?),\s*(.*?)\)/) || text.match(/\*\*(.*?)\*\*:\s*(.*?)\s*-\s*(.*)/);
                if (match) {
                    result.extractedMusic.push({
                        title: match[2]?.trim() || "ساوندتراك مستهدف",
                        desc: match[3]?.trim() || "موسيقى مستخلصة من المصدر",
                        genre: match[4]?.trim() || "Epic Orchestral",
                        tempo: match[5]?.trim() || "Medium/Dramatic",
                        instruments: match[6]?.trim() || "Acoustic Strings"
                    });
                }
            }
        });

        result.desc = descLines.join('\n').trim();
        return result;
    }

    // ==========================================
    // Production Wizard System (نظام المعالج الإنتاجي)
    // ==========================================

    initWizardTab() {
        this.currentWizardStep = this.currentWizardStep || 1;
        if (!this.wizardSessionData || typeof this.wizardSessionData.source === 'string') {
            this.resetWizardSession();
        }
        const steps = this.getTemplateSteps();
        if (!steps.includes(this.currentWizardStep)) {
            this.currentWizardStep = steps[0];
        }
        this.populateParentProjectsSelect();
        this.renderWizardStep();
        this.updateWizardStepperUI();
    }

    populateParentProjectsSelect() {
        if (!this.wizardParentProject) return;
        this.wizardParentProject.innerHTML = '<option value="">-- مشروع مستقل جديد --</option>';
        const projects = this.assets.filter(a => a.type === 'project_summary' && a.projectStatus === 'ended');
        projects.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = `🪐 ${p.title} (منتهي)`;
            this.wizardParentProject.appendChild(opt);
        });
    }

    getTemplateSteps() {
        const template = document.getElementById('wizard-project-template')?.value || 'full';
        const stepsMap = {
            full: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            film: [1, 2, 5, 6, 10],
            music: [1, 3, 7, 8, 10],
            comic: [1, 2, 4, 6, 9]
        };
        return stepsMap[template] || stepsMap.full;
    }

    updateWizardStepperUI() {
        if (!this.wizardStepper) return;
        
        const activeSteps = this.getTemplateSteps();
        const children = Array.from(this.wizardStepper.children);
        children.forEach(c => c.style.display = 'none');

        activeSteps.forEach((step, idx) => {
            const node = this.wizardStepper.querySelector(`.step-node[data-step="${step}"]`);
            if (node) {
                node.style.display = 'flex';
                node.classList.remove('active', 'completed');
                if (step === this.currentWizardStep) {
                    node.classList.add('active');
                } else if (activeSteps.indexOf(step) < activeSteps.indexOf(this.currentWizardStep)) {
                    node.classList.add('completed');
                }
                node.onclick = () => {
                    if (step <= this.currentWizardStep || this.isStepCompleted(step)) {
                        this.navigateWizardDirect(step);
                    } else {
                        alert("⚠️ يجب إكمال الخطوات السابقة بالترتيب أولاً!");
                    }
                };

                // Show step-line after this node if not the last step
                if (idx < activeSteps.length - 1) {
                    const nextEl = node.nextElementSibling;
                    if (nextEl && nextEl.classList.contains('step-line')) {
                        nextEl.style.display = 'block';
                    }
                }
            }
        });
    }

    isStepCompleted(step) {
        const type = this.getWizardStepType(step);
        return Array.isArray(this.wizardSessionData[type]) && this.wizardSessionData[type].length > 0;
    }

    getWizardStepType(step) {
        const types = {
            1: 'source',
            2: 'scenario',
            3: 'written',
            4: 'creator',
            5: 'character',
            6: 'environment',
            7: 'voice',
            8: 'music',
            9: 'comic',
            10: 'video',
            11: 'game'
        };
        return types[step] || 'source';
    }

    getWizardStepMeta(step) {
        const metas = {
            1: {
                title: "الخطوة 1: المصدر السردي الأصلي (Narrative Source)",
                guidance: "قم بصياغة الفكرة وحبكة القصة الكونية لكون سكتشيك كقاعدة انطلاق لبقية الأصول."
            },
            2: {
                title: "الخطوة 2: السيناريو السينمائي (Scenario)",
                guidance: "حدد الخط الدرامي وتقسيم الفصول بناءً على المصدر السردي المعتمد."
            },
            3: {
                title: "الخطوة 3: المخطوطة والنصوص (Written Texts)",
                guidance: "اكتب نصوص الحوار التفصيلية أو Lore الكوني المعتمد للمشاهد."
            },
            4: {
                title: "الخطوة 4: الرسام الكوني والأداة (Creator)",
                guidance: "حدد الهوية البصرية، الأداة الكونية، والأسلوب الفني الحاكم للأصول المرئية."
            },
            5: {
                title: "الخطوة 5: تصميم الشخصيات (Character)",
                guidance: "حدد فصيلة الشخصية وتصنيفها الفيزيائي والدرامي لتعزيز الصدام البصري."
            },
            6: {
                title: "الخطوة 6: العوالم والبيئات الكونية (Environment)",
                guidance: "قم بتهيئة مسرح المشهد، كثافة التصادم، وفيزياء تداخل الجاذبية والضوء."
            },
            7: {
                title: "الخطوة 7: البصمة الصوتية (Voice)",
                guidance: "حدد الصوت المقترح ومحرك TTS المستخدم لنطق خطوط الحوار للشخصية."
            },
            8: {
                title: "الخطوة 8: الموسيقى والساوندتراك (Music)",
                guidance: "اختر الثيمة اللحنية، الآلات الكونية، ومحرك التوليد الصوتي المناسب للعمل."
            },
            9: {
                title: "الخطوة 9: القصة المصورة ولوحة السيناريو (Comic)",
                guidance: "قم بتنسيق الكوادر ورسم التناقض البصري بين أساليب الرسم المتنافرة."
            },
            10: {
                title: "الخطوة 10: مقاطع الفيديو والتحريك (Video)",
                guidance: "اصنع لقطة سينمائية متحركة تجسد الحركة المتنافرة وتمنع تمازج الخطوط والظلال."
            },
            11: {
                title: "الخطوة 11: الألعاب التفاعلية (Game)",
                guidance: "صمم بيئة تفاعلية مصغرة تجعل المشاهد قابلة للعب والتجربة الفعلية."
            }
        };
        return metas[step] || metas[1];
    }

    renderWizardStep() {
        const step = this.currentWizardStep;
        const type = this.getWizardStepType(step);
        const meta = this.getWizardStepMeta(step);

        if (this.wizardSummaryView) this.wizardSummaryView.style.display = 'none';
        const grid = document.querySelector('.wizard-container-grid');
        if (grid) grid.style.display = 'grid';

        if (this.wizardStepTitle) this.wizardStepTitle.textContent = meta.title;
        if (this.wizardStepGuidance) this.wizardStepGuidance.textContent = meta.guidance;

        const steps = this.getTemplateSteps();
        if (this.btnWizardPrev) {
            this.btnWizardPrev.style.display = steps.indexOf(step) > 0 ? 'block' : 'none';
        }

        if (this.btnWizardNext) {
            const isLast = steps.indexOf(step) === steps.length - 1;
            this.btnWizardNext.textContent = isLast ? "تجميع المشروع وعرض النتائج 📊" : "حفظ والانتقال للخطوة التالية ➡️";
        }

        const assetIds = this.wizardSessionData[type] || [];
        let listHtml = "";
        if (assetIds.length > 0) {
            listHtml += `
                <div style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    <label style="font-weight: bold; font-size: 0.8rem; color: var(--color-cyan);">الأصول المنشأة في هذه الخطوة للمشروع الحالي (${assetIds.length}):</label>
                    <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 5px;">
            `;
            assetIds.forEach(id => {
                const asset = this.assets.find(a => a.id === id);
                if (asset) {
                    const isActive = this.currentWizardAssetId === id;
                    listHtml += `
                        <div style="display: flex; align-items: center; gap: 4px; background: rgba(99, 102, 241, 0.15); border: 1px solid ${isActive ? 'var(--color-accent)' : 'var(--border-color)'}; padding: 3px 6px; border-radius: 4px; font-size: 0.72rem;">
                            <span style="cursor: pointer; font-weight: bold; color: var(--text-primary);" onclick="window.app.editSessionAsset('${id}')">🔹 ${asset.title}</span>
                            <span style="color: var(--color-danger); cursor: pointer; font-weight: bold; margin-left: 2px;" onclick="window.app.deleteSessionAsset('${id}', '${type}')">×</span>
                        </div>
                    `;
                }
            });
            listHtml += `
                        <button type="button" class="btn" onclick="window.app.startNewSessionAsset()" style="background: var(--bg-tertiary); font-size: 0.7rem; padding: 2px 6px; border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">➕ إضافة أصل آخر</button>
                    </div>
                </div>
            `;
        }

        let assetData = null;
        if (this.currentWizardAssetId) {
            assetData = this.assets.find(a => a.id === this.currentWizardAssetId);
        } else if (assetIds.length > 0) {
            this.currentWizardAssetId = assetIds[0];
            assetData = this.assets.find(a => a.id === this.currentWizardAssetId);
        }

        const globalDriveUrl = document.getElementById('wizard-global-drive-url')?.value || 'https://drive.google.com/drive/folders/wizard-session';

        let fieldsHtml = `
            ${listHtml}
            <div class="form-group">
                <label>عنوان الأصل *</label>
                <input type="text" id="wiz-title" placeholder="أدخل اسم الأصل..." value="${assetData ? assetData.title : ''}" required style="width: 100%; box-sizing: border-box; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);">
            </div>
            <div class="form-group">
                <label>الوصف والتفاصيل *</label>
                <textarea id="wiz-desc" rows="3" placeholder="أدخل الوصف التفصيلي هنا..." required style="width: 100%; box-sizing: border-box; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);">${assetData ? assetData.desc : ''}</textarea>
            </div>
            <div class="form-group">
                <label>رابط Google Drive للملف *</label>
                <input type="text" id="wiz-drive-url" placeholder="رابط الملف..." value="${assetData ? assetData.driveUrl : globalDriveUrl}" required style="width: 100%; box-sizing: border-box; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary);">
            </div>
        `;

        let subOptionsHtml = "";
        const subOptions = assetData ? (assetData.subOptions || {}) : {};
        subOptionsHtml = this.getWizardSubOptionsHtml(type, subOptions);

        if (this.wizardFormFields) {
            this.wizardFormFields.innerHTML = fieldsHtml + subOptionsHtml;
        }

        const inputs = this.wizardFormFields.querySelectorAll('input, select, textarea');
        inputs.forEach(inp => {
            inp.addEventListener('input', () => this.generateWizardPrompt());
            inp.addEventListener('change', () => this.generateWizardPrompt());
        });

        this.generateWizardPrompt();
    }

    getWizardSubOptionsHtml(type, subOptions) {
        if (type === 'source') {
            return `
                <div class="form-group">
                    <label>نوع المصدر السردي *</label>
                    <select id="wiz-opt-sourceType" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="رواية كوكبية طويلة (Novel)" ${subOptions.sourceType === 'رواية كوكبية طويلة (Novel)' ? 'selected' : ''}>رواية كوكبية طويلة (Novel)</option>
                        <option value="قصة قصيرة (Short Story)" ${subOptions.sourceType === 'قصة قصيرة (Short Story)' ? 'selected' : ''}>قصة قصيرة (Short Story)</option>
                        <option value="أسطورة شعبية أو فلكلور أبعاد (Folklore)" ${subOptions.sourceType === 'أسطورة شعبية أو فلكلور أبعاد (Folklore)' ? 'selected' : ''}>أسطورة شعبية أو فلكلور أبعاد (Folklore)</option>
                        <option value="مسودة فكرة أصلية (Concept Draft)" ${subOptions.sourceType === 'مسودة فكرة أصلية (Concept Draft)' ? 'selected' : ''}>مسودة فكرة أصلية (Concept Draft)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>المؤلف السردي الأصلي *</label>
                    <input type="text" id="wiz-opt-sourceAuthor" value="	ext${subOptions.sourceAuthor || 'الكاتب الكوني الأول'}" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                </div>
                <div class="form-group">
                    <label>عدد الكلمات التقريبي *</label>
                    <input type="number" id="wiz-opt-sourceWordCount" value="	ext${subOptions.sourceWordCount || '1500'}" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                </div>
            `;
        }
        if (type === 'scenario') {
            return `
                <div class="form-group">
                    <label>نوع المصدر السردي الأصلي *</label>
                    <select id="wiz-opt-scenarioSourceType" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="رواية كوكبية طويلة (Cosmic Novel)" ${subOptions.scenarioSourceType === 'رواية كوكبية طويلة (Cosmic Novel)' ? 'selected' : ''}>رواية كوكبية طويلة (Cosmic Novel)</option>
                        <option value="قصة قصيرة (Short Story)" ${subOptions.scenarioSourceType === 'قصة قصيرة (Short Story)' ? 'selected' : ''}>قصة قصيرة (Short Story)</option>
                        <option value="أسطورة شعبية أو فلكلور أبعادي (Folklore)" ${subOptions.scenarioSourceType === 'أسطورة شعبية أو فلكلور أبعادي (Folklore)' ? 'selected' : ''}>أسطورة شعبية أو فلكلور أبعادي (Folklore)</option>
                        <option value="مسودة فكرة أو فكرة أصلية (Concept Draft)" ${subOptions.scenarioSourceType === 'مسودة فكرة أو فكرة أصلية (Concept Draft)' ? 'selected' : ''}>مسودة فكرة أو فكرة أصلية (Concept Draft)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>تصنيف قصة السيناريو *</label>
                    <select id="wiz-opt-genre" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="خيال علمي (Sci-Fi)" ${subOptions.genre === 'خيال علمي (Sci-Fi)' ? 'selected' : ''}>خيال علمي (Sci-Fi)</option>
                        <option value="سايبربانك (Cyberpunk)" ${subOptions.genre === 'سايبربانك (Cyberpunk)' ? 'selected' : ''}>سايبربانك (Cyberpunk)</option>
                        <option value="فانتازيا سحرية (Fantasy)" ${subOptions.genre === 'فانتازيا سحرية (Fantasy)' ? 'selected' : ''}>فانتازيا سحرية (Fantasy)</option>
                        <option value="دراما الصدام المرئي (Visual Clash Drama)" ${subOptions.genre === 'دراما الصدام المرئي (Visual Clash Drama)' ? 'selected' : ''}>دراما الصدام المرئي (Visual Clash Drama)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>أسلوب السرد *</label>
                    <select id="wiz-opt-style" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="سرد تفصيلي بطيء ومكثف" ${subOptions.style === 'سرد تفصيلي بطيء ومكثف' ? 'selected' : ''}>سرد تفصيلي بطيء ومكثف</option>
                        <option value="سرد حركي سريع ومليء بالإثارة" ${subOptions.style === 'سرد حركي سريع ومليء بالإثارة' ? 'selected' : ''}>سرد حركي سريع ومليء بالإثارة</option>
                        <option value="سرد فلسفي ميتافيزيقي" ${subOptions.style === 'سرد فلسفي ميتافيزيقي' ? 'selected' : ''}>سرد فلسفي ميتافيزيقي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الطبقة الزمنية المتوازية (Parallel Layer) *</label>
                    <select id="wiz-opt-parallelLayer" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="Layer 1 - الوجود المادي الفعلي" ${subOptions.parallelLayer === 'Layer 1 - الوجود المادي الفعلي' ? 'selected' : ''}>الطبقة الأولى - الوجود المادي الفعلي</option>
                        <option value="Layer 2 - الانعكاس والظلال" ${subOptions.parallelLayer === 'Layer 2 - الانعكاس والظلال' ? 'selected' : ''}>الطبقة الثانية - الانعكاس والظلال</option>
                        <option value="Layer 3 - المخطط الهيكلي الهندسي" ${subOptions.parallelLayer === 'Layer 3 - المخطط الهيكلي الهندسي' ? 'selected' : ''}>الطبقة الثالثة - المخطط الهيكلي الهندسي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>معدل الإطارات الكوني (Framerate) *</label>
                    <select id="wiz-opt-framerate" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="12fps" ${subOptions.framerate === '12fps' ? 'selected' : ''}>12 إطاراً في الثانية - حركة مانجا وكارتون خشنة</option>
                        <option value="24fps" ${subOptions.framerate === '24fps' ? 'selected' : ''}>24 إطاراً في الثانية - حركة سينمائية كلاسيكية</option>
                        <option value="60fps" ${subOptions.framerate === '60fps' ? 'selected' : ''}>60 إطاراً في الثانية - حركة ناعمة فائقة الواقعية (زيتي)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'written') {
            return `
                <div class="form-group">
                    <label>نوع المخطوط المكتوب *</label>
                    <select id="wiz-opt-writtenType" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="حوار تفصيلي سينمائي" ${subOptions.writtenType === 'حوار تفصيلي سينمائي' ? 'selected' : ''}>حوار تفصيلي سينمائي</option>
                        <option value="تاريخ كوني وأساطير (Lore)" ${subOptions.writtenType === 'تاريخ كوني وأساطير (Lore)' ? 'selected' : ''}>تاريخ كوني وأساطير (Lore)</option>
                        <option value="وثيقة تصميم وتوصيف للعالم" ${subOptions.writtenType === 'وثيقة تصميم وتوصيف للعالم' ? 'selected' : ''}>وثيقة تصميم وتوصيف للعالم</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>اللغة المستهدفة *</label>
                    <input type="text" id="wiz-opt-writtenLanguage" value="	ext${subOptions.writtenLanguage || 'العربية الفصحى'}" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                </div>
                <div class="form-group">
                    <label>الأسلوب التعبيري البلاغي *</label>
                    <select id="wiz-opt-writtenStyle" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="ملحمي وجاد" ${subOptions.writtenStyle === 'ملحمي وجاد' ? 'selected' : ''}>ملحمي وجاد</option>
                        <option value="شاعري غامض وفلسفي" ${subOptions.writtenStyle === 'شاعري غامض وفلسفي' ? 'selected' : ''}>شاعري غامض وفلسفي</option>
                        <option value="سردي مباشر ووصفي" ${subOptions.writtenStyle === 'سردي مباشر ووصفي' ? 'selected' : ''}>سردي مباشر ووصفي</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>المخطوطة / النص المكتوب التفصيلي *</label>
                    <textarea id="wiz-opt-writtenText" rows="4" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">${subOptions.writtenText || ''}</textarea>
                </div>
            `;
        }
        if (type === 'creator') {
            return `
                <div class="form-group">
                    <label>الأسلوب الفني الحاكم للرسام *</label>
                    <select id="wiz-opt-artStyle" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)" ${subOptions.artStyle === 'لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)' ? 'selected' : ''}>لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)</option>
                        <option value="مانجا يابانية تقليدية بحبر أسود حاد" ${subOptions.artStyle === 'مانجا يابانية تقليدية بحبر أسود حاد' ? 'selected' : ''}>مانجا يابانية تقليدية بحبر أسود حاد</option>
                        <option value="رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)" ${subOptions.artStyle === 'رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)' ? 'selected' : ''}>رسوم كارتون كلاسيكية من الثلاثينات (Rubber Hose)</option>
                        <option value="رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)" ${subOptions.artStyle === 'رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)' ? 'selected' : ''}>رسم تخطيطي خفيف بقلم الرصاص (Graphite Sketch)</option>
                        <option value="رسوم رقمية حديثة ذات متجهات هندسية (Vectors)" ${subOptions.artStyle === 'رسوم رقمية حديثة ذات متجهات هندسية (Vectors)' ? 'selected' : ''}>رسوم رقمية حديثة ذات متجهات هندسية (Vectors)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الأداة الكونية المميزة الخاصة به *</label>
                    <select id="wiz-opt-tool" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="فرشاة شعر السنجاب الغليظة المشبعة بالزيت" ${subOptions.tool === 'فرشاة شعر السنجاب الغليظة المشبعة بالزيت' ? 'selected' : ''}>فرشاة شعر السنجاب الغليظة المشبعة بالزيت</option>
                        <option value="ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)" ${subOptions.tool === 'ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)' ? 'selected' : ''}>ريشة الرسم الكرتونية المعدنية الحادة (G-Pen)</option>
                        <option value="قلم رصاص غرافيت فحم ناعم وقابل للمحو" ${subOptions.tool === 'قلم رصاص غرافيت فحم ناعم وقابل للمحو' ? 'selected' : ''}>قلم رصاص غرافيت فحم ناعم وقابل للمحو</option>
                        <option value="قلم الألواح الرقمية اللاسلكي اللانهائي" ${subOptions.tool === 'قلم الألواح الرقمية اللاسلكي اللانهائي' ? 'selected' : ''}>قلم الألواح الرقمية اللاسلكي اللانهائي</option>
                        <option value="ممحاة مطاطية لمضاد المادة (Cosmic Eraser)" ${subOptions.tool === 'ممحاة مطاطية لمضاد المادة (Cosmic Eraser)' ? 'selected' : ''}>ممحاة مطاطية لمضاد المادة (Cosmic Eraser)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'character') {
            return `
                <div class="form-group">
                    <label>الدور السردي للشخصية *</label>
                    <select id="wiz-opt-charClass" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="بطل القصة الرئيسي (Protagonist)" ${subOptions.charClass === 'بطل القصة الرئيسي (Protagonist)' ? 'selected' : ''}>بطل القصة الرئيسي (Protagonist)</option>
                        <option value="الخصم أو الشرير الرئيسي (Antagonist)" ${subOptions.charClass === 'الخصم أو الشرير الرئيسي (Antagonist)' ? 'selected' : ''}>الخصم أو الشرير الرئيسي (Antagonist)</option>
                        <option value="شخصية مستيقظة تدرك أنها مرسومة (Awakened)" ${subOptions.charClass === 'شخصية مستيقظة تدرك أنها مرسومة (Awakened)' ? 'selected' : ''}>شخصية مستيقظة تدرك أنها مرسومة (Awakened)</option>
                        <option value="حارس زمن يحمي طبقات اللوحة (Time Keeper)" ${subOptions.charClass === 'حارس زمن يحمي طبقات اللوحة (Time Keeper)' ? 'selected' : ''}>حارس زمن يحمي طبقات اللوحة (Time Keeper)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>الفصيل الكوني الحاكم *</label>
                    <select id="wiz-relatedFaction" style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="awakened" ${subOptions.relatedFaction === 'awakened' ? 'selected' : ''}>فصيل المستيقظين (The Awakened)</option>
                        <option value="keepers" ${subOptions.relatedFaction === 'keepers' ? 'selected' : ''}>فصيل الحراس (The Keepers)</option>
                        <option value="erasers" ${subOptions.relatedFaction === 'erasers' ? 'selected' : ''}>فصيل الممحاة والعدم (The Erasers)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'environment') {
            return `
                <div class="form-group">
                     <label>طبيعة البيئة الكونية *</label>
                     <select id="wiz-opt-envType" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                          <option value="داخل لوحة قماشية مائعة (Fluid Canvas Interior)" ${subOptions.envType === 'داخل لوحة قماشية مائعة (Fluid Canvas Interior)' ? 'selected' : ''}>داخل لوحة قماشية مائعة (Fluid Canvas Interior)</option>
                          <option value="جزيرة عائمة مبنية من قصاصات الصحف والورق" ${subOptions.envType === 'جزيرة عائمة مبنية من قصاصات الصحف والورق' ? 'selected' : ''}>جزيرة عائمة مبنية من قصاصات الصحف والورق</option>
                          <option value="غرفة ذات بعدين محاطة بجدران خشبية كلاسيكية 3D" ${subOptions.envType === 'غرفة ذات بعدين محاطة بجدران خشبية كلاسيكية 3D' ? 'selected' : ''}>غرفة ذات بعدين محاطة بجدران خشبية كلاسيكية 3D</option>
                          <option value="مدينة سايبربانك مبنية بمتجهات هندسية حادة (Vector City)" ${subOptions.envType === 'مدينة سايبربانك مبنية بمتجهات هندسية حادة (Vector City)' ? 'selected' : ''}>مدينة سايبربانك مبنية بمتجهات هندسية حادة (Vector City)</option>
                     </select>
                </div>
                <div class="form-group">
                     <label>كثافة تداخل الأنماط في الموقع *</label>
                     <select id="wiz-opt-clashDensity" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                          <option value="منخفضة (حافة تماس رفيعة جداً)" ${subOptions.clashDensity === 'منخفضة (حافة تماس رفيعة جداً)' ? 'selected' : ''}>منخفضة (حافة تماس رفيعة جداً)</option>
                          <option value="متوسطة (تداخل الضوء والجاذبية)" ${subOptions.clashDensity === 'متوسطة (تداخل الضوء والجاذبية)' ? 'selected' : ''}>متوسطة (تداخل الضوء والجاذبية)</option>
                          <option value="عالية (تداخل الأبنية والأرضيات دون اندماج)" ${subOptions.clashDensity === 'عالية (تداخل الأبنية والأرضيات دون اندماج)' ? 'selected' : ''}>عالية (تداخل الأبنية والأرضيات دون اندماج)</option>
                     </select>
                </div>
            `;
        }
        if (type === 'voice') {
            return `
                <div class="form-group">
                    <label>محرك الصوت بالذكاء الاصطناعي (Voice Engine) *</label>
                    <select id="wiz-opt-voiceEngine" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="gemini-3.1-flash-tts-preview" ${subOptions.voiceEngine === 'gemini-3.1-flash-tts-preview' ? 'selected' : ''}>gemini-3.1-flash-tts-preview (توليد تعبيري مباشر في Google AI Studio)</option>
                        <option value="Gemini Live (صوت تفاعلي عاطفي فوري)" ${subOptions.voiceEngine === 'Gemini Live (صوت تفاعلي عاطفي فوري)' ? 'selected' : ''}>Gemini Live (صوت تفاعلي عاطفي فوري)</option>
                        <option value="NotebookLM Audio Overview (حوار ثنائي تفاعلي)" ${subOptions.voiceEngine === 'NotebookLM Audio Overview (حوار ثنائي تفاعلي)' ? 'selected' : ''}>NotebookLM Audio Overview (حوار ثنائي تفاعلي)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>صوت المتحدث المختار (Speaker Settings) *</label>
                    <select id="wiz-opt-voiceSpeaker" style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="Algenib (Gravely, Lower pitch)" ${subOptions.voiceSpeaker === 'Algenib (Gravely, Lower pitch)' ? 'selected' : ''}>Algenib (Gravely, Lower pitch)</option>
                        <option value="Puck (Energetic, Mid pitch)" ${subOptions.voiceSpeaker === 'Puck (Energetic, Mid pitch)' ? 'selected' : ''}>Puck (Energetic, Mid pitch)</option>
                        <option value="Charon (Calm, Deep voice)" ${subOptions.voiceSpeaker === 'Charon (Calm, Deep voice)' ? 'selected' : ''}>Charon (Calm, Deep voice)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'music') {
            return `
                <div class="form-group">
                    <label>محرك الموسيقى بالذكاء الاصطناعي *</label>
                    <select id="wiz-opt-musicEngine" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="Suno AI (توليد كامل اللحن مع الكلمات)" ${subOptions.musicEngine === 'Suno AI (توليد كامل اللحن مع الكلمات)' ? 'selected' : ''}>Suno AI (توليد كامل اللحن مع الكلمات)</option>
                        <option value="Udio AI (توليد أصوات خلفية كلاسيكية متميزة)" ${subOptions.musicEngine === 'Udio AI (توليد أصوات خلفية كلاسيكية متميزة)' ? 'selected' : ''}>Udio AI (توليد أصوات خلفية كلاسيكية متميزة)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>النمط والمزاج الموسيقي *</label>
                    <select id="wiz-opt-musicGenre" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="Epic Cosmic Orchestral (أوركسترا كونية ملحمية)" ${subOptions.musicGenre === 'Epic Cosmic Orchestral (أوركسترا كونية ملحمية)' ? 'selected' : ''}>Epic Cosmic Orchestral (أوركسترا كونية ملحمية)</option>
                        <option value="Dark Ambient Synthwave (سينث-ويف غامض وبيئي)" ${subOptions.musicGenre === 'Dark Ambient Synthwave (سينث-ويف غامض وبيئي)' ? 'selected' : ''}>Dark Ambient Synthwave (سينث-ويف غامض وبيئي)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'comic') {
            return `
                <div class="form-group">
                    <label>صيغة وعرض القصة المصورة *</label>
                    <select id="wiz-opt-format" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="ويب تون طولي للموبايل (Vertical Webtoon)" ${subOptions.format === 'ويب تون طولي للموبايل (Vertical Webtoon)' ? 'selected' : ''}>ويب تون طولي للموبايل (Vertical Webtoon)</option>
                        <option value="صفحات مانجا تقليدية بالأبيض والأسود" ${subOptions.format === 'صفحات مانجا تقليدية بالأبيض والأسود' ? 'selected' : ''}>صفحات مانجا تقليدية بالأبيض والأسود</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>نمط الألوان والصدام *</label>
                    <select id="wiz-opt-color" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="أحادية اللون بالكامل (أبيض وأسود)" ${subOptions.color === 'أحادية اللون بالكامل (أبيض وأسود)' ? 'selected' : ''}>أحادية اللون بالكامل (أبيض وأسود)</option>
                        <option value="قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)" ${subOptions.color === 'قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)' ? 'selected' : ''}>قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'video') {
            return `
                <div class="form-group">
                    <label>محرك التوليد والتحريك بالذكاء الاصطناعي *</label>
                    <select id="wiz-opt-tool" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="Runway Gen-3 Alpha" ${subOptions.tool === 'Runway Gen-3 Alpha' ? 'selected' : ''}>Runway Gen-3 Alpha</option>
                        <option value="OpenAI Sora" ${subOptions.tool === 'OpenAI Sora' ? 'selected' : ''}>OpenAI Sora</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>انطباع حركة الإطارات الكونية *</label>
                    <select id="wiz-opt-fps" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)" ${subOptions.fps === 'مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)' ? 'selected' : ''}>مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)</option>
                        <option value="حركة سينمائية كلاسيكية (24 إطاراً في الثانية)" ${subOptions.fps === 'حركة سينمائية كلاسيكية (24 إطاراً في الثانية)' ? 'selected' : ''}>حركة سينمائية كلاسيكية (24 إطاراً في الثانية)</option>
                    </select>
                </div>
            `;
        }
        if (type === 'game') {
            return `
                <div class="form-group">
                    <label>تصنيف اللعبة للتحميل *</label>
                    <select id="wiz-opt-gameGenre" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)" ${subOptions.gameGenre === 'لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)' ? 'selected' : ''}>لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)</option>
                        <option value="مغامرة آر بي جي ثلاثية أبعاد (3D RPG Adventure)" ${subOptions.gameGenre === 'مغامرة آر بي جي ثلاثية أبعاد (3D RPG Adventure)' ? 'selected' : ''}>مغامرة آر بي جي ثلاثية أبعاد (3D RPG Adventure)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>ميكانيكية التحكم بالأسلوب الفني *</label>
                    <select id="wiz-opt-mechanic" required style="width:100%; padding:0.5rem; background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">
                        <option value="تبديل شيدر اللاعب (من حبر مانجا خفيف إلى درع زيتي ثقيل)" ${subOptions.mechanic === 'تبديل شيدر اللاعب (من حبر مانجا خفيف إلى درع زيتي ثقيل)' ? 'selected' : ''}>تبديل شيدر اللاعب (من حبر مانجا خفيف إلى درع زيتي ثقيل)</option>
                        <option value="بوابات تغيير أبعاد الرسم لحل الألغاز الكونية" ${subOptions.mechanic === 'بوابات تغيير أبعاد الرسم لحل الألغاز الكونية' ? 'selected' : ''}>بوابات تغيير أبعاد الرسم لحل الألغاز الكونية</option>
                    </select>
                </div>
            `;
        }
        return "";
    }

    editSessionAsset(id) {
        this.currentWizardAssetId = id;
        this.renderWizardStep();
    }

    startNewSessionAsset() {
        this.currentWizardAssetId = null;
        this.renderWizardStep();
    }

    deleteSessionAsset(id, type) {
        if (confirm("هل أنت متأكد من رغبتك في حذف هذا الأصل من الجلسة؟")) {
            this.assets = this.assets.filter(a => a.id !== id);
            this.wizardSessionData[type] = this.wizardSessionData[type].filter(x => x !== id);
            if (this.currentWizardAssetId === id) {
                this.currentWizardAssetId = null;
            }
            this.saveAssets();
            this.renderWizardStep();
            this.updateWizardStepperUI();
        }
    }

    navigateWizard(offset) {
        const steps = this.getTemplateSteps();
        const currentIndex = steps.indexOf(this.currentWizardStep);
        const targetIndex = currentIndex + offset;
        if (targetIndex >= 0 && targetIndex < steps.length) {
            this.navigateWizardDirect(steps[targetIndex]);
        }
    }

    navigateWizardDirect(step) {
        this.currentWizardStep = step;
        this.currentWizardAssetId = null;
        this.renderWizardStep();
        this.updateWizardStepperUI();
    }

    generateWizardPrompt() {
        const step = this.currentWizardStep;
        const type = this.getWizardStepType(step);

        const valOf = (id, fallback = "") => {
            const el = document.getElementById(`wiz-opt-${id}`) || document.getElementById(`wiz-${id}`) || document.getElementById(id);
            return el ? el.value : fallback;
        };

        const wizTitle = valOf('title', 'أصل غير محدد');
        const wizDesc = valOf('desc', '');

        let prompt = "";

        if (type === 'source') {
            const sourceType = valOf('sourceType', 'رواية كوكبية طويلة (Novel)');
            const sourceAuthor = valOf('sourceAuthor', 'الكاتب الكوني الأول');
            const sourceWordCount = valOf('sourceWordCount', '1500');
            prompt = `اكتب فكرة عامة وحبكة وسينوبسيس مفصل لمصدر سردي في كون سكتشيك السينمائي.\nعنوان المصدر المقترح: [${wizTitle}].\nنوع المصدر: [${sourceType}].\nالمؤلف الكوني: [${sourceAuthor}].\nالحجم المستهدف: [حدود ${sourceWordCount} كلمة].\nالوصف: ${wizDesc}\nيجب أن تركز القصة على الأبعاد المتوازية والصدام الفني البصري بين أبعاد الرسم المختلفة (الزيتي، الكارتون، الحبر، الغرافيت) وصراعات الفصائل الكونية في هذا الكون.`;
        } else if (type === 'creator') {
            const artStyle = valOf('artStyle', 'لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)');
            const tool = valOf('tool', 'فرشاة شعر السنجاب الغليظة المشبعة بالزيت');
            prompt = `اكتب ملفاً تعريفياً سردياً وأدبياً لرسام كوني في كون سكتشيك السينمائي يسمى [${wizTitle}].\nالأسلوب الفني الحاكم لرسوماته وعالمه: [${artStyle}].\nالأداة الكونية الخاصة التي يرسم بها: [${tool}].\nالوصف: ${wizDesc}\nاشرح صراعه الفلسفي وكيف تنعكس ضربات أداته وقوانينها الفيزيائية على رسوماته وعوالمه التي يرسمها.`;
        } else if (type === 'scenario') {
            const genre = valOf('genre', 'خيال علمي (Sci-Fi)');
            const style = valOf('style', 'سرد تفصيلي بطيء ومكثف');
            const layer = valOf('parallelLayer', 'Layer 1 - الوجود المادي الفعلي');
            const fps = valOf('framerate', '24fps');
            prompt = `بصفتك خبيراً سردياً لكون سكتشيك (Sketchic World)، قم بكتابة سيناريو سينمائي تفصيلي لسيناريو [${wizTitle}].\nالوصف: ${wizDesc}\nالتصنيف: [${genre}] وبأسلوب [${style}]. \nيخضع لمعدل إطارات كوني قدره [${fps}] ويتمركز في الطبقة: [${layer}].\nيجب أن تركز القصة على صدام الأسلوب الفني في الكادر ووجود أبعاد مرسومة متداخلة دون اندماج، مع كتابة السيناريو بهيكل مشاهد سينمائية تفصيلية.`;
        } else if (type === 'written') {
            const writtenType = valOf('writtenType', 'حوار تفصيلي سينمائي');
            const writtenLanguage = valOf('writtenLanguage', 'العربية الفصحى');
            const writtenStyle = valOf('writtenStyle', 'ملحمي وجاد');
            const writtenText = valOf('writtenText', '');
            prompt = `بصفتك كاتباً كوكيباً، قم بتحسين وصياغة النص التالي لكون سكتشيك:\nنوع المخطوط: [${writtenType}].\nاللغة المستهدفة: [${writtenLanguage}].\nالأسلوب البلاغي: [${writtenStyle}].\nالنص الأصلي:\n"${writtenText || wizDesc}"`;
        } else if (type === 'character') {
            const charClass = valOf('charClass', 'شخصية مستيقظة تدرك أنها مرسومة (Awakened)');
            const faction = valOf('relatedFaction', 'awakened');
            prompt = `توليد تصميم شخصية بصرية لكون سكتشيك السينمائي.\nاسم الشخصية: [${wizTitle}].\nالدور السردي: [${charClass}].\nالفصيل: [${faction}].\nالوصف والمظهر: 	ext${wizDesc}`;
        } else if (type === 'environment') {
            const envType = valOf('envType', 'داخل لوحة قماشية مائعة (Fluid Canvas Interior)');
            const clashDensity = valOf('clashDensity', 'متوسطة (تداخل الضوء والجاذبية)');
            prompt = `لوحة تصميم بيئة سينمائية لموقع في عالم سكتشيك (Sketchic World).\nاسم الموقع: [${wizTitle}].\nطبيعة البيئة: [${envType}].\nكثافة التداخل الفني: [${clashDensity}].\nالتفاصيل والمظهر: 	ext${wizDesc}`;
        } else if (type === 'voice') {
            const voiceEngine = valOf('voiceEngine', 'gemini-3.1-flash-tts-preview');
            const voiceSpeaker = valOf('voiceSpeaker', 'Charon (Calm, Deep voice)');
            prompt = `توليد بصمة صوتية للشخصية [${wizTitle}] باستخدام محرك [${voiceEngine}].\nالمتحدث: [${voiceSpeaker}].\nالتعليمات الصوتية والوصف: 	ext${wizDesc}`;
        } else if (type === 'music') {
            const musicEngine = valOf('musicEngine', 'Suno AI (توليد كامل اللحن مع الكلمات)');
            const musicGenre = valOf('musicGenre', 'Epic Cosmic Orchestral (أوركسترا كونية ملحمية)');
            prompt = `توليد موسيقى كوكبية تصويرية لكون سكتشيك.\nعنوان اللحن: [${wizTitle}].\nالمحرك: [${musicEngine}].\nالنمط: [${musicGenre}].\nالوصف والمزاج: 	ext${wizDesc}`;
        } else if (type === 'comic') {
            const format = valOf('format', 'ويب تون طولي للموبايل (Vertical Webtoon)');
            const color = valOf('color', 'قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)');
            prompt = `توليد لوحة قصة مصورة (Comic/Storyboard) لكون سكتشيك.\nالعنوان: [${wizTitle}].\nالصيغة: [${format}].\nالألوان والصدام البصري: [${color}].\nالوصف والمشهد: 	ext${wizDesc}`;
        } else if (type === 'video') {
            const tool = valOf('tool', 'Runway Gen-3 Alpha');
            const fps = valOf('fps', 'حركة سينمائية كلاسيكية (24 إطاراً في الثانية)');
            prompt = `توليد لقطة سينمائية متحركة لكون سكتشيك.\nالعنوان: [${wizTitle}].\nالمحرك: [${tool}].\nالحركة والإطارات: [${fps}].\nالوصف والمؤثرات البصرية: 	ext${wizDesc}`;
        } else if (type === 'game') {
            const gameGenre = valOf('gameGenre', 'لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)');
            const mechanic = valOf('mechanic', 'بوابات تغيير أبعاد الرسم لحل الألغاز الكونية');
            prompt = `تصميم لعبة تفاعلية مصغرة لكون سكتشيك.\nاسم اللعبة: [${wizTitle}].\nالتصنيف: [${gameGenre}].\nالميكانيكية الرئيسية: [${mechanic}].\nالوصف العام: 	ext${wizDesc}`;
        }

        if (this.wizardPromptText) {
            this.wizardPromptText.textContent = prompt;
        }
    }

    validateAndNextWizardStep() {
        const step = this.currentWizardStep;
        const type = this.getWizardStepType(step);

        const titleEl = document.getElementById('wiz-title');
        const descEl = document.getElementById('wiz-desc');
        const driveUrlEl = document.getElementById('wiz-drive-url');

        if (titleEl && titleEl.value.trim().length > 0) {
            if (!descEl || !descEl.value.trim()) {
                alert("⚠️ يرجى إدخال وصف للأصل.");
                if (descEl) descEl.focus();
                return;
            }
            if (!driveUrlEl || !driveUrlEl.value.trim()) {
                alert("⚠️ يرجى إدخال رابط Google Drive.");
                if (driveUrlEl) driveUrlEl.focus();
                return;
            }

            // Extract subOptions
            const subOptions = {};
            const selects = this.wizardFormFields.querySelectorAll('select');
            selects.forEach(sel => {
                const key = sel.id.replace('wiz-opt-', '').replace('wiz-', '');
                if (key !== 'relatedFaction') {
                    subOptions[key] = sel.value;
                }
            });
            const inputsText = this.wizardFormFields.querySelectorAll('input, textarea');
            inputsText.forEach(inp => {
                if (inp.id !== 'wiz-title' && inp.id !== 'wiz-desc' && inp.id !== 'wiz-drive-url') {
                    const key = inp.id.replace('wiz-opt-', '').replace('wiz-', '');
                    subOptions[key] = inp.value;
                }
            });

            let assetId = this.currentWizardAssetId;
            if (!assetId) {
                assetId = 'wiz-' + type + '-' + Date.now();
                this.wizardSessionData[type].push(assetId);
            }

            let relatedSourceId = (this.wizardSessionData['source'] && this.wizardSessionData['source'][0]) || "";
            let relatedScenarioId = (this.wizardSessionData['scenario'] && this.wizardSessionData['scenario'][0]) || "";
            let relatedCreatorId = (this.wizardSessionData['creator'] && this.wizardSessionData['creator'][0]) || "";
            let relatedChars = this.wizardSessionData['character'] || [];

            const factionEl = document.getElementById('wiz-relatedFaction');
            const relatedFactionVal = factionEl ? factionEl.value : "";

            const assetObject = {
                id: assetId,
                type: type,
                title: titleEl.value.trim(),
                desc: descEl.value.trim(),
                driveUrl: driveUrlEl.value.trim(),
                status: 'finished',
                relatedSource: relatedSourceId,
                relatedScenario: relatedScenarioId,
                relatedCreator: relatedCreatorId,
                relatedFaction: relatedFactionVal,
                relatedCharacters: relatedChars,
                interfacePhysics: "",
                directorChecklist: {
                    noBlending: true,
                    depthContrast: true,
                    sonicDissonance: true
                },
                usedPrompt: this.wizardPromptText ? this.wizardPromptText.textContent : "",
                subOptions: subOptions,
                createdAt: new Date().toISOString()
            };

            const existingIndex = this.assets.findIndex(a => a.id === assetId);
            if (existingIndex > -1) {
                this.assets[existingIndex] = assetObject;
            } else {
                this.assets.push(assetObject);
            }

            this.saveAssets();
            this.currentWizardAssetId = assetId;
        }

        if ((this.wizardSessionData[type] || []).length === 0) {
            alert("⚠️ يرجى حفظ وتعبئة أصل واحد على الأقل للمتابعة.");
            return;
        }

        const steps = this.getTemplateSteps();
        const currentIndex = steps.indexOf(step);
        if (currentIndex === steps.length - 1) {
            this.showProjectSummary();
        } else {
            this.navigateWizard(1);
        }
    }

    showProjectSummary() {
        const grid = document.querySelector('.wizard-container-grid');
        if (grid) grid.style.display = 'none';
        if (this.wizardSummaryView) this.wizardSummaryView.style.display = 'block';

        if (this.btnWizardEndProject) this.btnWizardEndProject.style.display = 'block';
        if (this.btnWizardExtendProject) this.btnWizardExtendProject.style.display = 'none';

        if (this.wizardSummaryTableBody) {
            this.wizardSummaryTableBody.innerHTML = "";
            const typesList = this.getTemplateSteps().map(s => this.getWizardStepType(s));
            const toolMap = {
                source: "Gemini / ChatGPT",
                scenario: "Gemini / ChatGPT",
                written: "Gemini / ChatGPT",
                creator: "Midjourney",
                character: "Midjourney v6",
                environment: "Midjourney v6",
                voice: "Google TTS",
                music: "Suno AI",
                comic: "Midjourney",
                video: "Runway Gen-3",
                game: "Unity 2D"
            };
            const outputMap = {
                source: "مستند قصة سردي",
                scenario: "سيناريو تفصيلي",
                written: "مخطوطة حوار",
                creator: "دليل أسلوب فني",
                character: "لوحة تصميم شخصية",
                environment: "لوحة تصميم بيئة",
                voice: "ملف صوتي تعبيري",
                music: "ساوندتراك خلفي",
                comic: "قصة مصورة",
                video: "لقطة متحركة",
                game: "لعبة مصغرة WebGL"
            };
            const formatMap = {
                source: "MD (.md)",
                scenario: "MD (.md)",
                written: "MD (.md)",
                creator: "PDF / MD",
                character: "PNG (.png)",
                environment: "PNG (.png)",
                voice: "MP3 (.mp3)",
                music: "MP3 (.mp3)",
                comic: "PDF / PNG",
                video: "MP4 (.mp4)",
                game: "ZIP (.zip)"
            };
            const arabicTypes = {
                source: "📖 مصدر سردي",
                scenario: "📝 سيناريو",
                written: "📜 مخطوطة",
                creator: "🎨 رسام",
                character: "👤 شخصية",
                environment: "🌌 بيئة",
                voice: "🎙️ صوت",
                music: "🎵 موسيقى",
                comic: "📚 قصة مصورة",
                video: "🎬 فيديو",
                game: "🎮 لعبة"
            };

            typesList.forEach(t => {
                const ids = this.wizardSessionData[t] || [];
                ids.forEach(id => {
                    const asset = this.assets.find(a => a.id === id);
                    if (asset) {
                        const tr = document.createElement('tr');
                        tr.style.borderBottom = "1px solid var(--border-color)";
                        tr.innerHTML = `
                            <td style="padding: 10px; border: 1px solid var(--border-color);">
                                <strong>${arabicTypes[t]}</strong><br>
                                <span style="font-size:0.75rem; color:var(--color-cyan);">${asset.title}</span>
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="	ext${asset.usedPrompt || ''}">
                                ${asset.usedPrompt || 'لا يوجد برومبت'}
                            </td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">${toolMap[t] || ''}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color);">${outputMap[t] || ''}</td>
                            <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: bold; color: var(--color-green);">${formatMap[t] || ''}</td>
                        `;
                        this.wizardSummaryTableBody.appendChild(tr);
                    }
                });
            });
        }
    }

    downloadProjectSummaryMD() {
        let md = `# 🌌 مشروع كون سكتشيك الإنتاجي المتكامل (Cosmic Production Project)\n\n`;
        md += `تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}\n\n---\n\n`;
        const typesList = this.getTemplateSteps().map(s => this.getWizardStepType(s));
        const arabicTypes = {
            source: "📖 المصادر السردية",
            scenario: "📝 السيناريوهات",
            written: "📜 المخطوطات ونصوص العالم",
            creator: "🎨 الرسامون الكونيون",
            character: "👤 الشخصيات",
            environment: "🌌 البيئات",
            voice: "🎙️ الأصوات",
            music: "🎵 الموسيقى",
            comic: "📚 القصص المصورة",
            video: "🎬 مقاطع الفيديو",
            game: "🎮 الألعاب التفاعلية"
        };

        typesList.forEach(t => {
            const ids = this.wizardSessionData[t] || [];
            if (ids.length > 0) {
                md += `## ${arabicTypes[t]}\n\n`;
                ids.forEach(id => {
                    const asset = this.assets.find(a => a.id === id);
                    if (asset) {
                        md += `### 🔹 أصل: 	ext${asset.title}\n`;
                        md += `* **الوصف**: 	ext${asset.desc}\n`;
                        md += `* **رابط Google Drive للملف**: 	ext${asset.driveUrl}\n`;
                        if (asset.usedPrompt) md += `* **موجه التوليد (Prompt)**:\n\`\`\`text\n	ext${asset.usedPrompt}\n\`\`\`\n`;
                        md += `\n`;
                    }
                });
                md += `---\n\n`;
            }
        });

        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `sketchic_project_${Date.now()}.md`);
        link.click();
    }

    async endCurrentProject() {
        if (!confirm("🛑 هل أنت متأكد من رغبتك في إنهاء هذا المشروع وحفظه في الأرشيف؟")) {
            return;
        }
        
        const typesList = this.getTemplateSteps().map(s => this.getWizardStepType(s));
        let md = `# 🌌 مشروع كون سكتشيك الإنتاجي المتكامل (Cosmic Production Project)\n\n`;
        md += `تاريخ التصدير: ${new Date().toLocaleDateString('ar-EG')}\n\n---\n\n`;
        
        typesList.forEach(t => {
            const ids = this.wizardSessionData[t] || [];
            if (ids.length > 0) {
                md += `## أصول الخطوة: ${t}\n\n`;
                ids.forEach(id => {
                    const asset = this.assets.find(a => a.id === id);
                    if (asset) {
                        md += `### 🔹 أصل: ${asset.title}\n`;
                        md += `* **الوصف**: ${asset.desc}\n`;
                        md += `* **رابط Google Drive**: ${asset.driveUrl}\n`;
                        if (asset.usedPrompt) md += `* **موجه التوليد (Prompt)**:\n\`\`\`text\n${asset.usedPrompt}\n\`\`\`\n`;
                        md += `\n`;
                    }
                });
                md += `---\n\n`;
            }
        });

        const parentProjId = this.wizardParentProject ? this.wizardParentProject.value : "";
        const projId = 'wiz-project-' + Date.now();
        const firstAssetId = (this.wizardSessionData['source'] && this.wizardSessionData['source'][0]);
        const firstAsset = firstAssetId ? this.assets.find(a => a.id === firstAssetId) : null;
        const projTitle = firstAsset ? `مشروع: ${firstAsset.title}` : `مشروع سكتشيك كوني - ${Date.now()}`;
        const safeTitle = projTitle.replace(/[\/\\:*?"<>|]/g, '_');

        let driveUrl = document.getElementById('wizard-global-drive-url')?.value || 'https://drive.google.com/drive/folders/wizard-session';
        let alertMsg = `💾 تم حفظ مستند المشروع النهائي بنجاح:\n1. كقاعدة بيانات داخل النظام باسم [${projTitle}].\n`;

        if (this.isGDriveConnected && this.gdriveAccessToken) {
            try {
                const uploadedUrl = await this.uploadFileToGDrive("Sketchic_Projects", safeTitle, md);
                if (uploadedUrl) {
                    driveUrl = uploadedUrl;
                    alertMsg += `2. تم رفعه ومزامنته في Google Drive تحت المجلد [Sketchic_Projects] بنجاح.\nالرابط الفعلي للمستند:\n${driveUrl}`;
                } else {
                    alertMsg += `2. ⚠️ فشل الرفع الفعلي لـ Google Drive (سنستخدم المسار المحلي مؤقتاً).`;
                }
            } catch (err) {
                console.error("GDrive project summary upload error", err);
                alertMsg += `2. ⚠️ فشل الرفع لـ Google Drive بسبب خطأ في الشبكة أو الصلاحيات.`;
            }
        } else {
            alertMsg += `2. تم محاكاة رفعه ومزامنته في Google Drive تحت المجلد الموحد (Drive غير متصل).`;
        }
        
        const projectAsset = {
            id: projId,
            type: 'project_summary',
            title: projTitle,
            desc: `مستند المشروع الإنتاجي المتكامل المولد بالطيار الآلي. يشمل الأصول والبرومبتات.`,
            driveUrl: driveUrl,
            status: 'finished',
            projectStatus: 'ended',
            parentProject: parentProjId,
            content: md,
            wizardSessionData: JSON.parse(JSON.stringify(this.wizardSessionData)),
            createdAt: new Date().toISOString()
        };

        this.assets.push(projectAsset);
        this.saveAssets();

        alert(alertMsg);
        
        if (this.btnWizardEndProject) this.btnWizardEndProject.style.display = 'none';
        if (this.btnWizardExtendProject) {
            this.btnWizardExtendProject.style.display = 'block';
            this.btnWizardExtendProject.dataset.projId = projId;
        }
    }

    extendCurrentProject() {
        const parentId = this.btnWizardExtendProject.dataset.projId;
        if (!parentId) return;

        const parentProject = this.assets.find(a => a.id === parentId);
        if (!parentProject) return;

        if (!confirm(`🚀 هل ترغب في إنشاء جزء جديد (Sequel) يكمل قصة [	ext${parentProject.title}]؟`)) {
            return;
        }

        this.currentWizardStep = 1;
        this.currentWizardAssetId = null;
        this.wizardSessionData = {
            source: [], scenario: [], creator: [], character: [], environment: [],
            voice: [], music: [], comic: [], video: [], game: [], written: []
        };
        
        this.assets = this.assets.filter(a => a.type === 'project_summary' || !a.id.startsWith('wiz-'));
        this.saveAssets();

        if (this.wizardSummaryView) this.wizardSummaryView.style.display = 'none';
        const grid = document.querySelector('.wizard-container-grid');
        if (grid) grid.style.display = 'grid';

        this.populateParentProjectsSelect();
        if (this.wizardParentProject) {
            this.wizardParentProject.value = parentId;
        }

        this.navigateWizardDirect(this.getTemplateSteps()[0]);
        
        const parentSessionData = parentProject.wizardSessionData || {};
        const parentSourceId = parentSessionData.source && parentSessionData.source[0];
        const parentSource = parentSourceId ? this.assets.find(a => a.id === parentSourceId) : null;

        const titleEl = document.getElementById('wiz-title');
        const descEl = document.getElementById('wiz-desc');

        if (titleEl && parentSource) {
            titleEl.value = `${parentSource.title} - الجزء الثاني`;
        }
        if (descEl && parentSource) {
            descEl.value = `امتداد درامي وسردي لأحداث الجزء الأول: ${parentSource.desc}. يتابع الصراع بين أبعاد الرسم المتداخلة.`;
        }
        
        this.generateWizardPrompt();
        alert(`📝 تم بدء جزء جديد بنجاح وتغذية البيانات من المشروع السابق [	ext${parentProject.title}]!`);
    }

    resetWizardSession() {
        this.currentWizardStep = 1;
        this.currentWizardAssetId = null;
        this.wizardSessionData = {
            source: [],
            scenario: [],
            creator: [],
            character: [],
            environment: [],
            voice: [],
            music: [],
            comic: [],
            video: [],
            game: [],
            written: []
        };
        this.assets = this.assets.filter(a => a.type === 'project_summary' || !a.id.startsWith('wiz-'));
        this.saveAssets();
        if (this.wizardSummaryView) this.wizardSummaryView.style.display = 'none';
        const grid = document.querySelector('.wizard-container-grid');
        if (grid) grid.style.display = 'grid';
        this.navigateWizardDirect(this.getTemplateSteps()[0]);
    }

    async runWizardAutopilot() {
        const steps = this.getTemplateSteps();
        
        if (!confirm("🤖 هل ترغب في توليد وحفظ كافة أصول المشروع تلقائياً وبسرعة فائقة بالطيار الآلي؟ (سيقوم بإنشاء شخصيات وبيئات متعددة إبداعياً)")) {
            return;
        }

        const parentProjId = this.wizardParentProject ? this.wizardParentProject.value : "";
        const parentProject = parentProjId ? this.assets.find(a => a.id === parentProjId) : null;
        let parentSource = null;
        if (parentProject && parentProject.wizardSessionData) {
            const parentSourceId = parentProject.wizardSessionData.source && parentProject.wizardSessionData.source[0];
            parentSource = parentSourceId ? this.assets.find(a => a.id === parentSourceId) : null;
        }

        const getMultiplicity = (type) => {
            const rules = {
                character: [
                    { title: "شخصية: البطل الرئيسي (Protagonist)", desc: "شخصية مستيقظة تدرك أنها مرسومة بحبر مانجا حاد وتتحكم بفرشاتها الخاصة." },
                    { title: "شخصية: الخصم والشرير الرئيسي (Antagonist)", desc: "حارس البعد الكوني الذي يمثل الأسلوب الزيتي الكلاسيكي ويسعى لدمج الخطوط." },
                    { title: "شخصية مساندة: المرافق الرقمي", desc: "كائن ثلاثي أبعاد يساعد البطل في فك الشفرات البصرية للأبعاد المتداخلة." }
                ],
                environment: [
                    { title: "بيئة: مسرح البداية والتماس البصري", desc: "بقعة التداخل الأولى حيث تطفو الكوادر الحبرية فوق بحيرة من ألوان الزيت السائلة." },
                    { title: "بيئة: ساحة الصدام الأخير", desc: "المركز الكوني لانهيار الأبعاد حيث تتمازج ضربات الفرشاة وتتلاشى الحدود الهندسية." },
                    { title: "بيئة: دهليز الأكواد المفقودة", desc: "ممر تحت البوابة الكونية يحتوي على لوحات كلاسيكية غير مكتملة." }
                ]
            };
            const list = rules[type] || [null];
            if (type === 'character' || type === 'environment') {
                const count = Math.floor(Math.random() * 2) + 2; // either 2 or 3 dynamically
                return list.slice(0, count);
            }
            return list;
        };

        for (let step of steps) {
            this.currentWizardStep = step;
            const type = this.getWizardStepType(step);
            
            const ids = this.wizardSessionData[type] || [];
            if (ids.length === 0) {
                const multiRules = getMultiplicity(type);
                this.wizardSessionData[type] = [];

                for (let i = 0; i < multiRules.length; i++) {
                    const rule = multiRules[i];
                    this.renderWizardStep();
                    this.generateWizardStepWithAI();
                    
                    const titleEl = document.getElementById('wiz-title');
                    const descEl = document.getElementById('wiz-desc');
                    const globalDriveUrl = document.getElementById('wizard-global-drive-url')?.value || 'https://drive.google.com/drive/folders/wizard-session';
                    
                    if (rule && titleEl) {
                        titleEl.value = rule.title;
                        if (parentSource && i === 0) titleEl.value += " (تكملة لـ " + parentSource.title + ")";
                    }
                    if (rule && descEl) {
                        descEl.value = rule.desc;
                        if (parentSource) descEl.value += " يتأثر هذا الأصل سلبياً أو إيجابياً بأحداث الجزء الأول من القصة.";
                    }

                    this.generateWizardPrompt();

                    const subOptions = {};
                    const selects = this.wizardFormFields.querySelectorAll('select');
                    selects.forEach(sel => {
                        const key = sel.id.replace('wiz-opt-', '').replace('wiz-', '');
                        if (key !== 'relatedFaction') {
                            subOptions[key] = sel.value;
                        }
                    });
                    const inputsText = this.wizardFormFields.querySelectorAll('input, textarea');
                    inputsText.forEach(inp => {
                        if (inp.id !== 'wiz-title' && inp.id !== 'wiz-desc' && inp.id !== 'wiz-drive-url') {
                            const key = inp.id.replace('wiz-opt-', '').replace('wiz-', '');
                            subOptions[key] = inp.value;
                        }
                    });

                    const assetId = 'wiz-' + type + '-' + Date.now() + '-' + i + '-' + Math.floor(Math.random()*1000);
                    this.wizardSessionData[type].push(assetId);

                    let relatedSourceId = (this.wizardSessionData['source'] && this.wizardSessionData['source'][0]) || "";
                    let relatedScenarioId = (this.wizardSessionData['scenario'] && this.wizardSessionData['scenario'][0]) || "";
                    let relatedCreatorId = (this.wizardSessionData['creator'] && this.wizardSessionData['creator'][0]) || "";
                    let relatedChars = this.wizardSessionData['character'] || [];

                    const factionEl = document.getElementById('wiz-relatedFaction');
                    const relatedFactionVal = factionEl ? factionEl.value : "";

                    const assetObject = {
                        id: assetId,
                        type: type,
                        title: titleEl ? titleEl.value.trim() : "أصل تلقائي",
                        desc: descEl ? descEl.value.trim() : "وصف تلقائي",
                        driveUrl: globalDriveUrl,
                        status: 'finished',
                        relatedSource: relatedSourceId,
                        relatedScenario: relatedScenarioId,
                        relatedCreator: relatedCreatorId,
                        relatedFaction: relatedFactionVal,
                        relatedCharacters: relatedChars,
                        interfacePhysics: "",
                        directorChecklist: {
                            noBlending: true,
                            depthContrast: true,
                            sonicDissonance: true
                        },
                        usedPrompt: this.wizardPromptText ? this.wizardPromptText.textContent : "",
                        subOptions: subOptions,
                        createdAt: new Date().toISOString()
                    };

                    this.assets.push(assetObject);
                }
            }
        }
        
        this.saveAssets();
        this.showProjectSummary();
        alert("🤖 تم تشغيل الطيار الآلي الكوني وتوليد جميع الأصول والبرومبتات للمشروع بنجاح! تفضل بمراجعة الجدول والتحميل.");
    }

    generateWizardStepWithAI() {
        const step = this.currentWizardStep;
        const type = this.getWizardStepType(step);

        const parentSourceId = (this.wizardSessionData['source'] || [])[0];
        const parentSource = parentSourceId ? this.assets.find(a => a.id === parentSourceId) : null;
        const sourceTitle = parentSource ? parentSource.title : "";
        const sourceTheme = parentSource && parentSource.subOptions ? (parentSource.subOptions.theme || parentSource.subOptions.sourceTheme || "") : "";
        const sourcePlot = parentSource && parentSource.subOptions ? (parentSource.subOptions.plot || parentSource.subOptions.sourcePlot || "") : "";
        const sourceSetting = parentSource && parentSource.subOptions ? (parentSource.subOptions.setting || parentSource.subOptions.sourceSetting || "") : "";

        const titleEl = document.getElementById('wiz-title');
        const descEl = document.getElementById('wiz-desc');

        if (type === 'source') {
            if (titleEl) titleEl.value = "رواية: تمزق الأبعاد الحبرية لكون سكتشيك";
            if (descEl) descEl.value = "رواية ملحمية ترصد قصة الرسام الكوني الأخير ومحاولاته اليائسة لإصلاح الشقوق الناتجة عن تداخل الأبعاد والفرشاة الجافة.";
            
            const typeSel = document.getElementById('wiz-opt-sourceType');
            if (typeSel) typeSel.value = "رواية كوكبية طويلة (Novel)";
            const authorInput = document.getElementById('wiz-opt-sourceAuthor');
            if (authorInput) authorInput.value = "الكاتب الكوني الأول";
            const wcInput = document.getElementById('wiz-opt-sourceWordCount');
            if (wcInput) wcInput.value = "2500";

        } else if (type === 'scenario') {
            if (titleEl) titleEl.value = sourceTitle ? `سيناريو: ${sourceTitle}` : "سيناريو: بوابة التماس والألوان المتناثرة";
            if (descEl) descEl.value = sourcePlot 
                ? `السيناريو الحاكم والمقسم للحبكة المستوحاة من: ${sourcePlot.substring(0, 120)}`
                : "صراع بصري حاد بين مستيقظ حبري وحارس الأبعاد على حافة لوحة زيتية متآكلة.";
            
            const genreSel = document.getElementById('wiz-opt-genre');
            if (genreSel) genreSel.value = "دراما الصدام المرئي (Visual Clash Drama)";
            const styleSel = document.getElementById('wiz-opt-style');
            if (styleSel) styleSel.value = "سرد فلسفي ميتافيزيقي";
            const layerSel = document.getElementById('wiz-opt-parallelLayer');
            if (layerSel) layerSel.value = "Layer 1 - الوجود المادي الفعلي";
            const fpsSel = document.getElementById('wiz-opt-framerate');
            if (fpsSel) fpsSel.value = "24fps";

        } else if (type === 'written') {
            if (titleEl) titleEl.value = sourceTitle ? `مخطوطة: حوارات (${sourceTitle})` : "مخطوطة نصوص البعد المفقود";
            if (descEl) descEl.value = "مخطوطة حوارية تفصيلية مبنية على صراع الطبقات الزمنية البصرية للأبعاد.";
            
            const wtSel = document.getElementById('wiz-opt-writtenType');
            if (wtSel) wtSel.value = "حوار تفصيلي سينمائي";
            const wlInput = document.getElementById('wiz-opt-writtenLanguage');
            if (wlInput) wlInput.value = "العربية الفصحى";
            const wsSel = document.getElementById('wiz-opt-writtenStyle');
            if (wsSel) wsSel.value = "شاعري غامض وفلسفي";
            
            const textTA = document.getElementById('wiz-opt-writtenText');
            if (textTA) {
                textTA.value = `[المستيقظ الحبري]: "ضربات فرشاتك سميكة جداً.. إنها تخنق خطوطي الرفيعة!"\n[حارس الأبعاد]: "الحدود ضرورية للحفاظ على تماسك اللوحة الكونية، بدون أصباغي ستتلاشى خطوطك في الفراغ!"`;
            }

        } else if (type === 'creator') {
            if (titleEl) titleEl.value = "الرسام الكوني: غريغوري الزيتي الأخير";
            if (descEl) descEl.value = "رسام كوني غامض يفضل الأسلوب الكلاسيكي ويهوى دمج الفرشاة الجافة مع الأصباغ المتنافرة لمنع الاندماج الفني.";
            
            const styleSel = document.getElementById('wiz-opt-artStyle');
            if (styleSel) styleSel.value = "لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)";
            const toolSel = document.getElementById('wiz-opt-tool');
            if (toolSel) toolSel.value = "فرشاة شعر السنجاب الغليظة المشبعة بالزيت";

        } else if (type === 'character') {
            if (titleEl) titleEl.value = "شخصية: كورين المستيقظة الحبرية";
            if (descEl) descEl.value = "شخصية أنثوية ثنائية الأبعاد مرسومة بحبر المانجا الحاد، تدرك وجود المشاهدين وتحارب للبقاء خارج إطار اللوحة.";
            
            const ccSel = document.getElementById('wiz-opt-charClass');
            if (ccSel) ccSel.value = "شخصية مستيقظة تدرك أنها مرسومة (Awakened)";
            const factSel = document.getElementById('wiz-relatedFaction');
            if (factSel) factSel.value = "awakened";

        } else if (type === 'environment') {
            if (titleEl) titleEl.value = "بيئة: مسرح بوابات الرسم الحبرية";
            if (descEl) descEl.value = sourceSetting ? `بيئة المشهد مستلهمة من: ${sourceSetting.substring(0, 100)}` : "موقع تماس الأبعاد الكونية حيث تتداخل اللوحات الزيتية المائعة مع الخطوط الحبرية الجافة.";
            
            const etSel = document.getElementById('wiz-opt-envType');
            if (etSel) etSel.value = "داخل لوحة قماشية مائعة (Fluid Canvas Interior)";
            const cdSel = document.getElementById('wiz-opt-clashDensity');
            if (cdSel) cdSel.value = "متوسطة (تداخل الضوء والجاذبية)";

        } else if (type === 'voice') {
            if (titleEl) titleEl.value = "صوت: كورين المستيقظة";
            if (descEl) descEl.value = "بصمة صوتية مستخرجة بمحركات Google AI Studio للتعبير عن نبرة الحوار المتمردة لكورين.";
            
            const veSel = document.getElementById('wiz-opt-voiceEngine');
            if (veSel) veSel.value = "gemini-3.1-flash-tts-preview";
            const vsSel = document.getElementById('wiz-opt-voiceSpeaker');
            if (vsSel) vsSel.value = "Charon (Calm, Deep voice)";

        } else if (type === 'music') {
            if (titleEl) titleEl.value = "موسيقى: سمفونية التمزق اللوني";
            if (descEl) descEl.value = "ساوندتراك تصويري يجمع بين كمان كلاسيكي وأصوات نبضات رقمية حادة ومتنافرة.";
            
            const meSel = document.getElementById('wiz-opt-musicEngine');
            if (meSel) meSel.value = "Suno AI (توليد كامل اللحن مع الكلمات)";
            const mgSel = document.getElementById('wiz-opt-musicGenre');
            if (mgSel) mgSel.value = "Epic Cosmic Orchestral (أوركسترا كونية ملحمية)";

        } else if (type === 'comic') {
            if (titleEl) titleEl.value = "لوحة قصة: صدام الأبعاد النهائي";
            if (descEl) descEl.value = "4 كوادر توضح محاولات كورين لاقتحام اللوحة الزيتية ومواجهة حارس البوابة الكوني.";
            
            const fSel = document.getElementById('wiz-opt-format');
            if (fSel) fSel.value = "ويب تون طولي للموبايل (Vertical Webtoon)";
            const cSel = document.getElementById('wiz-opt-color');
            if (cSel) cSel.value = "قص لوني متباين (ألوان زيتية متداخلة مع حبر مانجا)";

        } else if (type === 'video') {
            if (titleEl) titleEl.value = "فيديو: الحركة المتنافرة للألوان";
            if (descEl) descEl.value = "مقطع تحريكي مدته 4 ثوانٍ يجسد تساقط واختلاط خطوط الحبر مع بقع الزيت دون اندماج.";
            
            const tSel = document.getElementById('wiz-opt-tool');
            if (tSel) tSel.value = "Runway Gen-3 Alpha";
            const fSel = document.getElementById('wiz-opt-fps');
            if (fSel) fSel.value = "مختلط متنافر (12 إطاراً للمانجا مقابل 60 إطاراً للزيتي)";

        } else if (type === 'game') {
            if (titleEl) titleEl.value = "لعبة: متاهة شقوق الأبعاد الكونية";
            if (descEl) descEl.value = "لعبة منصات ولغز فيزيائي يتحكم اللاعب فيها بخواص ألوانه لحل مشاكل تداخل الجاذبية والعبور للطبقة التالية.";
            
            const ggSel = document.getElementById('wiz-opt-gameGenre');
            if (ggSel) ggSel.value = "لعبة منصات وألغاز ثنائية أبعاد (2D Platformer)";
            const mSel = document.getElementById('wiz-opt-mechanic');
            if (mSel) mSel.value = "بوابات تغيير أبعاد الرسم لحل الألغاز الكونية";
        }

        this.generateWizardPrompt();
        alert(`🤖 تم توليد وتعبئة تفاصيل الخطوة 	ext${step} بنجاح! تم استخدام بيانات السياق المتوفرة لضمان اتساق الأصول.`);
    }
    wipeAllDatabaseData() {
        if (!confirm("🚨 تحذير: هل أنت متأكد من رغبتك في تفريغ ومسح جميع بيانات الأصول والمشاهد والملفات من النظام؟ سيقوم هذا بإعادة تهيئة التطبيق بالكامل ومسح localStorage!")) {
            return;
        }
        localStorage.clear();
        alert("🧹 تم تفريغ ومسح جميع بيانات قاعدة البيانات وlocalStorage بالكامل! سيتم الآن إعادة تحميل الصفحة للبدء من جديد.");
        window.location.reload();
    }

    async wipeGoogleDriveContents() {
        if (!this.isGDriveConnected || !this.gdriveAccessToken) {
            alert("⚠️ يجب ربط حساب Google Drive أولاً لمسح محتوياته!");
            return;
        }

        if (!confirm("🚨 تحذير خطير: هل أنت متأكد من مسح جميع الملفات والمجلدات التي أنشأها هذا التطبيق في حساب Google Drive الخاص بك؟ لا يمكن التراجع عن هذا الإجراء!")) {
            return;
        }

        try {
            if (this.btnWipeGDrive) {
                this.btnWipeGDrive.disabled = true;
                this.btnWipeGDrive.textContent = "⏳ جاري مسح ملفات Google Drive...";
            }

            const listUrl = 'https://www.googleapis.com/drive/v3/files?spaces=drive&fields=files(id,name)';
            const response = await fetch(listUrl, {
                headers: {
                    'Authorization': `Bearer ${this.gdriveAccessToken}`
                }
            });
            const data = await response.json();
            const files = data.files || [];

            if (files.length === 0) {
                alert("✨ لا توجد ملفات للتطبيق لحذفها في حساب Google Drive.");
                return;
            }

            let deletedCount = 0;
            for (let file of files) {
                const deleteUrl = `https://www.googleapis.com/drive/v3/files/${file.id}`;
                const delResp = await fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${this.gdriveAccessToken}`
                    }
                });
                if (delResp.ok) {
                    deletedCount++;
                }
            }

            alert(`🧹 تم بنجاح مسح ${deletedCount} ملف/مجلد من حساب Google Drive الخاص بك!`);
        } catch (err) {
            console.error("Error wiping GDrive", err);
            alert("⚠️ حدث خطأ أثناء مسح محتويات Google Drive: " + err.message);
        } finally {
            if (this.btnWipeGDrive) {
                this.btnWipeGDrive.disabled = false;
                this.btnWipeGDrive.textContent = "☁️ مسح وتفريغ جميع محتويات الجوجل درايف للمنشورة";
            }
        }
    }

    initDirectorChat() {
        this.directorMessage = document.getElementById('director-message-text');
        this.directorOptions = document.getElementById('director-options-container');
        this.directorCustomContainer = document.getElementById('director-custom-input-container');
        this.directorCustomVal = document.getElementById('director-custom-val');
        this.btnDirectorSubmitCustom = document.getElementById('btn-director-submit-custom');
        
        if (!this.directorMessage) return;

        this.btnDirectorSubmitCustom.addEventListener('click', () => this.handleDirectorCustomSubmit());
        
        this.updateDirectorChat();
    }

    updateDirectorChat() {
        if (!this.directorMessage) return;
        this.directorCustomContainer.style.display = 'none';
        this.directorCustomVal.value = '';
        this.directorOptions.innerHTML = '';
        
        const creators = this.assets.filter(a => a.type === 'creator');
        const characters = this.assets.filter(a => a.type === 'character');
        const environments = this.assets.filter(a => a.type === 'environment');
        const scenarios = this.assets.filter(a => a.type === 'scenario');

        const prevType = this.directorChatState ? this.directorChatState.type : null;

        if (creators.length === 0) {
            this.directorChatState = { type: 'CREATE_CREATOR' };
            this.directorMessage.innerHTML = `👋 أهلاً بك! ليس لديك أي <strong>رسام كوني (Creator)</strong> في النظام بعد. الرسامون هم من يحددون نمط الأبعاد والقوانين البصرية لكون سكتشيك.<br>لنبدأ بإنشاء أول رسام، ما هو الأسلوب الفني الذي يقترحه قلبك؟`;
            
            const options = [
                { text: "🎨 لوحة زيتية كلاسيكية (عصر النهضة)", val: "لوحة زيتية كلاسيكية من عصر النهضة (Renaissance)", tool: "فرشاة شعر السنجاب الغليظة المشبعة بالزيت" },
                { text: "✏️ مانجا يابانية بالأبيض والأسود", val: "رسم مانجا ياباني تقليدي بالأبيض والأسود مع تأثير التظليل الخشن", tool: "ريشة رسم يابانية مخصصة للحبر الأسود النقي" },
                { text: "🎬 كارتون كلاسيكي من التسعينات", val: "رسوم متحركة ثنائية أبعاد من كلاسيكيات التسعينات بتباين لوني جريء", tool: "أقلام تحبير فلوماستر وألوان غواش مشبعة" },
                { text: "✨ أسلوب آخر خاص بك...", isCustom: true }
            ];
            this.renderDirectorOptions(options);
        } else if (characters.length === 0) {
            const creator = creators[0];
            this.directorChatState = { type: 'CREATE_CHARACTER', creatorId: creator.id };
            this.directorMessage.innerHTML = `✍️ الرسام الكوني <strong>[${creator.title}]</strong> جاهز ويريد رسم شخصيته الأولى في هذا البعد!<br>ما هو الدور السردي المقترح لهذه الشخصية؟`;

            const options = [
                { text: "👤 البطل المستيقظ (المتمرد)", val: "شخصية مستيقظة تدرك أنها مرسومة بحبر حاد وتتحكم بفرشاتها الخاصة", role: "شخصية مستيقظة تدرك أنها مرسومة (Awakened)" },
                { text: "🛡️ حارس البعد الكوني (حامي النظام)", val: "حارس البعد الذي يمثل قوانين الألوان الثابتة ويسعى لمنع الاندماج", role: "حارس الأزمان واللوحات (Time Keeper)" },
                { text: "🌌 كائن هجين غامض", val: "كائن غريب مصنوع من قصاصات ورق ورسومات غير مكتملة يساعد الأبطال", role: "مخلوق مساند غامض" },
                { text: "✍️ دور آخر خاص بك...", isCustom: true }
            ];
            this.renderDirectorOptions(options);
        } else if (environments.length === 0) {
            const creator = creators[0];
            const character = characters[0];
            this.directorChatState = { type: 'CREATE_ENVIRONMENT', creatorId: creator.id, characterId: character.id };
            this.directorMessage.innerHTML = `🌌 الشخصية <strong>[${character.title}]</strong> تائهة في الفراغ! لنصمم لها بيئتها الأولى لتبدأ قصتها.<br>أين تقع هذه البيئة المرجعية؟`;

            const options = [
                { text: "💧 لوحة مائعة عائمة", val: "موقع تماس الأبعاد الكونية حيث تتداخل اللوحات الزيتية المائعة مع الخطوط الحبرية الجافة", envType: "داخل لوحة قماشية مائعة (Fluid Canvas Interior)", clash: "متوسطة" },
                { text: "📚 دهليز الأوراق وقصاصات الرصاص", val: "ممر تحت البوابة الكونية يحتوي على لوحات كلاسيكية غير مكتملة وقصاصات ورقية معلقة", envType: "دهليز قصاصات الورق والغرافيت (Graphite Debris)", clash: "خفيفة" },
                { text: "🏙️ مدينة الحبر المضيء (Neon Ink)", val: "مدينة ضخمة مرسومة بخطوط حبر النيون المضيء ذات الجاذبية المائلة", envType: "أفق مدينة الحبر المضيء (Neon Ink City Skyline)", clash: "شديدة" },
                { text: "✍️ بيئة أخرى خاصة بك...", isCustom: true }
            ];
            this.renderDirectorOptions(options);
        } else {
            // Balanced rotation to prevent repeating the same type consecutively
            const candidates = [];
            if (characters.length < creators.length * 2) {
                candidates.push('CREATE_CHARACTER_RAND');
            }
            if (environments.length < characters.length) {
                candidates.push('CREATE_ENVIRONMENT_RAND');
            }
            if (scenarios.length < environments.length) {
                candidates.push('CREATE_SCENARIO_RAND');
            }

            let chosenType = null;
            if (candidates.length > 0) {
                // Filter out the last category type to prevent immediate repetition
                const filtered = candidates.filter(t => t !== prevType);
                const finalPool = filtered.length > 0 ? filtered : candidates;
                chosenType = finalPool[Math.floor(Math.random() * finalPool.length)];
            } else {
                chosenType = 'CREATE_CREATOR_RAND';
            }

            if (chosenType === 'CREATE_CREATOR_RAND') {
                this.directorChatState = { type: 'CREATE_CREATOR_RAND' };
                this.directorMessage.innerHTML = `🧠 ما رأيك في توسيع الكون بإضافة رسام كوني جديد؟ سيجلب هذا فصائل وخطوط رسم جديدة للصدام! ما هو الأسلوب الجديد المقترح؟`;
                
                const options = [
                    { text: "🎨 رسم زيتي مائي مائع (Watercolor)", val: "رسم مائي انسيابي بألوان الباستيل المائعة الشفافة", tool: "فرشاة مائية مشبعة بالماء الجاري" },
                    { text: "🖌️ خطوط غرافيت رصاص جافة (Sketch)", val: "رسم تظليل قلم رصاص غرافيتي خشن مع طبقات تظليل ميكانيكية", tool: "قلم رصاص غرافيت جاف 4B" },
                    { text: "✨ أسلوب آخر...", isCustom: true }
                ];
                this.renderDirectorOptions(options);
            } else if (chosenType === 'CREATE_CHARACTER_RAND') {
                const creator = creators[Math.floor(Math.random() * creators.length)];
                this.directorChatState = { type: 'CREATE_CHARACTER_RAND', creatorId: creator.id };
                this.directorMessage.innerHTML = `👤 الرسام الكوني <strong>[${creator.title}]</strong> يبحث عن إلهام لتصميم بطل جديد في بعده الخاص!<br>ما هو الدور السردي الذي تقترحه؟`;
                
                const options = [
                    { text: "⚔️ مقاتل فئة قوى المحو (Erasers)", val: "مقاتل غامض يحمل ممحاة فوضى عملاقة لمحو الخطوط الزائدة", role: "قوى المحو الكوني (The Eraser)" },
                    { text: "🎭 مرافق ساخر ذو أبعاد هجينة", val: "كائن ثنائي الأبعاد مضحك يسخر من المشاهدين ويعلق على الأحداث", role: "مرافق ميتافيزيقي" },
                    { text: "✨ اسم ودور آخر...", isCustom: true }
                ];
                this.renderDirectorOptions(options);
            } else if (chosenType === 'CREATE_ENVIRONMENT_RAND') {
                const creator = creators[Math.floor(Math.random() * creators.length)];
                this.directorChatState = { type: 'CREATE_ENVIRONMENT_RAND', creatorId: creator.id };
                this.directorMessage.innerHTML = `🌌 أبعاد الرسم تتمدد! نحتاج لتصميم بيئة جديدة تحت رعاية الرسام <strong>[${creator.title}]</strong>.<br>ما هي طبيعة هذا الموقع الجديد؟`;
                
                const options = [
                    { text: "💧 لوحة مائعة عائمة", val: "موقع تماس الأبعاد الكونية حيث تتداخل اللوحات الزيتية المائعة", envType: "Fluid Canvas", clash: "متوسطة" },
                    { text: "🏙️ مدينة الحبر المضيء (Neon Ink)", val: "مدينة ضخمة مرسومة بخطوط حبر النيون المضيء ذات الجاذبية المائلة", envType: "Neon Ink City", clash: "شديدة" },
                    { text: "✨ بيئة أخرى...", isCustom: true }
                ];
                this.renderDirectorOptions(options);
            } else if (chosenType === 'CREATE_SCENARIO_RAND') {
                this.directorChatState = { type: 'CREATE_SCENARIO_RAND' };
                this.directorMessage.innerHTML = `📝 لدينا شخصيات وبيئات! ما رأيك في نسج سيناريو قصة جديد يجمعهما في مغامرة؟ ما نوع المغامرة؟`;
                
                const options = [
                    { text: "💥 معركة الصدام البصري الأول", val: "سيناريو يوثق اللحظة الأولى لتصادم أسلوب الرسام الكلاسيكي بالمانجا الحديثة", category: "دراما الصدام المرئي" },
                    { text: "🗝️ فك شفرة الخطوط المفقودة", val: "مغامرة لحل ألغاز في دهليز الأكواد المفقودة بمساعدة المشاهد", category: "غموض وفلسفة كوكبية" },
                    { text: "✨ حبكة أخرى...", isCustom: true }
                ];
                this.renderDirectorOptions(options);
            }
        }
    }

    renderDirectorOptions(options) {
        if (!this.directorOptions) return;
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-secondary';
            btn.style.textAlign = 'right';
            btn.style.fontSize = '0.85rem';
            btn.style.padding = '8px 12px';
            btn.innerHTML = opt.text;
            
            btn.addEventListener('click', () => {
                if (opt.isCustom) {
                    this.directorCustomContainer.style.display = 'flex';
                    this.directorCustomVal.focus();
                } else {
                    this.processDirectorAction(opt);
                }
            });
            this.directorOptions.appendChild(btn);
        });
    }

    processDirectorAction(choice) {
        const state = this.directorChatState;
        
        if (state.type === 'CREATE_CREATOR' || state.type === 'CREATE_CREATOR_RAND') {
            const style = choice.val;
            const tool = choice.tool;
            const assetId = 'wiz-creator-' + Date.now();
            
            const creatorNames = ["غريغوري", "سيريوس", "أوريون", "تيتان", "ليوناردو", "رافايل", "كوبلت"];
            const randomName = creatorNames[Math.floor(Math.random() * creatorNames.length)];
            let cleanTitle = choice.isCustom ? choice.text : choice.text.replace(/^[^\s]+\s+/, '');
            let title = choice.isCustom ? choice.text : `الرسام الكوني: ${randomName} (${cleanTitle})`;
            
            const newCreator = {
                id: assetId,
                type: 'creator',
                title: title,
                desc: `رسام كوني ولد بمقترح المرشد التفاعلي. أسلوبه: ${style}.`,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                subOptions: {
                    artStyle: style,
                    tool: tool
                },
                createdAt: new Date().toISOString()
            };
            this.assets.push(newCreator);
            this.saveAssets();
            alert(`🎨 تم إنشاء الرسام الكوني بنجاح: [${newCreator.title}]!`);
            this.updateDirectorChat();
        } else if (state.type === 'CREATE_CHARACTER' || state.type === 'CREATE_CHARACTER_RAND') {
            const desc = choice.val;
            const role = choice.role;
            const assetId = 'wiz-character-' + Date.now();
            
            const charNames = ["كورين", "أثير", "سديم", "شهاب", "ليرا", "سهيل", "طارق", "فجر", "برق", "سهم"];
            const randomName = charNames[Math.floor(Math.random() * charNames.length)];
            let cleanTitle = choice.isCustom ? choice.text : choice.text.replace(/^[^\s]+\s+/, '');
            let title = choice.isCustom ? choice.text : `الشخصية: ${randomName} (${cleanTitle})`;

            const newChar = {
                id: assetId,
                type: 'character',
                title: title,
                desc: desc,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                relatedCreator: state.creatorId || "",
                subOptions: {
                    charClass: role
                },
                createdAt: new Date().toISOString()
            };
            this.assets.push(newChar);
            this.saveAssets();
            alert(`👤 تم تصميم الشخصية وإضافتها للكون: [${newChar.title}]!`);
            this.updateDirectorChat();
        } else if (state.type === 'CREATE_ENVIRONMENT' || state.type === 'CREATE_ENVIRONMENT_RAND') {
            const desc = choice.val;
            const envType = choice.envType || "بيئة رسم كوني";
            const clash = choice.clash || "متوسطة";
            const assetId = 'wiz-environment-' + Date.now();
            
            const envNames = ["سديم", "أطلس", "بوابة التماس", "دهليز الفوضى", "ممر الضوء", "حافة الورقة"];
            const randomName = envNames[Math.floor(Math.random() * envNames.length)];
            let cleanTitle = choice.isCustom ? choice.text : choice.text.replace(/^[^\s]+\s+/, '');
            let title = choice.isCustom ? choice.text : `البيئة: ${randomName} (${cleanTitle})`;

            const newEnv = {
                id: assetId,
                type: 'environment',
                title: title,
                desc: desc,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                relatedCreator: state.creatorId || "",
                subOptions: {
                    envType: envType,
                    clashDensity: clash
                },
                createdAt: new Date().toISOString()
            };
            this.assets.push(newEnv);
            this.saveAssets();
            alert(`🌌 تم تصميم البيئة وإضافتها للكون: [${newEnv.title}]!`);
            this.updateDirectorChat();
        } else if (state.type === 'CREATE_SCENARIO_RAND') {
            const desc = choice.val;
            const cat = choice.category || "دراما";
            const assetId = 'wiz-scenario-' + Date.now();
            let cleanTitle = choice.isCustom ? choice.text : choice.text.replace(/^[^\s]+\s+/, '');
            let title = choice.isCustom ? choice.text : `السيناريو: ${cleanTitle}`;

            const newScen = {
                id: assetId,
                type: 'scenario',
                title: title,
                desc: desc,
                driveUrl: 'https://drive.google.com/drive/folders/wizard-session',
                status: 'finished',
                subOptions: {
                    genre: cat,
                    style: "سرد تفصيلي"
                },
                createdAt: new Date().toISOString()
            };
            this.assets.push(newScen);
            this.saveAssets();
            alert(`📝 تم صياغة سيناريو المشهد بنجاح: [${newScen.title}]!`);
            this.updateDirectorChat();
        }
    }

    handleDirectorCustomSubmit() {
        const val = this.directorCustomVal.value.trim();
        if (!val) {
            alert("يرجى كتابة اقتراح أولاً.");
            return;
        }

        const state = this.directorChatState;
        const choice = {
            text: val,
            val: `أصل مخصص تم تعبئته بواسطة الكاتب: ${val}`,
            tool: "أداة مخصصة",
            role: "دور مخصص",
            envType: "بيئة مخصصة",
            clash: "متوسطة",
            category: "تصنيف مخصص",
            isCustom: true
        };
        this.processDirectorAction(choice);
    }
    openVidsExportModal(assetId) {
        const asset = this.assets.find(a => a.id === assetId);
        if (!asset) return;

        // Determine title, setting, and description
        let title = asset.title;
        let desc = asset.desc || "";
        
        let creatorStyle = "لوحة زيتية كلاسيكية مع حبر مانجا";
        if (asset.relatedCreator) {
            const creator = this.assets.find(a => a.id === asset.relatedCreator);
            if (creator && creator.subOptions) {
                creatorStyle = creator.subOptions.artStyle || creatorStyle;
            }
        }

        let charName = "البطل المستيقظ";
        if (asset.relatedCharacters && asset.relatedCharacters.length > 0) {
            const char = this.assets.find(a => a.id === asset.relatedCharacters[0]);
            if (char) charName = char.title;
        }

        // Generate 4 narrative shots optimized for Google Veo / Google Labs Flow
        this.currentVidsShots = [
            {
                shot: "1",
                visual: `لقطة تأسيسية واسعة للبيئة الكونية: [${title}]. الأسلوب الفني: [${creatorStyle}].`,
                veoVisual: `Establishing wide shot of cosmic environment [${title}], style is [${creatorStyle}], slow camera panning left to right, volumetric lighting, shallow depth of field, vivid details, photorealistic details, Google Veo style.`,
                vo: `أهلاً بكم في هذا البعد الفني الجديد من عوالم سكتشيك، حيث يتشكل الواقع من ضربات الفرشاة وقصاصات الورق.`,
                audio: "موسيقى تصويرية غامضة وهادئة (Cosmic Ambient Pad)"
            },
            {
                shot: "2",
                visual: `لقطة متوسطة تظهر الشخصية [${charName}] وهي تكتشف أبعاد هذا العالم.`,
                veoVisual: `Medium shot of character [${charName}] exploring [${title}], stylized rendering, camera tracking slowly behind character, warm dramatic lighting, high contrast, Google Veo style.`,
                vo: `هنا يستيقظ البطل ليجد نفسه مرسوماً بحبر حاد، متحدياً قوانين اللوحة والخطوط التي رسمتها فرشاة المخرج.`,
                audio: "إضافة صوت إيقاعي بطيء متصاعد (Slow synth build-up)"
            },
            {
                shot: "3",
                visual: `لقطة قريبة سريعة توثق اللحظة الدرامية وتصادم الأساليب البصرية عند حافة الألوان.`,
                veoVisual: `Dynamic extreme close-up of color intersection lines, sharp ink textures clashing with fluid oil paint strokes, camera tilting up rapidly, high speed motion, neon contrast lighting, Google Veo style.`,
                vo: `عند التماس المباشر للخطوط المائعة، يرتفع التباين ليعلن عن ولادة قصة جديدة تعبر عن صراع الأشكال والجاذبية.`,
                audio: "إيقاع أوركسترالي متصاعد حاد لقمة الإثارة"
            },
            {
                shot: "4",
                visual: `لقطة سينمائية نهائية واسعة للكون وهو يستقر في مجلد سكتشيك الموحد في السحاب.`,
                veoVisual: `Cinematic extreme wide shot of cosmic canvas settling, slow drone zoom-out, magical starry particles floating, soft sunset lighting, ultra realistic render, 8k resolution, Google Veo style.`,
                vo: `وهكذا ينتهي المشهد الأول، ليبقى هذا البعد محفوظاً كأثر كوني متكامل في سجلات المخرج البصري.`,
                audio: "نهاية ناعمة مع نغمات بيانو منفردة تتلاشى تدريجياً"
            }
        ];

        // Render in Table
        const tbody = document.getElementById('vids-export-table-body');
        if (tbody) {
            tbody.innerHTML = "";
            this.currentVidsShots.forEach(s => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid var(--border-color)";
                tr.innerHTML = `
                    <td style="padding: 10px; border-left: 1px solid var(--border-color); text-align: center; font-weight: bold; color: var(--color-cyan);">${s.shot}</td>
                    <td style="padding: 10px; border-left: 1px solid var(--border-color); color: var(--text-primary);">
                        <strong>${s.visual}</strong>
                        <div style="font-size:0.75rem; color:var(--color-cyan); margin-top:5px; font-family:monospace; direction:ltr; text-align:left; background:var(--bg-tertiary); padding:5px; border-radius:4px; overflow-x:auto;">
                            ${s.veoVisual}
                        </div>
                    </td>
                    <td style="padding: 10px; border-left: 1px solid var(--border-color); color: var(--text-secondary);">${s.vo}</td>
                    <td style="padding: 10px; color: var(--text-secondary);">${s.audio}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Show Modal
        const modal = document.getElementById('vids-export-modal');
        if (modal) {
            modal.classList.add('open');
        }
        this.currentExportAsset = asset;
    }

    copyVidsText(type) {
        if (!this.currentVidsShots) return;
        let text = "";
        if (type === 'prompts') {
            text = this.currentVidsShots.map(s => `Shot ${s.shot} Visual: ${s.visual}`).join('\n\n');
        } else if (type === 'veo') {
            text = this.currentVidsShots.map(s => `Shot ${s.shot} Veo Prompt: ${s.veoVisual}`).join('\n\n');
        } else if (type === 'flow_script') {
            // Generate full Google Flow Scenebuilder storyboard template outline
            text = "=== GOOGLE FLOW SCENEBUILDER STORYBOARD OUTLINE ===\n\n";
            this.currentVidsShots.forEach(s => {
                text += `CLIP ID: ${s.shot}\n`;
                text += `VIDEO GENERATION PROMPT (Veo): ${s.veoVisual}\n`;
                text += `VOICEOVER / SCRIPT LAYER: ${s.vo}\n`;
                text += `AUDIO / SFX LAYER: ${s.audio}\n`;
                text += `--------------------------------------------------\n\n`;
            });
        } else {
            text = this.currentVidsShots.map(s => `Shot ${s.shot} Voiceover: ${s.vo}`).join('\n\n');
        }
        navigator.clipboard.writeText(text).then(() => {
            alert("📋 تم نسخ النصوص إلى الحافظة بنجاح!");
        }).catch(err => {
            console.error("Failed to copy:", err);
        });
    }

    initDrawingTab() {
        this.btnGenerateHybridStyle = document.getElementById('btn-generate-hybrid-style');
        this.btnCopyHybridPrompt = document.getElementById('btn-copy-hybrid-prompt');
        this.hybridStyle1 = document.getElementById('hybrid-style-1');
        this.hybridStyle2 = document.getElementById('hybrid-style-2');
        this.hybridRatio = document.getElementById('hybrid-ratio');
        this.hybridRatioLabel = document.getElementById('hybrid-ratio-label');
        this.hybridSubject = document.getElementById('hybrid-subject');
        this.hybridModifiers = document.getElementById('hybrid-modifiers');
        this.hybridPromptResult = document.getElementById('hybrid-prompt-result');
        this.hybridPreviewCanvas = document.getElementById('hybrid-preview-canvas');
        this.hybridPreviewVisual = document.getElementById('hybrid-preview-visual');
        this.hybridPreviewText = document.getElementById('hybrid-preview-text');

        this.hybridMode = document.getElementById('hybrid-mode');

        if (this.hybridMode) {
            this.hybridMode.addEventListener('change', () => {
                const isSingle = this.hybridMode.value === 'single';
                const container = document.getElementById('hybrid-only-fields');
                if (container) container.style.display = isSingle ? 'none' : 'block';
            });
        }

        if (this.hybridRatio) {
            this.hybridRatio.addEventListener('input', () => {
                const ratio = this.hybridRatio.value;
                if (this.hybridRatioLabel) {
                    this.hybridRatioLabel.textContent = `${ratio}% / ${100 - ratio}%`;
                }
            });
        }

        if (this.btnGenerateHybridStyle) {
            this.btnGenerateHybridStyle.addEventListener('click', () => {
                const mode = this.hybridMode ? this.hybridMode.value : "hybrid";
                const style1 = this.hybridStyle1 ? this.hybridStyle1.value : "";
                const style2 = this.hybridStyle2 ? this.hybridStyle2.value : "";
                const ratio = this.hybridRatio ? this.hybridRatio.value : 50;
                const subject = this.hybridSubject ? this.hybridSubject.value.trim() : "";
                const modifiers = this.hybridModifiers ? this.hybridModifiers.value.trim() : "";

                if (!subject) {
                    alert("يرجى إدخال الموضوع أو عنصر الرسم أولاً.");
                    return;
                }

                // Generate Prompt
                let prompt = "";
                if (mode === 'single') {
                    prompt = `A cinematic visual clash artwork of [${subject}], stylized in the pure style of (${style1}).\n${modifiers ? `Visual modifiers: ${modifiers}. ` : ''}Maintain sharp borders, stylized textures, and dramatic contrast, Google Imagen 3 style.`;
                } else {
                    prompt = `A cinematic visual clash artwork of [${subject}], stylized in a hybrid fusion of ${ratio}% (${style1}) and ${100 - ratio}% (${style2}).\n${modifiers ? `Visual modifiers: ${modifiers}. ` : ''}Maintain sharp collision borders, stylized textures, and dramatic contrast, Google Imagen 3 style.`;
                }

                if (this.hybridPromptResult) {
                    this.hybridPromptResult.textContent = prompt;
                }

                // Update UI Mock Preview
                if (this.hybridPreviewCanvas) {
                    if (mode === 'single') {
                        this.hybridPreviewCanvas.style.background = "#1e1e2e";
                    } else {
                        this.hybridPreviewCanvas.style.background = `linear-gradient(${ratio}deg, #1e1e2e, #313244)`;
                    }
                    
                    // Apply visual effect based on styles
                    let visualEmoji = "🎨";
                    if (style1.includes("Manga") || style2.includes("Manga")) visualEmoji = "🖋️";
                    else if (style1.includes("Oil") || style2.includes("Oil")) visualEmoji = "🖌️";
                    else if (style1.includes("Graphite") || style2.includes("Graphite")) visualEmoji = "✏️";
                    else if (style1.includes("Vector") || style2.includes("Vector")) visualEmoji = "📐";
                    
                    if (this.hybridPreviewVisual) {
                        this.hybridPreviewVisual.textContent = visualEmoji;
                        this.hybridPreviewVisual.style.transform = `scale(${1 + ratio / 100}) rotate(${ratio}deg)`;
                    }
                    if (this.hybridPreviewText) {
                        if (mode === 'single') {
                            this.hybridPreviewText.innerHTML = `معاينة الأسلوب: <strong>نمط أحادي نقي للأسلوب الأول (${style1.split(' (')[0]})</strong>.<br>البرومبت جاهز للنسخ والتوليد!`;
                        } else {
                            this.hybridPreviewText.innerHTML = `معاينة التهجين: <strong>دمج فني بين ${ratio}% أسلوب أساسي و ${100 - ratio}% أسلوب ثانوي</strong>.<br>البرومبت جاهز للنسخ والتوليد!`;
                        }
                    }
                }
            });
        }

        if (this.btnCopyHybridPrompt) {
            this.btnCopyHybridPrompt.addEventListener('click', () => {
                const text = this.hybridPromptResult ? this.hybridPromptResult.textContent : "";
                if (!text) {
                    alert("يرجى توليد الأسلوب الهجين أولاً قبل النسخ.");
                    return;
                }
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.btnCopyHybridPrompt.textContent;
                    this.btnCopyHybridPrompt.textContent = "تم النسخ! ✓";
                    setTimeout(() => {
                        this.btnCopyHybridPrompt.textContent = originalText;
                    }, 2000);
                });
            });
        }
    }

    downloadVidsCSV() {
        if (!this.currentVidsShots || !this.currentExportAsset) return;
        
        // CSV Content with BOM for Arabic support
        let csvContent = "\ufeff";
        csvContent += "اللقطة,الوصف الإرشادي,موجه Veo (Google Flow),التعليق الصوتي (Voiceover),المؤثرات الصوتية والموسيقى\n";
        
        this.currentVidsShots.forEach(s => {
            const visual = s.visual.replace(/"/g, '""');
            const veoVisual = s.veoVisual.replace(/"/g, '""');
            const vo = s.vo.replace(/"/g, '""');
            const audio = s.audio.replace(/"/g, '""');
            csvContent += `"${s.shot}","${visual}","${veoVisual}","${vo}","${audio}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const safeTitle = this.currentExportAsset.title.replace(/[\/\\:*?"<>|]/g, '_');
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `Flow_Storyboard_${safeTitle}.csv`);
        link.click();
    }
}

// Instantiate the App on window load
window.addEventListener('DOMContentLoaded', () => {
    window.app = new SketchicApp();
});
