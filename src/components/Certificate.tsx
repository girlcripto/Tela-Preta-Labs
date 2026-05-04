import React, { useRef } from 'react';
import { Award, Download, Share2, ShieldCheck, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import { LFS_STEPS } from '../constants/lfsSteps';

interface CertificateProps {
  user: any;
  progress: Record<number, { isCompleted: boolean }>;
}

export const Certificate: React.FC<CertificateProps> = ({ user, progress }) => {
  const allCompleted = LFS_STEPS.every(step => progress[step.id]?.isCompleted);
  const certRef = useRef<HTMLDivElement>(null);

  if (!allCompleted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 grayscale opacity-40">
           <Award className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-4 opacity-40">CERTIFICATE LOCKED</h2>
        <p className="text-gray-500 leading-relaxed">
          Complete all 12 chapters of the Linux From Scratch Mastery Lab and pass the respective quizzes to unlock your professional certification.
        </p>
        <div className="mt-8 w-full bg-white/5 rounded-2xl p-6 border border-white/10">
           <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Progress</span>
              <span className="text-xs font-mono text-blue-500">
                 {Object.values(progress).filter(p => p.isCompleted).length} / {LFS_STEPS.length} Chapters
              </span>
           </div>
           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                 className="h-full bg-blue-500 transition-all duration-1000"
                 style={{ width: `${(Object.values(progress).filter(p => p.isCompleted).length / LFS_STEPS.length) * 100}%` }}
              />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-8 bg-black/20 p-8 rounded-3xl border border-white/5">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-black tracking-tighter">Your Certification</h2>
            <p className="text-gray-400">Congratulations on mastering the art of Linux From Scratch.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors">
               <Download className="w-4 h-4" /> DOWNLOAD PDF
            </button>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
               <Printer className="w-4 h-4" />
            </button>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12">
        <motion.div 
          initial={{ rotateX: 10, opacity: 0, y: 50 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          className="relative w-full max-w-4xl aspect-[1.414/1] bg-[#111] border-[12px] border-[#222] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
          style={{ perspective: '1000px' }}
        >
          {/* Certificate Design */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />
          </div>

          <div className="h-full flex flex-col p-16 relative z-10 text-center">
             <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                   <Award className="w-8 h-8 text-black" />
                </div>
             </div>

             <h3 className="text-sm font-mono text-gray-500 uppercase tracking-[0.4em] mb-4">Certificate of Mastery</h3>
             <h1 className="text-5xl font-black tracking-tighter mb-8 italic">LINUX FROM SCRATCH</h1>
             
             <div className="w-24 h-0.5 bg-white/20 mx-auto mb-10" />

             <p className="text-lg text-gray-400 mb-2">This is to certify that</p>
             <h2 className="text-4xl font-bold mb-10 text-white underline decoration-white/20 underline-offset-8">{user?.displayName || 'Anonymous Explorer'}</h2>
             
             <p className="max-w-2xl mx-auto text-gray-400 text-sm leading-relaxed mb-12">
                Has successfully completed the 12-chapter rigorous training of the LFS Mastery Lab, demonstrating profound understanding of system toolchains, kernel compilation, and standalone system architecture.
             </p>

             <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-12">
                <div className="text-left">
                   <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">Issued On</p>
                   <p className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex flex-col items-center">
                   <ShieldCheck className="w-10 h-10 text-blue-500 mb-2 opacity-50" />
                   <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Verified by LFS Lab</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1">Certificate ID</p>
                   <p className="text-sm font-bold font-mono">LFS-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
             </div>
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rotate-45" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 -ml-16 -mb-16 rotate-45" />
        </motion.div>
      </div>
    </div>
  );
};
