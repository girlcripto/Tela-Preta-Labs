/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { auth, db, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  getDocs, 
  updateDoc, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { Sidebar, Section } from './components/Sidebar';
import { Terminal } from './components/Terminal';
import { Checklist } from './components/Checklist';
import { Quiz } from './components/Quiz';
import { Reference } from './components/Reference';
import { Progress } from './components/Progress';
import { Certificate } from './components/Certificate';
import { Auth } from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';

// Error Handling helper
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('terminal');
  const [selectedStepId, setSelectedStepId] = useState(1);
  const [progress, setProgress] = useState<Record<number, { isCompleted: boolean; completedSubSteps: string[] }>>({});
  const [quizResults, setQuizResults] = useState<Record<number, { score: number; totalQuestions: number }>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Sync user profile
        const userRef = doc(db, 'users', user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }

          // Initial load of progress
          const progressQuery = query(collection(db, 'users', user.uid, 'progress'));
          const progressSnap = await getDocs(progressQuery);
          const progressData: any = {};
          progressSnap.forEach(doc => {
            progressData[doc.id] = doc.data();
          });
          setProgress(progressData);

          // Initial load of quiz results
          const quizQuery = query(collection(db, 'users', user.uid, 'quizzes'));
          const quizSnap = await getDocs(quizQuery);
          const quizData: any = {};
          quizSnap.forEach(doc => {
            quizData[doc.id] = doc.data();
          });
          setQuizResults(quizData);

        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleSubStep = async (stepId: number, subStepId: string) => {
    if (!user) return;
    const stepRef = doc(db, 'users', user.uid, 'progress', String(stepId));
    const currentStep = progress[stepId] || { isCompleted: false, completedSubSteps: [] };
    
    let newSubSteps = [...currentStep.completedSubSteps];
    if (newSubSteps.includes(subStepId)) {
      newSubSteps = newSubSteps.filter(id => id !== subStepId);
    } else {
      newSubSteps.push(subStepId);
    }

    const newData = {
      ...currentStep,
      completedSubSteps: newSubSteps,
      updatedAt: serverTimestamp(),
      userId: user.uid,
      stepId: stepId
    };

    try {
      await setDoc(stepRef, newData, { merge: true });
      setProgress(prev => ({ ...prev, [stepId]: { ...currentStep, completedSubSteps: newSubSteps } }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/progress/${stepId}`);
    }
  };

  const handleToggleStep = async (stepId: number) => {
    if (!user) return;
    const stepRef = doc(db, 'users', user.uid, 'progress', String(stepId));
    const currentStep = progress[stepId] || { isCompleted: false, completedSubSteps: [] };
    
    const isCompleted = !currentStep.isCompleted;
    const newData = {
      ...currentStep,
      isCompleted,
      updatedAt: serverTimestamp(),
      userId: user.uid,
      stepId: stepId
    };

    try {
      await setDoc(stepRef, newData, { merge: true });
      setProgress(prev => ({ ...prev, [stepId]: { ...currentStep, isCompleted } }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/progress/${stepId}`);
    }
  };

  const handleQuizComplete = async (stepId: number, score: number, totalQuestions: number) => {
    if (!user) return;
    const quizRef = doc(db, 'users', user.uid, 'quizzes', String(stepId));
    const quizData = {
      userId: user.uid,
      stepId,
      score,
      totalQuestions,
      completedAt: serverTimestamp()
    };

    try {
      await setDoc(quizRef, quizData);
      setQuizResults(prev => ({ ...prev, [stepId]: { score, totalQuestions } }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/quizzes/${stepId}`);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">Initializing Lab...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_40%)]" />
        
        <div className="h-full max-w-7xl mx-auto p-8 relative z-10 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 min-h-0"
            >
              {activeSection === 'terminal' && <Terminal />}
              {activeSection === 'checklist' && (
                <Checklist 
                  progress={progress} 
                  onToggleSubStep={handleToggleSubStep}
                  onToggleStep={handleToggleStep}
                  selectedStepId={selectedStepId}
                  setSelectedStepId={setSelectedStepId}
                />
              )}
              {activeSection === 'quiz' && (
                <Quiz 
                  selectedStepId={selectedStepId}
                  onQuizComplete={(id: number, score: number) => {
                    const step = LFS_STEPS.find(s => s.id === id);
                    if (step) handleQuizComplete(id, score, step.quiz.length);
                  }}
                />
              )}
              {activeSection === 'reference' && <Reference />}
              {activeSection === 'progress' && <Progress progress={progress} quizResults={quizResults} />}
              {activeSection === 'certificate' && <Certificate user={user} progress={progress} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Ensure LFS_STEPS is imported for Quiz total questions logic
import { LFS_STEPS } from './constants/lfsSteps';

