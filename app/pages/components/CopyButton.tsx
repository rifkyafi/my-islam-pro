'use client';

import { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
}

export function CopyButton({ textToCopy, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center p-2 rounded-md transition-all duration-200 
        ${copied 
          ? 'bg-[#3D9B7F]/20 text-[#3D9B7F] border border-[#3D9B7F]/30' 
          : 'bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20 hover:bg-[#C9A84C]/20 hover:border-[#C9A84C]/40'} 
        ${className}`}
      title={copied ? "Tersalin!" : "Salin Hadis"}
    >
      {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      <span className="ml-2 text-[0.7rem] font-medium tracking-wider uppercase">
        {copied ? "Tersalin" : "Salin"}
      </span>
    </button>
  );
}
