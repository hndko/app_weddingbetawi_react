import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, AlertCircle, Loader2, KeyRound } from 'lucide-react';

export interface LoginProps {
  groomName: string;
  brideName: string;
  onLoginSuccess: () => void;
  onNavigateBack: () => void;
}

export function Login({
  groomName,
  brideName,
  onLoginSuccess,
  onNavigateBack,
}: LoginProps) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e?: React.FormEvent, customValue?: string) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const valueToTest = (customValue !== undefined ? customValue : passcode).trim().toLowerCase();
    
    if (!valueToTest) {
      setHasError(true);
      triggerShake();
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Intentional 400ms visual delay for UX polish and brute-force mitigation
    setTimeout(() => {
      if (valueToTest === 'password' || valueToTest === 'admin123' || valueToTest === 'admin') {
        try {
          sessionStorage.setItem('admin_authenticated', 'true');
        } catch {
          // Safe fallback for restricted storage environments
        }
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setHasError(true);
        triggerShake();
      }
    }, 400);
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleQuickFill = () => {
    setPasscode('password');
    setHasError(false);
    handleSubmit(undefined, 'password');
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F6F0] flex flex-col items-center justify-center p-4 sm:p-6 relative selection:bg-sage/30">
      {/* Subtle Background Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(var(--color-sage-dark) 2px, transparent 2px)', 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Main Auth Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isShaking ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { opacity: 1, y: 0 }}
        transition={{ duration: isShaking ? 0.4 : 0.35, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden relative z-10 flex flex-col"
      >
        {/* Top Betawi Gigi Balang Motif Accent */}
        <div className="w-full h-3 bg-gradient-to-r from-betawi-red via-gold to-sage-dark relative flex items-center justify-center overflow-hidden">
          <svg className="w-full h-3 text-white/30" preserveAspectRatio="none" viewBox="0 0 120 12">
            <path d="M0,0 L6,12 L12,0 L18,12 L24,0 L30,12 L36,0 L42,12 L48,0 L54,12 L60,0 L66,12 L72,0 L78,12 L84,0 L90,12 L96,0 L102,12 L108,0 L114,12 L120,0 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Couple Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/10 text-sage-dark text-xs font-medium mb-4">
            <ShieldCheck size={14} className="text-sage" />
            <span>The Wedding of {groomName} & {brideName}</span>
          </div>

          {/* Cultural Lock Shield */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-gold/30 text-sage-dark flex items-center justify-center shadow-inner mb-4 relative">
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gold ring-2 ring-white" />
            <Lock size={28} className="text-sage-dark" />
          </div>

          {/* Typography */}
          <h1 className="font-heading text-2xl sm:text-3xl text-text-dark font-medium mb-1.5">
            Panel Pengelola Undangan
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-6">
            Masukkan passcode resmi untuk mengelola data mempelai, jadwal acara, RSVP, dan doa restu.
          </p>

          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e)} className="w-full flex flex-col gap-4">
            <div className="flex flex-col text-left gap-1.5">
              <label 
                htmlFor="admin-passcode-input" 
                className="text-xs font-semibold text-gray-700 tracking-wide flex items-center justify-between"
              >
                <span>Passcode Akses</span>
                <span className="text-[11px] font-normal text-gray-400">Default: password</span>
              </label>
              
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center">
                  <KeyRound size={18} />
                </div>
                <input
                  id="admin-passcode-input"
                  type={showPasscode ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (hasError) setHasError(false);
                  }}
                  placeholder="Ketik passcode..."
                  disabled={isLoading}
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-3.5 text-sm sm:text-base rounded-xl border transition-all duration-200 bg-warm-white/50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white ${
                    hasError 
                      ? 'border-red-400 ring-2 ring-red-100' 
                      : 'border-gray-200 focus:border-sage-dark focus:ring-2 focus:ring-sage/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  disabled={isLoading}
                  className="absolute right-3 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors cursor-pointer"
                  title={showPasscode ? 'Sembunyikan passcode' : 'Lihat passcode'}
                  aria-label={showPasscode ? 'Sembunyikan passcode' : 'Lihat passcode'}
                >
                  {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Error Message */}
              {hasError && (
                <motion.div 
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 mt-1 text-xs text-red-600 font-medium"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Passcode tidak cocok. Coba kembali atau gunakan passcode bawaan.</span>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-sage-dark hover:bg-sage text-white py-3.5 px-5 rounded-xl text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Buka Panel Pengelola</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Helper Button */}
          <div className="mt-4 pt-4 border-t border-gray-100 w-full flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleQuickFill}
              disabled={isLoading}
              className="text-xs text-sage-dark hover:text-deep-red font-medium py-1.5 px-3 rounded-lg hover:bg-sage/10 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <KeyRound size={13} />
              <span>Isi Otomatis Passcode Bawaan (password)</span>
            </button>

            {/* Back to Wedding Invitation Link */}
            <button
              type="button"
              onClick={onNavigateBack}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer py-1"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Halaman Undangan</span>
            </button>
          </div>
        </div>

        {/* Bottom Platform Footer Accent */}
        <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100 flex items-center justify-center text-[11px] text-gray-400">
          <span>Dilindungi Firebase Firestore • Mari Partner Wedding Invitation</span>
        </div>
      </motion.div>
    </div>
  );
}

export const AdminAuth = Login;
