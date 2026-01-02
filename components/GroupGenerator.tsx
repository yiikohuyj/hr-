
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateTeamNames } from '../services/geminiService';

interface Props {
  participants: Participant[];
}

const GroupGenerator: React.FC<Props> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState<number>(Math.min(4, participants.length));
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleGenerateGroups = async () => {
    if (groupSize < 1) return;
    setIsGenerating(true);

    const shuffled = shuffleArray<Participant>(participants);
    const result: Group[] = [];
    let groupIdx = 0;

    for (let i = 0; i < shuffled.length; i += groupSize) {
      result.push({
        id: groupIdx++,
        name: `第 ${groupIdx} 小組`,
        members: shuffled.slice(i, i + groupSize),
      });
    }

    try {
      const coolNames = await generateTeamNames(result.length);
      result.forEach((group, idx) => {
        group.name = coolNames[idx] || group.name;
      });
    } catch (e) {
      console.warn("使用預設名稱");
    }

    setGroups(result);
    setIsGenerating(false);
  };

  const handleDownloadCSV = () => {
    if (groups.length === 0) return;

    // 建立 CSV 標頭
    let csvContent = "\uFEFF小組名稱,成員姓名\n"; // \uFEFF 是為了讓 Excel 正確識別 UTF-8 編碼

    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-800">智能分組工具</h2>
          <p className="text-slate-500">快速將參與成員隨機分配到各個小組，並由 AI 命名。</p>
        </div>

        <div className="flex items-end space-x-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center block">每組人數</label>
            <input
              type="number"
              min="1"
              max={participants.length}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-24 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-center font-bold"
            />
          </div>
          <button
            onClick={handleGenerateGroups}
            disabled={isGenerating}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? 'AI 思考中...' : '開始分組'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">點擊「開始分組」來分配 {participants.length} 位成員。</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group animate-popIn">
              <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
                <h3 className="font-black text-indigo-600 truncate mr-2" title={group.name}>
                  {group.name}
                </h3>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-bold">
                  {group.members.length} 人
                </span>
              </div>
              <ul className="space-y-2">
                {group.members.map((member) => (
                  <li key={member.id} className="text-slate-600 flex items-center text-sm">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                    {member.name}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {groups.length > 0 && (
        <div className="flex flex-col items-center gap-4 pt-8">
           <button
             onClick={handleDownloadCSV}
             className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all flex items-center gap-2 shadow-md"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
             </svg>
             下載分組結果 (CSV)
           </button>
           <p className="text-slate-400 text-xs italic">隊名由 Gemini AI 創意生成</p>
        </div>
      )}
    </div>
  );
};

export default GroupGenerator;
