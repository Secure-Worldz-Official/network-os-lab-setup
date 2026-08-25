import { useSettings } from '@/context/SettingsContext';
import { BookOpen, Check, Layers, Target } from 'lucide-react';
import { learningPaths } from '@/data/cyberpathData';

export function LearningSection() {
  const { learning, updateLearning } = useSettings();

  const toggleItems: Array<{
    key: keyof Omit<typeof learning, 'defaultPath' | 'difficulty'>;
    title: string;
    description: string;
  }> = [
    {
      key: 'autoContinue',
      title: 'Auto Continue Tasks',
      description: 'Automatically advance to the next learning task upon successful flag/answer submission.'
    },
    {
      key: 'showTaskHints',
      title: 'Show Guided Task Hints',
      description: 'Display tactical syntax tips and tool usage hints inside practical room task cards.'
    },
    {
      key: 'confirmHintXp',
      title: 'Confirm Before Using XP Hints',
      description: 'Prompt for confirmation before revealing hints that deduct reward XP milestones.'
    },
    {
      key: 'showCompletedTasks',
      title: 'Show Completed Tasks in Overview',
      description: 'Keep already completed tasks expanded by default when inspecting room progress.'
    },
    {
      key: 'streakProtection',
      title: 'Streak Safeguard Mode',
      description: 'Allow daily mission quizzes or flashcard reviews to fulfill daily active streak requirements.'
    },
    {
      key: 'learningReminders',
      title: 'In-Platform Learning Prompts',
      description: 'Display interactive suggestion banners on the dashboard based on your current learning path.'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Learning Preferences Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BookOpen size={14} />
              CURRICULUM & LEARNING EXPERIENCE
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
              Configure career track focus, progression behaviors, and hint difficulty parameters.
            </p>
          </div>
        </div>

        {/* Career Path & Difficulty Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Default Learning Path */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
            <label className="font-bold text-[#111111] dark:text-white block uppercase text-[11px] flex items-center gap-1.5">
              <Target size={13} />
              DEFAULT LEARNING PATHWAY
            </label>
            <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
              Sets the primary track highlighted on your dashboard and automated recommendations.
            </p>
            <select
              value={learning.defaultPath}
              onChange={(e) => updateLearning({ defaultPath: e.target.value })}
              className="w-full bg-white dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs font-mono font-bold text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white"
            >
              {learningPaths.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title.toUpperCase()} ({p.difficulty.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Preference */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-2">
            <label className="font-bold text-[#111111] dark:text-white block uppercase text-[11px] flex items-center gap-1.5">
              <Layers size={13} />
              ROOM DIFFICULTY FILTER PREFERENCE
            </label>
            <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
              Filter default room listings to match your preferred challenge level.
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => updateLearning({ difficulty: diff })}
                  className={`py-1.5 text-[9px] font-bold rounded border uppercase transition-all ${
                    learning.difficulty === diff
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                      : 'bg-white dark:bg-[#181818] text-[#555555] dark:text-[#B5B5B5] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Toggles */}
        <div className="space-y-2.5 pt-2">
          {toggleItems.map((item) => {
            const isChecked = learning[item.key] as boolean;

            return (
              <div
                key={item.key}
                onClick={() => updateLearning({ [item.key]: !isChecked })}
                className="flex items-center justify-between p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC] dark:hover:border-[#444444] cursor-pointer transition-all duration-150"
              >
                <div className="pr-4 space-y-0.5">
                  <span className="font-bold text-xs text-[#111111] dark:text-white uppercase font-heading block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-[#666666] dark:text-[#B5B5B5] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isChecked
                        ? 'bg-[#111111] dark:bg-white'
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
    </div>
  );
}
