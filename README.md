# 🧠 AI Study Planner

A modern, multi-screen AI-powered study planner that generates personalized study schedules based on your syllabus, deadlines, learning pace, and availability.

## 🎯 **App Flow**

The app follows a step-by-step flow across multiple screens:

1. **Syllabus Structure** (Step 1/6) - Add subjects and topics
2. **Deadlines** (Step 2/6) - Set exam and assignment dates  
3. **Learning Pace** (Step 3/6) - Choose your learning speed
4. **Daily Availability** (Step 4/6) - Set study hours and preferred times
5. **Study Preferences** (Step 5/6) - Configure breaks and revision frequency
6. **Review & Generate** (Step 6/6) - Review settings and generate plan
7. **Dashboard** - View your personalized study schedule

## 📁 **File Structure**

```
AI-Study-Planner/
├── index.html              # Loading screen → redirects to syllabus
├── app.js                  # Global state management & navigation
├── app.css                 # App-wide styles for multi-screen flow
├── script.js               # Study plan generation algorithms
├── README.md               # This file
└── pages/
    ├── syllabus.html       # Step 1: Add subjects and topics
    ├── deadlines.html      # Step 2: Set deadlines
    ├── learning-pace.html  # Step 3: Choose learning pace
    ├── daily-availability.html # Step 4: Set daily hours
    ├── study-preferences.html  # Step 5: Configure preferences
    ├── review.html         # Step 6: Review and generate
    └── dashboard.html      # Final dashboard with study plan
```

## 🚀 **Quick Start**

### Option 1: Direct Browser
1. Open `index.html` in your web browser
2. Follow the step-by-step flow
3. Generate your AI study plan!

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Then visit: http://localhost:8000
```

## ✨ **Key Features**

### **🎯 Smart Navigation**
- **No vertical scrolling** between sections
- **Next/Back buttons only** for navigation
- **Step-by-step flow** with progress indicator
- **Smart validation** - Next button disabled until required fields are filled

### **💾 Data Persistence**
- **localStorage** saves data between pages
- **Auto-save** on input changes
- **Form population** when returning to previous pages
- **Global state management** across all screens

### **📱 Mobile-First Design**
- **One screen = one section**
- **Large tap-friendly buttons**
- **App-like layout** with sticky header/footer
- **Responsive** for all screen sizes
- **Dark theme** with glassmorphism effects

### **🤖 AI-Powered Planning**
- **Difficulty-based time allocation** (Easy/Medium/Hard topics)
- **Subject alternation** to prevent mental fatigue
- **Weekend adjustment** for lighter study loads
- **Deadline prioritization** ensures exam readiness
- **Smart break scheduling** with optimal timing
- **Revision frequency** management

### **📊 Comprehensive Dashboard**
- **Daily Schedule** - Hour-by-hour breakdown with time ranges
- **Weekly Overview** - Week-by-week summary with subject distribution
- **Progress Tracker** - Visual progress bars and completion stats
- **Motivational quotes** and study tips

## 🎨 **User Experience**

### **Visual Design**
- **Modern dark theme** easy on the eyes
- **Glassmorphism UI** with backdrop blur effects
- **Smooth page transitions** with CSS animations
- **Color-coded indicators** for difficulty and urgency
- **Consistent layout** across all screens

### **Smart Features**
- **Interactive slider** for daily hours with real-time breakdown
- **Dynamic form validation** with helpful error messages
- **Loading animations** during plan generation
- **Success notifications** when plan is ready
- **Pro tips and explanations** throughout the flow

## 🧠 **AI Logic**

The planner uses sophisticated algorithms to:

1. **Analyze** syllabus size vs available time
2. **Prioritize** difficult topics and approaching deadlines  
3. **Balance** workload to prevent burnout
4. **Optimize** study sessions with strategic breaks
5. **Adapt** to your learning pace and preferences
6. **Include** regular revision sessions
7. **Distribute** subjects evenly for better retention

### **Time Allocation Formula**
- **Easy topics:** 1.5-3 hours (based on pace)
- **Medium topics:** 2-4 hours (based on pace)  
- **Hard topics:** 3-5 hours (based on pace)
- **Automatic breaks:** 15-30 minutes between sessions
- **Revision sessions:** Daily/Weekly/Bi-weekly options

## 🛠️ **Technical Details**

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **No Dependencies:** Works offline, no frameworks needed
- **State Management:** localStorage with global app state
- **Responsive:** CSS Grid and Flexbox for all screen sizes
- **Modern:** Uses CSS custom properties and modern web APIs

## 🎯 **Browser Support**

- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## 📱 **Mobile Experience**

The app is designed mobile-first with:
- **Touch-friendly** large buttons and inputs
- **Swipe-like navigation** between screens
- **No horizontal scrolling** 
- **Optimized keyboard** input on mobile
- **App-like feel** with native-style transitions

## 🎓 **Perfect For**

- **Students** preparing for exams
- **Professionals** studying for certifications
- **Anyone** wanting to optimize their learning schedule
- **Multiple subjects** with varying difficulty levels
- **Tight deadlines** requiring strategic planning

## 🚀 **Getting Started**

1. **Open** `index.html` in your browser
2. **Add** your subjects and topics with difficulty levels
3. **Set** your exam date and any assignment deadlines
4. **Choose** your learning pace (slow/medium/fast)
5. **Configure** your daily availability and preferred study times
6. **Set** break duration and revision frequency
7. **Review** all settings and generate your AI study plan
8. **Follow** your personalized daily schedule!

Your AI Study Planner will create an optimized schedule that adapts to your learning style and ensures you're ready for your exams! 🎯✨

---

**Built with ❤️ for students worldwide • No signup required • Works offline**