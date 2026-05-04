import React from 'react';
import { LFS_STEPS, LfsStep } from '../constants/lfsSteps';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ChecklistProps {
  progress: Record<number, { isCompleted: boolean; completedSubSteps: string[] }>;
  onToggleSubStep: (stepId: number, subStepId: string) => void;
  onToggleStep: (stepId: number) => void;
  selectedStepId: number;
  setSelectedStepId: (id: number) => void;
}

export const Checklist: React.FC<ChecklistProps> = ({ progress, onToggleSubStep, onToggleStep, selectedStepId, setSelectedStepId }) => {
  const selectedStep = LFS_STEPS.find(s => s.id === selectedStepId);

  return (
    <div className="flex h-full gap-6">
      {/* Steps List */}
      <div className="w-1/3 bg-white/5 rounded-xl border border-white/10 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">Chapters</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {LFS_STEPS.map((step) => {
            const isCompleted = progress[step.id]?.isCompleted;
            const completedCount = progress[step.id]?.completedSubSteps.length || 0;
            const totalCount = step.subSteps.length;
            const percent = (completedCount / totalCount) * 100;

            return (
              <button
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200 flex items-start gap-3 group relative",
                  selectedStepId === step.id ? "bg-white text-black shadow-lg" : "hover:bg-white/10 text-gray-300"
                )}
              >
                <div className={cn(
                  "mt-0.5 flex-shrink-0",
                  isCompleted ? "text-green-500" : percent > 0 ? "text-blue-500" : "text-gray-600"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono opacity-50">Step {String(step.id).padStart(2, '0')}</span>
                    {totalCount > 0 && (
                      <span className="text-[10px] font-mono opacity-50">{completedCount}/{totalCount}</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold leading-tight line-clamp-1">{step.title}</h4>
                  <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-500", isCompleted ? "bg-green-500" : "bg-blue-500")}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Substeps Detail */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {selectedStep ? (
          <motion.div 
            key={selectedStep.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 bg-white/5 rounded-xl border border-white/10 p-8 overflow-y-auto"
          >
            <div className="mb-8">
              <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] font-mono font-bold uppercase tracking-tighter mb-2">Chapter {selectedStep.id}</span>
              <h2 className="text-3xl font-black tracking-tighter mb-2">{selectedStep.title}</h2>
              <p className="text-gray-400 leading-relaxed max-w-2xl">{selectedStep.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-white/10 pb-2">Sub-steps Checklist</h3>
              {selectedStep.subSteps.map((sub) => {
                const isChecked = progress[selectedStep.id]?.completedSubSteps.includes(sub.id);
                return (
                  <div 
                    key={sub.id} 
                    className={cn(
                      "p-4 rounded-lg border transition-all duration-200 cursor-pointer flex gap-4 group",
                      isChecked ? "bg-green-500/10 border-green-500/20" : "bg-white/5 border-white/10 hover:border-white/30"
                    )}
                    onClick={() => onToggleSubStep(selectedStep.id, sub.id)}
                  >
                    <div className={cn(
                      "mt-1 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors",
                      isChecked ? "bg-green-500 border-green-500 text-black" : "border-white/20 group-hover:border-white/40"
                    )}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <h5 className={cn("font-bold text-sm mb-1", isChecked ? "text-green-400" : "text-white")}>{sub.title}</h5>
                      <p className="text-sm text-gray-400 mb-3">{sub.description}</p>
                      {sub.command && (
                        <div className="bg-black/40 rounded p-3 font-mono text-xs text-blue-400 flex items-center justify-between group/cmd">
                          <code>$ {sub.command}</code>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(sub.command!);
                            }}
                            className="opacity-0 group-hover/cmd:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[10px] text-white"
                          >
                            COPY
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-lg">Finished with this chapter?</h4>
                <p className="text-sm text-gray-400">Complete all substeps to finalize this chapter.</p>
              </div>
              <button
                onClick={() => onToggleStep(selectedStep.id)}
                className={cn(
                  "px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-xl",
                  progress[selectedStep.id]?.isCompleted ? "bg-green-500 text-black" : "bg-white text-black hover:scale-105 active:scale-95"
                )}
              >
                {progress[selectedStep.id]?.isCompleted ? "COMPLETED" : "MARK CHAPTER AS COMPLETE"}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 border border-white/10 border-dashed rounded-xl">
            Select a step from the list to begin
          </div>
        )}
      </div>
    </div>
  );
};
