import React, { useState, useRef } from 'react';
import { Lightbulb, CheckCircle2, Sparkles, Send, AlertCircle, Upload, X, Link as LinkIcon, File } from 'lucide-react';
import { useStudio } from '../../context/StudioContext.tsx';
import { validateConceptForm, checkRateLimit } from '../../utils/pricing.ts';
import { TurnstileCaptcha } from '../common/TurnstileCaptcha.tsx';
import { TermsModal } from '../modals/TermsModal.tsx';

export const SubmitCreativeConceptSection: React.FC = () => {
  const { submitIdea } = useStudio();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    title: '',
    description: '',
    referenceLink: '',
    consent: false,
  });

  // Reference file state
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedConcept, setSubmittedConcept] = useState<any | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // File handling: check size & type, show simulated progress
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) return;

    // Check size (Max 25MB)
    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setFileError('File size exceeds 25MB limit. Please provide a cloud link or upload a smaller file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check type (Video, Audio, Image, PDF, Document, Archive)
    const allowedExtensions = ['mp4', 'mov', 'avi', 'mkv', 'jpg', 'jpeg', 'png', 'webp', 'pdf', 'zip', 'rar', 'doc', 'docx', 'txt', 'mp3', 'wav'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(ext)) {
      setFileError('Unsupported file type. Supported formats: MP4, MOV, JPG, PNG, PDF, ZIP, MP3, DOCX.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Format file size
    const sizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    // Simulate upload progress
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setAttachedFile({
            name: file.name,
            size: sizeStr,
            type: file.type || ext,
          });
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    setUploadProgress(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Disable multiple submits on first tap
    if (isSubmitting) return;

    // 1. Rate limit check
    const rateCheck = checkRateLimit(lastSubmissionTime, 15000);
    if (!rateCheck.allowed) {
      setErrors({ form: `Please wait ${rateCheck.remainingSeconds}s before submitting another concept.` });
      return;
    }

    // 2. Form validation
    const validation = validateConceptForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // 3. Captcha check
    if (!captchaToken) {
      setErrors({ captcha: 'Please complete the anti-spam verification check below.' });
      return;
    }

    // 4. Reference file or link is strictly OPTIONAL.
    // The form submits correctly with no reference file or link with no error or warning.

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const finalReference = attachedFile
        ? `[File Attached: ${attachedFile.name} (${attachedFile.size})] ${formData.referenceLink ? `• Link: ${formData.referenceLink}` : ''}`
        : formData.referenceLink.trim() || undefined;

      const res = submitIdea({
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        title: formData.title.trim(),
        category: 'Creative Concept',
        description: formData.description.trim(),
        fileUrl: finalReference,
        consent: formData.consent,
      });

      setIsSubmitting(false);
      setLastSubmissionTime(Date.now());
      setSubmittedConcept(res.idea);
      setFormData({
        name: '',
        contact: '',
        title: '',
        description: '',
        referenceLink: '',
        consent: false,
      });
      setAttachedFile(null);
      setUploadProgress(null);
      setCaptchaToken('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 600);
  };

  return (
    <section
      id="submit-concept"
      className="py-20 lg:py-28 relative scroll-mt-20 bg-gradient-to-b from-[#07070D] via-[#0E0C1A] to-[#07070D]"
    >
      {/* Anchor targets to preserve smooth scrolling from various locations */}
      <span id="concepts" className="absolute -top-20" />
      <span id="ideas" className="absolute -top-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Section */}
        <div className="rounded-3xl border border-[#FF2E9A]/30 bg-gradient-to-br from-[#1A0E2A] via-[#0F0F1A] to-[#07070D] p-8 sm:p-12 mb-16 relative overflow-hidden shadow-[0_0_50px_rgba(255,46,154,0.12)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF2E9A]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF2E9A]/40 bg-[#FF2E9A]/10 text-xs font-semibold text-[#FF2E9A] mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Drishya Revenue-Share Program</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Submit Creative Concept{' '}
              <span className="bg-gradient-to-r from-[#FF2E9A] to-[#00E5FF] bg-clip-text text-transparent">
                & Share Revenue.
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#9AA0B8] leading-relaxed">
              Have a visionary narrative reel, video edit concept, visual project, or creative format? Pitch your creative concept to Drishya. If produced commercially, <strong>you receive an agreed contract share (15%–35% of net revenues)</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FF2E9A] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">100% Free to Submit</strong>
                  <span className="text-[#9AA0B8]">Zero pitch fee or upfront costs.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00E5FF] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Written Contract Terms</strong>
                  <span className="text-[#9AA0B8]">Guaranteed share & credit attribution.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#7B5CFF] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Direct Disbursements</strong>
                  <span className="text-[#9AA0B8]">Disbursed transparently via UPI or Bank.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-[#0F0F1A] p-6 sm:p-10 shadow-xl">
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#FF2E9A]" />
              Submit Creative Concept
            </h3>
            <p className="text-xs sm:text-sm text-[#9AA0B8]">
              Harsha personally evaluates every pitch. If accepted, you’ll receive an invitation to co-create with guaranteed revenue share.
            </p>
          </div>

          {submittedConcept ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              {/* Exact required post-submit message */}
              <h4 className="text-lg sm:text-xl font-display font-bold text-white">
                Your concept is submitted. We will contact you.
              </h4>

              <p className="text-xs text-[#9AA0B8] max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-white">{submittedConcept.name}</strong>. Your creative concept "{submittedConcept.title}" has been securely logged in our queue.
              </p>

              <div className="p-4 rounded-xl bg-[#07070D] border border-white/5 space-y-2 text-xs text-[#9AA0B8] max-w-sm mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-white/60">Concept ID:</span>
                  <span className="font-mono text-white">{submittedConcept.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Contact:</span>
                  <span className="text-white">{submittedConcept.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Revenue Tier:</span>
                  <span className="text-[#00E5FF] font-semibold">20% Baseline Share</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubmittedConcept(null)}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Submit Another Concept
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form && (
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Form Field 1: Name* & Field 2: Email or Instagram* */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="concept-name" className="block text-xs font-medium text-[#F2F4FF] mb-1.5">
                    Name <span className="text-[#FF2E9A]">*</span>
                  </label>
                  <input
                    id="concept-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Karan Patel"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#FF2E9A] focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-red-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="concept-contact" className="block text-xs font-medium text-[#F2F4FF] mb-1.5">
                    Email or Instagram <span className="text-[#FF2E9A]">*</span>
                  </label>
                  <input
                    id="concept-contact"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. @karan_edits or karan@gmail.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#FF2E9A] focus:outline-none"
                  />
                  {errors.contact && <p className="mt-1 text-[11px] text-red-400">{errors.contact}</p>}
                </div>
              </div>

              {/* Form Field 3: Concept title* */}
              <div>
                <label htmlFor="concept-title" className="block text-xs font-medium text-[#F2F4FF] mb-1.5">
                  Concept title <span className="text-[#FF2E9A]">*</span>
                </label>
                <input
                  id="concept-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Cyberpunk Varanasi Short Spec"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#FF2E9A] focus:outline-none"
                />
                {errors.title && <p className="mt-1 text-[11px] text-red-400">{errors.title}</p>}
              </div>

              {/* Form Field 4: Concept description* */}
              <div>
                <label htmlFor="concept-desc" className="block text-xs font-medium text-[#F2F4FF] mb-1.5">
                  Concept description <span className="text-[#FF2E9A]">*</span>
                </label>
                <textarea
                  id="concept-desc"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Outline your premise, visual style, why it will generate retention or sales, and how we can produce it together..."
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#07070D] px-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#FF2E9A] focus:outline-none resize-none"
                />
                {errors.description && <p className="mt-1 text-[11px] text-red-400">{errors.description}</p>}
              </div>

              {/* Form Field 5: Reference file or link: OPTIONAL. Helper text: "Optional. Add one if you have it." */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="concept-ref-link" className="block text-xs font-medium text-[#F2F4FF]">
                    Reference file or link
                  </label>
                  <span className="text-[11px] text-[#9AA0B8]">Optional. Add one if you have it.</span>
                </div>

                <div className="space-y-3">
                  {/* Link Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9AA0B8]">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="concept-ref-link"
                      type="url"
                      value={formData.referenceLink}
                      onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
                      placeholder="Paste link (Google Drive, Dropbox, YouTube, Pinterest, etc.)"
                      className="w-full rounded-xl border border-white/10 bg-[#07070D] pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:border-[#FF2E9A] focus:outline-none"
                    />
                  </div>

                  {/* File Upload Zone */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="concept-file-upload"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".mp4,.mov,.avi,.jpg,.jpeg,.png,.webp,.pdf,.zip,.rar,.doc,.docx,.mp3"
                    />

                    {!attachedFile && (
                      <label
                        htmlFor="concept-file-upload"
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/15 bg-[#07070D]/60 hover:bg-[#07070D] hover:border-[#FF2E9A]/40 text-xs text-[#9AA0B8] hover:text-white cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4 text-[#FF2E9A]" />
                        <span>Or attach reference file (Max 25MB • MP4, PDF, ZIP, Images)</span>
                      </label>
                    )}

                    {/* Upload progress & attached file preview */}
                    {uploadProgress !== null && uploadProgress < 100 && (
                      <div className="p-3 rounded-xl border border-white/10 bg-[#07070D] space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-white">Uploading reference file...</span>
                          <span className="text-[#00E5FF] font-mono">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#FF2E9A] to-[#00E5FF] h-1.5 rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {attachedFile && (
                      <div className="flex items-center justify-between p-3 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-xs text-white">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <File className="w-4 h-4 text-[#00E5FF] flex-shrink-0" />
                          <span className="truncate font-medium">{attachedFile.name}</span>
                          <span className="text-[10px] text-[#9AA0B8] font-mono">({attachedFile.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeAttachedFile}
                          className="p-1 rounded-lg hover:bg-white/10 text-[#9AA0B8] hover:text-white transition-colors"
                          aria-label="Remove attached file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {fileError && <p className="mt-1.5 text-[11px] text-red-400">{fileError}</p>}
                  </div>
                </div>
              </div>

              {/* Form Field 6: Consent checkbox* */}
              <div className="rounded-xl border border-white/10 bg-[#07070D] p-3.5">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    required
                    className="mt-0.5 rounded border-white/20 bg-[#0F0F1A] text-[#FF2E9A] focus:ring-[#FF2E9A]"
                  />
                  <span className="text-xs text-[#9AA0B8] leading-relaxed">
                    I confirm this is my original creative concept and agree to Drishya’s{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-[#FF2E9A] underline hover:text-white"
                    >
                      Revenue-Share & Confidentiality Terms
                    </button>
                    . If selected, I will receive the agreed net revenue share percentage. <span className="text-[#FF2E9A]">*</span>
                  </span>
                </label>
                {errors.consent && <p className="mt-1 text-[11px] text-red-400 pl-6">{errors.consent}</p>}
              </div>

              {/* Spam Protection Turnstile */}
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

              {/* Submit Button: says EXACTLY "Submit" and disabled on first tap */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E9A] via-[#7B5CFF] to-[#00E5FF] text-xs font-bold text-white uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-[#FF2E9A]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>

      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </section>
  );
};
