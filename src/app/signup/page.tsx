'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, ArrowRight, GraduationCap, Shield, Mail, KeyRound, CheckCircle2, User, BookOpen, Calendar, Building, Upload, Camera, AlertCircle, ShieldCheck, Phone } from 'lucide-react';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import EvidaLogo from '@/components/ui/EvidaLogo';
import LoginSplash from '@/components/LoginSplash';

type SignupStep = 'role-selection' | 'auth-options' | 'verify-email' | 'data-privacy' | 'profile-onboarding' | 'school-onboarding' | 'success';

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useUser();

  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<SignupStep>('role-selection');
  const [role, setRole] = useState<'student' | 'school'>('student');
  
  // Auth Options Form State
  const [email, setEmail] = useState('');
  // Password removed — easy access mode
  const password = 'nopassword';
  
  // Student Profile Onboarding State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('2028');
  const [phone, setPhone] = useState('');
  
  // Avatar Selection State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#FD5C05');
  const [avatarType, setAvatarType] = useState<'initials' | 'upload'>('initials');

  // School Onboarding State
  const [department, setDepartment] = useState('');
  const [customSchoolName, setCustomSchoolName] = useState('');

  // Privacy Consent State
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [consentAge, setConsentAge] = useState(false);

  // Verification State
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Transitions
  const slideVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 })
  };

  const [dir, setDir] = useState(1);

  const navigateTo = (nextStep: SignupStep, direction: 'forward' | 'backward' = 'forward') => {
    setError('');
    setDir(direction === 'forward' ? 1 : -1);
    setStep(nextStep);
  };

  const handleRoleSelect = (selectedRole: 'student' | 'school') => {
    setRole(selectedRole);
    navigateTo('auth-options', 'forward');
  };

  // Auto-detect school name from email
  const detectSchool = (emailStr: string): string => {
    if (!emailStr) return 'State University';
    const domain = emailStr.split('@')[1]?.toLowerCase();
    if (!domain) return 'State University';
    if (domain.includes('stateuni') || domain.includes('university')) return 'State University';
    const part = domain.split('.')[0];
    return part ? part.charAt(0).toUpperCase() + part.slice(1) + ' University' : 'State University';
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      setIsLoading(false);
      setEmail('google.student@university.edu');
      // Google flow skips verification, goes to consent
      navigateTo('data-privacy', 'forward');
    }, 1000);
  };

  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (role === 'school') {
        setCustomSchoolName(detectSchool(email));
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      navigateTo('verify-email', 'forward');
    }, 800);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // After verification → Data & Privacy consent
      navigateTo('data-privacy', 'forward');
    }, 800);
  };

  const handleConsentSubmit = () => {
    if (!consentTerms || !consentData || !consentAge) {
      setError('You must accept all terms before proceeding.');
      return;
    }
    setError('');
    if (role === 'student') {
      navigateTo('profile-onboarding', 'forward');
    } else {
      if (!customSchoolName) setCustomSchoolName(detectSchool(email));
      navigateTo('school-onboarding', 'forward');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setAvatarType('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !major) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    const detectedSchoolName = detectSchool(email);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`,
          role: 'student',
          major,
          gradYear,
          school: detectedSchoolName,
          avatar: avatarType === 'upload' ? (uploadedImage || initials) : initials,
          phone: phone || undefined,
          consentGiven: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Success — set user in context
      setCurrentUser({
        ...data,
        graduationYear: gradYear,
      });
      setIsLoading(false);
      navigateTo('success', 'forward');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }

      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSchoolOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !customSchoolName) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name: `${department} Admin`,
          role: 'admin',
          department,
          school: customSchoolName,
          consentGiven: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      setCurrentUser(data);
      setIsLoading(false);
      navigateTo('success', 'forward');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('evida_force_redirect_splash', 'true');
      }

      setTimeout(() => {
        router.push('/school/dashboard');
      }, 1500);
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  // Initials helper
  const getInitials = () => {
    const f = firstName.trim().charAt(0) || '';
    const l = lastName.trim().charAt(0) || '';
    return (f + l).toUpperCase() || '?';
  };

  // Progress indicator
  const stepOrder: SignupStep[] = role === 'student'
    ? ['role-selection', 'auth-options', 'verify-email', 'data-privacy', 'profile-onboarding', 'success']
    : ['role-selection', 'auth-options', 'verify-email', 'data-privacy', 'school-onboarding', 'success'];
  const currentStepIdx = stepOrder.indexOf(step);
  const totalSteps = stepOrder.length;

  return (
    <div className="min-h-screen bg-[var(--color-primary-bg)] flex items-center justify-center p-6 max-sm:p-4 relative overflow-hidden font-sans">
      
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0 z-50 overflow-hidden"
          >
            <LoginSplash onStart={() => setShowSplash(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="signup-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md z-10 flex flex-col items-center relative animate-fade-in"
          >
            {/* Back to Home */}
            {step === 'role-selection' && (
              <Link href="/" className="absolute top-[-44px] left-2 text-[#5A554E] hover:text-[#2A2621] flex items-center gap-2 transition-colors font-bold text-xs uppercase tracking-wider">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            )}

            <Card glass className="p-8 max-sm:p-5 max-sm:rounded-[28px] space-y-6 overflow-hidden relative w-full" hover={false}>
              
              {/* Progress Bar */}
              {step !== 'role-selection' && step !== 'success' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        if (step === 'auth-options') navigateTo('role-selection', 'backward');
                        else if (step === 'verify-email') navigateTo('auth-options', 'backward');
                        else if (step === 'data-privacy') navigateTo(generatedCode ? 'verify-email' : 'auth-options', 'backward');
                        else if (step === 'profile-onboarding') navigateTo('data-privacy', 'backward');
                        else if (step === 'school-onboarding') navigateTo('data-privacy', 'backward');
                      }}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#5A554E] hover:text-[#2A2621] transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back
                    </button>
                    <span className="text-[10px] font-black text-[#FD5C05] bg-[#2A2621] px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Step {currentStepIdx} of {totalSteps - 2}
                    </span>
                  </div>
                  <div className="h-1 bg-black/[0.06] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FD5C05] transition-all duration-300"
                      style={{ width: `${(currentStepIdx / (totalSteps - 2)) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  {/* ═══ STEP 1: ROLE SELECTION ═══ */}
                  {step === 'role-selection' && (
                    <>
                      {/* Header */}
                      <div className="text-center space-y-3">
                        <div className="mx-auto flex justify-center mb-1">
                          <EvidaLogo size={36} showText={false} />
                        </div>
                        <div>
                          <h1 className="text-xl font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                            Join Evida
                          </h1>
                          <p className="text-xs text-[#5A554E] mt-1.5">
                            Select your account type to set up your profile
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 gap-3">
                          {/* Student Option */}
                          <button
                            onClick={() => handleRoleSelect('student')}
                            className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-[#D8D2BC]/30 bg-white hover:bg-black/[0.01] hover:border-[#FD5C05] transition-all duration-300 cursor-pointer text-left group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-[#FD5C05]/10 text-[#FD5C05] flex items-center justify-center group-hover:scale-105 transition-transform">
                                <GraduationCap className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#2A2621] uppercase tracking-wide">Student Account</p>
                                <p className="text-xs text-[#5A554E] mt-0.5 max-w-[220px]">Discover events, join student groups, and host activities.</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-[#5A554E] group-hover:text-[#FD5C05] group-hover:translate-x-1 transition-all" />
                          </button>

                          {/* School Option */}
                          <button
                            onClick={() => handleRoleSelect('school')}
                            className="w-full flex items-center justify-between p-5 rounded-2xl border-2 border-[#D8D2BC]/30 bg-white hover:bg-black/[0.01] hover:border-[#2A2621]/30 transition-all duration-300 cursor-pointer text-left group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-[#2A2621]/10 text-[#2A2621] flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Shield className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#2A2621] uppercase tracking-wide">School Administration</p>
                                <p className="text-xs text-[#5A554E] mt-0.5 max-w-[220px]">Verify student groups, approve events, and manage campus alerts.</p>
                              </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-[#5A554E] group-hover:text-[#2A2621] group-hover:translate-x-1 transition-all" />
                          </button>
                        </div>

                        <div className="pt-4 border-t border-[#D8D2BC]/30 text-center">
                          <p className="text-xs text-[#5A554E]">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#2A2621] font-bold underline decoration-2 decoration-[#FD5C05] hover:text-[#2A2621]/80 transition-all">
                              Sign in here
                            </Link>
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ═══ STEP 2: AUTHENTICATION OPTIONS ═══ */}
                  {step === 'auth-options' && (
                    <div className="space-y-5">
                      <div className="text-center space-y-2">
                        <h2 className="text-lg font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          Create Credentials
                        </h2>
                        <p className="text-xs text-[#5A554E]">
                          Enter your school email or use Google to fast track setup
                        </p>
                      </div>

                      {/* Google Quick Sign Up */}
                      <button 
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-black/[0.08] hover:border-black/20 bg-white hover:bg-neutral-50 font-bold text-xs text-[#2A2621] uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" strokeWidth="0" />
                        </svg>
                        Continue with Google
                      </button>

                      <div className="flex items-center justify-between text-neutral-300">
                        <div className="h-px bg-black/[0.08] flex-1" />
                        <span className="text-[9px] font-black uppercase px-3 tracking-widest text-[#5A554E]">or use email</span>
                        <div className="h-px bg-black/[0.08] flex-1" />
                      </div>

                      {/* Email Form */}
                      <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">University Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A554E]"><Mail className="h-4 w-4" /></div>
                            <input 
                              type="email" 
                              required 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. yourname@university.edu"
                              className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium"
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD5C05] hover:bg-[#FD5C05]/90 active:bg-[#2A2621] py-3.5 text-xs font-bold text-[#2A2621] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? 'Generating Code...' : 'Get Verification Code'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* ═══ STEP 3: VERIFY EMAIL (OTP MOCK) ═══ */}
                  {step === 'verify-email' && (
                    <form onSubmit={handleVerifySubmit} className="space-y-5">
                      <div className="text-center space-y-2">
                        <h2 className="text-lg font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          Verify School Email
                        </h2>
                        <p className="text-xs text-[#5A554E]">
                          We sent a 6-digit access code to <span className="font-bold text-[#2A2621]">{email}</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">6-Digit Verification Code</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A554E]"><KeyRound className="h-4 w-4" /></div>
                          <input 
                            type="text" 
                            maxLength={6}
                            required 
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 6-digit code"
                            className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium text-center tracking-[0.3em] font-mono text-base"
                          />
                        </div>
                        {generatedCode && (
                          <div className="bg-[#FD5C05]/10 border border-[#FD5C05]/20 rounded-lg p-2.5 text-[10px] text-[#5A554E] text-left">
                            <span className="font-bold text-[#2A2621] block uppercase tracking-wider mb-0.5">Mock Notification Inbox:</span>
                            Your verification code is: <span className="font-black text-[#2A2621] text-xs">{generatedCode}</span>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD5C05] hover:bg-[#FD5C05]/90 active:bg-[#2A2621] py-3.5 text-xs font-bold text-[#2A2621] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'Verifying Code...' : 'Confirm Verification Code'}
                      </button>
                    </form>
                  )}

                  {/* ═══ STEP 4: DATA PRIVACY & TERMS CONSENT ═══ */}
                  {step === 'data-privacy' && (
                    <form onSubmit={handleConsentSubmit} className="space-y-5">
                      <div className="text-center space-y-2">
                        <h2 className="text-lg font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          Consent & Privacy
                        </h2>
                        <p className="text-xs text-[#5A554E]">
                          Evida takes safety seriously. Review and check all required consents.
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                          <input type="checkbox" checked={consentTerms} onChange={() => setConsentTerms(!consentTerms)} className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-[#FD5C05] focus:ring-[#FD5C05]" />
                          <span className="text-[11px] text-[#5A554E] leading-snug">
                            I agree to the <Link href="/terms" target="_blank" className="font-bold underline text-[#2A2621]">Terms of Service</Link> and the campus safety policies.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                          <input type="checkbox" checked={consentData} onChange={() => setConsentData(!consentData)} className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-[#FD5C05] focus:ring-[#FD5C05]" />
                          <span className="text-[11px] text-[#5A554E] leading-snug">
                            I consent to the collection and use of my registration details for school verification purposes.
                          </span>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer group select-none">
                          <input type="checkbox" checked={consentAge} onChange={() => setConsentAge(!consentAge)} className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-[#FD5C05] focus:ring-[#FD5C05]" />
                          <span className="text-[11px] text-[#5A554E] leading-snug">
                            I confirm that I am at least 16 years of age and currently enrolled at this university.
                          </span>
                        </label>
                      </div>

                      {error && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD5C05] hover:bg-[#FD5C05]/90 active:bg-[#2A2621] py-3.5 text-xs font-bold text-[#2A2621] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                      >
                        Accept Terms & Continue
                      </button>
                    </form>
                  )}

                  {/* ═══ STEP 5A: STUDENT PROFILE ONBOARDING ═══ */}
                  {step === 'profile-onboarding' && (
                    <form onSubmit={handleStudentProfileSubmit} className="space-y-4 pt-1">
                      {/* Avatar Picker */}
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-[9px] font-extrabold text-[#5A554E] uppercase tracking-wider block">
                          Profile Picture
                        </span>
                        <div className="relative">
                          {avatarType === 'upload' && uploadedImage ? (
                            <div className="h-16 w-16 rounded-full border-2 border-black/10 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${uploadedImage})` }} />
                          ) : (
                            <div 
                              className="h-16 w-16 rounded-full border-2 border-[#D8D2BC]/40 text-white flex items-center justify-center font-extrabold text-lg shadow-sm transition-colors duration-300"
                              style={{ backgroundColor: selectedColor }}
                            >
                              {getInitials()}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#2A2621] text-white flex items-center justify-center hover:scale-105 transition-transform border border-white cursor-pointer shadow"
                          >
                            <Camera className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                        <div className="flex gap-2.5 items-center justify-center">
                          {['#FD5C05', '#FF7A1A', '#9C27B0', '#2196F3', '#FF5722'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => { setSelectedColor(c); setAvatarType('initials'); }}
                              className={`h-5 w-5 rounded-full border border-black/10 transition-all hover:scale-110 cursor-pointer ${selectedColor === c && avatarType === 'initials' ? 'ring-2 ring-[#2A2621] ring-offset-2 scale-105' : ''}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {/* First & Last Name */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">First Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A554E]"><User className="h-3.5 w-3.5" /></div>
                              <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Alex"
                                className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium" />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">Last Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A554E]"><User className="h-3.5 w-3.5" /></div>
                              <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Carter"
                                className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium" />
                            </div>
                          </div>
                        </div>

                        {/* Major Field */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">Academic Major</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A554E]"><BookOpen className="h-4 w-4" /></div>
                            <input type="text" required value={major} onChange={(e) => setMajor(e.target.value)} placeholder="e.g. Computer Science"
                              className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium" />
                          </div>
                        </div>

                        {/* Graduation Year */}
                        <div className="grid grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">Graduation Year</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A554E]"><Calendar className="h-4 w-4" /></div>
                              <select value={gradYear} onChange={(e) => setGradYear(e.target.value)}
                                className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-xs text-[#2A2621] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-semibold">
                                {['2026', '2027', '2028', '2029', '2030'].map((y) => <option key={y} value={y}>{y}</option>)}
                              </select>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">Phone Number</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5A554E]"><Phone className="h-3.5 w-3.5" /></div>
                              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(123) 456-7890"
                                className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-9 pr-3 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD5C05] hover:bg-[#FD5C05]/90 active:bg-[#2A2621] py-3.5 text-xs font-bold text-[#2A2621] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'Creating Student Profile...' : 'Complete Profile Setup'}
                      </button>
                    </form>
                  )}

                  {/* ═══ STEP 5B: SCHOOL ONBOARDING ═══ */}
                  {step === 'school-onboarding' && (
                    <form onSubmit={handleSchoolOnboardingSubmit} className="space-y-4 pt-1">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">Administration Department</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A554E]"><User className="h-4 w-4" /></div>
                            <input type="text" required value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Student Affairs Board"
                              className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-[#5A554E] uppercase tracking-widest block">Institution Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5A554E]"><Building className="h-4 w-4" /></div>
                            <input type="text" required value={customSchoolName} onChange={(e) => setCustomSchoolName(e.target.value)} placeholder="e.g. State University"
                              className="w-full rounded-xl border-2 border-black/[0.08] bg-white py-2.5 pl-11 pr-4 text-xs text-[#2A2621] placeholder-[#5A554E] focus:outline-none focus:border-[#FD5C05] focus:ring-1 focus:ring-[#FD5C05] transition-all font-medium" />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="text-xs text-red-600 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg p-2.5">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FD5C05] hover:bg-[#FD5C05]/90 active:bg-[#2A2621] py-3.5 text-xs font-bold text-[#2A2621] uppercase tracking-widest transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'Saving Institution Profile...' : 'Complete Administration Setup'}
                      </button>
                    </form>
                  )}

                  {/* ═══ SUCCESS SCREEN ═══ */}
                  {step === 'success' && (
                    <div className="text-center py-8 space-y-5">
                      <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border-2 border-emerald-500/25"
                      >
                        <CheckCircle2 className="h-8 w-8" />
                      </motion.div>

                      <div className="space-y-2">
                        <h2 className="text-xl font-extrabold text-[#2A2621] tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>
                          Account Activated
                        </h2>
                        <p className="text-xs text-[#5A554E]">
                          Welcome to Evida! Initializing your custom {role === 'student' ? 'Student' : 'Administration'} workspace...
                        </p>
                      </div>

                      <div className="flex justify-center pt-2">
                        <div className="w-6 h-6 border-2 border-[#FD5C05] border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background Glowing Blobs (only when splash is gone) */}
      {!showSplash && (
        <>
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#FD5C05]/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FD5C05]/4 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#FD5C05]/3 blur-[140px] pointer-events-none" />
        </>
      )}
    </div>
  );
}
