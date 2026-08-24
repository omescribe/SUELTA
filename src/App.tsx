/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ViewType, PracticeType } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { GuideModal } from './components/GuideModal';
import { HomeView } from './components/HomeView';
import { LiberationView } from './components/LiberationView';
import { ReleaseCanvas } from './components/ReleaseCanvas';
import { ClosingView } from './components/ClosingView';
import { ToolsView } from './components/ToolsView';
import { BreathingView } from './components/BreathingView';
import { ProfileView } from './components/ProfileView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('inicio');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | undefined>(undefined);
  const [currentPractice, setCurrentPractice] = useState<PracticeType>('fuego');
  const [textToRelease, setTextToRelease] = useState('');

  // Handle dark / light theme persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('suelta_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (newTheme === 'light') {
      document.body.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('suelta_theme', nextTheme);
    applyTheme(nextTheme);
  };

  const handleStartLiberation = (emotion?: string) => {
    setSelectedEmotion(emotion);
    setCurrentView('liberacion');
  };

  const handleStartAnimation = (practice: PracticeType, text: string) => {
    setCurrentPractice(practice);
    setTextToRelease(text);
    setCurrentView('animacion');
  };

  const handleAnimationFinish = () => {
    setCurrentView('cierre');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-[#F7F7F5] text-[#1F1F1F]'
    }`}>
      {/* Header with Guide Modal button and Theme toggle */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-5 py-5 sm:px-8 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentView === 'inicio' && (
            <HomeView
              key="inicio"
              onStartLiberation={handleStartLiberation}
              onGoToBreathing={() => setCurrentView('ejercicios')}
            />
          )}

          {currentView === 'ejercicios' && (
            <BreathingView
              key="ejercicios"
              onCompleteSession={() => setCurrentView('liberacion')}
            />
          )}

          {currentView === 'liberacion' && (
            <LiberationView
              key="liberacion"
              initialEmotion={selectedEmotion}
              onStartAnimation={handleStartAnimation}
            />
          )}

          {currentView === 'animacion' && (
            <ReleaseCanvas
              key="animacion"
              practice={currentPractice}
              text={textToRelease}
              onFinish={handleAnimationFinish}
            />
          )}

          {currentView === 'cierre' && (
            <ClosingView
              key="cierre"
              onReleaseAnother={() => setCurrentView('liberacion')}
              onGoToGuides={() => setCurrentView('descubrir')}
            />
          )}

          {currentView === 'descubrir' && (
            <ToolsView key="descubrir" />
          )}

          {currentView === 'perfil' && (
            <ProfileView
              key="perfil"
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {currentView !== 'animacion' && (
        <BottomNav
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
        />
      )}

      {/* Guide & Purpose Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onStartPractice={() => {
          setIsGuideOpen(false);
          setCurrentView('liberacion');
        }}
      />
    </div>
  );
}
