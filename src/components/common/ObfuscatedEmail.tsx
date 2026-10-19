import React, { useState } from 'react';
import { Mail, Check, Copy } from 'lucide-react';

interface ObfuscatedEmailProps {
  className?: string;
  showIcon?: boolean;
}

export const ObfuscatedEmail: React.FC<ObfuscatedEmailProps> = ({
  className = '',
  showIcon = true,
}) => {
  const fullEmail = 'unknowneditor910@gmail.com';
  const [copied, setCopied] = useState(false);

  const mailtoUrl = `mailto:${fullEmail}?subject=${encodeURIComponent(
    'Project Inquiry - Drishya'
  )}&body=${encodeURIComponent(
    'Hi Harsha,\n\nI would like to discuss a creative project with Drishya.\n\nProject Type: Video Editing / Poster Art / Photo Editing\nTarget Delivery Date: \n\nSend files through email (attach files or paste Google Drive / WeTransfer / Dropbox links):\n'
  )}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={mailtoUrl}
        aria-label={`Send email to ${fullEmail} with project files`}
        title="Click to redirect to mail and send files"
        className="inline-flex items-center gap-1.5 text-xs text-[#9AA0B8] hover:text-[#00E5FF] transition-colors focus:outline-none"
      >
        {showIcon && <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />}
        <span className="font-mono text-white/90 hover:text-[#00E5FF]">{fullEmail}</span>
      </a>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy email address"
        title="Copy email to clipboard"
        className="p-1 rounded text-[#9AA0B8] hover:text-white hover:bg-white/10 transition-colors"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
};
