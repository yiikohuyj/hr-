
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
}

const LuckyDraw: React.FC<Props> = ({ participants }) => {
  const [candidates, setCandidates] = useState<Participant[]>([...participants]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentName, setCurrentName] = useState<string>('???');
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const spinIntervalRef = useRef<number | null>(null);

  const startSpin = () => {
    if (isSpinning) return;
    if (!allowDuplicates && candidates.length === 0) {
      alert("已經沒有剩餘的人選可以抽取了！");
      return;
    }

    setIsSpinning(true);
    let duration = 0;
    const maxDuration = 2000; 
    const interval = 80;

    spinIntervalRef.current = window.setInterval(() => {
      const source = allowDuplicates ? participants : candidates;
      const randomIndex = Math.floor(Math.random() * source.length);
      setCurrentName(source[randomIndex]?.name || "???");
      
      duration += interval;
      if (duration >= maxDuration) {
        finishSpin();
      }
    }, interval);
  };

  const finishSpin = () => {
    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    
    const source = allowDuplicates ? participants : candidates;
    const winnerIndex = Math.floor(Math.random() * source.length);
    const winner = source[winnerIndex];

    setWinners(prev => [winner, ...prev]);
    setCurrentName(winner.name);
    
    if (!allowDuplicates) {
      setCandidates(prev => prev.filter(c => c.id !== winner.id));
    }
    
    setIsSpinning(false);
  };

  const reset = () => {
    setCandidates([...participants]);
    setWinners([]);
    setCurrentName('???');
  };

  return (
    <div className="flex flex-col items-center space-y-10 animate-fadeIn">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-800">活動幸運大抽籤</h2>
        <p className="text-slate-500">今天的幸運得主會是誰呢？</p>
      </div>

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={allowDuplicates}
            onChange={(e) => {
              setAllowDuplicates(e.target.checked);
              setCandidates([...participants]);
            }}
            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-slate-600 group-hover:text-indigo-600 transition-colors font-medium">允許重複中獎</span>
        </label>
        
        <button 
          onClick={reset}
          className="text-slate-400 hover:text-slate-600 text-sm"
        >
          重置抽籤
        </button>
      </div>

      {/* 轉盤展示區域 */}
      <div className="relative w-full max-w-md aspect-video bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center p-8 border-8 border-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse"></div>
        </div>
        
        <div className={`text-white text-4xl md:text-5xl font-black text-center transition-all ${isSpinning ? 'scale-110 opacity-70 blur-[1px]' : 'scale-100'}`}>
          {currentName}
        </div>
        
        {!isSpinning && winners.length > 0 && (
          <div className="absolute top-4 right-4 animate-bounce bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            恭喜得獎！
          </div>
        )}
      </div>

      <button
        onClick={startSpin}
        disabled={isSpinning || (!allowDuplicates && candidates.length === 0)}
        className={`w-full max-w-xs py-5 rounded-2xl font-black text-xl tracking-wider transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 ${
          isSpinning 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isSpinning ? '正在抽獎中...' : '開始抽籤'}
      </button>

      {/* 中獎紀錄 */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          得獎名單
        </h3>
        <div className="flex flex-wrap gap-3">
          {winners.length === 0 ? (
            <div className="text-slate-400 italic">尚無中獎紀錄。</div>
          ) : (
            winners.map((w, idx) => (
              <div key={idx} className="bg-white border-2 border-indigo-100 px-4 py-2 rounded-xl text-indigo-700 font-semibold shadow-sm animate-popIn">
                🏆 {w.name}
              </div>
            ))
          )}
        </div>
      </div>
      
      {!allowDuplicates && (
        <div className="text-sm text-slate-400">
          剩餘候選人數：{candidates.length} 人
        </div>
      )}
    </div>
  );
};

export default LuckyDraw;
