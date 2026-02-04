class ModernStudyPlanner {
    constructor() {
        this.subjects = [];
        this.deadlines = [];
        this.studyPlan = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSlider();
        this.addInitialEventListeners();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('studyPlanForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateStudyPlan();
        });

        // Add subject
        document.getElementById('addSubject').addEventListener('click', () => {
            this.addSubjectCard();
        });

        // Add deadline
        document.getElementById('addDeadline').addEventListener('click', () => {
            this.addDeadlineRow();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.tab-btn').dataset.tab);
            });
        });
    }

    setupSlider() {
        const slider = document.getElementById('hoursSlider');
        const valueDisplay = document.getElementById('hoursValue');
        
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = `${value} hour${value !== '1' ? 's' : ''}`;
        });
    }

    addInitialEventListeners() {
        // Add topic buttons
        this.setupTopicButtons();
        // Remove topic buttons
        this.setupRemoveButtons();
    }

    setupTopicButtons() {
        document.querySelectorAll('.add-topic-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        document.querySelectorAll('.add-topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addTopicRow(e.target.closest('.subject-card'));
            });
        });
    }

    setupRemoveButtons() {
        document.querySelectorAll('.remove-topic').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.topic-row').remove();
            });
        });

        document.querySelectorAll('.remove-deadline').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.deadline-row').remove();
            });
        });
    }

    addSubjectCard() {
        const container = document.getElementById('syllabusContainer');
        const subjectCard = document.createElement('div');
        subjectCard.className = 'subject-card';
        subjectCard.innerHTML = `
            <input type="text" placeholder="Subject name (e.g., Mathematics)" class="subject-input" required>
            <div class="topics-list">
                <div class="topic-row">
                    <input type="text" placeholder="Topic name" class="topic-input" required>
                    <select class="difficulty-select">
                        <option value="easy">Easy</option>
                        <option value="medium" selected>Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <button type="button" class="remove-topic" title="Remove topic">×</button>
                </div>
            </div>
            <button type="button" class="add-topic-btn">+ Add Topic</button>
        `;
        container.appendChild(subjectCard);
        this.setupTopicButtons();
        this.setupRemoveButtons();
    }

    addTopicRow(subjectCard) {
        const topicsList = subjectCard.querySelector('.topics-list');
        const topicRow = document.createElement('div');
        topicRow.className = 'topic-row';
        topicRow.innerHTML = `
            <input type="text" placeholder="Topic name" class="topic-input" required>
            <select class="difficulty-select">
                <option value="easy">Easy</option>
                <option value="medium" selected>Medium</option>
                <option value="hard">Hard</option>
            </select>
            <button type="button" class="remove-topic" title="Remove topic">×</button>
        `;
        topicsList.appendChild(topicRow);
        this.setupRemoveButtons();
    }

    addDeadlineRow() {
        const container = document.getElementById('additionalDeadlines');
        const deadlineRow = document.createElement('div');
        deadlineRow.className = 'deadline-row';
        deadlineRow.innerHTML = `
            <input type="text" placeholder="Assignment/Test name" class="deadline-name">
            <input type="date" class="deadline-date">
            <button type="button" class="remove-deadline" title="Remove deadline">×</button>
        `;
        container.appendChild(deadlineRow);
        this.setupRemoveButtons();
    }

    collectFormData() {
        // Collect subjects and topics
        const subjectCards = document.querySelectorAll('.subject-card');
        this.subjects = [];
        
        subjectCards.forEach(card => {
            const subjectName = card.querySelector('.subject-input').value.trim();
            if (!subjectName) return;
            
            const topics = [];
            const topicRows = card.querySelectorAll('.topic-row');
            
            topicRows.forEach(row => {
                const topicName = row.querySelector('.topic-input').value.trim();
                const difficulty = row.querySelector('.difficulty-select').value;
                if (topicName) {
                    topics.push({ name: topicName, difficulty });
                }
            });
            
            if (topics.length > 0) {
                this.subjects.push({ name: subjectName, topics });
            }
        });

        // Collect deadlines
        this.deadlines = [];
        const examDate = document.getElementById('examDate').value;
        if (examDate) {
            this.deadlines.push({ 
                name: 'Main Exam', 
                date: new Date(examDate), 
                type: 'exam' 
            });
        }

        const deadlineRows = document.querySelectorAll('.deadline-row');
        deadlineRows.forEach(row => {
            const name = row.querySelector('.deadline-name').value.trim();
            const date = row.querySelector('.deadline-date').value;
            if (name && date) {
                this.deadlines.push({ 
                    name, 
                    date: new Date(date), 
                    type: 'assignment' 
                });
            }
        });

        // Sort deadlines by date
        this.deadlines.sort((a, b) => a.date - b.date);

        return {
            subjects: this.subjects,
            deadlines: this.deadlines,
            pace: document.querySelector('input[name="pace"]:checked').value,
            hoursPerDay: parseInt(document.getElementById('hoursSlider').value),
            preferredTime: document.getElementById('preferredTime').value,
            breakDuration: parseInt(document.getElementById('breakDuration').value),
            revisionFreq: document.getElementById('revisionFreq').value
        };
    }

    calculateStudyHours(topic, pace) {
        const baseHours = {
            easy: { slow: 3, medium: 2, fast: 1.5 },
            medium: { slow: 4, medium: 3, fast: 2 },
            hard: { slow: 5, medium: 4, fast: 3 }
        };
        return baseHours[topic.difficulty][pace];
    }

    generateStudyPlan() {
        const formData = this.collectFormData();
        
        if (formData.subjects.length === 0) {
            this.showError('Please add at least one subject with topics.');
            return;
        }

        if (formData.deadlines.length === 0) {
            this.showError('Please set your exam date.');
            return;
        }

        // Show loading state
        this.showLoading();

        // Simulate AI processing delay
        setTimeout(() => {
            this.processStudyPlan(formData);
        }, 1500);
    }

    showError(message) {
        // Create a temporary error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
            z-index: 1000;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 4000);
    }

    showLoading() {
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.innerHTML = `
            <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            Generating Your Plan...
        `;
        generateBtn.disabled = true;

        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    processStudyPlan(formData) {
        // Calculate total study hours needed
        let totalHours = 0;
        const topicHours = new Map();
        
        formData.subjects.forEach(subject => {
            subject.topics.forEach(topic => {
                const hours = this.calculateStudyHours(topic, formData.pace);
                totalHours += hours;
                topicHours.set(`${subject.name}-${topic.name}`, {
                    subject: subject.name,
                    topic: topic.name,
                    difficulty: topic.difficulty,
                    hours: hours,
                    completed: false
                });
            });
        });

        // Calculate available days
        const today = new Date();
        const examDate = formData.deadlines.find(d => d.type === 'exam').date;
        const daysAvailable = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysAvailable <= 0) {
            this.showError('Exam date must be in the future!');
            this.resetGenerateButton();
            return;
        }

        // Generate daily schedule
        this.studyPlan = this.createOptimizedSchedule(formData, topicHours, daysAvailable, totalHours);
        this.displayStudyPlan();
        this.resetGenerateButton();
    }

    resetGenerateButton() {
        const generateBtn = document.querySelector('.generate-btn');
        generateBtn.innerHTML = `
            <span class="btn-icon">🚀</span>
            Generate My Study Plan
        `;
        generateBtn.disabled = false;
    }

    createOptimizedSchedule(formData, topicHours, daysAvailable, totalHours) {
        const schedule = [];
        const topics = Array.from(topicHours.values());
        const dailyHours = formData.hoursPerDay;
        const breakDuration = formData.breakDuration;
        
        // Advanced sorting: prioritize by difficulty and deadline proximity
        topics.sort((a, b) => {
            const difficultyWeight = { hard: 3, medium: 2, easy: 1 };
            const diffScore = difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty];
            
            // If same difficulty, prioritize by subject (spread subjects evenly)
            if (diffScore === 0) {
                return a.subject.localeCompare(b.subject);
            }
            return diffScore;
        });

        let currentTopicIndex = 0;
        let currentTopicRemainingHours = topics[0]?.hours || 0;
        let lastSubjectStudied = '';
        
        for (let day = 0; day < daysAvailable && currentTopicIndex < topics.length; day++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + day);
            
            const daySchedule = {
                date: currentDate,
                sessions: [],
                totalHours: 0
            };

            let remainingDailyHours = dailyHours;
            let sessionCount = 0;

            // Skip weekends for lighter study (optional feature)
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
            if (isWeekend) {
                remainingDailyHours = Math.max(2, Math.floor(dailyHours * 0.6));
            }

            while (remainingDailyHours > 0.5 && currentTopicIndex < topics.length) {
                const currentTopic = topics[currentTopicIndex];
                
                // Try to alternate subjects for better learning
                if (sessionCount > 0 && currentTopic.subject === lastSubjectStudied) {
                    // Look for a different subject
                    let alternativeIndex = currentTopicIndex + 1;
                    while (alternativeIndex < topics.length && 
                           topics[alternativeIndex].subject === lastSubjectStudied) {
                        alternativeIndex++;
                    }
                    
                    if (alternativeIndex < topics.length) {
                        // Swap topics temporarily
                        [topics[currentTopicIndex], topics[alternativeIndex]] = 
                        [topics[alternativeIndex], topics[currentTopicIndex]];
                    }
                }

                const sessionHours = Math.min(
                    2, // Max 2 hours per session
                    remainingDailyHours, 
                    currentTopicRemainingHours
                );
                
                if (sessionHours >= 0.5) {
                    const startTime = this.calculateOptimalStartTime(
                        formData.preferredTime, 
                        sessionCount, 
                        currentDate
                    );

                    daySchedule.sessions.push({
                        type: 'study',
                        subject: currentTopic.subject,
                        topic: currentTopic.topic,
                        difficulty: currentTopic.difficulty,
                        duration: sessionHours,
                        startTime: startTime,
                        endTime: this.addHoursToTime(startTime, sessionHours)
                    });

                    remainingDailyHours -= sessionHours;
                    currentTopicRemainingHours -= sessionHours;
                    daySchedule.totalHours += sessionHours;
                    lastSubjectStudied = currentTopic.subject;
                    sessionCount++;

                    // Add break after study session (except last session of day)
                    if (remainingDailyHours > 0.5 && sessionCount < 4) {
                        const breakStartTime = this.addHoursToTime(startTime, sessionHours);
                        daySchedule.sessions.push({
                            type: 'break',
                            duration: breakDuration / 60,
                            startTime: breakStartTime,
                            endTime: this.addMinutesToTime(breakStartTime, breakDuration)
                        });
                        remainingDailyHours -= (breakDuration / 60);
                    }
                }

                if (currentTopicRemainingHours <= 0) {
                    currentTopicIndex++;
                    currentTopicRemainingHours = topics[currentTopicIndex]?.hours || 0;
                }
            }

            // Add revision sessions
            if (this.shouldAddRevision(day, formData.revisionFreq) && remainingDailyHours >= 1) {
                const revisionStartTime = this.getLastEndTime(daySchedule.sessions) || 
                                        this.calculateOptimalStartTime(formData.preferredTime, sessionCount, currentDate);
                
                daySchedule.sessions.push({
                    type: 'revision',
                    subject: 'Mixed Review',
                    topic: 'Review previous topics',
                    duration: Math.min(1, remainingDailyHours),
                    startTime: revisionStartTime,
                    endTime: this.addHoursToTime(revisionStartTime, 1)
                });
                daySchedule.totalHours += 1;
            }

            if (daySchedule.sessions.length > 0) {
                schedule.push(daySchedule);
            }
        }

        return {
            schedule,
            totalTopics: topics.length,
            totalHours,
            daysNeeded: schedule.length,
            averageHoursPerDay: totalHours / schedule.length,
            completionRate: 0,
            efficiency: this.calculateEfficiencyScore(schedule, formData)
        };
    }

    calculateOptimalStartTime(preferredTime, sessionIndex, date) {
        const timeSlots = {
            morning: ['7:00 AM', '9:00 AM', '11:00 AM'],
            afternoon: ['1:00 PM', '3:00 PM', '5:00 PM'],
            evening: ['6:00 PM', '8:00 PM', '9:30 PM'],
            night: ['10:00 PM', '11:30 PM', '1:00 AM']
        };
        
        const slots = timeSlots[preferredTime] || timeSlots.morning;
        return slots[sessionIndex % slots.length] || slots[0];
    }

    addHoursToTime(timeStr, hours) {
        const [time, period] = timeStr.split(' ');
        const [hourStr, minute] = time.split(':');
        let hour = parseInt(hourStr);
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        hour += Math.floor(hours);
        const additionalMinutes = (hours % 1) * 60;
        let totalMinutes = parseInt(minute) + additionalMinutes;
        
        if (totalMinutes >= 60) {
            hour += Math.floor(totalMinutes / 60);
            totalMinutes = totalMinutes % 60;
        }
        
        const newPeriod = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        
        return `${displayHour}:${totalMinutes.toString().padStart(2, '0')} ${newPeriod}`;
    }

    addMinutesToTime(timeStr, minutes) {
        return this.addHoursToTime(timeStr, minutes / 60);
    }

    getLastEndTime(sessions) {
        if (sessions.length === 0) return null;
        const lastSession = sessions[sessions.length - 1];
        return lastSession.endTime;
    }

    shouldAddRevision(dayIndex, frequency) {
        switch (frequency) {
            case 'daily': return dayIndex > 2;
            case 'weekly': return dayIndex > 0 && dayIndex % 7 === 0;
            case 'biweekly': return dayIndex > 0 && dayIndex % 14 === 0;
            default: return false;
        }
    }

    calculateEfficiencyScore(schedule, formData) {
        // Simple efficiency calculation based on various factors
        let score = 100;
        
        // Penalize for too many hours per day
        const avgHours = schedule.reduce((sum, day) => sum + day.totalHours, 0) / schedule.length;
        if (avgHours > 6) score -= 10;
        
        // Bonus for consistent daily hours
        const hourVariance = this.calculateVariance(schedule.map(day => day.totalHours));
        if (hourVariance < 1) score += 10;
        
        return Math.max(70, Math.min(100, score));
    }

    calculateVariance(numbers) {
        const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
        const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
        return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
    }

    displayStudyPlan() {
        const outputContainer = document.getElementById('studyPlanOutput');
        outputContainer.style.display = 'block';
        
        // Update plan stats
        this.updatePlanStats();
        
        // Show daily view by default
        this.switchTab('daily');
        
        // Smooth scroll to output
        outputContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        // Add success notification
        this.showSuccessNotification();
    }

    updatePlanStats() {
        const statsContainer = document.getElementById('planStats');
        if (!this.studyPlan) return;

        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-value">${this.studyPlan.totalTopics}</span>
                <span class="stat-label">Topics</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${Math.round(this.studyPlan.totalHours)}</span>
                <span class="stat-label">Total Hours</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${this.studyPlan.daysNeeded}</span>
                <span class="stat-label">Study Days</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${Math.round(this.studyPlan.averageHoursPerDay * 10) / 10}</span>
                <span class="stat-label">Avg Hours/Day</span>
            </div>
        `;
    }

    showSuccessNotification() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
            z-index: 1000;
            font-weight: 500;
        `;
        successDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>✅</span>
                <span>Study plan generated successfully!</span>
            </div>
        `;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.remove();
        }, 4000);
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Display content
        const content = document.getElementById('planContent');
        switch (tabName) {
            case 'daily':
                content.innerHTML = this.generateDailyView();
                break;
            case 'weekly':
                content.innerHTML = this.generateWeeklyView();
                break;
            case 'progress':
                content.innerHTML = this.generateProgressView();
                break;
        }
    }

    generateDailyView() {
        if (!this.studyPlan) return '<p>No study plan generated yet.</p>';

        let html = '<div class="daily-schedule">';
        
        this.studyPlan.schedule.forEach((day, index) => {
            const dateStr = day.date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const isToday = this.isToday(day.date);
            const isPast = day.date < new Date();
            
            html += `
                <div class="day-card ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}">
                    <div class="day-header">
                        <div class="day-title">
                            ${isToday ? '🔥 ' : ''}Day ${index + 1} - ${dateStr}
                        </div>
                        <div class="day-hours">${day.totalHours}h total</div>
                    </div>
            `;
            
            day.sessions.forEach(session => {
                const sessionClass = `${session.type}-session`;
                const timeRange = session.endTime ? 
                    `${session.startTime} - ${session.endTime}` : 
                    session.startTime;
                
                if (session.type === 'study') {
                    const difficultyEmoji = {
                        easy: '🟢',
                        medium: '🟡', 
                        hard: '🔴'
                    };
                    
                    html += `
                        <div class="session ${sessionClass}">
                            <div class="session-time">${timeRange}</div>
                            <div class="session-content">
                                <strong>${session.subject}</strong>: ${session.topic}
                            </div>
                            <div class="session-meta">
                                ${difficultyEmoji[session.difficulty]} ${session.difficulty} • ${session.duration}h
                            </div>
                        </div>
                    `;
                } else if (session.type === 'break') {
                    html += `
                        <div class="session ${sessionClass}">
                            <div class="session-time">${timeRange}</div>
                            <div class="session-content">☕ Break Time</div>
                            <div class="session-meta">${Math.round(session.duration * 60)} minutes</div>
                        </div>
                    `;
                } else if (session.type === 'revision') {
                    html += `
                        <div class="session ${sessionClass}">
                            <div class="session-time">${timeRange}</div>
                            <div class="session-content">📚 ${session.topic}</div>
                            <div class="session-meta">${session.duration}h review</div>
                        </div>
                    `;
                }
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }

    generateWeeklyView() {
        if (!this.studyPlan) return '<p>No study plan generated yet.</p>';

        let html = '<div class="weekly-overview">';
        let currentWeek = [];
        let weekNumber = 1;

        this.studyPlan.schedule.forEach((day, index) => {
            currentWeek.push(day);
            
            if (currentWeek.length === 7 || index === this.studyPlan.schedule.length - 1) {
                const weekHours = currentWeek.reduce((sum, day) => sum + day.totalHours, 0);
                
                html += `
                    <div class="week-section">
                        <h3 style="color: #f4f4f5; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                            <span>Week ${weekNumber}</span>
                            <span style="font-size: 0.9rem; color: #6366f1;">${Math.round(weekHours)}h total</span>
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                `;
                
                currentWeek.forEach(day => {
                    const dateStr = day.date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                    
                    const isToday = this.isToday(day.date);
                    
                    html += `
                        <div class="day-card" style="margin-bottom: 0; ${isToday ? 'border-color: #6366f1;' : ''}">
                            <div class="day-header" style="font-size: 0.9rem; margin-bottom: 0.75rem;">
                                <div style="font-weight: 600;">${dateStr}</div>
                                <div style="color: #6366f1; font-size: 0.8rem;">${day.totalHours}h</div>
                            </div>
                    `;
                    
                    const studySessions = day.sessions.filter(s => s.type === 'study');
                    studySessions.slice(0, 3).forEach(session => {
                        html += `
                            <div style="font-size: 0.75rem; padding: 0.4rem; background: rgba(99, 102, 241, 0.1); margin: 0.25rem 0; border-radius: 4px; border-left: 2px solid #6366f1;">
                                ${session.subject}
                            </div>
                        `;
                    });
                    
                    if (studySessions.length > 3) {
                        html += `<div style="font-size: 0.7rem; color: #a1a1aa; text-align: center;">+${studySessions.length - 3} more</div>`;
                    }
                    
                    html += '</div>';
                });
                
                html += '</div></div>';
                currentWeek = [];
                weekNumber++;
            }
        });

        html += '</div>';
        return html;
    }

    generateProgressView() {
        if (!this.studyPlan) return '<p>No study plan generated yet.</p>';

        const totalDays = this.studyPlan.schedule.length;
        const completedDays = this.studyPlan.schedule.filter(day => 
            day.date < new Date()
        ).length;
        const progressPercentage = (completedDays / totalDays) * 100;

        let html = `
            <div class="progress-overview">
                <div class="progress-card">
                    <span class="progress-value">${Math.round(progressPercentage)}%</span>
                    <span class="progress-label">Overall Progress</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                <div class="progress-card">
                    <span class="progress-value">${completedDays}</span>
                    <span class="progress-label">Days Completed</span>
                </div>
                <div class="progress-card">
                    <span class="progress-value">${totalDays - completedDays}</span>
                    <span class="progress-label">Days Remaining</span>
                </div>
                <div class="progress-card">
                    <span class="progress-value">${this.studyPlan.efficiency}%</span>
                    <span class="progress-label">Plan Efficiency</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">
                <div class="progress-card">
                    <h4 style="color: #f4f4f5; margin-bottom: 1rem;">Study Distribution</h4>
                    ${this.generateSubjectDistribution()}
                </div>
                <div class="progress-card">
                    <h4 style="color: #f4f4f5; margin-bottom: 1rem;">Upcoming Deadlines</h4>
                    ${this.generateUpcomingDeadlines()}
                </div>
            </div>
        `;

        // Add motivational message
        const motivationalMessages = [
            "🌟 Consistency beats perfection. Keep going!",
            "🚀 Every study session brings you closer to success.",
            "💪 Your future self will thank you for today's effort.",
            "🎯 Focus on progress, not perfection.",
            "⭐ Small steps daily lead to big results yearly.",
            "🔥 You're building the foundation for your dreams.",
            "🧠 Knowledge is power, and you're getting stronger!"
        ];
        
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        
        html += `
            <div class="motivation-card">
                <h3>Daily Motivation</h3>
                <p class="motivation-text">${randomMessage}</p>
            </div>
        `;

        return html;
    }

    generateSubjectDistribution() {
        const subjectHours = {};
        this.studyPlan.schedule.forEach(day => {
            day.sessions.forEach(session => {
                if (session.type === 'study') {
                    subjectHours[session.subject] = (subjectHours[session.subject] || 0) + session.duration;
                }
            });
        });

        let html = '';
        Object.entries(subjectHours).forEach(([subject, hours]) => {
            const percentage = (hours / this.studyPlan.totalHours) * 100;
            html += `
                <div style="margin-bottom: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.9rem; color: #d4d4d8;">${subject}</span>
                        <span style="font-size: 0.8rem; color: #6366f1;">${Math.round(hours)}h</span>
                    </div>
                    <div class="progress-bar" style="height: 6px;">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    generateUpcomingDeadlines() {
        const today = new Date();
        const upcomingDeadlines = this.deadlines
            .filter(deadline => deadline.date >= today)
            .slice(0, 5);

        if (upcomingDeadlines.length === 0) {
            return '<p style="color: #a1a1aa; font-size: 0.9rem;">No upcoming deadlines</p>';
        }

        let html = '';
        upcomingDeadlines.forEach(deadline => {
            const daysUntil = Math.ceil((deadline.date - today) / (1000 * 60 * 60 * 24));
            const urgencyColor = daysUntil <= 7 ? '#ef4444' : daysUntil <= 14 ? '#f59e0b' : '#10b981';
            
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(63, 63, 70, 0.3);">
                    <div>
                        <div style="font-size: 0.9rem; color: #f4f4f5;">${deadline.name}</div>
                        <div style="font-size: 0.8rem; color: #a1a1aa;">${deadline.date.toLocaleDateString()}</div>
                    </div>
                    <div style="color: ${urgencyColor}; font-size: 0.8rem; font-weight: 600;">
                        ${daysUntil} day${daysUntil !== 1 ? 's' : ''}
                    </div>
                </div>
            `;
        });

        return html;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ModernStudyPlanner();
});