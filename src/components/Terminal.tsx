import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalProps {
  initialCommand?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ initialCommand = "ls -la" }) => {
  const [history, setHistory] = useState<{ type: 'cmd' | 'output', text: string }[]>([
    { type: 'output', text: 'LFS Mastery Lab - Terminal Environment ready.' },
    { type: 'output', text: 'Type "help" for a list of simulated commands.' }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    let response = "";

    switch (trimmed) {
      case 'help':
        response = 'Simulated commands: help, clear, ls, whoami, uname, export, cat, ./version-check.sh';
        break;
      case 'ls':
        response = 'bin  etc  home  lib  mnt  proc  root  sbin  sys  tmp  usr  var';
        break;
      case 'whoami':
        response = 'lfs';
        break;
      case 'uname -a':
        response = 'Linux lfs-lab 6.2.0-lfs #1 SMP Mon Jan 1 00:00:00 UTC 2024 x86_64 GNU/Linux';
        break;
      case 'clear':
        setHistory([]);
        return;
      case './version-check.sh':
        response = 'Bash: 5.2.15\nBinutils: 2.40\nGCC: 12.2.0\nGlibc: 2.37\nKernel: 6.2.0\nMake: 4.4.1\nCheck complete: Pre-requisites met.';
        break;
      default:
        response = `Command not found: ${cmd}. This is a simulated environment.`;
    }

    setHistory(prev => [
      ...prev,
      { type: 'cmd', text: cmd },
      { type: 'output', text: response }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-lg border border-[#333] shadow-2xl overflow-hidden font-mono text-sm">
      <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-[#333]">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-500" />
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Interactive LFS Terminal</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-2">
        {history.map((line, i) => (
          <div key={i} className={line.type === 'cmd' ? "flex gap-2" : "text-gray-400 whitespace-pre-wrap pl-6"}>
            {line.type === 'cmd' && <span className="text-green-500">lfs@lab:~$</span>}
            <span className={line.type === 'cmd' ? "text-white" : ""}>{line.text}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-[#111] border-t border-[#333] flex items-center gap-2">
        <span className="text-green-500 whitespace-nowrap">lfs@lab:~$</span>
        <input
          id="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
             if (e.key === 'ArrowUp' && history.length > 0) {
               const lastCmd = [...history].reverse().find(h => h.type === 'cmd');
               if (lastCmd) setInput(lastCmd.text);
             }
          }}
          autoFocus
          autoComplete="off"
          spellCheck="false"
          className="flex-1 bg-transparent border-none outline-none text-white selection:bg-green-500/30"
          placeholder="Type a command..."
        />
        <button type="submit" className="p-1 text-gray-500 hover:text-green-500 transition-colors">
          <Play className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
