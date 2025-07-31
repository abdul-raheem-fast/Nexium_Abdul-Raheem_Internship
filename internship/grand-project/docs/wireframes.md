# 🎨 Mental Health Tracker - Wireframes & UI Design Specifications

<div align="center">

![Design System](https://img.shields.io/badge/Design%20System-Modern-purple?style=for-the-badge)
![Mobile First](https://img.shields.io/badge/Mobile-First-green?style=for-the-badge)
![Accessibility](https://img.shields.io/badge/WCAG%202.1-AA-blue?style=for-the-badge)

**🎯 Complete wireframe specifications for an intuitive, accessible, and engaging mental health tracking experience**

**✅ Implementation Status: Fully implemented with modern UI/UX**

</div>

---

## 🎨 Design System & Visual Identity

### **Color Palette**
```css
/* Primary Colors - Calming & Professional */
--primary-blue: #2563eb;      /* Trust, reliability */
--primary-green: #059669;     /* Growth, wellness */
--primary-teal: #0891b2;      /* Balance, calm */

/* Secondary Colors - Supporting Elements */
--secondary-purple: #7c3aed;  /* Innovation, wisdom */
--secondary-orange: #ea580c;  /* Energy, warmth */
--secondary-pink: #db2777;    /* Compassion, care */

/* Neutral Colors - Foundation */
--neutral-50: #f8fafc;       /* Light backgrounds */
--neutral-100: #f1f5f9;      /* Card backgrounds */
--neutral-200: #e2e8f0;      /* Borders, dividers */
--neutral-500: #64748b;      /* Secondary text */
--neutral-700: #334155;      /* Primary text */
--neutral-900: #0f172a;      /* Headers, emphasis */

/* Semantic Colors - Status & Feedback */
--success: #10b981;          /* Positive outcomes */
--warning: #f59e0b;          /* Alerts, caution */
--error: #ef4444;            /* Errors, critical */
--info: #3b82f6;             /* Information, tips */
```

### **Typography Scale**
```css
/* Font Family - Implemented in Production */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px - Small labels */
--text-sm: 0.875rem;    /* 14px - Body text small */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-xl: 1.25rem;     /* 20px - Small headers */
--text-2xl: 1.5rem;     /* 24px - Section headers */
--text-3xl: 1.875rem;   /* 30px - Page headers */
--text-4xl: 2.25rem;    /* 36px - Main headers */

/* Font Weights */
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

### **Spacing System**
```css
/* Consistent spacing scale - Implemented with Tailwind CSS */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
```

---

## 📱 Mobile App Wireframes

### **Onboarding Flow**

#### **Welcome Screen**
```
┌─────────────────────────┐
│  ◄                    ⚙ │
├─────────────────────────┤
│                         │
│        🧠 💚            │
│                         │
│   Mental Health         │
│      Tracker            │
│                         │
│  "Your journey to       │
│   better wellness       │
│   starts here"          │
│                         │
│  ┌─────────────────────┐│
│  │    Get Started      ││
│  └─────────────────────┘│
│                         │
│  Already have account?  │
│      Sign In            │
│                         │
└─────────────────────────┘
```

#### **Privacy Setup**
```
┌─────────────────────────┐
│  ◄    Privacy First   ✓ │
├─────────────────────────┤
│                         │
│        🔒               │
│                         │
│   Your data is 100%     │
│   private & secure      │
│                         │
│  • End-to-end encrypted │
│  • HIPAA compliant     │
│  • You control sharing │
│  • Anonymous analytics │
│                         │
│  ┌─────────────────────┐│
│  │   I Understand      ││
│  └─────────────────────┘│
│                         │
│  ●○○○ Progress          │
│                         │
└─────────────────────────┘
```

### **Main Dashboard**

#### **Home Screen**
```
┌─────────────────────────┐
│  ☰    Dashboard    🔔 📊│
├─────────────────────────┤
│                         │
│  Good morning, Sarah! 🌅│
│                         │
│  ┌─────────────────────┐│
│  │   Today's Check-in  ││
│  │                     ││
│  │   How are you       ││
│  │   feeling today?    ││
│  │                     ││
│  │  😟 😐 🙂 😊 😄    ││
│  │                     ││
│  │  [    Quick Log    ]││
│  └─────────────────────┘│
│                         │
│  ┌─────────────────────┐│
│  │   This Week         ││
│  │   ████████░░        ││
│  │   Mood: +15% ↗      ││
│  │   Stress: -8% ↘     ││
│  └─────────────────────┘│
│                         │
│  📝 Journal  🎯 Goals   │
│  📊 Insights 🆘 Support │
│                         │
└─────────────────────────┘
```

#### **Quick Check-in Modal**
```
┌─────────────────────────┐
│        Check-in         │
├─────────────────────────┤
│                         │
│  How's your mood?       │
│                         │
│  😟   😐   🙂   😊   😄 │
│  1     2   3    4    5  │
│           [3]           │
│                         │
│  Energy level?          │
│  ▓▓▓░░ Low    High ▓▓▓▓▓│
│                         │
│  Stress level?          │
│  ▓▓░░░ Low    High ▓▓▓▓▓│
│                         │
│  💭 Quick note:         │
│  ┌─────────────────────┐│
│  │ Feeling good after  ││
│  │ morning walk...     ││
│  └─────────────────────┘│
│                         │
│  [Cancel]    [Log It] ✓│
│                         │
└─────────────────────────┘
```

### **Analytics & Insights**

#### **Mood Trends Screen**
```
┌─────────────────────────┐
│  ◄    Mood Insights   📈│
├─────────────────────────┤
│                         │
│  ┌─────────────────────┐│
│  │     Past 30 Days    ││
│  │                     ││
│  │      ●─●─●          ││
│  │     ╱       ╲       ││
│  │    ●         ●─●    ││
│  │                     ││
│  │  Week 1  2  3  4    ││
│  └─────────────────────┘│
│                         │
│  📊 Average: 3.4/5      │
│  📈 Trend: +12% this    │
│      month              │
│                         │
│  🔍 Patterns Found:     │
│  • Monday blues (-15%)  │
│  • Friday highs (+25%) │
│  • Exercise = +mood     │
│                         │
│  💡 Recommendation:     │
│  Try scheduling walks   │
│  on Monday mornings     │
│                         │
└─────────────────────────┘
```

#### **Stress Analysis**
```
┌─────────────────────────┐
│  ◄   Stress Patterns  ⚡│
├─────────────────────────┤
│                         │
│  ┌─────────────────────┐│
│  │    Stress Heatmap   ││
│  │                     ││
│  │  M T W T F S S      ││
│  │  █ ▓ ░ ▓ ░ ░ ░  W1  ││
│  │  ▓ █ ▓ ░ ░ ░ ░  W2  ││
│  │  ░ ▓ █ ▓ ░ ░ ░  W3  ││
│  │  ▓ ░ ▓ █ ░ ░ ░  W4  ││
│  │                     ││
│  │  ░ Low  ▓ Med  █ High│
│  └─────────────────────┘│
│                         │
│  ⚠️  High Stress Alert  │
│  Pattern detected:      │
│  Tuesdays & Wednesdays  │
│                         │
│  💡 Suggested Actions:  │
│  • Block focus time     │
│  • Schedule breaks      │
│  • Try breathing apps   │
│                         │
│  [   View Details   ]   │
│                         │
└─────────────────────────┘
```

---

## 💻 Desktop Web Application

### **Dashboard Layout**

#### **Main Dashboard**
```
┌─────────────────────────────────────────────────────────────┐
│ Mental Health Tracker    🏠 📊 📝 🎯 ⚙️         Sarah ▼   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Quick Checkin │  │  Today's Mood   │  │   Insights  │ │
│  │                 │  │                 │  │             │ │
│  │  How are you    │  │     😊  4/5     │  │ 💡 You tend │ │
│  │  feeling?       │  │                 │  │ to feel     │ │
│  │                 │  │   🌟 Energy: 85%│  │ better on   │ │
│  │ 😟 😐 🙂 😊 😄 │  │   ⚡ Stress: 30%│  │ days when   │ │
│  │                 │  │                 │  │ you walk    │ │
│  │ [   Log Now   ] │  │ ┌─────────────┐ │  │             │ │
│  │                 │  │ │ View Trends │ │  │ [View More] │ │
│  └─────────────────┘  │ └─────────────┘ │  └─────────────┘ │
│                       └─────────────────┘                  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Weekly Overview                      │ │
│  │                                                       │ │
│  │  Mon   Tue   Wed   Thu   Fri   Sat   Sun            │ │
│  │   😊    😐    😟    🙂    😄    😊    🙂            │ │
│  │   4     3     2     3     5     4     3              │ │
│  │                                                       │ │
│  │  ■■■■  ■■■   ■■    ■■■   ■■■■■ ■■■■  ■■■           │ │
│  │  Mood                                                 │ │
│  │                                                       │ │
│  │  ░░░   ▓▓▓   ███   ▓▓    ░░    ░░░   ▓▓             │ │
│  │  Stress                                               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Recent Journal │  │   Achievements  │  │   Actions   │ │
│  │                 │  │                 │  │             │ │
│  │ "Had a great    │  │ 🏆 7-day streak │  │ 📖 Journal  │ │
│  │ morning walk    │  │ 🎯 Goal: Stay   │  │ 🎯 Set Goal │ │
│  │ today. Feeling  │  │    positive     │  │ 📊 Analytics│ │
│  │ energized!"     │  │ ⭐ Mindfulness  │  │ 🆘 Get Help │ │
│  │                 │  │    champion     │  │             │ │
│  │ [Write Entry]   │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **Analytics Dashboard**

#### **Comprehensive Analytics View**
```
┌─────────────────────────────────────────────────────────────┐
│ Mental Health Tracker                          Analytics 📊  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ Time Range ──┐  [Last 30 Days ▼]  [Export Data]       │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Mood Trends                        │ │
│  │  5 ●─────●                                           │ │
│  │    │      ╲                                          │ │
│  │  4 │       ●─────●                                   │ │
│  │    │              ╲                                  │ │
│  │  3 ●               ●───●                             │ │
│  │    │                   │                             │ │
│  │  2 │                   ●                             │ │
│  │    │                                                 │ │
│  │  1 ●─────────────────────────────────────────────    │ │
│  │    Week1  Week2  Week3  Week4                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Key Metrics    │  │   Correlations  │  │  Patterns   │ │
│  │                 │  │                 │  │             │ │
│  │ Avg Mood: 3.7   │  │ Sleep ↔ Mood    │  │ Best Day:   │ │
│  │ Mood Variance:  │  │   r = 0.73      │  │ Friday      │ │
│  │   Low ✓         │  │                 │  │             │ │
│  │                 │  │ Exercise ↔ Mood │  │ Tough Day:  │ │
│  │ Stress Level:   │  │   r = 0.65      │  │ Monday      │ │
│  │   Moderate      │  │                 │  │             │ │
│  │                 │  │ Work ↔ Stress   │  │ Peak Time:  │ │
│  │ Check-in Rate:  │  │   r = 0.58      │  │ 9-11 AM     │ │
│  │   94% ✓         │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 AI Insights & Recommendations         │ │
│  │                                                       │ │
│  │ 🔍 Pattern Detection:                                │ │
│  │ • Your mood improves by 23% after exercise          │ │
│  │ • Monday mornings show consistent stress spikes     │ │
│  │ • 8+ hours sleep correlates with better mood        │ │
│  │                                                       │ │
│  │ 💡 Personalized Recommendations:                    │ │
│  │ • Schedule 15-min walks before Monday meetings      │ │
│  │ • Consider meditation apps for Sunday evenings      │ │
│  │ • Try blocking Thursday PM for focused work         │ │
│  │                                                       │ │
│  │ ⚠️  Early Warning:                                  │ │
│  │ • Stress trending upward this week                  │ │
│  │ • Consider scheduling relaxation time               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 👥 Manager Dashboard Wireframes

### **Team Overview**
```
┌─────────────────────────────────────────────────────────────┐
│ Mental Health Tracker                       Team Dashboard  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Team: Engineering (12 members)              [Settings ⚙️] │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  Team Wellness Score                  │ │
│  │                                                       │ │
│  │                     7.8/10 😊                        │ │
│  │                                                       │ │
│  │  ████████████████████████████████▒▒▒▒▒▒▒▒           │ │
│  │                                                       │ │
│  │  This Week: +0.3 ↗    Last Month: +1.2 ↗            │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Team Trends   │  │   Risk Alerts   │  │   Actions   │ │
│  │                 │  │                 │  │             │ │
│  │     📈          │  │     ⚠️  2       │  │ 📝 Send     │ │
│  │   Mood: +15%    │  │                 │  │   Check-in  │ │
│  │   Stress: -8%   │  │ • Anonymous     │  │             │ │
│  │   Engagement:   │  │   team member   │  │ 🎯 Team     │ │
│  │   Stable        │  │   stress ↑      │  │   Building  │ │
│  │                 │  │                 │  │             │ │
│  │ [View Details]  │  │ • Project       │  │ 📊 Generate │ │
│  │                 │  │   deadline      │  │   Report    │ │
│  │                 │  │   pressure      │  │             │ │
│  │                 │  │                 │  │ 🆘 Crisis   │ │
│  │                 │  │ [View Support   │  │   Support   │ │
│  │                 │  │  Resources]     │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                Anonymous Team Insights                │ │
│  │                                                       │ │
│  │  Department Comparison:                               │ │
│  │  Engineering    ████████████████████▒▒▒▒▒▒  7.8/10   │ │
│  │  Product        ██████████████████████████  8.2/10   │ │
│  │  Design         ███████████████████▒▒▒▒▒▒▒  7.4/10   │ │
│  │  Marketing      █████████████████████████▒  8.1/10   │ │
│  │                                                       │ │
│  │  Recommendations for Engineering:                     │ │
│  │  • Consider flexible work arrangements               │ │
│  │  • Schedule team social activities                   │ │
│  │  • Review current project timelines                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏢 HR Analytics Wireframes

### **Organization Overview**
```
┌─────────────────────────────────────────────────────────────┐
│ Mental Health Tracker                      HR Analytics 📈  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Organization: TechCorp (500 employees)    [Export Report] │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │               Organizational Wellness KPIs            │ │
│  │                                                       │ │
│  │  Overall Score: 7.9/10    Participation: 87%         │ │
│  │                                                       │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │ │
│  │  │    Mood     │ │   Stress    │ │ Engagement  │     │ │
│  │  │    8.1/10   │ │   6.2/10    │ │   8.4/10    │     │ │
│  │  │     ↗+5%    │ │    ↘-12%    │ │    ↗+8%     │     │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                Department Breakdown                    │ │
│  │                                                       │ │
│  │  Engineering (120)  ████████████████▒▒▒▒  7.8  ⚠️     │ │
│  │  Sales (80)        ██████████████████████  8.2        │ │
│  │  Marketing (60)    ███████████████████████  8.1       │ │
│  │  Support (40)      ██████████████████▒▒▒▒  7.6  ⚠️     │ │
│  │  HR (25)           ████████████████████████  8.4       │ │
│  │  Finance (35)      ███████████████████████▒  8.0       │ │
│  │                                                       │ │
│  │  Risk Departments: Engineering, Support               │ │
│  │  Recommended Action: Workload review                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  ROI Tracking   │  │ Trend Analysis  │  │ Predictions │ │
│  │                 │  │                 │  │             │ │
│  │ Sick Days:      │  │     📊          │  │ Next Month: │ │
│  │   -30% YoY      │  │   6 Month       │  │             │ │
│  │                 │  │   Trends        │  │ Wellness ↗  │ │
│  │ Productivity:   │  │                 │  │ Risk Areas: │ │
│  │   +18% YoY      │  │ ●─●─●─●─●─●     │  │ • Engineering│ │
│  │                 │  │              ●  │  │ • Support   │ │
│  │ Retention:      │  │ Mood improving  │  │             │ │
│  │   +12% YoY      │  │ since Q2        │  │ Recommend:  │ │
│  │                 │  │                 │  │ • Team      │ │
│  │ Healthcare      │  │ [View Details]  │  │   activities│ │
│  │ Costs: -22%     │  │                 │  │ • Workload  │ │
│  │                 │  │                 │  │   review    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🆘 Crisis Support Interface

### **Crisis Detection & Response**
```
┌─────────────────────────────────────────────────────────────┐
│ Mental Health Tracker                      Crisis Support   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⚠️  IMMEDIATE SUPPORT NEEDED                              │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │        🤗 You are not alone                           │ │
│  │                                                       │ │
│  │  It looks like you might be going through a          │ │
│  │  difficult time. There are people who want to        │ │
│  │  help and resources available right now.             │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Talk to       │  │   Crisis        │  │   Text      │ │
│  │   Someone       │  │   Hotline       │  │   Support   │ │
│  │                 │  │                 │  │             │ │
│  │     📞          │  │     🆘          │  │     💬      │ │
│  │                 │  │                 │  │             │ │
│  │ Connect with a  │  │   988 Lifeline  │  │ Crisis Text │ │
│  │ counselor in    │  │                 │  │ Line        │ │
│  │ under 24 hours  │  │ Available 24/7  │  │             │ │
│  │                 │  │ Free & Private  │  │ Text HOME   │ │
│  │                 │  │                 │  │ to 741741   │ │
│  │ [Connect Now]   │  │ [Call Now]      │  │ [Text Now]  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 Additional Resources                  │ │
│  │                                                       │ │
│  │ 🌐 Mental Health America                             │ │
│  │ 🏥 Find Local Mental Health Services                 │ │
│  │ 📱 Recommended Mental Health Apps                    │ │
│  │ 📖 Self-Help Resources & Coping Strategies          │ │
│  │ 👥 Support Groups in Your Area                      │ │
│  │                                                       │ │
│  │ [View All Resources]                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                    Safety Planning                    │ │
│  │                                                       │ │
│  │ Would you like help creating a safety plan?          │ │
│  │                                                       │ │
│  │ [Yes, Help Me Plan] [Maybe Later] [I'm Safe Now]     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Accessibility Features

### **Universal Design Principles**

#### **Visual Accessibility**
- **High Contrast Mode**: Enhanced color contrast for low vision users
- **Font Size Controls**: User-adjustable text sizing (100%-200%)
- **Color-Blind Friendly**: Patterns and icons supplement color coding
- **Screen Reader Support**: ARIA labels and semantic HTML structure

#### **Motor Accessibility**
- **Large Touch Targets**: Minimum 44px touch targets on mobile
- **Keyboard Navigation**: Full keyboard accessibility with focus indicators
- **Voice Input**: Speech-to-text for check-ins and journaling
- **Switch Control**: Support for assistive input devices

#### **Cognitive Accessibility**
- **Simple Language**: Clear, jargon-free interface text
- **Consistent Navigation**: Predictable interface patterns
- **Progress Indicators**: Clear feedback on multi-step processes
- **Error Prevention**: Helpful validation and error messages

### **Inclusive Design Features**

#### **Cultural Sensitivity**
- **Diverse Imagery**: Inclusive representation in graphics and icons
- **Cultural Adaptations**: Respect for different mental health perspectives
- **Language Options**: Multi-language support for diverse workforces
- **Religious Considerations**: Accommodations for various spiritual practices

#### **Neurodiversity Support**
- **Sensory Controls**: Reduced motion options for vestibular disorders
- **Attention Support**: Focus modes and distraction reduction
- **Processing Time**: No automatic timeouts on forms
- **Multiple Formats**: Text, audio, and visual information presentation

---

## 📊 Component Library

### **Interactive Elements**

#### **Mood Selector Component**
```css
.mood-selector {
  display: flex;
  justify-content: space-between;
  padding: var(--space-6);
  gap: var(--space-4);
}

.mood-option {
  font-size: 3rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  filter: grayscale(50%);
}

.mood-option:hover,
.mood-option.selected {
  transform: scale(1.2);
  filter: grayscale(0%);
}
```

#### **Progress Ring Component**
```css
.progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.progress-ring circle {
  fill: transparent;
  stroke: var(--primary-blue);
  stroke-width: 8;
  stroke-dasharray: 377; /* 2 * π * 60 */
  stroke-dashoffset: calc(377 - (377 * var(--progress)) / 100);
  transition: stroke-dashoffset 0.5s ease;
}
```

#### **Insight Card Component**
```css
.insight-card {
  background: linear-gradient(135deg, var(--primary-blue), var(--primary-teal));
  color: white;
  padding: var(--space-6);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2);
}

.insight-card::before {
  content: '💡';
  font-size: 2rem;
  margin-bottom: var(--space-4);
  display: block;
}
```

### **Data Visualization Components**

#### **Mood Timeline Chart**
```javascript
const MoodTimelineChart = {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Mood',
      data: [3, 4, 2, 3, 5, 4, 3],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#2563eb',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const moods = ['😟', '😐', '🙂', '😊', '😄'];
            return moods[value - 1];
          }
        }
      }
    }
  }
};
```

#### **Stress Heatmap Component**
```css
.stress-heatmap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-2);
  padding: var(--space-4);
}

.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}

.heatmap-cell.low {
  background-color: #dcfce7;
  color: #166534;
}

.heatmap-cell.medium {
  background-color: #fed7aa;
  color: #c2410c;
}

.heatmap-cell.high {
  background-color: #fecaca;
  color: #dc2626;
}
```

---

## 🔧 Technical Implementation Notes

### **Performance Optimization**

#### **Mobile Performance**
- **Lazy Loading**: Progressive loading of charts and heavy components
- **Image Optimization**: WebP format with fallbacks, responsive images
- **Bundle Splitting**: Code splitting by route and feature
- **Caching Strategy**: Service worker for offline functionality

#### **Database Optimization**
- **Indexing**: Optimized indexes for time-series queries
- **Data Aggregation**: Pre-computed analytics for faster dashboard loading
- **Connection Pooling**: Efficient database connection management
- **Caching Layer**: Redis for frequently accessed data

### **Security Implementation**

#### **Data Protection**
- **Encryption**: AES-256 encryption for sensitive data at rest
- **Transmission Security**: TLS 1.3 for all data in transit
- **API Security**: JWT tokens with short expiration, refresh token rotation
- **Input Validation**: Comprehensive input sanitization and validation

#### **Privacy Controls**
- **Granular Permissions**: User control over data sharing levels
- **Anonymous Analytics**: Aggregated insights without personal identification
- **Data Retention**: Automatic deletion of personal data after defined periods
- **Audit Logging**: Comprehensive logging of data access and modifications

### **Responsive Design Implementation**

#### **Breakpoint Strategy**
```css
/* Mobile First Approach */
.dashboard {
  /* Mobile styles (320px+) */
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  /* Tablet styles */
  .dashboard {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

@media (min-width: 1024px) {
  /* Desktop styles */
  .dashboard {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}

@media (min-width: 1440px) {
  /* Large desktop styles */
  .dashboard {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

#### **Touch-Friendly Design**
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-3) var(--space-4);
  border-radius: 8px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s ease;
}

.touch-target:hover {
  background-color: var(--primary-blue-600);
  transform: translateY(-1px);
}

.touch-target:active {
  transform: translateY(0);
}
```

---

## 🎨 Animation & Micro-interactions

### **Loading States**

#### **Skeleton Loading**
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### **Progress Indicators**
```css
.progress-circle {
  stroke-dasharray: 377;
  stroke-dashoffset: 377;
  animation: progress-fill 2s ease-in-out forwards;
}

@keyframes progress-fill {
  to {
    stroke-dashoffset: calc(377 - (377 * var(--progress)) / 100);
  }
}
```

### **Feedback Animations**

#### **Success States**
```css
.success-animation {
  animation: success-bounce 0.6s ease-out;
}

@keyframes success-bounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
```

#### **Error States**
```css
.error-shake {
  animation: error-shake 0.5s ease-in-out;
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
```

---

<div align="center">

**🎨 Mental Health Tracker - Wireframes Complete**

*"Designing for wellness, accessibility, and human connection through thoughtful user experience"*

**Built with ❤️ for better mental health outcomes**

---

**📅 Document Version**: 1.0  
**📝 Last Updated**: July 2025  
**👤 Author**: Muhammad Abdul Raheem Khan  
**🏢 Organization**: Nexium Internship Program  

</div> 