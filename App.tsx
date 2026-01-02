
import React, { useState, useCallback } from 'react';
import { ViewMode, Participant } from './types';
import ParticipantManager from './components/ParticipantManager';
import LuckyDraw from './components/LuckyDraw';
import GroupGenerator from './components/GroupGenerator';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('list');
  const [participants, setParticipants] = useState<Participant[]>([]);

  const handleUpdateParticipants = useCallback((newList: Participant[]) => {
    setParticipants(newList);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight mb-2">
          HR 專業行政助手
        </h1>
        <p className="text-slate-500 text-lg">輕鬆管理您的團隊活動、獎品抽籤與自動分組。</p>
      </header>

      <nav className="flex justify-center mb-8 sticky top-4 z-50">
        <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-200 flex space-x-1">
          <button
            onClick={() => setView('list')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              view === 'list'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            名單管理
          </button>
          <button
            onClick={() => setView('lucky-draw')}
            disabled={participants.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              view === 'lucky-draw'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            獎品抽籤
          </button>
          <button
            onClick={() => setView('grouping')}
            disabled={participants.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              view === 'grouping'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            自動分組
          </button>
        </div>
      </nav>

      <main className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10 min-h-[600px] transition-all">
        {view === 'list' && (
          <ParticipantManager 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
            onNext={() => setView('lucky-draw')}
          />
        )}
        {view === 'lucky-draw' && (
          <LuckyDraw 
            participants={participants} 
          />
        )}
        {view === 'grouping' && (
          <GroupGenerator 
            participants={participants} 
          />
        )}
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} HR Pro Toolbox • 由 Gemini AI 提供創意支援
      </footer>
    </div>
  );
};

export default App;
