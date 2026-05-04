import React from 'react';
import { LFS_STEPS } from '../constants/lfsSteps';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Target, Flag, Zap, Clock } from 'lucide-react';

interface ProgressProps {
  progress: Record<number, { isCompleted: boolean; completedSubSteps: string[] }>;
  quizResults: Record<number, { score: number; totalQuestions: number }>;
}

export const Progress: React.FC<ProgressProps> = ({ progress, quizResults }) => {
  const completedStepsCount = Object.values(progress).filter(p => p.isCompleted).length;
  const totalSteps = LFS_STEPS.length;
  const overallPercent = Math.round((completedStepsCount / totalSteps) * 100);

  const chartData = LFS_STEPS.map(step => {
    const p = progress[step.id] || { isCompleted: false, completedSubSteps: [] };
    const q = quizResults[step.id] || { score: 0, totalQuestions: 0 };
    return {
      name: `Step ${step.id}`,
      completion: Math.round((p.completedSubSteps.length / (step.subSteps.length || 1)) * 100),
      label: step.title,
      quizScore: q.totalQuestions > 0 ? Math.round((q.score / q.totalQuestions) * 100) : 0
    };
  });

  const pieData = [
    { name: 'Completed', value: completedStepsCount },
    { name: 'Remaining', value: totalSteps - completedStepsCount }
  ];

  const COLORS = ['#3b82f6', '#1e293b'];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Overall Progress", value: `${overallPercent}%`, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Completed Chapters", value: `${completedStepsCount}/${totalSteps}`, icon: Flag, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Quiz Success Rate", value: "85%", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Est. Time to Finish", value: "24h", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        {/* Step-by-Step Completion Bar Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col min-h-0">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Chapter Completion (%)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#555" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#ffffff08' }}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px' }}
                />
                <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completion === 100 ? '#22c55e' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Progress Radial */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-8 left-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Status Overview</h3>
           </div>
           
           <div className="relative w-64 h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={pieData}
                       innerRadius={80}
                       outerRadius={100}
                       paddingAngle={5}
                       dataKey="value"
                       startAngle={90}
                       endAngle={-270}
                    >
                       {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-black tracking-tighter">{overallPercent}%</span>
                 <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Mastery</span>
              </div>
           </div>

           <div className="mt-8 flex gap-8">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-500" />
                 <span className="text-xs text-gray-400">Completed Chapters</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#1e293b]" />
                 <span className="text-xs text-gray-400">In Progress / Pending</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
