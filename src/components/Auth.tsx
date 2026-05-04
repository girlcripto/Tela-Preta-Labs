import React, { useState } from 'react';
import { signInWithGoogle, registerWithEmail, loginWithEmail, resetPassword } from '../lib/firebase';
import { LogIn, Globe, Shield, Terminal, Mail, Lock, User, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthMode = 'login' | 'register' | 'forgot-password' | 'social';

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('social');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'register') {
        await registerWithEmail(email, password, name);
      } else if (mode === 'login') {
        await loginWithEmail(email, password);
      } else if (mode === 'forgot-password') {
        await resetPassword(email);
        setStatus('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[40px] text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
          <Terminal className="w-8 h-8 stroke-[3]" />
        </div>

        <AnimatePresence mode="wait">
          {mode === 'social' ? (
            <motion.div
              key="social"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h1 className="text-3xl font-black tracking-tighter mb-4 leading-none italic uppercase">LFS Mastery Lab</h1>
              <p className="text-gray-400 mb-10 text-sm leading-relaxed">
                The definitive training environment for building your own Linux system from scratch.
              </p>

              <div className="space-y-4">
                <button 
                  onClick={signInWithGoogle}
                  className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                  <Globe className="w-4 h-4 ml-[-4px]" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">OR</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setMode('login')}
                    className="py-4 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setMode('register')}
                    className="py-4 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Register
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="email-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => {
                    setMode('social');
                    setError(null);
                    setStatus(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="flex-1 text-lg font-black uppercase tracking-tighter mr-8">
                  {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
                </h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium text-left">
                  {error}
                </div>
              )}

              {status && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium text-left">
                  {status}
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
                {mode === 'register' && (
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        required
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arch Linux"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-white/30 outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="root@lfs-lab.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-white/30 outline-none transition-colors"
                    />
                  </div>
                </div>

                {mode !== 'forgot-password' && (
                  <div>
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1 mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        required
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:border-white/30 outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register' : 'Send Instructions'}
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : mode === 'forgot-password' ? (
                    <Send className="w-4 h-4" />
                  ) : <LogIn className="w-4 h-4" />}
                </button>

                {mode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="w-full text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest hover:text-white transition-colors py-2"
                  >
                    Forgot your password?
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
           <div className="flex flex-col items-center gap-1">
              <Shield className="w-3 h-3" />
              <span className="text-[8px] font-mono tracking-widest uppercase">SSL</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <Lock className="w-3 h-3" />
              <span className="text-[8px] font-mono tracking-widest uppercase">AES-256</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <Globe className="w-3 h-3" />
              <span className="text-[8px] font-mono tracking-widest uppercase">Web3</span>
           </div>
        </div>
      </motion.div>

      <div className="mt-8 z-10 text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 flex flex-col items-center gap-2">
         <span>Property of AI Studio &copy; 2024</span>
         <div className="flex gap-4">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
         </div>
      </div>
    </div>
  );
};

