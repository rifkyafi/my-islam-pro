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
          ? 'bg-[#C97A34]/20 text-[#C97A34] border border-[#C97A34]/30' 
          : 'bg-[#D48C46]/10 text-[#D48C46] border border-[#D48C46]/20 hover:bg-[#D48C46]/20 hover:border-[#D48C46]/40'} 
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
