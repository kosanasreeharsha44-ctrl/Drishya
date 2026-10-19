import React, { useState } from 'react';
import { Smartphone, Bell, MessageSquare, Lightbulb, CheckCircle2, Star, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';

export const AdminAndroidCompanion: React.FC = () => {
  const { reviews, approveReview, ideas, notifications } = useStudio();
  const [activeScreen, setActiveScreen] = useState<'concepts' | 'reviews' | 'alerts'>('reviews');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-3xl border border-white/10 bg-[#0F0F1A] flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#7B5CFF] p-0.5">
            <div className="w-full h-full rounded-[14px] bg-[#07070D] flex items-center justify-center text-[#00E5FF]">
              <Smartphone className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-display font-bold text-white">Drishya Android Companion</h3>
            <p className="text-xs text-[#9AA0B8]">Direct studio controls: approve reviews & track creative concepts on mobile</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Synced</span>
        </div>
      </div>

      {/* Mobile Device Simulation Frame */}
      <div className="rounded-[40px] border-4 border-white/20 bg-[#07070D] p-5 shadow-2xl space-y-5">
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between pt-2 px-2 text-xs">
          <span className="font-mono text-white/60">09:41</span>
          <div className="w-24 h-4 bg-white/10 rounded-full mx-auto" />
          <span className="text-[#00E5FF] font-semibold">5G 100%</span>
        </div>

        {/* In-App Tab Switcher */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-[#0F0F1A] border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveScreen('reviews')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeScreen === 'reviews'
                ? 'bg-gradient-to-r from-amber-400 to-[#FF2E9A] text-[#07070D] font-bold'
                : 'text-[#9AA0B8] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('concepts')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeScreen === 'concepts'
                ? 'bg-gradient-to-r from-[#FF2E9A] to-[#00E5FF] text-white font-bold'
                : 'text-[#9AA0B8] hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Concepts ({ideas.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('alerts')}
            className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeScreen === 'alerts'
                ? 'bg-[#00E5FF] text-[#07070D] font-bold'
                : 'text-[#9AA0B8] hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts ({notifications.length})</span>
          </button>
        </div>

        {/* Screen 1: Reviews Approval on Android */}
        {activeScreen === 'reviews' && (
          <div className="space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Client Reviews</span>
              <span className="text-[11px] text-[#9AA0B8]">Tap to Approve/Hide</span>
            </div>

            {reviews.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9AA0B8] rounded-2xl bg-[#0F0F1A] border border-white/5">
                No reviews yet. Strict real data mode.
              </div>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                    r.isApproved ? 'border-emerald-500/40 bg-[#0F0F1A]' : 'border-white/10 bg-[#0F0F1A]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{r.clientName}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        r.isApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {r.isApproved ? 'Approved Live' : 'Hidden'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-current' : 'opacity-20'}`} />
                    ))}
                    <span className="text-[11px] font-mono ml-1">{r.rating}★</span>
                  </div>

                  <p className="text-white/80 italic leading-relaxed">"{r.comment}"</p>

                  <button
                    type="button"
                    onClick={() => approveReview(r.id)}
                    className={`w-full py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      r.isApproved
                        ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-emerald-500 text-[#07070D] hover:bg-emerald-400'
                    }`}
                  >
                    {r.isApproved ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide from Site</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Approve for Site</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Screen 2: Creative Concepts on Android */}
        {activeScreen === 'concepts' && (
          <div className="space-y-3 min-h-[300px]">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Creative Concepts Inbox</span>
              <span className="text-[11px] text-[#9AA0B8]">{ideas.length} received</span>
            </div>

            {ideas.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9AA0B8] rounded-2xl bg-[#0F0F1A] border border-white/5">
                No creative concepts submitted yet.
              </div>
            ) : (
              ideas.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl border border-white/10 bg-[#0F0F1A] text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white">{c.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2E9A]/20 text-[#FF2E9A]">
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[#9AA0B8] line-clamp-2">{c.description}</p>
                  <div className="text-[11px] text-white/60">
                    By <strong className="text-white">{c.name}</strong> • {c.contact}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Screen 3: Alerts on Android */}
        {activeScreen === 'alerts' && (
          <div className="space-y-3 min-h-[300px]">
            <span className="text-xs font-bold text-white uppercase tracking-wider px-1 block">Live Push Alerts</span>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9AA0B8] rounded-2xl bg-[#0F0F1A] border border-white/5">
                No alerts yet. Submitting concepts or inquiries triggers real-time alerts.
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-3.5 rounded-2xl border border-white/10 bg-[#0F0F1A] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-white">{n.title}</span>
                    <span className="text-[10px] text-[#9AA0B8] font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#9AA0B8]">{n.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
