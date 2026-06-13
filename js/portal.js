/* ==========================================
   Sketchic Portal - Public Frontend Viewer
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const portalFrame = document.getElementById('portal-frame');
    
    // Fetch the exported assets JSON
    fetch('public_assets.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Database file not found');
            }
            return response.json();
        })
        .then(assets => {
            renderPortal(assets);
        })
        .catch(err => {
            console.error('Error loading assets database:', err);
            portalFrame.innerHTML = `
                <div class="portal-body">
                    <div class="portal-hero">
                        <h2>بوابة كون سكتشيك السينمائي (Sketchic Portal)</h2>
                        <p>مرحباً بك في البوابة الرسمية لاستكشاف عوالم سكتشيك الفنية التنافسية.</p>
                    </div>
                    <div class="portal-empty-state" style="border-color: var(--color-danger); background-color: rgba(239, 68, 68, 0.02);">
                        <h4 style="color: var(--color-danger);">⚠️ تعذر تحميل البيانات حالياً</h4>
                        <p style="margin-top: 8px;">يرجى التأكد من تصدير الأصول من لوحة التحكم المحلية (Publish) ورفع ملف <code>public_assets.json</code> إلى مستودع GitHub.</p>
                    </div>
                </div>
            `;
        });

    function renderPortal(assets) {
        // Filter out finished assets (just in case)
        const finishedAssets = assets.filter(a => a.status === 'finished');
        
        const creators = finishedAssets.filter(a => a.type === 'creator');
        const scenarios = finishedAssets.filter(a => a.type === 'scenario');
        const characters = finishedAssets.filter(a => a.type === 'character');
        const comics = finishedAssets.filter(a => a.type === 'comic');
        const videos = finishedAssets.filter(a => a.type === 'video');
        const games = finishedAssets.filter(a => a.type === 'game');

        if (finishedAssets.length === 0) {
            portalFrame.innerHTML = `
                <div class="portal-body">
                    <div class="portal-hero">
                        <h2>كون سكتشيك السينمائي (Sketchic Portal)</h2>
                        <p>مرحباً بك في البوابة الرسمية لاستكشاف عوالم سكتشيك الفنية التنافسية.</p>
                    </div>
                    <div class="portal-empty-state">
                        <h4>المعرض فارغ حالياً 🌐</h4>
                        <p>لم يتم نشر أي أصول منتهية للجمهور بعد.</p>
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
                    const cr = finishedAssets.find(a => a.id === c.relatedCreator) || assets.find(a => a.id === c.relatedCreator);
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

        portalFrame.innerHTML = `
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
});
