// Google Story Studio - Planner for Flow
class StoryStudioPlanner {
    constructor() {
        this.currentTab = 'script';
        this.selectedStyle = 'realistic';
        this.customStyles = {};
        this.assets = [
            {
                id: 'char-1',
                type: 'character',
                title: 'زين (Ink Zen)',
                desc: 'مدقق خطي يعيش في متروبوليس الحبر، حركته بأسلوب المانجا 12fps.',
                charInfo: 'زين: شخصية مستيقظة ملتزمة بحماية نقاوة بعد الحبر ومنع ذوبان الخطوط وتداخلها.',
                voiceSpeaker: 'Algenib'
            },
            {
                id: 'char-2',
                type: 'character',
                title: 'آرا الهجينة (Hybrid Ara)',
                desc: 'كائن هجين ذو قلب من الفحم ودرع من الطلاء الزيتي الكثيف 60fps.',
                charInfo: 'آرا: شخصية مستيقظة تعيش في قلق وجودي دائم من تلاشيها بفعل المحو.',
                voiceSpeaker: 'Charon'
            },
            {
                id: 'loc-1',
                type: 'location',
                title: 'أرخبيل القصاصات العائم',
                desc: 'بيئة معمارية معقدة من قصاصات ورقية تطفو في سديم زيتي لزج متصادم.'
            }
        ];
        this.frames = [];
        this.activeFormat = 'title';

        this.initElements();
        this.bindEvents();
    }

    initElements() {
        // Modals
        this.onboardingModal = document.getElementById('onboarding-modal');
        this.customStyleModal = document.getElementById('custom-style-modal');
        
        // Selectors
        this.mainStyleSelect = document.getElementById('main-style-select');
        this.headerStyleSelect = document.getElementById('header-style-select');
        this.customStyleName = document.getElementById('custom-style-name');
        this.customStyleDesc = document.getElementById('custom-style-desc');
        
        // App Panels
        this.appWorkspace = document.getElementById('app-workspace');
        this.projectTitleDisplay = document.getElementById('project-title-display');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');

        // Editor
        this.scriptEditor = document.getElementById('script-editor');
        this.scriptAiPrompt = document.getElementById('script-ai-prompt');
        this.formatBtns = document.querySelectorAll('.format-btn');

        // Assets
        this.assetsListGrid = document.getElementById('assets-list-grid');
        this.assetFormContainer = document.getElementById('asset-form-container');
        this.assetEditId = document.getElementById('asset-edit-id');
        this.assetType = document.getElementById('asset-type');
        this.assetTitle = document.getElementById('asset-title');
        this.assetCharInfo = document.getElementById('asset-char-info');
        this.assetVoiceSpeaker = document.getElementById('asset-voice-speaker');
        this.assetDesc = document.getElementById('asset-desc');
        this.charInfoGroup = document.getElementById('char-info-group');
        this.charVoiceGroup = document.getElementById('char-voice-group');

        // Storyboard
        this.storyboardCardsGrid = document.getElementById('storyboard-cards-grid');
        this.frameDetailsPanel = document.getElementById('frame-details-panel');
        this.frameSceneIndicator = document.getElementById('frame-scene-indicator');
        this.frameTitleDisplay = document.getElementById('frame-title-display');
        this.frameTitleInput = document.getElementById('frame-title-input');
        this.frameActionInput = document.getElementById('frame-action-input');
        this.frameRefTagsContainer = document.getElementById('frame-ref-tags-container');
        this.generatedPromptSpell = document.getElementById('generated-prompt-spell');
    }

    bindEvents() {
        if (this.mainStyleSelect) {
            this.mainStyleSelect.addEventListener('change', () => {
                if (this.mainStyleSelect.value === 'custom') {
                    this.openCustomStyleModal();
                }
            });
        }
        if (this.scriptEditor) {
            this.scriptEditor.addEventListener('input', () => this.parseScriptToFrames());
        }
    }

    // Onboarding Actions
    openCustomStyleModal() {
        if (this.customStyleModal) this.customStyleModal.style.display = 'flex';
    }

    closeCustomStyleModal() {
        if (this.customStyleModal) this.customStyleModal.style.display = 'none';
        if (this.mainStyleSelect) this.mainStyleSelect.value = 'realistic';
    }

    autofillStyleDesc() {
        const name = this.customStyleName.value.trim().toLowerCase();
        let desc = "Describe visual style, texture and lighting...";

        if (name.includes('cyber') || name.includes('neon') || name.includes('رقمي')) {
            desc = "Digital vectors, high-contrast neon lighting with cyan and magenta bloom. Extremely clean outline strokes, mathematical grid coordinate background.";
        } else if (name.includes('clash') || name.includes('صدام') || name.includes('هجين')) {
            desc = "Visual clash style. Split screen/boundary composition containing high-contrast black-and-white Manga (12fps) directly colliding with classical soft-edge Renaissance Oil painting (60fps) without color blending.";
        } else if (name.includes('manga') || name.includes('ink') || name.includes('حبر')) {
            desc = "Traditional Japanese manga look. Dark solid ink contour lines, screentone dots for shading, high dynamic speed lines in action shots, monochrome paper texture.";
        } else if (name.includes('oil') || name.includes('renaissance') || name.includes('زيتي')) {
            desc = "Impasto canvas texture, rich oil brushstrokes, dramatic chiaroscuro lighting, volumetric shadow depth, 60fps fluid camera motion.";
        } else if (name.includes('pencil') || name.includes('sketch') || name.includes('رصاص')) {
            desc = "Loose graphite sketch contours, visible shading hatch marks, fragile charcoal powder details, paper friction noise, erase marks on edges.";
        } else {
            desc = "Custom hybrid visual style representing artistic collision in the Sketchic Universe. High-fidelity rendering with custom boundary parameters.";
        }

        if (this.customStyleDesc) this.customStyleDesc.value = desc;
    }

    saveCustomStyle() {
        const name = this.customStyleName.value.trim() || 'Custom Style';
        const desc = this.customStyleDesc.value.trim() || '';
        const id = 'style-' + Date.now();

        this.customStyles[id] = { name, desc };
        
        // Add to select lists
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `✨ ${name}`;
        
        if (this.mainStyleSelect) {
            this.mainStyleSelect.appendChild(opt.cloneNode(true));
            this.mainStyleSelect.value = id;
        }
        if (this.headerStyleSelect) {
            this.headerStyleSelect.appendChild(opt);
            this.headerStyleSelect.value = id;
        }

        this.closeCustomStyleModal();
    }

    startStoryStudio() {
        const selected = this.mainStyleSelect.value;
        this.selectedStyle = selected;
        if (this.headerStyleSelect) this.headerStyleSelect.value = selected;

        // Hide onboarding, show workspace
        if (this.onboardingModal) this.onboardingModal.style.display = 'none';
        if (this.appWorkspace) this.appWorkspace.classList.add('active');

        // Set initial sample script
        let sampleScript = "";
        if (selected === 'manga' || selected.includes('manga')) {
            sampleScript = "Title: تصدعات البعد الحبري\n\nScene: Ext. Metropolis Street - Day\nزين يقف متأملاً الفراغ الأبيض الذي بدأ يتمدد في أفق المدينة الحبرية. خطوطه السوداء تبدو حادة ومقصوصة.\n\nDialog: زين\nهل هذا هو العدم الورقي الذي حذرنا منه المبدعون؟";
        } else if (selected === 'oil' || selected.includes('oil')) {
            sampleScript = "Title: شروق زيتي كلاسيكي\n\nScene: Int. Renaissance Chamber - Dawn\nغرفة واسعة مضاءة بشموع صفراء دافئة، تفاصيل الفرشاة غليظة وواضحة على الجدران اللوحية.\n\nDialog: آرا الهجينة\nالألوان هنا ثقيلة ولزجة، وتجعل كل حركة تبدو وقورة ومقدسة.";
        } else {
            sampleScript = "Title: الصدام الأول في عالم سكتشيك\n\nScene: Ext. Visual Clash Boundary - Day\nزين يقف عند غشاء التماس، وتصطدم خطوط حبره بضربات الفرشاة الزيتية المحيطة بآرا.\n\nDialog: زين\nتوقف عن التقدم! ألوانك تكاد تذيب نقاوة خطوطي الخارجية.";
        }
        
        if (this.scriptEditor) {
            this.scriptEditor.value = sampleScript;
            this.parseScriptToFrames();
        }

        this.renderAssets();
    }

    changeHeaderStyle() {
        this.selectedStyle = this.headerStyleSelect.value;
        if (this.selectedStyle === 'custom') {
            this.openCustomStyleModal();
        } else {
            this.parseScriptToFrames();
        }
    }

    // Tabs Management
    switchTab(tabId) {
        this.currentTab = tabId;
        
        // Nav Buttons
        this.tabBtns.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Panels
        this.tabPanes.forEach(pane => {
            if (pane.id === `tab-${tabId}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        if (tabId === 'assets') {
            this.renderAssets();
        } else if (tabId === 'storyboard') {
            this.parseScriptToFrames();
            this.renderStoryboard();
        }
    }

    setFormat(format) {
        this.activeFormat = format;
        this.formatBtns.forEach(btn => {
            if (btn.textContent.toLowerCase() === format) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Insert formatting prefix in editor
        const text = this.scriptEditor.value;
        const start = this.scriptEditor.selectionStart;
        const end = this.scriptEditor.selectionEnd;
        const prefixes = {
            title: "\nTitle: ",
            scene: "\nScene: ",
            dialog: "\nDialog: ",
            transition: "\nTransition: "
        };
        const prefix = prefixes[format] || "";
        this.scriptEditor.value = text.substring(0, start) + prefix + text.substring(end);
        this.scriptEditor.focus();
    }

    // AI script refinement simulating Story Studio features
    runScriptAI() {
        const input = this.scriptAiPrompt.value.trim();
        if (!input) return;

        // Simulate AI script formatting & style integration
        let styleDetails = "Realistic styles";
        if (this.selectedStyle === 'manga') styleDetails = "Manga G-pen line drawing style";
        else if (this.selectedStyle === 'oil') styleDetails = "Renaissance Chiaroscuro Oil style";
        else if (this.selectedStyle === 'pencil') styleDetails = "Fragile Graphite Sketch style";
        else if (this.customStyles[this.selectedStyle]) styleDetails = this.customStyles[this.selectedStyle].name;

        const originalText = this.scriptEditor.value;
        this.scriptEditor.value = `Title: سيناريو مصقول - ${input}\n\nScene: Ext. City Clash Area - Day\nلقطة متوسطة تبرز الأبعاد المتداخلة بأسلوب [${styleDetails}]. تتصرف عناصر الطبيعة وفقاً لقوانين الرسم الخاصة بها.\n\nDialog: آرا الهجينة\nأشعر بأن خطوطي تزداد ثباتاً عند خط التماس.\n\n` + originalText;
        
        this.scriptAiPrompt.value = "";
        this.parseScriptToFrames();
        alert("✨ تم تنقيح وصقل السيناريو بنجاح وحقنه بالخواص البصرية للأسلوب المختار!");
    }

    // Script parser
    parseScriptToFrames() {
        const text = this.scriptEditor.value;
        const lines = text.split('\n');
        
        let projectTitle = "Untitled Story";
        let parsedScenes = [];
        let currentScene = null;
        let frameCount = 0;

        lines.forEach(line => {
            const clean = line.trim();
            if (clean.startsWith('Title:')) {
                projectTitle = clean.replace('Title:', '').trim();
            } else if (clean.startsWith('Scene:')) {
                frameCount++;
                currentScene = {
                    index: frameCount,
                    title: clean.replace('Scene:', '').trim(),
                    action: "",
                    dialogue: "",
                    refAssetIds: []
                };
                parsedScenes.push(currentScene);
            } else if (currentScene) {
                if (clean.startsWith('Dialog:') || clean.startsWith('Dialogue:')) {
                    currentScene.dialogue = clean.replace(/Dialog:|Dialogue:/, '').trim() + ": ";
                } else if (clean.length > 0) {
                    if (currentScene.dialogue && currentScene.dialogue.endsWith(': ')) {
                        currentScene.dialogue += clean;
                    } else {
                        currentScene.action += (currentScene.action ? "\n" : "") + clean;
                    }
                }
            }
        });

        if (this.projectTitleDisplay) this.projectTitleDisplay.textContent = projectTitle;

        // Merge with existing edit values if matching indices
        this.frames = parsedScenes.map(newFrame => {
            const oldFrame = this.frames.find(f => f.index === newFrame.index);
            if (oldFrame) {
                newFrame.refAssetIds = oldFrame.refAssetIds;
                if (!newFrame.title) newFrame.title = oldFrame.title;
            }
            return newFrame;
        });

        this.renderStoryboard();
    }

    // Cast / Assets UI
    renderAssets() {
        if (!this.assetsListGrid) return;
        this.assetsListGrid.innerHTML = "";

        this.assets.forEach(asset => {
            const card = document.createElement('div');
            card.className = 'asset-card';
            card.innerHTML = `
                <div class="asset-card-details">
                    <h4>${asset.title}</h4>
                    <p>${asset.type === 'character' ? '👤 شخصية' : asset.type === 'location' ? '🗺️ بيئة' : '🛡️ أداة'}</p>
                </div>
                <div style="font-weight: bold; color: var(--color-cyan); font-size: 0.8rem;">تعديل</div>
            `;
            card.onclick = () => this.editAsset(asset.id);
            this.assetsListGrid.appendChild(card);
        });
    }

    onAssetTypeChange() {
        const isChar = this.assetType.value === 'character';
        if (this.charInfoGroup) this.charInfoGroup.style.display = isChar ? 'flex' : 'none';
        if (this.charVoiceGroup) this.charVoiceGroup.style.display = isChar ? 'flex' : 'none';
    }

    createNewAsset() {
        if (this.assetFormContainer) this.assetFormContainer.style.display = 'flex';
        this.assetEditId.value = "";
        this.assetTitle.value = "";
        this.assetCharInfo.value = "";
        this.assetDesc.value = "";
        this.assetType.value = "character";
        this.onAssetTypeChange();
    }

    editAsset(id) {
        const asset = this.assets.find(a => a.id === id);
        if (!asset) return;

        if (this.assetFormContainer) this.assetFormContainer.style.display = 'flex';
        this.assetEditId.value = asset.id;
        this.assetType.value = asset.type;
        this.assetTitle.value = asset.title;
        this.assetDesc.value = asset.desc;
        
        if (asset.type === 'character') {
            this.assetCharInfo.value = asset.charInfo || "";
            this.assetVoiceSpeaker.value = asset.voiceSpeaker || "Algenib";
        }
        
        this.onAssetTypeChange();
    }

    saveAsset() {
        const id = this.assetEditId.value;
        const type = this.assetType.value;
        const title = this.assetTitle.value.trim();
        const desc = this.assetDesc.value.trim();
        
        if (!title) {
            alert("يرجى كتابة اسم الأصل!");
            return;
        }

        const newAsset = {
            id: id || 'asset-' + Date.now(),
            type,
            title,
            desc,
            charInfo: type === 'character' ? this.assetCharInfo.value.trim() : undefined,
            voiceSpeaker: type === 'character' ? this.assetVoiceSpeaker.value : undefined
        };

        if (id) {
            this.assets = this.assets.map(a => a.id === id ? newAsset : a);
        } else {
            this.assets.push(newAsset);
        }

        this.cancelAssetEdit();
        this.renderAssets();
    }

    cancelAssetEdit() {
        if (this.assetFormContainer) this.assetFormContainer.style.display = 'none';
    }

    // Storyboard Rendering & Detail panel
    renderStoryboard() {
        if (!this.storyboardCardsGrid) return;
        this.storyboardCardsGrid.innerHTML = "";

        if (this.frames.length === 0) {
            this.storyboardCardsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">اكتب مشاهد في علامة التبويب (Script) للبدء في توليد إطارات لوحة العمل...</div>`;
            return;
        }

        this.frames.forEach((frame, idx) => {
            const card = document.createElement('div');
            card.className = 'frame-card';
            
            // Background image simulator based on style
            let bgStyle = 'linear-gradient(135deg, #1d2133, #0f111a)';
            if (this.selectedStyle === 'manga') bgStyle = 'repeating-linear-gradient(45deg, #222 0px, #222 2px, #333 2px, #333 4px)';
            else if (this.selectedStyle === 'oil') bgStyle = 'radial-gradient(circle, #441a1a, #161925)';

            card.innerHTML = `
                <div class="frame-image-placeholder" style="background: ${bgStyle};">
                    🎬 Frame #${frame.index}
                </div>
                <div class="frame-card-body">
                    <h4>${frame.index}. ${frame.title || 'لقطة غير مسماة'}</h4>
                    <p>${frame.action || 'لا يوجد وصف متاح'}</p>
                </div>
            `;
            card.onclick = () => this.selectFrame(idx);
            this.storyboardCardsGrid.appendChild(card);
        });
    }

    selectFrame(index) {
        const frame = this.frames[index];
        if (!frame) return;

        // Activate frame details panel
        if (this.frameDetailsPanel) this.frameDetailsPanel.style.display = 'flex';
        
        document.querySelectorAll('.frame-card').forEach((c, idx) => {
            if (idx === index) c.classList.add('active');
            else c.classList.remove('active');
        });

        this.frameSceneIndicator.textContent = `Scene 01 • Frame ${String(frame.index).padStart(2, '0')}`;
        this.frameTitleDisplay.textContent = frame.title || 'لقطة غير مسماة';
        this.frameTitleInput.value = frame.title || '';
        this.frameActionInput.value = frame.action || '';
        this.frameDetailsIndex = index;

        this.renderFrameRefTags();
        this.updateGeneratedPromptSpell();
    }

    updateFrameTitle() {
        const idx = this.frameDetailsIndex;
        if (idx === undefined) return;
        this.frames[idx].title = this.frameTitleInput.value;
        this.frameTitleDisplay.textContent = this.frameTitleInput.value || 'لقطة غير مسماة';
        this.renderStoryboard();
    }

    updateFrameAction() {
        const idx = this.frameDetailsIndex;
        if (idx === undefined) return;
        this.frames[idx].action = this.frameActionInput.value;
        this.renderStoryboard();
        this.updateGeneratedPromptSpell();
    }

    renderFrameRefTags() {
        if (!this.frameRefTagsContainer) return;
        this.frameRefTagsContainer.innerHTML = "";

        const frame = this.frames[this.frameDetailsIndex];
        if (!frame) return;

        // Render current tags
        const tags = frame.refAssetIds || [];
        tags.forEach(aid => {
            const asset = this.assets.find(a => a.id === aid);
            if (asset) {
                const tagEl = document.createElement('div');
                tagEl.className = 'ref-tag';
                tagEl.innerHTML = `${asset.title} <span onclick="window.app.removeFrameRefTag('${aid}')">×</span>`;
                this.frameRefTagsContainer.appendChild(tagEl);
            }
        });

        // Plus button to add tags
        const addBtn = document.createElement('button');
        addBtn.className = 'btn-add-ref-tag';
        addBtn.textContent = '➕ ربط أصل كوني';
        addBtn.onclick = () => this.showAddRefTagMenu();
        this.frameRefTagsContainer.appendChild(addBtn);
    }

    showAddRefTagMenu() {
        const frame = this.frames[this.frameDetailsIndex];
        const currentTags = frame.refAssetIds || [];
        const available = this.assets.filter(a => !currentTags.includes(a.id));

        if (available.length === 0) {
            alert("لقد قمت بربط كافة الأصول المتاحة بالفعل! قم بإضافة المزيد في علامة التبويب Assets.");
            return;
        }

        let menuHtml = "اختر الأصل الذي تريد ربطه بهذه اللقطة:\n";
        available.forEach((a, i) => {
            menuHtml += `${i + 1}. ${a.title} (${a.type})\n`;
        });

        const choice = prompt(menuHtml);
        if (choice) {
            const idx = parseInt(choice) - 1;
            if (available[idx]) {
                frame.refAssetIds = frame.refAssetIds || [];
                frame.refAssetIds.push(available[idx].id);
                this.renderFrameRefTags();
                this.updateGeneratedPromptSpell();
            }
        }
    }

    removeFrameRefTag(assetId) {
        const frame = this.frames[this.frameDetailsIndex];
        if (frame) {
            frame.refAssetIds = frame.refAssetIds.filter(id => id !== assetId);
            this.renderFrameRefTags();
            this.updateGeneratedPromptSpell();
        }
    }

    updateGeneratedPromptSpell() {
        if (!this.generatedPromptSpell) return;
        const frame = this.frames[this.frameDetailsIndex];
        if (!frame) return;

        // Get style specs
        let styleName = this.selectedStyle;
        let styleDesc = "Default visual settings";

        if (this.selectedStyle === 'manga') {
            styleDesc = "Manga G-pen line drawing style, screentone dot textures, high-contrast monochrome ink rendering, 12fps animation.";
        } else if (this.selectedStyle === 'oil') {
            styleDesc = "Chiaroscuro oil painting style, thick paint texture (impasto brushwork), slow-paced 60fps cinematic flow.";
        } else if (this.selectedStyle === 'pencil') {
            styleDesc = "Graphite charcoal sketch look, soft contours, visible hatching.";
        } else if (this.customStyles[this.selectedStyle]) {
            styleName = this.customStyles[this.selectedStyle].name;
            styleDesc = this.customStyles[this.selectedStyle].desc;
        }

        // Gather cast details
        let castPromptParts = [];
        let charInfoDirectives = [];
        
        if (frame.refAssetIds && frame.refAssetIds.length > 0) {
            frame.refAssetIds.forEach(aid => {
                const asset = this.assets.find(a => a.id === aid);
                if (asset) {
                    castPromptParts.push(`${asset.title} (${asset.desc})`);
                    if (asset.charInfo) {
                        charInfoDirectives.push(`[Character Info for ${asset.title}]: ${asset.charInfo}`);
                    }
                }
            });
        }

        let prompt = `[Google Flow Prompt Spell - Visual Storyboard Studio]\n`;
        prompt += `Style: ${styleName} (${styleDesc})\n`;
        if (castPromptParts.length > 0) {
            prompt += `Cast Featured: ${castPromptParts.join(', ')}\n`;
        }
        if (charInfoDirectives.length > 0) {
            prompt += `${charInfoDirectives.join('\n')}\n`;
        }
        prompt += `Scene Action: ${frame.action || 'No description'}\n`;
        prompt += `Visual Clash Boundary: Preserve individual medium laws strictly, zero color bleeding at line limits.`;

        this.generatedPromptSpell.textContent = prompt;
    }

    copyPromptSpell() {
        if (this.generatedPromptSpell) {
            navigator.clipboard.writeText(this.generatedPromptSpell.textContent).then(() => {
                alert("📋 تم نسخ تعويذة التوليد الفنية لـ Google Flow بنجاح! الصقها مباشرة في مربع التوليد.");
            });
        }
    }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new StoryStudioPlanner();
});
