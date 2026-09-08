import React from "react";

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass w-full max-w-lg rounded-xl overflow-hidden border border-[#1c2f47] shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c2f47] bg-[#090e18]">
          <h3 className="text-[12px] font-mono uppercase tracking-widest text-slate-400">{title}</h3>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-5 overflow-y-auto max-h-[80vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
