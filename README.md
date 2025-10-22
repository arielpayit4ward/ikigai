# 働きがい Hatarakigai Explorer

A mobile-responsive web application that helps you discover meaningful work at the intersection of **what you love**, **what you're good at**, **what the world needs**, and **what you can be paid for**.

![Ikigai Concept](https://img.shields.io/badge/ikigai-生き甲斐-purple?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🎯 Core Functionality
- **Interactive Journey-Based Quiz**: 32 thoughtfully crafted questions across 4 ikigai dimensions
- **Reflection Pauses**: Journal your insights between each section for deeper self-discovery
- **Progressive Depth**: Move from broad exploration → deeper dive → constraint mapping
- **Visual Results**: Interactive ikigai diagram showing the overlap of all four circles
- **Personalized Recommendations**: Career paths combining traditional roles with entrepreneurial opportunities
- **Progress Saving**: Local storage automatically saves your progress - resume anytime

### 🎨 User Experience
- **Mobile-First Design**: Beautiful, responsive interface that works perfectly on all devices
- **Smooth Animations**: Engaging transitions and progress indicators throughout
- **Thoughtful Questions**: Deep, reflective prompts that go beyond typical career assessments
- **Privacy-Focused**: All data stored locally on your device
- **Shareable**: Easy sharing via URL to help others discover their ikigai

### 📊 Question Types
1. **Single Choice**: Select one option that resonates most
2. **Multiple Choice**: Choose all that apply
3. **Scale**: Rate your agreement or confidence (1-5)
4. **Text**: Write thoughtful, reflective responses
5. **Ranking**: Drag and drop to order by importance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ikigai
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── CareerCard.tsx          # Expandable career recommendation cards
│   ├── IkigaiVisualization.tsx # Interactive Venn diagram visualization
│   ├── ProgressBar.tsx         # Quiz progress indicator
│   ├── QuestionDisplay.tsx     # Handles all question types
│   └── ReflectionPause.tsx     # Journaling component between sections
├── data/
│   └── questions.ts            # All quiz questions and dimension info
├── pages/               # Main page components
│   ├── Welcome.tsx             # Landing page with overview
│   ├── Quiz.tsx                # Main quiz flow with state management
│   └── Results.tsx             # Results page with visualization & recommendations
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/               # Utility functions
│   ├── scoring.ts              # Results calculation and career recommendations
│   └── storage.ts              # Local storage management
├── App.tsx              # Main app with routing
├── main.tsx             # App entry point
└── index.css            # Global styles and Tailwind config
```

## 🧩 The Four Dimensions

### ❤️ What You Love (Passion)
Explore activities that bring you joy and make you lose track of time. Questions probe:
- Energy patterns and flow states
- Childhood dreams and underlying motivations
- Topics you can discuss for hours
- Moments when you feel most alive

### ⭐ What You're Good At (Profession)
Identify your natural talents and developed skills. Questions explore:
- What others consistently ask for your help with
- Confidence in various skill areas
- Formal training and significant experience
- Natural roles you take on in teams

### 🌍 What the World Needs (Mission)
Discover how you can make a meaningful impact. Questions examine:
- Global and social issues you care about
- Scale of impact that feels meaningful
- Communities you want to support
- The change you want to see in the world

### 💼 What You Can Be Paid For (Vocation)
Understand how to create sustainable value. Questions address:
- Career priorities and work arrangements
- Skills you're willing to develop
- Comfort with uncertainty
- Revenue models that interest you

## 🎨 Design Philosophy

The application prioritizes:
- **Self-Discovery Over Assessment**: This isn't a test with right/wrong answers
- **Depth Over Speed**: Questions encourage reflection rather than quick responses
- **Action Over Theory**: Results include concrete next steps
- **Balance Over Perfection**: Focus on progress, not perfect alignment
- **Growth Mindset**: Results are a starting point, not a fixed label

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3 with custom animations
- **Routing**: React Router 6
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Vite
- **Type Safety**: TypeScript with strict mode
- **Data Persistence**: Browser Local Storage API

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional career recommendations
- More question variations
- Enhanced visualizations
- Internationalization (i18n)
- PDF export of results
- Integration with career APIs

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the Japanese concept of ikigai (生き甲斐)
- Built with modern web technologies
- Designed with love for self-discovery

## 📧 Contact

For questions, suggestions, or feedback, please open an issue in the repository.

---

**Remember**: Your ikigai is not something you find once and it stays forever. It evolves as you grow. Use this tool as a compass, not a destination. 🧭✨
