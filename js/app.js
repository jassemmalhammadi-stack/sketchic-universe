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

        // Initial Scenarios Database presets
        const defaultScenarios = [
            {
                id: 'scenario-1',
                title: 'تصدعات البعد الحبري (Manga Ink Fracture)',
                schoolId: 'school-1',
                script: 'المشهد الأول: زين يقف عند حافة المدينة ممسكاً بريشته المعدنية. السماء المسطحة تبدأ في التصدع وتتساقط منها رقاقات كرتونية مهتزة.'
            }
        ];

        // Load databases from localStorage or defaults
        this.schools = JSON.parse(localStorage.getItem('sketchic_schools')) || defaultSchools;
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

        // Scenario inputs
        this.scenarioEditId = document.getElementById('scenario-edit-id');
        this.scenarioTitle = document.getElementById('scenario-title');
        this.scenarioSchoolSelect = document.getElementById('scenario-school');
        this.scenarioScript = document.getElementById('scenario-script');
        this.scenariosList = document.getElementById('scenarios-list');
        this.scenarioFormTitle = document.getElementById('scenario-form-title');
        this.scenarioPromptOutput = document.getElementById('scenario-prompt-output');
    }

    bindEvents() {
        // Nothing complex, all tied to global helper methods
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
        localStorage.setItem('sketchic_scenarios', JSON.stringify(this.scenarios));
    }

    // Render databases lists & select menus
    renderAll() {
        this.renderSchoolsList();
        this.renderScenariosList();
        this.populateSchoolsDropdown();
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

    // Scenarios Actions
    populateSchoolsDropdown() {
        if (!this.scenarioSchoolSelect) return;
        const currentVal = this.scenarioSchoolSelect.value;
        this.scenarioSchoolSelect.innerHTML = '<option value="">-- اختر مدرسة فنية --</option>';

        this.schools.forEach(school => {
            const opt = document.createElement('option');
            opt.value = school.id;
            opt.textContent = school.name;
            this.scenarioSchoolSelect.appendChild(opt);
        });

        this.scenarioSchoolSelect.value = currentVal;
    }

    renderScenariosList() {
        if (!this.scenariosList) return;
        this.scenariosList.innerHTML = "";

        if (this.scenarios.length === 0) {
            this.scenariosList.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 15px; font-size: 0.8rem;">لا توجد سيناريوهات مسجلة حالياً.</div>`;
            return;
        }

        this.scenarios.forEach(scen => {
            const school = this.schools.find(s => s.id === scen.schoolId);
            const schoolName = school ? school.name : "أسلوب غير محدد";
            const row = document.createElement('div');
            row.className = 'item-row';
            row.innerHTML = `
                <div class="item-info">
                    <h4>${scen.title}</h4>
                    <p style="color: var(--color-cyan); font-weight: bold; margin-top: 2px;">المدرسة: ${schoolName}</p>
                    <p>${scen.script.substring(0, 100)}...</p>
                </div>
                <div class="item-actions">
                    <button class="btn-action btn-edit" onclick="window.app.editScenario('${scen.id}')">تعديل</button>
                    <button class="btn-action btn-delete" onclick="window.app.deleteScenario('${scen.id}')">حذف</button>
                </div>
            `;
            this.scenariosList.appendChild(row);
        });
    }

    saveScenario() {
        const id = this.scenarioEditId.value;
        const title = this.scenarioTitle.value.trim();
        const schoolId = this.scenarioSchoolSelect.value;
        const script = this.scenarioScript.value.trim();

        if (!title || !schoolId || !script) {
            alert("يرجى تعبئة جميع الحقول المطلوبة!");
            return;
        }

        const newScenario = { id: id || 'scenario-' + Date.now(), title, schoolId, script };

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
        this.scenarioScript.value = scen.script;

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
        this.scenarioScript.value = "";
        this.updateScenarioPreview();
    }

    // Real-time generator of prompt spell for Google Flow
    updateScenarioPreview() {
        if (!this.scenarioPromptOutput) return;

        const title = this.scenarioTitle.value.trim() || 'سيناريو غير مسمى';
        const schoolId = this.scenarioSchoolSelect.value;
        const script = this.scenarioScript.value.trim();

        if (!schoolId || !script) {
            this.scenarioPromptOutput.textContent = "قم بتعبئة نص السيناريو واختيار المدرسة الفنية لتركيب الموجه...";
            return;
        }

        const school = this.schools.find(s => s.id === schoolId);
        const schoolName = school ? school.name : 'أصل غير محدد';
        const schoolDesc = school ? school.desc : '';

        let prompt = `[Google Flow Prompt Spell - Story Studio Planner]\n`;
        prompt += `Project Title: ${title}\n`;
        prompt += `Style & Medium Rules: ${schoolName} (${schoolDesc})\n\n`;
        prompt += `Script Story / Action Plan:\n${script}\n\n`;
        prompt += `Visual Clash Boundary Directive: Zero color bleeding. Preserve precise G-pen outlines or thick classical oil brushstrokes on contacts.`;

        this.scenarioPromptOutput.textContent = prompt;
    }

    copyScenarioPrompt() {
        if (this.scenarioPromptOutput) {
            navigator.clipboard.writeText(this.scenarioPromptOutput.textContent).then(() => {
                alert("📋 تم نسخ موجه التوليد لـ Google Flow بنجاح! الصقه مباشرة في Story Studio.");
            });
        }
    }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new DoubleDatabaseApp();
});
