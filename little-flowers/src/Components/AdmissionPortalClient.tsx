'use client';

import React, { useState, useEffect } from 'react';
import {
  StorioAdmissionFormConfig,
  StorioAdmissionOTPResponse,
  StorioAdmissionApplicationResponse,
} from '@/data/storioExtendedTypes';
import { storio } from '@storio/template-sdk';
import SplitText from '@/Components/SplitText';
import PartyPopperExplosion from '@/Components/PartyPopperExplosion';

interface AdmissionPortalClientProps {
  formConfig: StorioAdmissionFormConfig;
  tenantHost: string;
  isStandalone: boolean;
}

export default function AdmissionPortalClient({
  formConfig,
  tenantHost,
  isStandalone,
}: AdmissionPortalClientProps) {
  // Stepper state: 1 = Student Info, 2 = Guardian Info, 3 = OTP Verification, 4 = Success
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Record<string, string>>({
    applied_class: 'Playgroup (Age 2-3)',
    gender: 'Male',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // OTP state
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [resending, setResending] = useState<boolean>(false);

  // 60-second countdown for Resend Code when in Step 3
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 3 && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentStep, resendCountdown]);

  // Auto-vanish success message after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSuccessMsg) {
      timer = setTimeout(() => {
        setOtpSuccessMsg(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [otpSuccessMsg]);

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [applicationNumber, setApplicationNumber] = useState<string>('');

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  // Group fields dynamically:
  // 1. If fields have explicit step properties, honor them.
  // 2. Otherwise, automatically distribute fields so that:
  //    - If there are <= 4 fields, or student-oriented fields (name, applied_class, dob, gender, photo), put in step 1.
  //    - Guardian/contact fields (phone, email, father, mother, address) or second half go in step 2.
  const hasExplicitSteps = formConfig.fields?.some((f) => typeof f.step === 'number');

  let step1Fields: typeof formConfig.fields = [];
  let step2Fields: typeof formConfig.fields = [];

  if (hasExplicitSteps) {
    step1Fields = (formConfig.fields || []).filter((f) => f.step === 1);
    step2Fields = (formConfig.fields || []).filter((f) => f.step === 2);
  } else {
    const allFields = formConfig.fields || [];
    if (allFields.length <= 4) {
      // Small form: place first half or first 2 in step 1, rest in step 2
      const midpoint = Math.ceil(allFields.length / 2);
      step1Fields = allFields.slice(0, midpoint);
      step2Fields = allFields.slice(midpoint);
    } else {
      step1Fields = allFields.filter((f) => {
        const idOrLabel = `${f.id} ${f.label}`.toLowerCase();
        return (
          idOrLabel.includes('student') ||
          idOrLabel.includes('name') ||
          idOrLabel.includes('dob') ||
          idOrLabel.includes('birth') ||
          idOrLabel.includes('gender') ||
          idOrLabel.includes('class') ||
          idOrLabel.includes('blood') ||
          idOrLabel.includes('photo') ||
          idOrLabel.includes('image')
        ) && !idOrLabel.includes('father') && !idOrLabel.includes('mother') && !idOrLabel.includes('guardian');
      });

      step2Fields = allFields.filter((f) => !step1Fields.some((s1) => s1.id === f.id));

      // Guarantee at least 1 field in each step if there are fields
      if (step1Fields.length === 0 && allFields.length > 0) {
        step1Fields = allFields.slice(0, Math.ceil(allFields.length / 2));
        step2Fields = allFields.slice(Math.ceil(allFields.length / 2));
      }
    }
  }

  // Validate current step
  const validateStep = (fields: typeof formConfig.fields): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step1Fields)) {
      setCurrentStep(2);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleProceedToOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step2Fields)) return;

    // Detect email from form data or dedicated guardian_email field
    const emailField = formConfig.fields?.find(
      (f) => f.type === 'email' || `${f.id} ${f.label}`.toLowerCase().includes('email')
    );
    const email = emailField ? formData[emailField.id] : formData['guardian_email'] || formData['email'];

    if (!email) {
      // If the school's configured form doesn't have an email field, provide a prompt or use placeholder
      setErrors((prev) => ({
        ...prev,
        [emailField?.id || 'guardian_email']: 'Email address is required for application confirmation code',
      }));
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      if (isStandalone) {
        // Standalone preview mock behavior
        setOtpSent(true);
        setOtpSuccessMsg('Demo OTP code sent! Use "123456" to verify in standalone preview mode.');
        setCurrentStep(3);
      } else {
        const res = await storio.apiFetch<StorioAdmissionOTPResponse>(
          '/api/v2/template/admission/send-otp/',
          {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
            tenantHost,
          }
        );

        if (res && res.success) {
          setOtpSent(true);
          setOtpSuccessMsg(res.message || 'Verification code sent to your email.');
          setResendCountdown(60);
          setCurrentStep(3);
        } else {
          setOtpError(res?.message || 'Failed to dispatch verification code. Please check your email.');
        }
      }
    } catch {
      // In case network or API is offline
      if (isStandalone) {
        setOtpSent(true);
        setOtpSuccessMsg('Demo OTP code dispatched! Use 123456 to test.');
        setResendCountdown(60);
        setCurrentStep(3);
      } else {
        setOtpError('Network error connecting to admission server. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0 || resending) return;

    const emailField = formConfig.fields?.find(
      (f) => f.type === 'email' || `${f.id} ${f.label}`.toLowerCase().includes('email')
    );
    const email = emailField ? formData[emailField.id] : formData['guardian_email'] || formData['email'];

    if (!email) return;

    setResending(true);
    setOtpError(null);

    try {
      if (isStandalone) {
        setOtpSuccessMsg('New demo verification code dispatched! Use 123456 to verify.');
        setResendCountdown(60);
      } else {
        const res = await storio.apiFetch<StorioAdmissionOTPResponse>(
          '/api/v2/template/admission/send-otp/',
          {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' },
            tenantHost,
          }
        );

        if (res && res.success) {
          setOtpSuccessMsg(res.message || 'Verification code sent to your email.');
          setResendCountdown(60);
        } else {
          setOtpError(res?.message || 'Failed to resend verification code.');
        }
      }
    } catch {
      setOtpError('Network error resending code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 4) {
      setOtpError('Please enter the verification code.');
      return;
    }

    setSubmitting(true);
    setOtpError(null);

    try {
      if (isStandalone) {
        // Standalone preview mock success
        if (otpCode.trim() === '123456' || otpCode.trim().length >= 4) {
          const generatedAppId = `LFK-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
          setApplicationNumber(generatedAppId);
          setCurrentStep(4);
        } else {
          setOtpError('Invalid code. In Standalone Preview mode, use 123456.');
        }
      } else {
        // 1. Verify OTP
        const emailField = formConfig.fields?.find(
          (f) => f.type === 'email' || `${f.id} ${f.label}`.toLowerCase().includes('email')
        );
        const email = emailField ? formData[emailField.id] : formData['guardian_email'] || formData['email'];

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.storio.cloud';

        // 1. Verify OTP
        const verifyResponse = await fetch(`${baseUrl}/api/v2/template/admission/verify-otp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-host': tenantHost,
          },
          body: JSON.stringify({ email, otp_code: otpCode.trim() }),
        });

        const verifyData = await verifyResponse.json().catch(() => null);

        if (!verifyResponse.ok || !verifyData?.success) {
          setOtpError(verifyData?.message || 'Invalid or expired OTP code.');
          setSubmitting(false);
          return;
        }

        // 2. Submit Application
        // The backend requires email to be present inside form_data (as `email` or `guardian_email`)
        const submissionFormData = {
          ...formData,
          email: email,
          guardian_email: email,
        };

        const submitResponse = await fetch(`${baseUrl}/api/v2/template/admission/applications/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-host': tenantHost,
          },
          body: JSON.stringify({
            form_data: submissionFormData,
            otp_code: otpCode.trim(),
          }),
        });

        const submitData = await submitResponse.json().catch(() => null);

        if (submitResponse.ok && (submitData?.success || submitData?.application_number || submitResponse.status === 201)) {
          setApplicationNumber(submitData.application_number || `ADM-${Date.now()}`);
          setCurrentStep(4);
        } else {
          let errMsg =
            submitData?.message ||
            (submitData?.email ? (Array.isArray(submitData.email) ? submitData.email.join(', ') : submitData.email) : null) ||
            (submitData?.otp_code ? (Array.isArray(submitData.otp_code) ? submitData.otp_code.join(', ') : submitData.otp_code) : null);

          if (!errMsg && submitData?.form_data) {
            if (typeof submitData.form_data === 'object') {
              errMsg = Object.values(submitData.form_data).flat().join(', ');
            } else if (Array.isArray(submitData.form_data)) {
              errMsg = submitData.form_data.join(', ');
            }
          }

          setOtpError(errMsg || 'Failed to submit application. Please verify details.');
        }
      }
    } catch {
      if (isStandalone) {
        setApplicationNumber(`LFK-${Date.now().toString().slice(-6)}`);
        setCurrentStep(4);
      } else {
        setOtpError('An error occurred while submitting your application.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Student Info' },
    { num: 2, title: 'Parent & Guardian' },
    { num: 3, title: 'Verification' },
    { num: 4, title: 'Confirmed' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 print:p-0 print:m-0 print:max-w-none">
      {/* 1. Header Banner */}
      <div className="text-center mb-10 print:hidden">
        <span className="inline-block text-xs font-extrabold tracking-wider uppercase text-secondary-color bg-amber-100 px-3.5 py-1 rounded-full shadow-xs mb-3">
          {formConfig.academic_session || '2026 - 2027'} Admissions Open
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-color font-fredoka leading-tight">
          <SplitText
            text="Join the Little Flowers Family"
            tag="span"
            splitType="words, chars"
            delay={30}
            duration={0.8}
            ease="power3.out"
          />
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-3 max-w-xl mx-auto font-medium">
          {formConfig.description ||
            'Complete the online registration below to begin your child’s joyful educational journey.'}
        </p>
      </div>

      {/* 2. Visual Stepper Bar */}
      <div className="mb-12 bg-white rounded-3xl p-4 sm:p-6 border border-purple-100 shadow-sm print:hidden">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
          {steps.map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;

            return (
              <div key={st.num} className="flex flex-col items-center text-center relative z-10">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 shadow-xs ${
                    isCompleted
                      ? 'bg-accent-green text-white scale-95'
                      : isCurrent
                        ? 'bg-primary-color text-white scale-105 shadow-md ring-4 ring-purple-100'
                        : 'bg-pastel-purple text-gray-400'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-2 truncate w-full ${
                    isCurrent
                      ? 'text-primary-color font-black'
                      : isCompleted
                        ? 'text-accent-green'
                        : 'text-gray-400'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Multi-Step Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-100 shadow-md relative overflow-hidden print:p-0 print:border-none print:shadow-none">
        {/* Decorative corner background aura */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-soft-amber rounded-full blur-3xl opacity-60 pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-soft-pink rounded-full blur-3xl opacity-60 pointer-events-none print:hidden" />

        {/* STEP 1: Student Information */}
        {currentStep === 1 && (
          <form onSubmit={handleNextToStep2} className="relative z-10 space-y-6 animate-fadeIn">
            <div className="border-b border-purple-100 pb-4 mb-6">
              <h2 className="text-xl font-extrabold text-primary-color font-fredoka flex items-center gap-2">
                <span>Step 1:</span>
                <span>Little Learner’s Profile</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Tell us about your child to customize classroom placement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {step1Fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                >
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {field.label} {field.required && <span className="text-accent-pink">*</span>}
                  </label>

                  {field.type === 'select' ? (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-sm font-semibold text-gray-800 transition-all cursor-pointer"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-sm font-semibold text-gray-800 transition-all"
                    />
                  ) : field.type === 'image' || field.type === 'file' ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept={field.type === 'image' ? 'image/*' : '*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleInputChange(field.id, file.name);
                        }}
                        className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-color file:text-white hover:file:opacity-90 text-xs text-gray-600 transition-all cursor-pointer"
                      />
                      {formData[field.id] && (
                        <span className="text-[11px] text-accent-green font-bold block mt-1">
                          ✓ Selected: {formData[field.id]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'tel' : field.type || 'text'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-sm font-semibold text-gray-800 transition-all"
                    />
                  )}

                  {errors[field.id] && (
                    <p className="text-[11px] font-bold text-accent-pink mt-1 animate-fadeIn">
                      ⚠️ {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary-color hover:opacity-95 text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Parent Details</span>
                <span>→</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Parents & Guardian Information */}
        {currentStep === 2 && (
          <form onSubmit={handleProceedToOTP} className="relative z-10 space-y-6 animate-fadeIn">
            <div className="border-b border-purple-100 pb-4 mb-6">
              <h2 className="text-xl font-extrabold text-primary-color font-fredoka flex items-center gap-2">
                <span>Step 2:</span>
                <span>Parents & Guardian Details</span>
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Provide contact and emergency details for school correspondence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {step2Fields.map((field) => (
                <div
                  key={field.id}
                  className={field.type === 'textarea' ? 'sm:col-span-2' : ''}
                >
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    {field.label} {field.required && <span className="text-accent-pink">*</span>}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder || ''}
                      className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-sm font-semibold text-gray-800 transition-all"
                    />
                  ) : field.type === 'image' || field.type === 'file' ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept={field.type === 'image' ? 'image/*' : '*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleInputChange(field.id, file.name);
                        }}
                        className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary-color file:text-white hover:file:opacity-90 text-xs text-gray-600 transition-all cursor-pointer"
                      />
                      {formData[field.id] && (
                        <span className="text-[11px] text-accent-green font-bold block mt-1">
                          ✓ Selected: {formData[field.id]}
                        </span>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'tel' : field.type || 'text'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      placeholder={field.placeholder || `Enter ${field.label}`}
                      className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-sm font-semibold text-gray-800 transition-all"
                    />
                  )}

                  {errors[field.id] && (
                    <p className="text-[11px] font-bold text-accent-pink mt-1 animate-fadeIn">
                      ⚠️ {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}

              {/* Ensure an email input exists if tenant config didn't include one */}
              {!formConfig.fields?.some(
                (f) => f.type === 'email' || `${f.id} ${f.label}`.toLowerCase().includes('email')
              ) && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Guardian Email (for verification code) <span className="text-accent-pink">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData['guardian_email'] || ''}
                    onChange={(e) => handleInputChange('guardian_email', e.target.value)}
                    placeholder="e.g. parent@example.com"
                    className="w-full px-4 py-3 bg-pastel-purple rounded-2xl border border-purple-100 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-sm font-semibold text-gray-800 transition-all"
                  />
                  {errors['guardian_email'] && (
                    <p className="text-[11px] font-bold text-accent-pink mt-1 animate-fadeIn">
                      ⚠️ {errors['guardian_email']}
                    </p>
                  )}
                </div>
              )}
            </div>

            {otpError && (
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-accent-pink text-xs font-bold animate-fadeIn">
                ⚠️ {otpError}
              </div>
            )}

            <div className="pt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-purple-200 text-gray-600 hover:bg-purple-50 font-bold text-xs rounded-full transition-all cursor-pointer"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={otpLoading}
                className="px-8 py-3.5 bg-secondary-color hover:opacity-95 text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {otpLoading ? (
                  <span>Sending Verification Code...</span>
                ) : (
                  <>
                    <span>Proceed to Email Verification</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP Verification */}
        {currentStep === 3 && (
          <form onSubmit={handleVerifyAndSubmit} className="relative z-10 max-w-lg mx-auto py-6 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-pastel-purple text-primary-color flex items-center justify-center text-3xl shadow-inner border border-purple-100">
              ✉️
            </div>

            <div>
              <h2 className="text-2xl font-black text-primary-color font-fredoka">
                Verify Guardian Email
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  We sent a 6-digit confirmation code to{' '}
                  <strong className="text-gray-900 font-bold">
                    {formData['guardian_email'] || formData['email']}
                  </strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-accent-pink hover:text-primary-color underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Change Email
                </button>
              </div>
            </div>

            {otpSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-secondary-color text-xs font-bold animate-fadeIn transition-opacity duration-500">
                ✓ {otpSuccessMsg}
              </div>
            )}

            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-56 text-center tracking-[0.5em] text-2xl font-black px-4 py-3 bg-pastel-purple rounded-2xl border-2 border-purple-200 focus:border-primary-color focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-100 text-gray-900 mx-auto block"
              />
              <span className="text-[11px] text-gray-400 block font-semibold">
                Enter 6-digit verification code
              </span>
            </div>

            {/* Resend OTP with 60-second countdown timer */}
            <div className="pt-1 flex items-center justify-center">
              {resendCountdown > 0 ? (
                <div className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Resend code in <strong className="text-gray-700 font-bold">{resendCountdown}s</strong></span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-xs font-extrabold text-primary-color hover:text-accent-pink underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {resending ? 'Sending new code...' : 'Didn’t receive the code? Resend Code'}
                </button>
              )}
            </div>

            {otpError && (
              <p className="text-xs font-bold text-accent-pink animate-fadeIn">
                ⚠️ {otpError}
              </p>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-6 py-3 border border-purple-200 text-gray-600 hover:bg-purple-50 font-bold text-xs rounded-full transition-all cursor-pointer"
              >
                ← Back to Details
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-color hover:opacity-95 text-white font-extrabold text-sm rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting Application...' : 'Verify & Submit Application →'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success & Confirmation */}
        {currentStep === 4 && (
          <div className="relative z-10 max-w-lg mx-auto py-8 text-center space-y-6 animate-fadeIn">
            {/* Realtime birthday popper confetti explosion canvas */}
            <PartyPopperExplosion />

            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-100 via-amber-100 to-sky-100 flex items-center justify-center shadow-lg border-2 border-purple-200 transform transition-transform hover:scale-105">
                <div className="w-12 h-12 rounded-2xl bg-accent-green text-white flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-accent-green bg-lime-100 px-3.5 py-1 rounded-full">
                Application Received Successfully!
              </span>
              <h2 className="text-3xl font-black text-primary-color mt-3 font-fredoka">
                Welcome to Little Flowers!
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                Thank you, <strong>{formData['father_name'] || formData['mother_name'] || 'Guardian'}</strong>. We have
                received your admission registration for <strong>{formData['student_name']}</strong> in{' '}
                <strong>{formData['applied_class']}</strong>.
              </p>
            </div>

            {/* Printable Tracking Card */}
            <div className="p-6 rounded-3xl bg-pastel-purple border-2 border-purple-200/80 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Application Tracking ID
                </span>
                <span className="text-sm font-black text-primary-color font-mono bg-white px-3 py-1 rounded-xl shadow-xs border border-purple-100">
                  {applicationNumber}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Student Name:</span>
                <strong className="text-gray-900">{formData['student_name']}</strong>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Enrolled Grade:</span>
                <strong className="text-secondary-color">{formData['applied_class']}</strong>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Contact Email:</span>
                <strong className="text-gray-900">{formData['guardian_email']}</strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span>📋</span> Next Steps for Parents:
              </p>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Our admissions coordinator will review your form and contact you within 2 business days to schedule an informal parent-child interaction tour.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-full shadow-sm transition-all cursor-pointer"
              >
                🖨️ Print Confirmation
              </button>
              <a
                href="/"
                className="px-8 py-3 bg-primary-color hover:opacity-95 text-white font-extrabold text-xs rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Return to Homepage →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
