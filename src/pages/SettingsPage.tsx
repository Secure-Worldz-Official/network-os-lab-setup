import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsNav } from '@/components/settings/SettingsNav';
import { AccountSection } from '@/components/settings/AccountSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { LearningSection } from '@/components/settings/LearningSection';
import { LabTerminalSection } from '@/components/settings/LabTerminalSection';
import { PrivacySecuritySection } from '@/components/settings/PrivacySecuritySection';
import { AccessibilitySection } from '@/components/settings/AccessibilitySection';
import { LanguageRegionSection } from '@/components/settings/LanguageRegionSection';
import { KeyboardShortcutsSection } from '@/components/settings/KeyboardShortcutsSection';
import { DataStorageSection } from '@/components/settings/DataStorageSection';
import { HelpAboutSection } from '@/components/settings/HelpAboutSection';
import { DangerZoneSection } from '@/components/settings/DangerZoneSection';
import { UnsavedChangesModal } from '@/components/settings/UnsavedChangesModal';
import { ToastNotification } from '@/components/settings/ToastNotification';
import { motion, AnimatePresence } from 'framer-motion';

export function SettingsPage() {
  const { activeCategory, setActiveCategory, isDirty, saveAll, discardAll } = useSettings();
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  const handleSelectCategory = (catId: string) => {
    if (catId === activeCategory) return;
    if (isDirty) {
      setPendingCategory(catId);
      setShowUnsavedModal(true);
    } else {
      setActiveCategory(catId);
    }
  };

  const handleStay = () => {
    setShowUnsavedModal(false);
    setPendingCategory(null);
  };

  const handleDiscard = () => {
    discardAll();
    setShowUnsavedModal(false);
    if (pendingCategory) {
      setActiveCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  const handleSaveAndExit = () => {
    saveAll();
    setShowUnsavedModal(false);
    if (pendingCategory) {
      setActiveCategory(pendingCategory);
      setPendingCategory(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 select-none font-mono pb-12">
      {/* Top Header with Save Status Indicator */}
      <SettingsHeader />

      {/* Main Settings Body Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Categories Navigation (4 Cols on desktop) */}
        <div className="lg:col-span-4 xl:col-span-3 sticky top-6">
          <SettingsNav
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* Right Column: Selected Category Content (8 Cols on desktop) */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeCategory === '01-account' && <AccountSection />}
              {activeCategory === '02-appearance' && <AppearanceSection />}
              {activeCategory === '03-notifications' && <NotificationsSection />}
              {activeCategory === '04-learning' && <LearningSection />}
              {activeCategory === '05-lab-terminal' && <LabTerminalSection />}
              {activeCategory === '06-privacy-security' && <PrivacySecuritySection />}
              {activeCategory === '07-accessibility' && <AccessibilitySection />}
              {activeCategory === '08-language-region' && <LanguageRegionSection />}
              {activeCategory === '09-keyboard-shortcuts' && <KeyboardShortcutsSection />}
              {activeCategory === '10-data-storage' && <DataStorageSection />}
              {activeCategory === '11-help-about' && <HelpAboutSection />}
              {activeCategory === '12-danger-zone' && <DangerZoneSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Unsaved Changes Protection Modal */}
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onStay={handleStay}
        onDiscard={handleDiscard}
        onSaveAndExit={handleSaveAndExit}
      />

      {/* Global Toast Notification */}
      <ToastNotification />
    </div>
  );
}
