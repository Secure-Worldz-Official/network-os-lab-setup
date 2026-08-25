import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCyberPath } from '@/context/CyberPathContext';
import { rooms, type RoomTask } from '@/data/cyberpathData';
import { 
  ArrowLeft, Terminal as TermIcon, CheckCircle, Key, Info, HelpCircle as QuizIcon,
  Clock, Download
} from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { InteractiveTerminal } from '@/components/terminal/InteractiveTerminal';
import { WebLabTarget } from '@/components/lab/WebLabTarget';
import { TaskValidator } from '@/lib/labServices';

type ActiveTab = 'intro' | 'task' | 'lab' | 'quiz' | 'complete';
type MobileTab = 'task' | 'lab' | 'terminal' | 'connection' | 'target';

export function RoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const { 
    completedTasks, 
    completeTask, 
    isTaskCompleted,
    completeRoom,
    completeQuiz,
    isQuizCompleted,
    activeLab,
    startLab,
    stopLab,
    resetLab,
    togglePauseLab,
    vpnStatus,
    downloadVpnConfig,
    deductXp
  } = useCyberPath();

  const room = rooms.find((r) => r.id === roomId);

  const [activeTab, setActiveTab] = useState<ActiveTab>('intro');
  const [mobileTab, setMobileTab] = useState<MobileTab>('task');
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<string, { success: boolean; msg: string }>>({});
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({});

  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<Record<number, string>>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  if (!room) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4 font-mono select-none">
        <h2 className="text-xl font-bold text-[#111111] dark:text-white font-heading">ROOM NOT FOUND</h2>
        <Link to="/rooms">
          <button className="btn-cyber-secondary text-xs">BACK TO ROOMS</button>
        </Link>
      </div>
    );
  }

  const roomTasks = room.tasks;
  const currentTask: RoomTask | undefined = roomTasks[selectedTaskIndex];
  const completedCount = roomTasks.filter((t) => completedTasks.has(t.id)).length;
  const progressPct = roomTasks.length > 0 ? Math.round((completedCount / roomTasks.length) * 100) : 0;
  const isLabActive = activeLab && activeLab.roomId === room.id;

  const handleTaskSubmit = (task: RoomTask) => {
    const userAns = answers[task.id] || '';
    const result = TaskValidator.validate(userAns, task.answer);

    setTaskFeedback(prev => ({
      ...prev,
      [task.id]: { success: result.success, msg: result.message }
    }));

    if (result.success) {
      completeTask(task.id);
      if (completedCount + 1 >= roomTasks.length) {
        setTimeout(() => completeRoom(room.id), 500);
      }
    }
  };

  const handleShowHint = (taskId: string) => {
    const currentLvl = hintLevel[taskId] || 0;
    if (currentLvl === 0) {
      deductXp(10, 'Revealed Hint 01');
      setHintLevel(prev => ({ ...prev, [taskId]: 1 }));
    } else if (currentLvl === 1) {
      deductXp(20, 'Revealed Hint 02');
      setHintLevel(prev => ({ ...prev, [taskId]: 2 }));
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderTaskWorkspace = () => {
    if (!currentTask) return null;

    if (currentTask.isWebLab || room.isWebLab) {
      return (
        <WebLabTarget 
          targetIp={activeLab?.targetIp || '10.10.20.15'} 
          onFlagSubmit={(flag) => setAnswers(prev => ({ ...prev, [currentTask.id]: flag }))} 
        />
      );
    }

    return (
      <InteractiveTerminal 
        targetIp={activeLab?.targetIp || '10.10.20.15'}
        initialMessage={`Connected to CyberPath ${room.title} container. Run CLI tools or type 'nmap ${activeLab?.targetIp || '10.10.20.15'}' to inspect host.`}
      />
    );
  };

  return (
    <div className="flex h-[calc(100vh-60px)] lg:h-screen w-full overflow-hidden bg-white dark:bg-[#080808] text-[#111111] dark:text-white select-none font-mono">
      
      {/* ─── LEFT COLUMN: ROOM TASK NAVIGATION (DESKTOP) ─── */}
      <aside className="w-64 border-r border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010] shrink-0 flex-col justify-between hidden md:flex">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Link to="/rooms" className="inline-flex items-center gap-1.5 text-xs text-[#666666] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white transition-colors mb-1 font-bold">
            <ArrowLeft size={13} /> BACK TO ROOMS
          </Link>
          
          <div className="space-y-1.5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
            <span className="text-[9px] uppercase tracking-widest text-[#888888] dark:text-[#777777] font-bold">
              ROOM CONTENT ({completedCount}/{roomTasks.length})
            </span>
            <h2 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight uppercase font-heading">
              {room.title}
            </h2>
            <ProgressBar value={progressPct} size="sm" />
          </div>

          <div className="space-y-1 pt-1">
            <button
              onClick={() => setActiveTab('intro')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === 'intro'
                  ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white'
                  : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white'
              }`}
            >
              <Info size={13} />
              <span>01. INTRODUCTION</span>
            </button>

            {roomTasks.map((task, index) => {
              const isDone = completedTasks.has(task.id);
              const isCurrent = activeTab === 'task' && selectedTaskIndex === index;

              return (
                <button
                  key={task.id}
                  onClick={() => {
                    setActiveTab('task');
                    setSelectedTaskIndex(index);
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all flex items-center justify-between cursor-pointer border ${
                    isCurrent
                      ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white'
                      : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-bold">
                      {isDone ? '✓' : isCurrent ? '●' : '○'}
                    </span>
                    <span className="truncate text-[11px]">
                      0{index + 2}. {task.title.toUpperCase()}
                    </span>
                  </div>
                  {isDone && <CheckCircle size={12} className={isCurrent ? 'text-white dark:text-black' : 'text-emerald-600 dark:text-emerald-400'} />}
                </button>
              );
            })}

            <button
              onClick={() => setActiveTab('lab')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === 'lab'
                  ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white'
                  : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white'
              }`}
            >
              <TermIcon size={13} />
              <span>PRACTICAL LAB</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-all flex items-center justify-between cursor-pointer border ${
                activeTab === 'quiz'
                  ? 'bg-[#111111] text-white font-bold border-[#111111] dark:bg-white dark:text-[#080808] dark:border-white'
                  : 'bg-white text-[#111111] border-[#E5E5E5] hover:border-[#111111] dark:bg-[#141414] dark:text-white dark:border-[#2A2A2A] dark:hover:border-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <QuizIcon size={13} />
                <span>FINAL CERTIFICATION</span>
              </div>
              {isQuizCompleted(room.id) && <CheckCircle size={12} className={activeTab === 'quiz' ? 'text-white dark:text-black' : 'text-emerald-600 dark:text-emerald-400'} />}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── CENTER COLUMN: TASK INSTRUCTIONS & WORKSPACE ─── */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between space-y-6">
        
        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2 gap-1 overflow-x-auto">
          {(['task', 'lab', 'terminal', 'connection', 'target'] as MobileTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded border ${
                mobileTab === tab ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white' : 'bg-white dark:bg-[#141414] text-[#111111] dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-[#888888] dark:text-[#777777]">
                {activeTab === 'intro' ? 'TASK 01' : `TASK 0${selectedTaskIndex + 2}`}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white">
                {room.difficulty.toUpperCase()}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded">
                +{currentTask?.points || 50} XP
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#111111] dark:text-white tracking-tight mt-1 uppercase font-heading">
              {activeTab === 'intro' && 'INTRODUCTION & OBJECTIVES'}
              {activeTab === 'task' && currentTask?.title}
              {activeTab === 'lab' && 'PRACTICAL VIRTUAL LAB WORKSPACE'}
              {activeTab === 'quiz' && 'ROOM CERTIFICATION EXAM'}
            </h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'intro' && (
            <div className="space-y-5 max-w-3xl text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
              <p>{room.description}</p>
              <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] space-y-2 font-mono">
                <h4 className="font-bold text-[#111111] dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={14} className="text-[#111111] dark:text-white" /> SKILLS YOU WILL MASTER
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-[#555555] dark:text-[#B5B5B5]">
                  {room.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => { setActiveTab('task'); setSelectedTaskIndex(0); }}
                  className="btn-cyber-primary text-xs py-2.5 px-5"
                >
                  <span>START TASK 01 →</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'task' && currentTask && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Task Objective Card */}
              <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] font-mono text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                  TASK OBJECTIVE
                </span>
                <p className="text-[#111111] dark:text-white font-bold text-sm">
                  {currentTask.description}
                </p>
                <p className="text-[#555555] dark:text-[#B5B5B5] text-xs font-sans">
                  {currentTask.question}
                </p>
              </div>

              {/* Lab Initialization Panel */}
              <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isLabActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span className="font-bold text-[#111111] dark:text-white uppercase">
                      TARGET: {activeLab?.targetMachine.name || 'LAB-TARGET-03'}
                    </span>
                  </div>
                  <span className="text-[#888888] dark:text-[#777777] text-[11px]">
                    IP: {activeLab?.targetIp || '10.10.20.15'}
                  </span>
                </div>

                {!isLabActive ? (
                  <button
                    onClick={() => startLab(room.id, currentTask.id)}
                    className="btn-cyber-primary text-xs w-full py-2"
                  >
                    <span>START LAB ENVIRONMENT →</span>
                  </button>
                ) : (
                  <div className="p-3 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">● LAB ACTIVE — TIME REMAINING: {formatTimer(activeLab.timeRemainingSeconds)}</span>
                    <button onClick={stopLab} className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline">
                      STOP LAB
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Workspace (Terminal or Web Target) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#888888] dark:text-[#777777] block">
                  SIMULATED LAB WORKSPACE
                </span>
                {renderTaskWorkspace()}
              </div>

              {/* Answer & Flag Submission Form */}
              <div className="space-y-3 pt-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] font-bold uppercase text-[#111111] dark:text-white block tracking-wider">
                  SUBMIT ANSWER OR CTF FLAG
                </span>
                <div className="flex gap-2.5 max-w-md">
                  <input
                    type="text"
                    placeholder="ENTER ANSWER / CP{...}"
                    value={answers[currentTask.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentTask.id]: e.target.value }))}
                    disabled={isTaskCompleted(currentTask.id)}
                    className="flex-1 bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white disabled:opacity-60 font-mono"
                  />
                  <button 
                    onClick={() => handleTaskSubmit(currentTask)}
                    disabled={isTaskCompleted(currentTask.id)}
                    className={isTaskCompleted(currentTask.id) ? 'btn-cyber-secondary text-xs' : 'btn-cyber-primary text-xs'}
                  >
                    {isTaskCompleted(currentTask.id) ? '✓ VERIFIED' : 'SUBMIT ANSWER →'}
                  </button>
                </div>

                {taskFeedback[currentTask.id] && (
                  <div className={`p-3 rounded border text-xs max-w-md font-mono font-bold ${
                    taskFeedback[currentTask.id].success 
                      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                      : 'border-rose-600 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                  }`}>
                    {taskFeedback[currentTask.id].msg}
                  </div>
                )}

                {/* Progressive Hint System */}
                <div className="pt-2">
                  <button 
                    onClick={() => handleShowHint(currentTask.id)}
                    className="text-[11px] font-bold text-[#666666] dark:text-[#B5B5B5] hover:text-[#111111] dark:hover:text-white underline cursor-pointer"
                  >
                    {(hintLevel[currentTask.id] || 0) === 0 ? '[ SHOW HINT (-10 XP) ]' : (hintLevel[currentTask.id] || 0) === 1 ? '[ SHOW SECOND HINT (-20 XP) ]' : '[ HINTS REVEALED ]'}
                  </button>

                  {(hintLevel[currentTask.id] || 0) >= 1 && (
                    <div className="mt-2 p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] text-xs text-[#555555] dark:text-[#B5B5B5] font-mono leading-relaxed max-w-md space-y-1">
                      <span className="font-bold text-[#111111] dark:text-white block">HINT 01:</span>
                      <p>{currentTask.hint}</p>
                    </div>
                  )}

                  {(hintLevel[currentTask.id] || 0) >= 2 && (
                    <div className="mt-2 p-3 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] text-xs text-[#555555] dark:text-[#B5B5B5] font-mono leading-relaxed max-w-md space-y-1">
                      <span className="font-bold text-[#111111] dark:text-white block">HINT 02:</span>
                      <p>Double-check command syntax or target IP e.g. nmap {activeLab?.targetIp || '10.10.20.15'}.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lab' && (
            <div className="space-y-4">
              <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] text-xs text-[#555555] dark:text-[#B5B5B5]">
                Full practical lab view for {room.title}. Run terminal commands or inspect web containers.
              </div>
              {renderTaskWorkspace()}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6 max-w-xl font-mono">
              <p className="text-xs text-[#555555] dark:text-[#B5B5B5]">
                Final Room Certification. Answer correctly to finalize certification for {room.title}.
              </p>
              <div className="p-5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#141414] space-y-3">
                <p className="text-xs font-bold text-[#111111] dark:text-white">
                  Which protocol or command allows secure terminal access to host machines on port 22?
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {['FTP', 'HTTP', 'SSH', 'DNS'].map((ans) => (
                    <button
                      key={ans}
                      onClick={() => setQuizSelectedAnswers({ 0: ans })}
                      className={`p-3 rounded border text-left text-xs transition-all cursor-pointer font-mono font-bold ${
                        quizSelectedAnswers[0] === ans 
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-[#080808] border-[#111111] dark:border-white' 
                          : 'bg-white dark:bg-[#181818] text-[#111111] dark:text-white border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-white'
                      }`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  setQuizSubmitted(true);
                  if (quizSelectedAnswers[0] === 'SSH') {
                    setQuizFeedback('✓ CERTIFICATION VERIFIED! +100 XP');
                    completeQuiz(room.id, 100);
                  } else {
                    setQuizFeedback('✕ INCORRECT ANSWER. SELECT SSH.');
                  }
                }}
                className="btn-cyber-primary text-xs py-2 px-5"
              >
                SUBMIT CERTIFICATION →
              </button>
              {quizSubmitted && quizFeedback && (
                <div className="p-3 rounded border border-[#111111] dark:border-white bg-white dark:bg-[#141414] text-[#111111] dark:text-white font-bold text-xs">
                  {quizFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Task Bottom Controls */}
        <div className="border-t border-[#E5E5E5] dark:border-[#2A2A2A] pt-4 flex items-center justify-between text-xs font-mono text-[#888888] dark:text-[#777777]">
          <span>{room.difficulty.toUpperCase()} LEVEL</span>
          <div className="flex gap-2">
            {activeTab === 'task' && selectedTaskIndex < roomTasks.length - 1 && (
              <button
                onClick={() => setSelectedTaskIndex(prev => prev + 1)}
                className="btn-cyber-primary text-xs"
              >
                NEXT TASK →
              </button>
            )}
          </div>
        </div>

      </main>

      {/* ─── RIGHT COLUMN: LAB STATUS & TARGET CONTROL PANEL (DESKTOP) ─── */}
      <aside className="w-72 border-l border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010] p-4 shrink-0 flex-col justify-between hidden xl:flex select-none font-mono space-y-5">
        <div className="space-y-5 overflow-y-auto">
          
          {/* Lab Status Panel */}
          <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-sm">
            <span className="text-[9px] font-bold uppercase text-[#888888] dark:text-[#777777] tracking-widest block border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
              LAB CONNECTION STATUS
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span>STATUS:</span>
                <span className={`font-bold ${isLabActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isLabActive ? '● ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#555555] dark:text-[#B5B5B5]">
                <span>NETWORK:</span>
                <span className="font-bold text-[#111111] dark:text-white">CYBERPATH-LAB</span>
              </div>
              <div className="flex justify-between items-center text-[#555555] dark:text-[#B5B5B5]">
                <span>TARGET IP:</span>
                <span className="font-bold text-[#111111] dark:text-white">{activeLab?.targetIp || '10.10.20.15'}</span>
              </div>
              <div className="flex justify-between items-center text-[#555555] dark:text-[#B5B5B5]">
                <span>VPN STATUS:</span>
                <span className={`font-bold ${vpnStatus.connected ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {vpnStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-1.5">
              <button 
                onClick={downloadVpnConfig}
                className="w-full btn-cyber-secondary text-[11px] py-1.5 justify-center"
              >
                <Download size={12} />
                <span>DOWNLOAD VPN CONFIG</span>
              </button>
              <Link 
                to="/vpn"
                className="block text-center w-full btn-cyber-bracket text-[11px] py-1.5 justify-center"
              >
                CONNECTION GUIDE
              </Link>
            </div>
          </div>

          {/* Target Machine Control Card */}
          <div className="p-4 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-3 shadow-sm">
            <span className="text-[9px] font-bold uppercase text-[#888888] dark:text-[#777777] tracking-widest block border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-2">
              TARGET MACHINE CONTROL
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span>NAME:</span>
                <span className="font-bold text-[#111111] dark:text-white">{activeLab?.targetMachine.name || 'WEB-BOX-01'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>OS:</span>
                <span className="font-bold text-[#111111] dark:text-white">{activeLab?.targetMachine.os || 'Linux'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>STATUS:</span>
                <span className={`font-bold ${isLabActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {isLabActive ? '● RUNNING' : 'STOPPED'}
                </span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-1.5 text-[11px]">
              <button onClick={resetLab} disabled={!isLabActive} className="btn-cyber-secondary py-1 px-2 text-[10px]">
                RESET
              </button>
              <button onClick={stopLab} disabled={!isLabActive} className="btn-cyber-secondary py-1 px-2 text-[10px]">
                STOP
              </button>
            </div>
          </div>

          {/* Lab Session Countdown Timer Card */}
          {isLabActive && (
            <div className="p-4 rounded border border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#181818] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#111111] dark:text-white">
                  <Clock size={14} /> TIME REMAINING
                </span>
                <span className="text-lg font-mono font-extrabold text-[#111111] dark:text-white">
                  {formatTimer(activeLab.timeRemainingSeconds)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button onClick={togglePauseLab} className="btn-cyber-secondary py-1">
                  {activeLab.status === 'PAUSED' ? 'RESUME' : 'PAUSE'}
                </button>
                <button onClick={stopLab} className="btn-cyber-secondary py-1">
                  END SESSION
                </button>
              </div>
            </div>
          )}
        </div>

        {completedCount === roomTasks.length && (
          <button
            onClick={() => {
              completeRoom(room.id);
              navigate('/rooms');
            }}
            className="w-full btn-cyber-primary py-2.5 text-xs tracking-wider uppercase font-bold"
          >
            [ COMPLETE ROOM → ]
          </button>
        )}
      </aside>

    </div>
  );
}
