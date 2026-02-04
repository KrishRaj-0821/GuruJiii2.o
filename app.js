// Global App State Management
class StudyPlannerApp {
    constructor() {
        this.data = this.loadData();
        this.currentStep = 1;
        this.totalSteps = 6;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        
        // Ensure validation runs after a short delay
        setTimeout(() => {
            this.validateCurrentStep();
        }, 300);
    }

    // Data Management
    loadData() {
        const saved = localStorage.getItem('studyPlannerData');
        return saved ? JSON.parse(saved) : {
            subjects: [],
            deadlines: [],
            pace: 'medium',
            hoursPerDay: 4,
            preferredTime: 'morning',
            breakDuration: 15,
            revisionFreq: 'weekly'
        };
    }

    saveData() {
        localStorage.setItem('studyPlannerData', JSON.stringify(this.data));
    }

    // Navigation
    setupEventListeners() {
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked, current step:', this.getCurrentStep());
                this.goNext();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Back button clicked, current step:', this.getCurrentStep());
                this.goBack();
            });
        }

        // Auto-save on input changes
        document.addEventListener('input', () => {
            this.collectCurrentPageData();
            this.validateCurrentStep();
        });

        document.addEventListener('change', () => {
            this.collectCurrentPageData();
            this.validateCurrentStep();
        });
    }

    getCurrentStep() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || path;
        
        const stepMap = {
            'syllabus.html': 1,
            'deadlines.html': 2,
            'learning-pace.html': 3,
            'daily-availability.html': 4,
            'study-preferences.html': 5,
            'review.html': 6,
            'dashboard.html': 7
        };
        
        // Also check full paths for compatibility
        const fullPathMap = {
            '/pages/syllabus.html': 1,
            '/pages/deadlines.html': 2,
            '/pages/learning-pace.html': 3,
            '/pages/daily-availability.html': 4,
            '/pages/study-preferences.html': 5,
            '/pages/review.html': 6,
            '/pages/dashboard.html': 7
        };
        
        return stepMap[filename] || fullPathMap[path] || 1;
    }

    updateProgress() {
        const currentStep = this.getCurrentStep();
        const progressBar = document.getElementById('progressBar');
        const stepIndicator = document.getElementById('stepIndicator');
        
        if (progressBar) {
            const percentage = ((currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressBar.style.width = `${percentage}%`;
        }
        
        if (stepIndicator) {
            if (currentStep <= this.totalSteps) {
                stepIndicator.textContent = `Step ${currentStep} of ${this.totalSteps}`;
            } else {
                stepIndicator.textContent = 'Dashboard';
            }
        }
    }

    goNext() {
        const nextPages = [
            'deadlines.html',           // From syllabus (step 1)
            'learning-pace.html',       // From deadlines (step 2)
            'daily-availability.html',  // From learning-pace (step 3)
            'study-preferences.html',   // From daily-availability (step 4)
            'review.html',              // From study-preferences (step 5)
            'dashboard.html'            // From review (step 6)
        ];

        const currentStep = this.getCurrentStep();
        if (currentStep >= 1 && currentStep <= 6) {
            this.navigateWithTransition(nextPages[currentStep - 1]);
        }
    }

    goBack() {
        const prevPages = [
            null,
            'syllabus.html',
            'deadlines.html',
            'learning-pace.html', 
            'daily-availability.html',
            'study-preferences.html',
            'review.html'
        ];

        const currentStep = this.getCurrentStep();
        if (currentStep > 1 && prevPages[currentStep - 1]) {
            this.navigateWithTransition(prevPages[currentStep - 1]);
        }
    }

    navigateWithTransition(url) {
        console.log('Navigating to:', url);
        
        // Validate URL
        if (!url) {
            console.error('Invalid URL for navigation');
            return;
        }
        
        // Add exit animation
        document.body.classList.add('page-exit');
        
        setTimeout(() => {
            try {
                window.location.href = url;
            } catch (error) {
                console.error('Navigation error:', error);
                // Fallback: remove exit animation if navigation fails
                document.body.classList.remove('page-exit');
            }
        }, 200);
    }

    // Validation
    validateCurrentStep() {
        const currentStep = this.getCurrentStep();
        const nextBtn = document.getElementById('nextBtn');
        
        console.log('Validating step:', currentStep);
        
        if (!nextBtn) {
            console.log('Next button not found');
            return;
        }

        let isValid = false;

        switch (currentStep) {
            case 1: // Syllabus
                isValid = this.validateSyllabus();
                break;
            case 2: // Deadlines
                isValid = this.validateDeadlines();
                break;
            case 3: // Learning Pace
                isValid = this.validateLearningPace();
                break;
            case 4: // Daily Availability
                isValid = this.validateDailyAvailability();
                break;
            case 5: // Study Preferences
                isValid = this.validateStudyPreferences();
                break;
            case 6: // Review
                isValid = true;
                break;
            default:
                isValid = true;
        }

        console.log('Step', currentStep, 'is valid:', isValid);
        
        nextBtn.disabled = !isValid;
        nextBtn.classList.toggle('disabled', !isValid);
    }

    validateSyllabus() {
        const subjects = document.querySelectorAll('.subject-card');
        let hasValidSubject = false;

        console.log('Validating syllabus, found', subjects.length, 'subject cards');

        subjects.forEach(card => {
            const subjectName = card.querySelector('.subject-input')?.value?.trim();
            const topics = card.querySelectorAll('.topic-input');
            let hasValidTopic = false;

            topics.forEach(topic => {
                if (topic.value?.trim()) {
                    hasValidTopic = true;
                }
            });

            console.log('Subject:', subjectName, 'has valid topic:', hasValidTopic);

            if (subjectName && hasValidTopic) {
                hasValidSubject = true;
            }
        });

        console.log('Syllabus validation result:', hasValidSubject);
        return hasValidSubject;
    }

    validateDeadlines() {
        const examDate = document.getElementById('examDate')?.value;
        return !!examDate;
    }

    validateLearningPace() {
        const pace = document.querySelector('input[name="pace"]:checked');
        return !!pace;
    }

    validateDailyAvailability() {
        const hours = document.getElementById('hoursSlider')?.value;
        const time = document.getElementById('preferredTime')?.value;
        return hours && time;
    }

    validateStudyPreferences() {
        const breakDuration = document.getElementById('breakDuration')?.value;
        const revisionFreq = document.getElementById('revisionFreq')?.value;
        return breakDuration && revisionFreq;
    }

    // Data Collection
    collectCurrentPageData() {
        const currentStep = this.getCurrentStep();

        switch (currentStep) {
            case 1:
                this.collectSyllabusData();
                break;
            case 2:
                this.collectDeadlinesData();
                break;
            case 3:
                this.collectLearningPaceData();
                break;
            case 4:
                this.collectDailyAvailabilityData();
                break;
            case 5:
                this.collectStudyPreferencesData();
                break;
        }

        this.saveData();
    }

    collectSyllabusData() {
        const subjects = [];
        const subjectCards = document.querySelectorAll('.subject-card');
        
        subjectCards.forEach(card => {
            const subjectName = card.querySelector('.subject-input')?.value?.trim();
            if (!subjectName) return;
            
            const topics = [];
            const topicRows = card.querySelectorAll('.topic-row');
            
            topicRows.forEach(row => {
                const topicName = row.querySelector('.topic-input')?.value?.trim();
                const difficulty = row.querySelector('.difficulty-select')?.value;
                if (topicName) {
                    topics.push({ name: topicName, difficulty });
                }
            });
            
            if (topics.length > 0) {
                subjects.push({ name: subjectName, topics });
            }
        });

        this.data.subjects = subjects;
    }

    collectDeadlinesData() {
        const deadlines = [];
        const examDate = document.getElementById('examDate')?.value;
        
        if (examDate) {
            deadlines.push({ 
                name: 'Main Exam', 
                date: examDate, 
                type: 'exam' 
            });
        }

        const deadlineRows = document.querySelectorAll('.deadline-row');
        deadlineRows.forEach(row => {
            const name = row.querySelector('.deadline-name')?.value?.trim();
            const date = row.querySelector('.deadline-date')?.value;
            if (name && date) {
                deadlines.push({ name, date, type: 'assignment' });
            }
        });

        this.data.deadlines = deadlines;
    }

    collectLearningPaceData() {
        const pace = document.querySelector('input[name="pace"]:checked')?.value;
        if (pace) {
            this.data.pace = pace;
        }
    }

    collectDailyAvailabilityData() {
        const hours = document.getElementById('hoursSlider')?.value;
        const time = document.getElementById('preferredTime')?.value;
        
        if (hours) this.data.hoursPerDay = parseInt(hours);
        if (time) this.data.preferredTime = time;
    }

    collectStudyPreferencesData() {
        const breakDuration = document.getElementById('breakDuration')?.value;
        const revisionFreq = document.getElementById('revisionFreq')?.value;
        
        if (breakDuration) this.data.breakDuration = parseInt(breakDuration);
        if (revisionFreq) this.data.revisionFreq = revisionFreq;
    }

    // Populate forms with saved data
    populateCurrentPage() {
        const currentStep = this.getCurrentStep();

        switch (currentStep) {
            case 1:
                this.populateSyllabus();
                break;
            case 2:
                this.populateDeadlines();
                break;
            case 3:
                this.populateLearningPace();
                break;
            case 4:
                this.populateDailyAvailability();
                break;
            case 5:
                this.populateStudyPreferences();
                break;
            case 6:
                this.populateReview();
                break;
        }
    }

    populateSyllabus() {
        // Will be implemented in syllabus.html specific code
    }

    populateDeadlines() {
        const examDate = document.getElementById('examDate');
        if (examDate && this.data.deadlines.length > 0) {
            const mainExam = this.data.deadlines.find(d => d.type === 'exam');
            if (mainExam) {
                examDate.value = mainExam.date;
            }
        }
    }

    populateLearningPace() {
        const paceRadio = document.querySelector(`input[name="pace"][value="${this.data.pace}"]`);
        if (paceRadio) {
            paceRadio.checked = true;
        }
    }

    populateDailyAvailability() {
        const hoursSlider = document.getElementById('hoursSlider');
        const hoursValue = document.getElementById('hoursValue');
        const preferredTime = document.getElementById('preferredTime');

        if (hoursSlider) {
            hoursSlider.value = this.data.hoursPerDay;
            if (hoursValue) {
                hoursValue.textContent = `${this.data.hoursPerDay} hour${this.data.hoursPerDay !== 1 ? 's' : ''}`;
            }
        }

        if (preferredTime) {
            preferredTime.value = this.data.preferredTime;
        }
    }

    populateStudyPreferences() {
        const breakDuration = document.getElementById('breakDuration');
        const revisionFreq = document.getElementById('revisionFreq');

        if (breakDuration) {
            breakDuration.value = this.data.breakDuration;
        }

        if (revisionFreq) {
            revisionFreq.value = this.data.revisionFreq;
        }
    }

    populateReview() {
        // Will be implemented in review.html
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing StudyPlannerApp');
    window.studyApp = new StudyPlannerApp();
    
    // Populate current page with saved data
    setTimeout(() => {
        console.log('Populating page data and validating');
        window.studyApp.populateCurrentPage();
        window.studyApp.validateCurrentStep();
    }, 100);
    
    // Add additional debugging
    setTimeout(() => {
        const nextBtn = document.getElementById('nextBtn');
        const backBtn = document.getElementById('backBtn');
        console.log('Button check - Next:', !!nextBtn, 'Back:', !!backBtn);
        if (nextBtn) {
            console.log('Next button disabled:', nextBtn.disabled);
            console.log('Next button classes:', nextBtn.className);
        }
    }, 200);
});