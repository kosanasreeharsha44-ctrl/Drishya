import React, { useState } from 'react';
import { Check, ShieldCheck, RefreshCw } from 'lucide-react';

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void;
  isVerified: boolean;
  className?: string;
}

export const TurnstileCaptcha: React.FC<TurnstileCaptchaProps> = ({
  onVerify,
  isVerified,
  className = '',
}) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleClick = () => {
    if (isVerified || isVerifying) return;
    setIsVerifying(true);

    // Simulate cryptographic proof of work challenge
    setTimeout(() => {
      setIsVerifying(false);
      const token = `cf-sec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      onVerify(token);
    }, 750);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-white/10 bg-[#0F0F1A] px-4 py-3 shadow-inner ${className}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClick}
          disabled={isVerified || isVerifying}
          aria-label={isVerified ? 'Verification passed' : 'Verify you are human'}
          className={`relative flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
            isVerified
              ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF]'
              : 'border-white/30 bg-black/40 hover:border-[#00E5FF]'
          }`}
        >
          {isVerifying ? (
            <RefreshCw className="h-3.5 w-3.5 text-[#00E5FF] animate-spin" />
          ) : isVerified ? (
            <Check className="h-4 w-4 text-[#00E5FF] stroke-[3]" />
          ) : null}
        </button>
        <span
          onClick={handleClick}
          className="text-xs select-none cursor-pointer text-[#F2F4FF] hover:text-[#00E5FF] transition-colors"
        >
          {isVerified ? 'Verification Complete' : isVerifying ? 'Verifying security token...' : 'I am human (Spam Protection)'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 opacity-60">
        <ShieldCheck className="h-4 w-4 text-[#00E5FF]" />
        <span className="text-[10px] tracking-wider uppercase font-semibold text-[#9AA0B8]">
          Drishya Guard
        </span>
      </div>
    </div>
  );
};
