# SpendSmart Pro — Project Context & Handoff Log

## 1. Project Overview & Deadlines
- **App Name:** SpendSmart Pro
- **Working Path:** `C:\Intership-project\SpendSmartNew`
- **Framework:** React Native 0.85.0 (TypeScript)
- **Backend & Deploy Deadline:** August 2
- **Presentation & Viva Date:** August 6
- **Context:** Built as a 45-day internship-level personal finance & fintech application.

## 2. Environment & Installed Packages
- **Node:** v24.16.0 | **npm:** 11.9.0 | **Java:** OpenJDK 17.0.19
- **Installed Packages:**
  - `@react-navigation/native`
  - `@react-navigation/native-stack`
  - `@react-navigation/bottom-tabs`
  - `react-native-screens`
  - `react-native-safe-area-context`
- **Crucial Build Rule:** **DO NOT** install `react-native-reanimated` or `react-native-worklets` to avoid native build locks and slow C++ compilation. Use React Native's built-in `Animated` API for high-performance animations.

## 3. Product Features & Architecture
- **Design System:** Modern fintech look with vibrant primary blue (`#2563EB`), green income, red expenses, rounded cards, and clean typography.
- **Core Features:** Income & expense tracking, budget planning UI, dashboard cards, recent activity, notifications.
- **Gamification & Micro-Savings:** Daily savings calculator, small micro-saving challenges, streaks, XP, badges, and level progression.
- **Data Ingestion Strategy:** Direct UPI transaction reading is blocked by bank security restrictions. Real-world alternative: SMS-based transaction detection and CSV statement import.

## 4. Completed Foundation & Files
- `src/constants/Colors.ts` (Fintech palette, semantic financial colors, gamification tones)
- `src/constants/Strings.ts` (App text copy and UI headers)
- `src/styles/GlobalStyles.ts` (Global cards, shadows, flex layouts)
- `src/screens/Splash/SplashScreen.tsx` (60 FPS native driver animated logo)
- `src/navigation/AppNavigator.tsx` (Root stack switcher)
- `App.tsx` (Wrapped in `SafeAreaProvider`)

## 5. Instructions for AI Assistant / Code Generation
- **Explanation Style:** Simple language, line-by-line breakdowns, and teacher/viva Q&A prep for every feature.
- **UI Quality:** Visually rich screens with no empty states.
- **Code Style:** Clean TypeScript code without unnecessary inline code comments.