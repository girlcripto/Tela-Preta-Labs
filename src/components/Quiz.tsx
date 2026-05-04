import React, { useState } from 'react';
import { LFS_STEPS } from '../constants/lfsSteps';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface QuizProps {
  onQuizComplete: (stepId: number, score: number) => void;
  selectedStepId: number;
}

export const Quiz: React.FC<QuizProps> = ({ onQuizComplete, selectedStepId }) => {
  const step = LFS_STEPS.find(s => s.id === selectedStepId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!step) return <div>Select a step to start the quiz.</div>;

  const currentQuestion = step.quiz[currentQuestionIndex];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < step.quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onQuizComplete(step.id, score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / step.quiz.length) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {step.quiz.length}</span>
              <HelpCircle className="w-5 h-5 text-blue-500 opacity-50" />
            </div>

            <h2 className="text-2xl font-bold mb-10 leading-tight">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group",
                    selectedOption === idx 
                      ? idx === currentQuestion.correctAnswer 
                        ? "bg-green-500/10 border-green-500 text-green-400" 
                        : "bg-red-500/10 border-red-500 text-red-400"
                      : isAnswered && idx === currentQuestion.correctAnswer
                        ? "bg-green-500/10 border-green-500/50 text-green-400"
                        : "bg-white/5 border-white/5 hover:border-white/20 text-gray-300"
                  )}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && idx === currentQuestion.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                  {isAnswered && selectedOption === idx && idx !== currentQuestion.correctAnswer && <XCircle className="w-5 h-5" />}
                </button>
              ))}
            </div>

            {isAnswered && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={nextQuestion}
                className="mt-10 w-full py-4 bg-white text-black font-black uppercase tracking-tighter rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < step.quiz.length - 1 ? "Next Question" : "Finish Quiz"}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl"
          >
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter mb-4">QUIZ COMPLETE!</h2>
            <div className="text-6xl font-mono font-black mb-8 text-white">
              {score}/{step.quiz.length}
            </div>
            <p className="text-gray-400 mb-10 max-w-sm mx-auto">
              {score === step.quiz.length 
                ? "Perfect! You've mastered this chapter's concepts." 
                : "Good effort! Review the chapter content and try again for a perfect score."}
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <button
                onClick={resetQuiz}
                className="flex-1 py-4 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                RETRY
              </button>
              <button
                onClick={() => { /* Navigate to next step or progress */ }}
                className="flex-1 py-4 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add missing icon import
import { Award } from 'lucide-react';
