// مساعد الإنتاج الكوني - سكتشيك & Google Flow
class CosmicWizardApp {
    constructor() {
        this.currentStep = 1;
        this.initElements();
        this.bindEvents();
        this.updateUI();
    }

    initElements() {
        // Step Cards
        this.stepCards = [
            document.getElementById('step-1-card'),
            document.getElementById('step-2-card'),
            document.getElementById('step-3-card'),
            document.getElementById('step-4-card')
        ];

        // Step Indicators
        this.stepIndicators = document.querySelectorAll('.step-indicator');
        this.progressLine = document.getElementById('progress-line');

        // Navigation Buttons
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');

        // Form Inputs
        this.charNameInput = document.getElementById('char-name');
        this.charSchoolSelect = document.getElementById('char-school');
        this.charPsychologySelect = document.getElementById('char-psychology');
        
        this.voiceSpeakerSelect = document.getElementById('voice-speaker');
        this.voiceDialogueInput = document.getElementById('voice-dialogue');
        
        this.sceneActionInput = document.getElementById('scene-action');

        // Prompt Outputs
        this.promptIdentityText = document.getElementById('prompt-identity-text');
        this.promptVoiceText = document.getElementById('prompt-voice-text');
        this.promptSceneText = document.getElementById('prompt-scene-text');
    }

    bindEvents() {
        const inputs = [
            this.charNameInput, this.charSchoolSelect, this.charPsychologySelect,
            this.voiceSpeakerSelect, this.voiceDialogueInput, this.sceneActionInput
        ];

        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.generatePrompts());
                input.addEventListener('change', () => this.generatePrompts());
            }
        });
    }

    updateUI() {
        // Show/hide step cards
        this.stepCards.forEach((card, idx) => {
            if (card) {
                if (idx + 1 === this.currentStep) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            }
        });

        // Update step indicators
        this.stepIndicators.forEach((indicator, idx) => {
            const stepNum = idx + 1;
            indicator.classList.remove('active', 'completed');
            if (stepNum === this.currentStep) {
                indicator.classList.add('active');
            } else if (stepNum < this.currentStep) {
                indicator.classList.add('completed');
            }
        });

        // Update progress bar line width
        const totalSteps = this.stepCards.length;
        const progressPercent = ((this.currentStep - 1) / (totalSteps - 1)) * 100;
        if (this.progressLine) {
            this.progressLine.style.width = `${progressPercent}%`;
        }

        // Show/hide buttons
        if (this.btnPrev) {
            this.btnPrev.style.display = this.currentStep > 1 ? 'block' : 'none';
        }
        if (this.btnNext) {
            if (this.currentStep === totalSteps) {
                this.btnNext.style.display = 'none';
            } else {
                this.btnNext.style.display = 'block';
                this.btnNext.textContent = this.currentStep === totalSteps - 1 ? 'إنهاء وحفظ 🏁' : 'التالي ⬅️';
            }
        }

        this.generatePrompts();
    }

    nextStep() {
        if (this.currentStep < this.stepCards.length) {
            this.currentStep++;
            this.updateUI();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
        }
    }

    resetWizard() {
        this.currentStep = 1;
        this.charNameInput.value = "آرا الهجينة";
        this.charSchoolSelect.selectedIndex = 0;
        this.charPsychologySelect.selectedIndex = 0;
        this.voiceSpeakerSelect.selectedIndex = 0;
        this.voiceDialogueInput.value = "[thoughtful] هل أنا مجرد خطوط يرسمها شخص آخر؟ [sighs] أخشى الفناء.";
        this.sceneActionInput.value = "الشخصية تقف عند خط التماس البصري، خطوط الحبر ترفض الذوبان في بحيرة الزيت الكلاسيكي المجاورة لها.";
        this.updateUI();
    }

    generatePrompts() {
        const charName = this.charNameInput.value || "شخصية غير مسماة";
        const charSchool = this.charSchoolSelect.options[this.charSchoolSelect.selectedIndex].text;
        const charPsychology = this.charPsychologySelect.options[this.charPsychologySelect.selectedIndex].text;
        const voiceSpeaker = this.voiceSpeakerSelect.value;
        const voiceDialogue = this.voiceDialogueInput.value;
        const sceneAction = this.sceneActionInput.value;

        // Step 1: Character identity prompt
        if (this.promptIdentityText) {
            this.promptIdentityText.textContent = `[Google Flow Character Ingredient]\nName: ${charName}\nArt School: ${charSchool}\nCharacter Info (Psychology): ${charPsychology}\nConsistency Directive: Do not blend this character's lines with backgrounds. Render strictly within the artistic school rules.`;
        }

        // Step 2: Voice prompt
        if (this.promptVoiceText) {
            this.promptVoiceText.textContent = `[Google Flow Custom TTS Input]\nSpeaker: ${voiceSpeaker}\nExpressive Dialogue Script: ${voiceDialogue}\nAmbiance Setting: Match character physics & visual art medium friction sounds.`;
        }

        // Step 3: Scene prompt
        if (this.promptSceneText) {
            this.promptSceneText.textContent = `[Google Flow Veo 3.1 Scene Prompt]\nCharacter: ${charName} (${charSchool})\nAction: ${sceneAction}\nVisual Clash Boundary: Perfect preservation of original medium differences. No color mixing, sharp edge separation.`;
        }
    }

    copyText(elementId) {
        const textElement = document.getElementById(elementId);
        if (textElement) {
            navigator.clipboard.writeText(textElement.textContent).then(() => {
                alert("📋 تم نسخ النص الحاكم بنجاح! يمكنك الآن لصقه مباشرة في أداة الإنتاج.");
            }).catch(err => {
                console.error("فشل نسخ النص: ", err);
            });
        }
    }
}

// Start application
window.addEventListener('DOMContentLoaded', () => {
    window.app = new CosmicWizardApp();
});
