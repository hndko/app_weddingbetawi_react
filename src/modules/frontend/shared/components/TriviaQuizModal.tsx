import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Gamepad2, Trophy, Award, CheckCircle2, XCircle, ArrowRight, 
  RotateCcw, Share2, Sparkles, User, HelpCircle, ChevronRight,
  Flame, Check, Loader2, PartyPopper
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { TriviaQuestion, TriviaScore } from '../../../../types';
import { playCorrectSound, playWrongSound, playVictoryFanfare } from '../utils/triviaAudioSynthesizer';

interface TriviaQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TriviaQuizModal({ isOpen, onClose }: TriviaQuizModalProps) {
  const { weddingConfig } = useWeddingConfig();
  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard'>('quiz');
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');

  // URL Guest Name extraction
  const urlGuestName = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('to') || '';
    } catch {
      return '';
    }
  }, []);

  const [guestName, setGuestName] = useState<string>(urlGuestName || 'Tamu Undangan');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false);
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<TriviaScore[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(true);

  // Default fallback questions in case Firestore has none
  const defaultQuestions: TriviaQuestion[] = useMemo(() => [
    {
      id: 'default-1',
      question: `Di mana ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname} pertama kali bertemu dan saling kenal?`,
      options: [
        'Acara Kebudayaan di Setu Babakan',
        'Kampus / Tempat Kuliah',
        'Kantor Tempat Kerja',
        'Pernikahan Sahabat Karib'
      ],
      correctAnswerIndex: 0,
      explanation: 'Pertemuan pertama mereka berawal dari percakapan hangat di sebuah perhelatan kebudayaan Betawi di Setu Babakan pada tahun 2021!',
      order: 1
    },
    {
      id: 'default-2',
      question: `Siapa yang pertama kali naksir dan membuka obrolan duluan?`,
      options: [
        `${weddingConfig.groom.nickname} duluan yang memberanikan diri`,
        `${weddingConfig.bride.nickname} yang mengirim sinyal duluan`,
        'Dicomblangi oleh sahabat dekat',
        'Saling tatap dan langsung jatuh cinta bersamaan'
      ],
      correctAnswerIndex: 0,
      explanation: `${weddingConfig.groom.nickname} yang memberanikan diri menyapa dan membuka obrolan pertama kali dengan penuh senyuman!`,
      order: 2
    },
    {
      id: 'default-3',
      question: `Apa agenda kencan favorit yang paling sering mereka nikmati bersama?`,
      options: [
        'Berburu kuliner tradisional & ngopi sore santai',
        'Nonton film bioskop premiere midnight',
        'Mendaki gunung & wisata alam rimba',
        'Olahraga maraton car free day'
      ],
      correctAnswerIndex: 0,
      explanation: 'Menikmati kuliner lezat kaki lima dan ngobrol berjam-jam ditemani secangkir kopi adalah momen paling berharga bagi mereka!',
      order: 3
    },
    {
      id: 'default-4',
      question: `Berapa lama perjalanan cinta mereka dari awal pacaran hingga momen lamaran resmi?`,
      options: [
        'Sekitar 2 Tahun',
        'Kurang dari 6 Bulan',
        'Lebih dari 5 Tahun',
        'Tepat 1 Tahun'
      ],
      correctAnswerIndex: 0,
      explanation: 'Setelah menjalin hubungan sejak 2023, komitmen suci diteguhkan dengan lamaran resmi pada tahun 2025.',
      order: 4
    },
    {
      id: 'default-5',
      question: `Di mana lokasi akad nikah suci mereka akan dilangsungkan?`,
      options: [
        weddingConfig.events.akad.venue || 'Masjid Cut Meutia, Menteng',
        'Masjid Istiqlal Jakarta',
        'Gedung Pewayangan Kautaman TMII',
        'Hotel Grand Hyatt Ballroom'
      ],
      correctAnswerIndex: 0,
      explanation: `Ijab kabul sakral akan dilangsungkan di ${weddingConfig.events.akad.venue}!`,
      order: 5
    }
  ], [weddingConfig]);

  // Sync Guest Name from URL
  useEffect(() => {
    if (urlGuestName) {
      setGuestName(urlGuestName);
    }
  }, [urlGuestName]);

  // Load questions from Firestore
  useEffect(() => {
    const q = query(collection(db, 'wedding_trivia_questions'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: TriviaQuestion[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<TriviaQuestion, 'id'>)
          }));
          setQuestions(loaded);
        } else {
          setQuestions(defaultQuestions);
        }
      },
      () => {
        setQuestions(defaultQuestions);
      }
    );

    return () => unsubscribe();
  }, [defaultQuestions]);

  // Load leaderboard scores
  useEffect(() => {
    const q = query(
      collection(db, 'wedding_trivia_scores'),
      orderBy('score', 'desc'),
      limit(25)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: TriviaScore[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TriviaScore, 'id'>)
        }));
        setLeaderboard(loaded);
        setLoadingLeaderboard(false);
      },
      () => {
        setLoadingLeaderboard(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  const activeQuestions = questions.length > 0 ? questions : defaultQuestions;
  const currentQ = activeQuestions[currentIdx];

  const handleStartGame = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setScoreSaved(false);
    setGameState('playing');
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || selectedOption !== null) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctAnswerIndex;
    if (isCorrect) {
      setScore((prev) => Math.min(activeQuestions.length, prev + 1));
      playCorrectSound();
    } else {
      playWrongSound();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz Finished
      playVictoryFanfare();
      setGameState('result');
    }
  };

  const totalQ = activeQuestions.length;
  const safeScore = Math.min(totalQ, Math.max(0, score));
  const percentage = totalQ > 0 ? Math.min(100, Math.max(0, Math.round((safeScore / totalQ) * 100))) : 0;

  const getRankBadge = (pct: number) => {
    if (pct === 100) return { title: 'Sahabat Sejati 100% 🏆', desc: 'Kamu kenal mempelai luar dalam! Hubungan persahabatan kalian luar biasa!' };
    if (pct >= 80) return { title: 'Sahabat Dekat 🌟', desc: 'Pengetahuanmu tentang perjalanan cinta mereka sangat mengesankan!' };
    if (pct >= 60) return { title: 'Kolega Kompak 💖', desc: 'Kamu tahu banyak hal tentang mereka! Sahabat yang hangat dan suportif.' };
    return { title: 'Yuk Kenalan Lebih Dekat 😄', desc: 'Masih ada rahasia manis yang belum kamu tahu. Jangan lupa ngobrol seru di hari-H!' };
  };

  const rankInfo = getRankBadge(percentage);

  const handleSaveScoreToLeaderboard = async () => {
    if (isSavingScore || scoreSaved) return;
    try {
      setIsSavingScore(true);
      await addDoc(collection(db, 'wedding_trivia_scores'), {
        guestName: guestName.trim() || 'Tamu Undangan',
        score: safeScore,
        totalQuestions: totalQ,
        percentage,
        title: rankInfo.title,
        createdAt: serverTimestamp()
      });
      setScoreSaved(true);
      setIsSavingScore(false);
    } catch {
      setIsSavingScore(false);
    }
  };

  const handleShareToWhatsApp = () => {
    const groom = weddingConfig.groom.nickname;
    const bride = weddingConfig.bride.nickname;
    const currentUrl = window.location.href;
    const text = `🎮 *Wedding Trivia Quiz: ${groom} & ${bride}*\n\n` +
      `Halo! Saya (*${guestName.trim() || 'Tamu Undangan'}*) baru saja menguji pengetahuan cinta di Trivia Quiz Pernikahan ${groom} & ${bride} dan meraih skor *${safeScore}/${totalQ} (${percentage}%)*!\n\n` +
      `Predikat: *${rankInfo.title}*\n\n` +
      `Yuk tebak juga seberapa kenal kamu dengan kedua mempelai di:\n${currentUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md max-h-[92vh] bg-gradient-to-b from-[#18181b] to-[#09090b] text-white rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gamepad2 size={20} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base tracking-wide flex items-center gap-1.5 text-white">
                Wedding Trivia <Sparkles size={14} className="text-amber-400 animate-pulse" />
              </h3>
              <p className="text-[11px] text-white/50 tracking-wider">
                {weddingConfig.groom.nickname} & {weddingConfig.bride.nickname}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors"
              title="Tutup Modal"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill */}
        <div className="px-5 pt-3 pb-2 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Gamepad2 size={14} /> Main Kuis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Trophy size={14} /> Papan Skor ({leaderboard.length})
          </button>
        </div>

        {/* Tab 1: Quiz Flow */}
        {activeTab === 'quiz' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
            {/* Intro Screen */}
            {gameState === 'intro' && (
              <div className="flex flex-col items-center text-center py-4">
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-xl shadow-amber-500/20 mb-5 flex items-center justify-center"
                >
                  <div className="w-full h-full bg-[#18181b] rounded-[22px] flex items-center justify-center text-amber-400">
                    <Trophy size={38} className="animate-bounce" />
                  </div>
                </motion.div>

                <h4 className="font-heading text-xl font-bold mb-2 text-white">
                  Seberapa Kenal Kamu dengan Kami?
                </h4>
                <p className="text-xs text-white/70 max-w-xs leading-relaxed mb-6">
                  Uji ingatan dan pengetahuanmu seputar kisah cinta, kebiasaan lucu, dan fakta menarik tentang kedua mempelai!
                </p>

                {/* Guest Name Input / Greeting */}
                <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-left mb-6">
                  <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <User size={12} className="text-amber-400" /> Nama Peserta Kuis
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Masukkan Nama Anda..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-medium"
                    maxLength={40}
                  />
                  <p className="text-[10px] text-white/40 mt-1.5">
                    Nama ini akan tercantum di papan peringkat juara tamu undangan.
                  </p>
                </div>

                {/* Features List */}
                <div className="grid grid-cols-2 gap-2.5 w-full mb-6 text-left">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <HelpCircle size={16} className="text-amber-400 shrink-0" />
                    <span className="text-[11px] text-white/80">{totalQ} Pertanyaan Seru</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-2.5 flex items-center gap-2">
                    <Award size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-white/80">Skor & Gelar Juara</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleStartGame}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 tracking-wide transition-all transform active:scale-95"
                >
                  <Flame size={18} /> MULAI KUIS SEKARANG
                </button>
              </div>
            )}

            {/* Game Playing Screen */}
            {gameState === 'playing' && currentQ && (
              <div className="flex flex-col py-1">
                {/* Progress Bar & Counter */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-medium">
                    <span>Pertanyaan {currentIdx + 1} dari {totalQ}</span>
                    <span className="text-amber-400 font-bold">Skor: {score}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Question Box */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase mb-1">
                    Pertanyaan #{currentIdx + 1}
                  </p>
                  <h4 className="text-base font-bold text-white leading-snug">
                    {currentQ.question}
                  </h4>
                </div>

                {/* 4 Options */}
                <div className="space-y-2.5 mb-4">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === currentQ.correctAnswerIndex;
                    
                    let btnStyle = "bg-white/[0.05] border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20";
                    let badgeLetterStyle = "bg-white/10 text-white/80";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-500/20 border-emerald-500/80 text-emerald-300 shadow-md shadow-emerald-500/10";
                        badgeLetterStyle = "bg-emerald-500 text-black";
                      } else if (isSelected && !isCorrect) {
                        btnStyle = "bg-rose-500/20 border-rose-500/80 text-rose-300";
                        badgeLetterStyle = "bg-rose-500 text-white";
                      } else {
                        btnStyle = "bg-white/[0.02] border-white/5 text-white/40";
                      }
                    }

                    const letters = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(oIdx)}
                        disabled={isAnswered}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${badgeLetterStyle}`}>
                            {letters[oIdx]}
                          </span>
                          <span className="text-xs font-medium leading-snug">{opt}</span>
                        </div>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle size={18} className="text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card */}
                {isAnswered && currentQ.explanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 mb-4 text-left"
                  >
                    <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                      <Sparkles size={13} /> Fakta Cerita:
                    </p>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </motion.div>
                )}

                {/* Next Button */}
                {isAnswered && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wider uppercase hover:bg-amber-400 transition-colors shadow-lg"
                  >
                    {currentIdx + 1 < totalQ ? (
                      <>Pertanyaan Berikutnya <ArrowRight size={15} /></>
                    ) : (
                      <>Lihat Hasil Akhir <Trophy size={15} /></>
                    )}
                  </motion.button>
                )}
              </div>
            )}

            {/* Result Screen */}
            {gameState === 'result' && (
              <div className="flex flex-col items-center text-center py-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-1 mb-4 flex items-center justify-center shadow-2xl shadow-amber-500/30"
                >
                  <div className="w-full h-full bg-[#18181b] rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-amber-400 font-heading leading-none">
                      {percentage}%
                    </span>
                    <span className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">
                      {safeScore}/{totalQ} Benar
                    </span>
                  </div>
                </motion.div>

                <h4 className="text-lg font-bold text-white mb-1">
                  {guestName}
                </h4>

                <div className="inline-block px-3.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-xs rounded-full mb-3">
                  {rankInfo.title}
                </div>

                <p className="text-xs text-white/70 max-w-xs leading-relaxed mb-6">
                  {rankInfo.desc}
                </p>

                {/* Action Buttons */}
                <div className="w-full space-y-2.5">
                  {!scoreSaved ? (
                    <button
                      type="button"
                      onClick={handleSaveScoreToLeaderboard}
                      disabled={isSavingScore}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isSavingScore ? (
                        <><Loader2 size={16} className="animate-spin" /> Menyimpan Skor...</>
                      ) : (
                        <><Trophy size={16} /> Catat Skor ke Papan Peringkat</>
                      )}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-2 text-emerald-300 text-xs font-semibold">
                      <Check size={16} /> Skor Anda Tersimpan di Papan Juara!
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleShareToWhatsApp}
                    className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/15 flex items-center justify-center gap-2 text-xs tracking-wider transition-colors"
                  >
                    <Share2 size={16} className="text-emerald-400" /> Tantang Teman via WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={handleStartGame}
                    className="w-full py-2.5 text-white/60 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw size={14} /> Main Ulang Kuis
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
            <div className="flex items-center justify-between mb-3 text-xs text-white/60">
              <span className="font-semibold text-white/80">Tamu Terpintar</span>
              <span>{leaderboard.length} Skor Tercatat</span>
            </div>

            {loadingLeaderboard ? (
              <div className="py-12 flex flex-col items-center justify-center text-white/50 text-xs gap-2">
                <Loader2 size={24} className="animate-spin text-amber-400" />
                <span>Memuat Papan Skor...</span>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-xs">
                <PartyPopper size={32} className="mx-auto mb-2 text-amber-400/50" />
                <p>Belum ada skor tercatat.</p>
                <p className="mt-1 text-[11px]">Jadilah yang pertama bermain kuis ini!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((item, idx) => {
                  let medalBadge = <span className="text-xs text-white/40 font-mono w-5">#{idx + 1}</span>;
                  let cardBg = "bg-white/[0.03] border-white/5";

                  if (idx === 0) {
                    medalBadge = <span className="text-base">🥇</span>;
                    cardBg = "bg-amber-500/10 border-amber-500/30 text-amber-300";
                  } else if (idx === 1) {
                    medalBadge = <span className="text-base">🥈</span>;
                    cardBg = "bg-slate-300/10 border-slate-300/20 text-slate-200";
                  } else if (idx === 2) {
                    medalBadge = <span className="text-base">🥉</span>;
                    cardBg = "bg-amber-700/10 border-amber-700/20 text-amber-200";
                  }

                  return (
                    <div
                      key={item.id || idx}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${cardBg}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 flex items-center justify-center shrink-0">
                          {medalBadge}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {item.guestName}
                          </p>
                          <p className="text-[10px] text-white/50 truncate">
                            {item.title}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-heading text-amber-400">
                          {item.score}/{item.totalQuestions}
                        </span>
                        <p className="text-[9px] text-white/40 font-mono">
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
