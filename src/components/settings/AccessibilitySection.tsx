import { useSettings } from '@/context/SettingsContext';
import { Eye, Check, Move, Contrast, Type, Keyboard, Focus } from 'lucide-react';

export function AccessibilitySection() {
  const { accessibility, updateAccessibility } = useSettings();

  const accessToggles: Array<{
    key: keyof Omit<typeof accessibility, 'colorBlindMode'>;
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    {
      key: 'reduceMotion',
      title: 'Reduce Interface Motion',
      description: 'Disable non-essential Framer Motion animations and decorative sliding transitions.',
      icon: Move
    },
    {
      key: 'highContrast',
      title: 'High Contrast Stark Mode',
      description: 'Strengthen border contrast definitions and typography readability.',
      icon: Contrast
    },
    {
      key: 'largerText',
      title: 'Enhanced Large Typography',
      description: 'Scale base platform body font size from 16px to 17.5px across all views.',
      icon: Type
    },
    {
      key: 'focusIndicators',
      title: 'High-Visibility Keyboard Focus Rings',
      description: 'Render thick 3px focus rings on interactive elements during keyboard navigation.',
      icon: Focus
    },
    {
      key: 'keyboardNavigation',
      title: 'Full Keyboard Shortcut Navigation',
      description: 'Enable multi-key sequence shortcuts (e.g. G+D, G+S, G+R) and hotkey dialogs.',
      icon: Keyboard
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Accessibility Header Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="space-y-0.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Eye size={14} />
            ACCESSIBILITY & INCLUSIVE INTERACTION
          </h3>
          <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
            Customize visual fidelity, motion dynamics, focus indicators, and screen contrast.
          </p>
        </div>

        {/* Toggles */}
        <div className="space-y-2.5">
          {accessToggles.map((item) => {
            const Icon = item.icon;
            const isChecked = accessibility[item.key] as boolean;

            return (
              <div
                key={item.key}
                onClick={() => updateAccessibility({ [item.key]: !isChecked })}
                className="flex items-center justify-between p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC] dark:hover:border-[#444444] cursor-pointer transition-all duration-150"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-8 h-8 rounded bg-[#F0F0F0] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-[#111111] dark:text-white uppercase font-heading">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#666666] dark:text-[#B5B5B5] font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isChecked
                        ? 'bg-[#111111] text-white dark:bg-white dark:text-[#080808]'
                        : 'bg-[#E5E5E5] dark:bg-[#2A2A2A]'
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-[#080808] w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {isChecked && <Check size={10} className="text-[#111111] dark:text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Blindness Vision Support */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Eye size={14} />
          COLORBLIND VISION PALETTE OPTIMIZATION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'none', label: 'PURE MONOCHROME (DEFAULT)', desc: 'Optimized high-contrast black & white' },
            { id: 'deuteranopia', label: 'DEUTERANOPIA SAFE', desc: 'Red-green color safe indicator tuning' },
            { id: 'protanopia', label: 'PROTANOPIA SAFE', desc: 'Red cone deficiency contrast adjustments' },
            { id: 'tritanopia', label: 'TRITANOPIA SAFE', desc: 'Blue-yellow contrast enhanced boundaries' }
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => updateAccessibility({ colorBlindMode: mode.id as any })}
              className={`p-3.5 rounded border text-left flex flex-col justify-between space-y-1 transition-all ${
                accessibility.colorBlindMode === mode.id
                  ? 'border-[#111111] dark:border-white bg-[#F7F7F7] dark:bg-[#181818] ring-1 ring-[#111111] dark:ring-white'
                  : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-transparent hover:border-[#CCCCCC]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] text-[#111111] dark:text-white uppercase">
                  {mode.label}
                </span>
                {accessibility.colorBlindMode === mode.id && (
                  <Check size={12} className="text-[#111111] dark:text-white stroke-[3]" />
                )}
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                {mode.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
