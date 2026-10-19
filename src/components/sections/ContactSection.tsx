import React, { useState, useEffect } from 'react';
import { Instagram, Mail, Send, CheckCircle2, Clock, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';
import type { ServiceType } from '../../types/index.ts';
import { validateInquiryForm, checkRateLimit } from '../../utils/pricing.ts';
import { TurnstileCaptcha } from '../common/TurnstileCaptcha.tsx';
import { ObfuscatedEmail } from '../common/ObfuscatedEmail.tsx';

interface ContactSectionProps {
  prefill?: {
    service: string;
    details: string;
  } | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ prefill }) => {
  const { settings, submitInquiry } = useStudio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'video_editing' as ServiceType,
    deadline: '',
    details: '',
    referenceLink: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any | null>(null);

  // Apply prefill when user clicks "Contact for details" from Services
  useEffect(() => {
    if (prefill) {
      setFormData((prev) => ({
        ...prev,
        service: (prefill.service as ServiceType) || prev.service,
        details: prefill.details || prev.details,
      }));
    }
  }, [prefill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Rate limit
    const rateCheck = checkRateLimit(lastSubmissionTime, 15000);
    if (!rateCheck.allowed) {
      setErrors({ form: `Please wait ${rateCheck.remainingSeconds}s before submitting again.` });
      return;
    }

    // 2. Validate
    const validation = validateInquiryForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 3. Captcha
    if (!captchaToken) {
      setErrors({ captcha: 'Please complete the anti-spam verification check below.' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const res = submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        service: formData.service,
        deadline: formData.deadline || undefined,
        details: formData.details.trim(),
        referenceLink: formData.referenceLink.trim() || undefined,
      });

      setIsSubmitting(false);
      setLastSubmissionTime(Date.now());
      setSubmittedInquiry(res.inquiry);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'video_editing',
        deadline: '',
        details: '',
        referenceLink: '',
      });
      setCaptchaToken('');
    }, 600);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct channels & Harsha Intro */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0F0F1A] text-xs font-semibold text-[#00E5FF] mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Let’s Connect</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
                Bring Your Vision To Life.
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA0B8] leading-relaxed mb-8">
                Ready to elevate your YouTube video, polish an ad campaign, design theatrical key art, or discuss a collaboration? Connect directly with Harsha via Instagram or email, or send your project specifications below.
              </p>

              {/* Direct Action Buttons */}
              <div className="space-y-3 mb-8">
                {/* Instagram Button */}
                <a
                  href="https://instagram.com/ur_harsha0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0F0F1A] hover:border-[#FF2E9A]/50 hover:bg-[#150F22] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#FF2E9A] to-[#7B5CFF] text-white">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#FF2E9A] transition-colors">
                        Direct Message on Instagram
                      </div>
                      <div className="text-[11px] text-[#9AA0B8]">@{settings.instagramHandle}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9AA0B8] group-hover:text-white transition-colors" />
                </a>

                {/* Email Channel: Click redirects directly to mail with prefilled file transfer details */}
                <a
                  href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(
                    'Project Inquiry - Drishya'
                  )}&body=${encodeURIComponent(
                    'Hi Harsha,\n\nI would like to discuss a project with Drishya.\n\nProject Type: Video Editing / Poster Art / Photo Editing\nTarget Delivery Date: \n\nProject Brief:\n\nSend files through email (attach files or paste Google Drive / WeTransfer / Dropbox links here):\n'
                  )}`}
                  className="flex items-start justify-between p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#0F0F1A] hover:border-[#00E5FF]/60 hover:bg-[#00E5FF]/5 transition-all group"
                  aria-label={`Email ${settings.contactEmail} to send files`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#00E5FF] to-[#7B5CFF] text-[#07070D] flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                        <span>Direct Email & File Transfer</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#9AA0B8] group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-xs font-mono text-[#00E5FF]">
                        {settings.contactEmail}
                      </div>
                      <p className="text-[11px] text-[#9AA0B8] leading-relaxed pt-1">
                        Click to open mail: Send files through email (attach footage, photos, audio, or paste Google Drive & WeTransfer links directly).
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick response badge */}
            <div className="p-4 rounded-2xl border border-white/10 bg-[#07070D] flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#00E5FF] flex-shrink-0" />
              <div className="text-xs text-[#9AA0B8]">
                <strong className="text-white block font-semibold">Average Response Time: 4 Hours</strong>
                Harsha personally reviews all inquiries and project requests.
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Project Request Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#0F0F1A] p-6 sm:p-10 shadow-2xl">
              <h3 className="text-xl font-display font-bold text-white mb-2">Send a Message</h3>
              <p className="text-xs text-[#9AA0B8] mb-6">
                Tell us about your project timeline and requirements. You can also click on our email above to send files through email directly.
              </p>

              {submittedInquiry ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Project Request Received!</h4>
                      <p className="text-xs text-emerald-200">
                        Thank you, {submittedInquiry.name}. We’ve notified Harsha.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#07070D] border border-white/5 space-y-2 text-xs text-[#9AA0B8]">
                    <div className="flex justify-between">
                      <span className="text-white/60">Reference ID:</span>
                      <span className="font-mono text-white">{submittedInquiry.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Service:</span>
                      <span className="text-white font-medium">{submittedInquiry.service.replace('_', ' ').toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#9AA0B8] leading-relaxed">
                    An auto-reply confirmation email has been dispatched to <strong className="text-white">{submittedInquiry.email}</strong>. Harsha will follow up promptly with next steps!
                  </div>

                  <button
                    type="button"
                    onClick={() => setSubmittedInquiry(null)}
                    className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errors.form && (
                    <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errors.form}</span>
                    </div>
                  )}

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                        Your Name <span className="text-[#00E5FF]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Siddharth Rao"
                        className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none"
                      />
                      {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                        Email Address <span className="text-[#00E5FF]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="siddharth@example.com"
                        className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none"
                      />
                      {errors.email && <p className="mt-1 text-[11px] text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                        Phone / WhatsApp <span className="text-[#9AA0B8]">(Optional)</span>
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-service" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                        Service Needed <span className="text-[#00E5FF]">*</span>
                      </label>
                      <select
                        id="contact-service"
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value as ServiceType })}
                        className="w-full rounded-xl border border-white/10 bg-[#07070D] px-3 py-2.5 text-xs text-white focus:border-[#00E5FF] focus:outline-none"
                      >
                        <option value="video_editing" className="bg-[#07070D]">Cinematic Video Editing</option>
                        <option value="poster_photo_editing" className="bg-[#07070D]">Poster & Photo Editing</option>
                        <option value="idea_submission" className="bg-[#07070D]">Submit Creative Concept</option>
                      </select>
                      {errors.service && <p className="mt-1 text-[11px] text-red-400">{errors.service}</p>}
                    </div>
                  </div>

                  {/* Deadline (No budget field) */}
                  <div>
                    <label htmlFor="contact-deadline" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                      Target Delivery Date <span className="text-[#9AA0B8]">(Optional)</span>
                    </label>
                    <input
                      id="contact-deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>

                  {/* Project Brief */}
                  <div>
                    <label htmlFor="contact-details" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                      Project Brief & Requirements <span className="text-[#00E5FF]">*</span>
                    </label>
                    <textarea
                      id="contact-details"
                      rows={3}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Describe what you want to create (video length, style references, number of deliverables)..."
                      className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none resize-none"
                    />
                    <p className="mt-1 text-[11px] text-[#9AA0B8]">
                      Tip: You can also send files through email directly to <a href={`mailto:${settings.contactEmail}`} className="text-[#00E5FF] underline">{settings.contactEmail}</a>.
                    </p>
                    {errors.details && <p className="mt-1 text-[11px] text-red-400">{errors.details}</p>}
                  </div>

                  {/* Reference Link */}
                  <div>
                    <label htmlFor="contact-ref" className="block text-xs font-medium text-[#F2F4FF] mb-1">
                      Reference Link / Footage Folder <span className="text-[#9AA0B8]">(Optional - or send files through email)</span>
                    </label>
                    <input
                      id="contact-ref"
                      type="url"
                      value={formData.referenceLink}
                      onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
                      placeholder="Google Drive, Dropbox, YouTube, Instagram or Figma link"
                      className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#00E5FF] focus:outline-none"
                    />
                  </div>

                  {/* Turnstile Captcha */}
                  <div>
                    <TurnstileCaptcha
                      isVerified={!!captchaToken}
                      onVerify={(token) => {
                        setCaptchaToken(token);
                        if (errors.captcha) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.captcha;
                            return next;
                          });
                        }
                      }}
                    />
                    {errors.captcha && <p className="mt-1 text-[11px] text-red-400">{errors.captcha}</p>}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#7B5CFF] to-[#FF2E9A] text-xs font-bold text-[#07070D] uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Contact for details</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
