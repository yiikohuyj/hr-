
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface Props {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onNext: () => void;
}

const MOCK_DATA = [
  "王大同", "李小龍", "張小泉", "陳美玲", 
  "林志豪", "吳淑芬", "周杰倫", "蔡依林",
  "郭台銘", "徐若瑄", "黃秋生", "劉德華"
];

const ParticipantManager: React.FC<Props> = ({ participants, onUpdate, onNext }) => {
  const [textInput, setTextInput] = useState('');

  // 計算重複項
  const nameCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    participants.forEach(p => {
      counts[p.name] = (counts[p.name] || 0) + 1;
    });
    return counts;
  }, [participants]);

  const hasDuplicates = useMemo(() => 
    Object.values(nameCounts).some(count => count > 1), 
  [nameCounts]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
      const newList = lines.map(line => ({
        id: Math.random().toString(36).substr(2, 9) + Date.now(),
        name: line.replace(/^"(.*)"$/, '$1').trim(), 
      }));
      onUpdate([...participants, ...newList]);
    };
    reader.readAsText(file);
  };

  const handleAddFromText = () => {
    const names = textInput.split(/\r?\n/).filter(name => name.trim() !== '');
    if (names.length === 0) return;

    const newList = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      name: name.trim(),
    }));
    onUpdate([...participants, ...newList]);
    setTextInput('');
  };

  const handleLoadMockData = () => {
    const newList = MOCK_DATA.map(name => ({
      id: Math.random().toString(36).substr(2, 9) + Date.now(),
      name,
    }));
    onUpdate([...participants, ...newList]);
  };

  const handleRemoveDuplicates = () => {
    const seen = new Set<string>();
    const uniqueList = participants.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
    onUpdate(uniqueList);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">1. 建立參與名單</h2>
          <p className="text-slate-500 text-sm">請貼上姓名（每行一個）或上傳 CSV。</p>
          
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-mono text-sm"
            placeholder="王小明&#10;李大華&#10;陳小姐..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddFromText}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                加入名單
              </button>
              <label className="flex-1 cursor-pointer bg-white border border-indigo-600 text-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 text-center transition-colors shadow-sm">
                上傳 CSV
                <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <button
              onClick={handleLoadMockData}
              className="w-full bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              ✨ 使用範例資料 (快速測試)
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800">2. 目前名單</h2>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                {participants.length} 人
              </span>
            </div>
            {hasDuplicates && (
              <button
                onClick={handleRemoveDuplicates}
                className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                移除重複項
              </button>
            )}
          </div>
          
          <div className="border border-slate-200 rounded-xl max-h-[350px] overflow-y-auto divide-y divide-slate-100">
            {participants.length === 0 ? (
              <div className="p-10 text-center text-slate-400 italic">
                目前名單還是空的。
              </div>
            ) : (
              participants.map((p, idx) => {
                const isDuplicate = nameCounts[p.name] > 1;
                return (
                  <div key={p.id} className={`p-3 flex justify-between items-center group transition-colors ${isDuplicate ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}>
                    <span className="text-slate-700 flex items-center">
                      <span className="text-slate-300 mr-2 font-mono text-xs">{idx + 1}.</span>
                      {p.name}
                      {isDuplicate && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded uppercase tracking-tighter">
                          重複
                        </span>
                      )}
                    </span>
                    <button 
                      onClick={() => onUpdate(participants.filter(item => item.id !== p.id))}
                      className="text-slate-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {participants.length > 0 && (
            <button
              onClick={() => onUpdate([])}
              className="w-full text-slate-400 hover:text-red-500 text-xs transition-colors py-1"
            >
              清除全部名單
            </button>
          )}
        </section>
      </div>

      {participants.length > 0 && (
        <div className="pt-6 border-t border-slate-100 flex justify-center">
          <button
            onClick={onNext}
            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            前往抽籤！ →
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantManager;
