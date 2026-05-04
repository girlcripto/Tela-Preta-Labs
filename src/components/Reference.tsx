import React from 'react';
import { Book, ExternalLink, ShieldCheck, Zap, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const Reference: React.FC = () => {
  const content = `
# Linux From Scratch Reference

LFS is a project that provides you with step-by-step instructions to build your own custom Linux system, entirely from source code.

## Key Directory Structure
| Directory | Purpose |
| :--- | :--- |
| \`/bin\` | Essential user command binaries (e.g., cat, ls) |
| \`/etc\` | Host-specific system-wide configuration files |
| \`/lib\` | Essential shared libraries and kernel modules |
| \`/sbin\` | Essential system binaries (e.g., fsck, init, route) |
| \`/usr\` | Secondary hierarchy for read-only user data |
| \`/var\` | Variable data (spool directories, log, temp files) |

## Toolchain Components
- **Binutils**: Contains a linker, an assembler, and other tools for handling object files.
- **GCC**: The GNU Compiler Collection.
- **Glibc**: The main C library that provides system calls and other basic facilities.

## Useful Commands
\`\`\`bash
# Check library dependencies
ldd /bin/bash

# View file content
cat /etc/os-release

# Environment variables
printenv | grep LFS
\`\`\`
  `;

  return (
    <div className="flex h-full gap-8">
      <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-10 overflow-y-auto">
        <div className="markdown-body prose prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      <div className="w-80 flex flex-col gap-6">
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20">
          <ShieldCheck className="w-8 h-8 mb-4" />
          <h3 className="font-bold text-lg mb-2">Pro Tip</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Always backup your host system before starting LFS. Working with partitions and bootloaders carries inherent risks.
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
            <ExternalLink className="w-3 h-3" /> External Resources
          </h3>
          <div className="space-y-3">
            {[
              { name: "LFS Official Site", url: "https://linuxfromscratch.org" },
              { name: "LFS Stable Book", url: "https://www.linuxfromscratch.org/lfs/view/stable/" },
              { name: "Beyond LFS (BLFS)", url: "https://www.linuxfromscratch.org/blfs/" },
              { name: "Kernel Newbies", url: "https://kernelnewbies.org/" }
            ].map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="no-referrer"
                className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium flex items-center justify-between group"
              >
                {link.name}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 flex-1">
          <div className="flex items-center gap-2 text-yellow-500 mb-4">
            <Info className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Glossary</h3>
          </div>
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-bold text-gray-300 mb-1 tracking-wider">CHROOT</p>
              <p className="text-gray-500 leading-normal">An operation that changes the apparent root directory for the current running process and their children.</p>
            </div>
            <div>
              <p className="font-bold text-gray-300 mb-1 tracking-wider">TOOLCHAIN</p>
              <p className="text-gray-500 leading-normal">The set of programming tools used to create a product (software or another toolchain).</p>
            </div>
            <div>
              <p className="font-bold text-gray-300 mb-1 tracking-wider">KERNEL</p>
              <p className="text-gray-500 leading-normal">The absolute core of a computer operating system with complete control over everything in the system.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
