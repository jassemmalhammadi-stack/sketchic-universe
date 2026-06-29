// مخطط الأرشيف الكوني - سكتشيك & Google Flow
class DoubleDatabaseApp {
    constructor() {
        this.currentTab = 'schools';
        
        // Initial Art Schools Database presets
        const defaultSchools = [
            {
                id: 'school-1',
                name: '✒️ Manga Ink / G-Pen',
                desc: 'Traditional Japanese manga look. Dark solid ink contour lines, screentone dots for shading, high dynamic speed lines in action shots, monochrome paper texture. Animated strictly at 12fps.'
            },
            {
                id: 'school-2',
                name: '🎨 Classical Oil / Renaissance',
                desc: 'Rich impasto canvas texture, visible thick oil brushstrokes, dramatic chiaroscuro high-contrast lighting, volumetric shadow depth. Slow-paced fluid camera motion rendered at 60fps.'
            },
            {
                id: 'school-3',
                name: '✏️ Graphite Pencil Sketch',
                desc: 'Loose graphite sketch outlines, visible cross-hatching shades, fragile charcoal powder textures. Delicate lines prone to erasing effects.'
            }
        ];

        // Initial Characters Database presets
        const defaultCharacters = [
            {
                id: 'char-1',
                name: 'كينجي (Kenji)',
                schoolId: 'school-1',
                voiceSpec: 'صوت رجولي عميق وحاد بنبرة بطل انمي جاد',
                psychologyPreset: 'stoic',
                charInfo: 'He possesses a stoic, observant nature that masks a volatile reflex for combat. Kenji rarely speaks, preferring to analyze his surroundings with a calculated, cold detachment. He is driven by a rigid sense of personal debt and a quiet ferocity that only surfaces when his autonomy is threatened.'
            },
            {
                id: 'char-2',
                name: 'آرا الهجينة (Ara)',
                schoolId: 'school-2',
                voiceSpec: 'صوت نسائي وقور وناعم ذو بريق عميق كلاسيكي',
                psychologyPreset: 'dread',
                charInfo: 'She experiences continuous existential dread, knowing she is a drawn being in a fragile world. She speaks with a soft, trembling whisper and moves deliberately to preserve her thick impasto oil coat from being erased.'
            }
        ];

        // Initial Scenarios Database presets
        const defaultScenarios = [
            {
                id: 'scenario-1',
                title: 'نشوء الحدود الحبرية (Genesis of Ink)',
                schoolId: 'school-1',
                act: 'act1',
                order: 1,
                charIds: ['char-1'],
                script: 'المشهد الأول: كينجي يراقب ولادة الحدود الحبرية على صفحة ورقية بيضاء لانهائية.'
            },
            {
                id: 'scenario-2',
                title: 'تصدعات البعد الحبري (Manga Ink Fracture)',
                schoolId: 'school-1',
                act: 'act2',
                order: 1,
                charIds: ['char-1', 'char-2'],
                script: 'المشهد الثاني: كينجي يواجه آرا الهجينة عند خط التماس المشتعل. السماء تبدأ في التصدع وتتساقط منها رقاقات كرتونية.'
            }
        ];

        // Load databases from localStorage or defaults
        this.schools = JSON.parse(localStorage.getItem('sketchic_schools')) || defaultSchools;
        this.characters = JSON.parse(localStorage.getItem('sketchic_characters')) || defaultCharacters;
        this.scenarios = JSON.parse(localStorage.getItem('sketchic_scenarios')) || defaultScenarios;

        this.initElements();
        this.bindEvents();
        this.renderAll();
    }

    initElements() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabPanes = document.querySelectorAll('.tab-pane');

        // School inputs
        this.schoolEditId = document.getElementById('school-edit-id');
        this.schoolName = document.getElementById('school-name');
        this.schoolDesc = document.getElementById('school-desc');
        this.schoolsList = document.getElementById('schools-list');
        this.schoolFormTitle = document.getElementById('school-form-title');

        // Character inputs
        this.characterEditId = document.getElementById('character-edit-id');
        this.charName = document.getElementById('char-name');
        this.charSchoolSelect = document.getElementById('char-school');
        this.charVoiceSpec = document.getElementById('char-voice-spec');
        this.charPsychologyPreset = document.getElementById('char-psychology-preset');
        this.charInfoText = document.getElementById('char-info-text');
        this.charactersList = document.getElementById('characters-list');
        this.characterFormTitle = document.getElementById('character-form-title');

        // Scenario inputs
        this.scenarioEditId = document.getElementById('scenario-edit-id');
        this.scenarioTitle = document.getElementById('scenario-title');
        this.scenarioSchoolSelect = document.getElementById('scenario-school');
        this.scenarioActSelect = document.getElementById('scenario-act');
        this.scenarioOrderInput = document.getElementById('scenario-order');
        this.scenarioCharsContainer = document.getElementById('scenario-chars-container');
        this.scenarioScript = document.getElementById('scenario-script');
        this.scenariosList = document.getElementById('scenarios-list');
        this.scenarioFormTitle = document.getElementById('scenario-form-title');
        this.scenarioPromptOutput = document.getElementById('scenario-prompt-output');
        this.dynamicCharactersOutputContainer = document.getElementById('dynamic-characters-output-container');
    }

    bindEvents() {
        // Tied to global app
    }

    // Tab switcher
    switchTab(tabId) {
        this.currentTab = tabId;
        this.tabBtns.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        this.tabPanes.forEach(pane => {
            if (pane.id === `tab-${tabId}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
        this.renderAll();
    }

    // Save databases
    saveToStorage() {
        localStorage.setItem('sketchic_schools', JSON.stringify(this.schools));
        localStorage.setItem('sketchic_characters', JSON.stringify(this.characters));
        localStorage.setItem('sketchic_scenarios', JSON.stringify(this.scenarios));
    }

    // Render databases lists & select menus
    renderAll() {
        this.renderSchoolsList();
        this.renderCharactersList();
        this.renderScenariosList();
        this.populateSchoolsDropdowns();
        this.populateScenarioCharactersCheckboxes();
        this.updateScenarioPreview();
    }

    // Art Schools Actions
    renderSchoolsList() {
        if (!this.schoolsList) return;
        this.schoolsList.innerHTML = "";

        if (this.schools.length === 0) {
            this.schoolsList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 15px; font-size: 0.8rem;">لا توجد مدارس فنية مسجلة حالياً.</div>`;
            return;
        }

        this.schools.forEach(school => {
            const row = document.createElement('div');
            row.className = 'item-row';
            row.innerHTML = `
                <div class="item-info">
                    <h4>${school.name}</h4>
                    <p>${school.desc}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-action btn-edit" onclick="window.app.editSchool('${school.id}')">تعديل</button>
                    <button class="btn-action btn-delete" onclick="window.app.deleteSchool('${school.id}')">حذف</button>
                </div>
            `;
            this.schoolsList.appendChild(row);
        });
    }

    autofillSchoolSpecs() {
        const name = this.schoolName.value.trim().toLowerCase();
        let desc = "";

        if (name.includes('cyber') || name.includes('neon') || name.includes('رقمي')) {
            desc = "Digital vectors, high-contrast neon lighting with cyan and magenta bloom. Extremely clean outline strokes, mathematical grid coordinate background.";
        } else if (name.includes('clash') || name.includes('صدام') || name.includes('هجين')) {
            desc = "Visual clash style representing two styles colliding (Manga and Classical Oil) separated by a glowing line boundary without blending colors.";
        } else if (name.includes('manga') || name.includes('ink') || name.includes('حبر')) {
            desc = "Traditional Japanese manga look. Dark solid ink contour lines, screentone dots for shading, high dynamic speed lines in action shots, monochrome paper texture. Animated strictly at 12fps.";
        } else if (name.includes('oil') || name.includes('renaissance') || name.includes('زيتي')) {
            desc = "Impasto canvas texture, rich oil brushstrokes, dramatic chiaroscuro high-contrast lighting, volumetric shadow depth. Slow-paced fluid camera motion rendered at 60fps.";
        } else if (name.includes('pencil') || name.includes('sketch') || name.includes('رصاص')) {
            desc = "Loose graphite sketch outlines, visible cross-hatching shades, fragile charcoal powder textures. Delicate lines prone to erasing effects.";
        } else {
            desc = "Custom visual style specifications. Detailed lighting, medium physics, and edge settings for Google Flow.";
        }

        if (this.schoolDesc) this.schoolDesc.value = desc;
    }

    saveSchool() {
        const id = this.schoolEditId.value;
        const name = this.schoolName.value.trim();
        const desc = this.schoolDesc.value.trim();

        if (!name || !desc) {
            alert("يرجى تعبئة جميع الحقول المطلوبة!");
            return;
        }

        const newSchool = { id: id || 'school-' + Date.now(), name, desc };

        if (id) {
            this.schools = this.schools.map(s => s.id === id ? newSchool : s);
        } else {
            this.schools.push(newSchool);
        }

        this.saveToStorage();
        this.clearSchoolForm();
        this.renderAll();
    }

    editSchool(id) {
        const school = this.schools.find(s => s.id === id);
        if (!school) return;

        this.schoolFormTitle.textContent = "تعديل المدرسة الفنية";
        this.schoolEditId.value = school.id;
        this.schoolName.value = school.name;
        this.schoolDesc.value = school.desc;
    }

    deleteSchool(id) {
        if (confirm("هل أنت متأكد من حذف هذه المدرسة الفنية؟ سيتأثر أي سيناريو مرتبط بها.")) {
            this.schools = this.schools.filter(s => s.id !== id);
            this.saveToStorage();
            this.renderAll();
        }
    }

    clearSchoolForm() {
        this.schoolFormTitle.textContent = "إضافة مدرسة فنية جديدة";
        this.schoolEditId.value = "";
        this.schoolName.value = "";
        this.schoolDesc.value = "";
    }

    // Populate dropdowns
    populateSchoolsDropdowns() {
        const dropdowns = [this.charSchoolSelect, this.scenarioSchoolSelect];
        dropdowns.forEach(dropdown => {
            if (!dropdown) return;
            const currentVal = dropdown.value;
            dropdown.innerHTML = '<option value="">-- اختر مدرسة فنية --</option>';

            this.schools.forEach(school => {
                const opt = document.createElement('option');
                opt.value = school.id;
                opt.textContent = school.name;
                dropdown.appendChild(opt);
            });

            dropdown.value = currentVal;
        });
    }

    // Characters Actions
    renderCharactersList() {
        if (!this.charactersList) return;
        this.charactersList.innerHTML = "";

        if (this.characters.length === 0) {
            this.charactersList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 15px; font-size: 0.8rem;">لا توجد شخصيات مسجلة حالياً.</div>`;
            return;
        }

        this.characters.forEach(char => {
            const school = this.schools.find(s => s.id === char.schoolId);
            const schoolName = school ? school.name : "أسلوب غير محدد";
            const row = document.createElement('div');
            row.className = 'item-row';
            row.innerHTML = `
                <div class="item-info">
                    <h4>${char.name}</h4>
                    <p style="color: var(--color-cyan); font-weight: bold; margin-top: 2px;">المدرسة: ${schoolName}</p>
                    <p>صوت: ${char.voiceSpec}</p>
                    <p style="font-style: italic; color: var(--text-secondary);">${char.charInfo.substring(0, 100)}...</p>
                </div>
                <div class="item-actions">
                    <button class="btn-action btn-edit" onclick="window.app.editCharacter('${char.id}')">تعديل</button>
                    <button class="btn-action btn-delete" onclick="window.app.deleteCharacter('${char.id}')">حذف</button>
                </div>
            `;
            this.charactersList.appendChild(row);
        });
    }

    autofillCharacterInfo() {
        const name = this.charName.value.trim() || 'Kenji';
        const preset = this.charPsychologyPreset.value;
        let info = "";

        if (preset === 'stoic') {
            info = `He possesses a stoic, observant nature that masks a volatile reflex for combat. ${name} rarely speaks, preferring to analyze his surroundings with a calculated, cold detachment. He is driven by a rigid sense of personal debt and a quiet ferocity that only surfaces when his autonomy is threatened.`;
        } else if (preset === 'dread') {
            info = `Highly emotional and experiences continuous existential dread. ${name} feels a lingering sadness, knowing they are a transient graphite drawing that can be easily erased by the cosmic eraser. Speaks in a soft, trembling whisper.`;
        } else if (preset === 'keeper') {
            info = `A fierce and stubborn protector of visual purity. ${name} hates the blending of colors or the touch of foreign brushstrokes. Stands firmly with sharp G-pen outlines and demands physical distance at style boundaries.`;
        } else if (preset === 'hybrid') {
            info = `A volatile glitch hybrid character composed of fragmented vector lines and heavy classical canvas paint layers. Speaks with a double-layered voice, constantly shifting between 12fps and 60fps motions.`;
        }

        if (this.charInfoText) this.charInfoText.value = info;
    }

    saveCharacter() {
        const id = this.characterEditId.value;
        const name = this.charName.value.trim();
        const schoolId = this.charSchoolSelect.value;
        const voiceSpec = this.charVoiceSpec.value.trim();
        const psychologyPreset = this.charPsychologyPreset.value;
        const charInfo = this.charInfoText.value.trim();

        if (!name || !schoolId || !voiceSpec || !charInfo) {
            alert("يرجى تعبئة جميع الحقول المطلوبة للشخصية!");
            return;
        }

        const newChar = { id: id || 'char-' + Date.now(), name, schoolId, voiceSpec, psychologyPreset, charInfo };

        if (id) {
            this.characters = this.characters.map(c => c.id === id ? newChar : c);
        } else {
            this.characters.push(newChar);
        }

        this.saveToStorage();
        this.clearCharacterForm();
        this.renderAll();
    }

    editCharacter(id) {
        const char = this.characters.find(c => c.id === id);
        if (!char) return;

        this.characterFormTitle.textContent = "تعديل الشخصية";
        this.characterEditId.value = char.id;
        this.charName.value = char.name;
        this.charSchoolSelect.value = char.schoolId;
        this.charVoiceSpec.value = char.voiceSpec;
        this.charPsychologyPreset.value = char.psychologyPreset || 'stoic';
        this.charInfoText.value = char.charInfo;
    }

    deleteCharacter(id) {
        if (confirm("هل أنت متأكد من حذف هذه الشخصية؟")) {
            this.characters = this.characters.filter(c => c.id !== id);
            this.saveToStorage();
            this.renderAll();
        }
    }

    clearCharacterForm() {
        this.characterFormTitle.textContent = "إضافة شخصية جديدة";
        this.characterEditId.value = "";
        this.charName.value = "";
        this.charSchoolSelect.value = "";
        this.charVoiceSpec.value = "صوت رجولي عميق وحاد بنبرة بطل انمي جاد";
        this.charPsychologyPreset.value = "stoic";
        this.charInfoText.value = "";
    }

    // Scenarios Actions
    populateScenarioCharactersCheckboxes() {
        if (!this.scenarioCharsContainer) return;
        this.scenarioCharsContainer.innerHTML = "";

        if (this.characters.length === 0) {
            this.scenarioCharsContainer.innerHTML = '<div style="color: var(--text-secondary); font-size: 0.75rem;">قم بإضافة شخصيات أولاً في علامة التبويب المخصصة.</div>';
            return;
        }

        this.characters.forEach(char => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            label.innerHTML = `
                <input type="checkbox" name="scenario-char-checkbox" value="${char.id}">
                <span>${char.name}</span>
            `;
            this.scenarioCharsContainer.appendChild(label);
        });
    }

    renderScenariosList() {
        if (!this.scenariosList) return;
        this.scenariosList.innerHTML = "";

        const acts = {
            act1: { title: "الفصل الأول: التمهيد ونشوء الخطوط (Act I)", class: "act-title-1" },
            act2: { title: "الفصل الثاني: تداخل الأنماط والصدام (Act II)", class: "act-title-2" },
            act3: { title: "الفصل الثالث: المحو المطلق والوفاق (Act III)", class: "act-title-3" }
        };

        Object.keys(acts).forEach(actKey => {
            // Filter and sort scenarios inside this act
            const actScenarios = this.scenarios
                .filter(s => s.act === actKey)
                .sort((a, b) => (a.order || 1) - (b.order || 1));

            if (actScenarios.length > 0) {
                const block = document.createElement('div');
                block.className = 'act-group-block';
                block.innerHTML = `<span class="act-group-title ${acts[actKey].class}">${acts[actKey].title}</span>`;

                const listContainer = document.createElement('div');
                listContainer.className = 'items-list';

                actScenarios.forEach(scen => {
                    const school = this.schools.find(s => s.id === scen.schoolId);
                    const schoolName = school ? school.name : "أسلوب غير محدد";
                    const row = document.createElement('div');
                    row.className = 'item-row';
                    row.innerHTML = `
                        <div class="item-info">
                            <h4>[#${scen.order || 1}] ${scen.title}</h4>
                            <p style="color: var(--color-cyan); font-weight: bold; margin-top: 2px;">الأسلوب: ${schoolName}</p>
                            <p>${scen.script.substring(0, 80)}...</p>
                        </div>
                        <div class="item-actions">
                            <button class="btn-action btn-edit" onclick="window.app.editScenario('${scen.id}')">تعديل</button>
                            <button class="btn-action btn-delete" onclick="window.app.deleteScenario('${scen.id}')">حذف</button>
                        </div>
                    `;
                    listContainer.appendChild(row);
                });

                block.appendChild(listContainer);
                this.scenariosList.appendChild(block);
            }
        });

        const totalScenarios = this.scenarios.length;
        if (totalScenarios === 0) {
            this.scenariosList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 15px; font-size: 0.8rem;">لا توجد سيناريوهات مسجلة حالياً.</div>`;
        }
    }

    saveScenario() {
        const id = this.scenarioEditId.value;
        const title = this.scenarioTitle.value.trim();
        const schoolId = this.scenarioSchoolSelect.value;
        const act = this.scenarioActSelect.value;
        const order = parseInt(this.scenarioOrderInput.value) || 1;
        const script = this.scenarioScript.value.trim();

        // Gather checked character IDs
        const checkboxes = this.scenarioCharsContainer.querySelectorAll('input[name="scenario-char-checkbox"]:checked');
        const charIds = Array.from(checkboxes).map(cb => cb.value);

        if (!title || !schoolId || !script) {
            alert("يرجى تعبئة جميع الحقول المطلوبة للسيناريو!");
            return;
        }

        const newScenario = { id: id || 'scenario-' + Date.now(), title, schoolId, act, order, charIds, script };

        if (id) {
            this.scenarios = this.scenarios.map(s => s.id === id ? newScenario : s);
        } else {
            this.scenarios.push(newScenario);
        }

        this.saveToStorage();
        this.clearScenarioForm();
        this.renderAll();
    }

    editScenario(id) {
        const scen = this.scenarios.find(s => s.id === id);
        if (!scen) return;

        this.scenarioFormTitle.textContent = "تعديل السيناريو";
        this.scenarioEditId.value = scen.id;
        this.scenarioTitle.value = scen.title;
        this.scenarioSchoolSelect.value = scen.schoolId;
        this.scenarioActSelect.value = scen.act || 'act1';
        this.scenarioOrderInput.value = scen.order || 1;
        this.scenarioScript.value = scen.script;

        // Reset and check matching character checkboxes
        const checkboxes = this.scenarioCharsContainer.querySelectorAll('input[name="scenario-char-checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = Array.isArray(scen.charIds) && scen.charIds.includes(cb.value);
        });

        this.updateScenarioPreview();
    }

    deleteScenario(id) {
        if (confirm("هل أنت متأكد من حذف هذا السيناريو؟")) {
            this.scenarios = this.scenarios.filter(s => s.id !== id);
            this.saveToStorage();
            this.renderAll();
        }
    }

    clearScenarioForm() {
        this.scenarioFormTitle.textContent = "إضافة سيناريو جديد";
        this.scenarioEditId.value = "";
        this.scenarioTitle.value = "";
        this.scenarioSchoolSelect.value = "";
        this.scenarioActSelect.value = "act1";
        this.scenarioOrderInput.value = "1";
        this.scenarioScript.value = "";
        const checkboxes = this.scenarioCharsContainer.querySelectorAll('input[name="scenario-char-checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        this.updateScenarioPreview();
    }

    // Real-time generator of prompt spells and copying blocks
    updateScenarioPreview() {
        if (!this.scenarioPromptOutput) return;

        const title = this.scenarioTitle.value.trim() || 'سيناريو غير مسمى';
        const schoolId = this.scenarioSchoolSelect.value;
        const script = this.scenarioScript.value.trim();

        if (!schoolId || !script) {
            this.scenarioPromptOutput.textContent = "قم بتعبئة نص السيناريو واختيار المدرسة الفنية لتركيب الموجه...";
            if (this.dynamicCharactersOutputContainer) this.dynamicCharactersOutputContainer.innerHTML = "";
            return;
        }

        const school = this.schools.find(s => s.id === schoolId);
        const schoolName = school ? school.name : 'أصل غير محدد';
        const schoolDesc = school ? school.desc : '';

        // Generate Script Prompt Spell
        let prompt = `[Google Flow Prompt Spell - Story Studio Planner]\n`;
        prompt += `Project Title: ${title}\n`;
        prompt += `Style & Medium Rules: ${schoolName} (${schoolDesc})\n\n`;
        prompt += `Script Story / Action Plan:\n${script}\n\n`;
        prompt += `Visual Clash Boundary Directive: Zero color bleeding. Preserve precise outlines or brushstrokes.`;

        this.scenarioPromptOutput.textContent = prompt;

        // Generate Character Info & Voice Specs output cards
        if (this.dynamicCharactersOutputContainer) {
            this.dynamicCharactersOutputContainer.innerHTML = "";
            
            const checkedCbs = this.scenarioCharsContainer.querySelectorAll('input[name="scenario-char-checkbox"]:checked');
            const selectedCharIds = Array.from(checkedCbs).map(cb => cb.value);

            selectedCharIds.forEach(cid => {
                const char = this.characters.find(c => c.id === cid);
                if (char) {
                    const block = document.createElement('div');
                    block.className = 'output-box';
                    block.style.marginTop = '10px';
                    block.style.border = '1px dashed rgba(6, 182, 212, 0.4)';
                    
                    const charInfoId = `char-info-out-${char.id}`;
                    const charVoiceId = `char-voice-out-${char.id}`;

                    block.innerHTML = `
                        <div style="font-weight: bold; font-size: 0.82rem; color: var(--color-cyan); margin-bottom: 8px;">👤 الشخصية: ${char.name}</div>
                        
                        <div class="output-title">أ. بصمة الصوت المخصصة (Custom Voice Specification)</div>
                        <div class="output-text" id="${charVoiceId}">${char.name} - ${char.voiceSpec}</div>
                        <button type="button" class="btn" style="width: 100%; font-size: 0.72rem; padding: 4px; margin-bottom: 10px;" onclick="window.app.copyText('${charVoiceId}')">نسخ مواصفات الصوت 📋</button>
                        
                        <div class="output-title">ب. نواة الشخصية [Character Info (optional)]</div>
                        <div class="output-text" id="${charInfoId}">${char.charInfo}</div>
                        <button type="button" class="btn btn-primary" style="width: 100%; font-size: 0.72rem; padding: 4px;" onclick="window.app.copyText('${charInfoId}')">نسخ Character Info لـ Google Flow 📋</button>
                    `;
                    this.dynamicCharactersOutputContainer.appendChild(block);
                }
            });
        }
    }

    copyText(elementId) {
        const textElement = document.getElementById(elementId);
        if (textElement) {
            navigator.clipboard.writeText(textElement.textContent).then(() => {
                alert("📋 تم نسخ النص بنجاح! يمكنك الآن لصقه مباشرة في الخانة المطلوبة بـ Google Flow.");
            });
        }
    }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new DoubleDatabaseApp();
});
