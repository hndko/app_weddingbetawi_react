import React, { useState, useEffect, useMemo } from 'react';
import { 
  Gamepad2, Trophy, Plus, Trash2, Edit2, Download, Search, CheckCircle2, 
  HelpCircle, Sparkles, Award, RotateCcw, X, Check, AlertTriangle, 
  Flame, User, MessageSquare, ListOrdered, Share2, Layers
} from 'lucide-react';
import { 
  collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc, 
  deleteDoc, serverTimestamp, writeBatch 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { TriviaQuestion, TriviaScore } from '../../../types';
import { useWeddingConfig } from '../../../context/WeddingContext';

interface TriviaQuizManagerProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export function TriviaQuizManager({ onNotify }: TriviaQuizManagerProps) {
  const { weddingConfig } = useWeddingConfig();
  const [activeTab, setActiveTab] = useState<'questions' | 'scores'>('questions');

  // Firestore state
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [scores, setScores] = useState<TriviaScore[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state (In-memory, zero URL pollution per Pilar 5)
  const [questionSearch, setQuestionSearch] = useState('');
  const [scoreSearch, setScoreSearch] = useState('');

  // Modal Form State (Add/Edit Question)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [formCorrectIdx, setFormCorrectIdx] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SweetAlert-style Delete Modal State (Pilar 5)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'question' | 'score' | 'reset_defaults'; id?: string; name?: string } | null>(null);

  // 1. Subscribe to Questions
  useEffect(() => {
    const q = query(collection(db, 'wedding_trivia_questions'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: TriviaQuestion[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TriviaQuestion, 'id'>)
        }));
        setQuestions(loaded);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to Scores
  useEffect(() => {
    const q = query(collection(db, 'wedding_trivia_scores'), orderBy('score', 'desc'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: TriviaScore[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<TriviaScore, 'id'>)
        }));
        setScores(loaded);
      },
      () => {}
    );

    return () => unsubscribe();
  }, []);

  // 4 KPI Calculations
  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const totalPlayers = scores.length;
    const avgPercentage = totalPlayers > 0 
      ? Math.round(scores.reduce((acc, cur) => acc + (cur.percentage || 0), 0) / totalPlayers) 
      : 0;
    const perfectScores = scores.filter((s) => (s.percentage || 0) === 100).length;

    return { totalQuestions, totalPlayers, avgPercentage, perfectScores };
  }, [questions, scores]);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    const q = questionSearch.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((item) => 
      item.question.toLowerCase().includes(q) ||
      item.options.some((opt) => opt.toLowerCase().includes(q)) ||
      (item.explanation && item.explanation.toLowerCase().includes(q))
    );
  }, [questions, questionSearch]);

  // Filtered Scores
  const filteredScores = useMemo(() => {
    const q = scoreSearch.trim().toLowerCase();
    if (!q) return scores;
    return scores.filter((item) => 
      item.guestName.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q)
    );
  }, [scores, scoreSearch]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingQuestionId(null);
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIdx(0);
    setFormExplanation('');
    setFormOrder(questions.length + 1);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: TriviaQuestion) => {
    setEditingQuestionId(item.id || null);
    setFormQuestion(item.question);
    setFormOptions([
      item.options[0] || '',
      item.options[1] || '',
      item.options[2] || '',
      item.options[3] || ''
    ]);
    setFormCorrectIdx(item.correctAnswerIndex ?? 0);
    setFormExplanation(item.explanation || '');
    setFormOrder(item.order || 1);
    setIsFormModalOpen(true);
  };

  // Save / Submit Question Form
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim()) {
      onNotify?.('Pertanyaan tidak boleh kosong', 'error');
      return;
    }
    if (formOptions.some((opt) => !opt.trim())) {
      onNotify?.('Keempat pilihan jawaban wajib diisi', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        question: formQuestion.trim(),
        options: formOptions.map((o) => o.trim()),
        correctAnswerIndex: formCorrectIdx,
        explanation: formExplanation.trim(),
        order: Number(formOrder) || 1,
        updatedAt: serverTimestamp()
      };

      if (editingQuestionId) {
        await updateDoc(doc(db, 'wedding_trivia_questions', editingQuestionId), payload);
        onNotify?.('Pertanyaan trivia berhasil diperbarui', 'success');
      } else {
        await addDoc(collection(db, 'wedding_trivia_questions'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        onNotify?.('Pertanyaan trivia baru berhasil ditambahkan', 'success');
      }

      setIsFormModalOpen(false);
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      onNotify?.('Gagal menyimpan pertanyaan', 'error');
    }
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'question' && deleteTarget.id) {
        await deleteDoc(doc(db, 'wedding_trivia_questions', deleteTarget.id));
        onNotify?.('Pertanyaan trivia berhasil dihapus', 'success');
      } else if (deleteTarget.type === 'score' && deleteTarget.id) {
        await deleteDoc(doc(db, 'wedding_trivia_scores', deleteTarget.id));
        onNotify?.('Skor tamu berhasil dihapus', 'success');
      } else if (deleteTarget.type === 'reset_defaults') {
        // Seed 5 default questions
        const groom = weddingConfig.groom.nickname;
        const bride = weddingConfig.bride.nickname;
        const venue = weddingConfig.events.akad.venue || 'Masjid Cut Meutia';

        const defaultData = [
          {
            question: `Di mana ${groom} & ${bride} pertama kali bertemu dan saling kenal?`,
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
            question: `Siapa yang pertama kali naksir dan membuka obrolan duluan?`,
            options: [
              `${groom} duluan yang memberanikan diri`,
              `${bride} yang mengirim sinyal duluan`,
              'Dicomblangi oleh sahabat dekat',
              'Saling tatap dan langsung jatuh cinta bersamaan'
            ],
            correctAnswerIndex: 0,
            explanation: `${groom} yang memberanikan diri menyapa dan membuka obrolan pertama kali dengan penuh senyuman!`,
            order: 2
          },
          {
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
            question: `Di mana lokasi akad nikah suci mereka akan dilangsungkan?`,
            options: [
              venue,
              'Masjid Istiqlal Jakarta',
              'Gedung Pewayangan Kautaman TMII',
              'Hotel Grand Hyatt Ballroom'
            ],
            correctAnswerIndex: 0,
            explanation: `Ijab kabul sakral akan dilangsungkan di ${venue}!`,
            order: 5
          }
        ];

        const batch = writeBatch(db);
        defaultData.forEach((qItem) => {
          const newDocRef = doc(collection(db, 'wedding_trivia_questions'));
          batch.set(newDocRef, {
            ...qItem,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });

        await batch.commit();
        onNotify?.('5 Soal Default Trivia berhasil dimuat!', 'success');
      }
      setDeleteTarget(null);
    } catch {
      onNotify?.('Terjadi kesalahan saat memproses data', 'error');
      setDeleteTarget(null);
    }
  };

  // Export Scores CSV (UTF-8 BOM per Pilar 5)
  const handleExportCSV = () => {
    if (scores.length === 0) {
      onNotify?.('Belum ada data skor tamu untuk diekspor', 'error');
      return;
    }

    const headers = ['No', 'Nama Tamu', 'Jawaban Benar', 'Total Soal', 'Persentase (%)', 'Predikat Gelar', 'Waktu Bermain'];
    const rows = scores.map((s, idx) => {
      let dateStr = '-';
      if (s.createdAt) {
        if ('toDate' in s.createdAt && typeof s.createdAt.toDate === 'function') {
          dateStr = s.createdAt.toDate().toLocaleString('id-ID');
        } else if (s.createdAt instanceof Date) {
          dateStr = s.createdAt.toLocaleString('id-ID');
        }
      }

      return [
        idx + 1,
        `"${s.guestName.replace(/"/g, '""')}"`,
        s.score,
        s.totalQuestions,
        `${s.percentage}%`,
        `"${s.title.replace(/"/g, '""')}"`,
        `"${dateStr}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap_trivia_wedding_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('Data rekap skor tamu berhasil diunduh ke CSV', 'success');
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Total Soal Aktif</p>
            <h4 className="text-xl sm:text-2xl font-bold text-stone-800 font-heading mt-1">
              {stats.totalQuestions}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <HelpCircle size={22} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Tamu Bermain</p>
            <h4 className="text-xl sm:text-2xl font-bold text-stone-800 font-heading mt-1">
              {stats.totalPlayers}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <User size={22} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Rata-Rata Skor</p>
            <h4 className="text-xl sm:text-2xl font-bold text-stone-800 font-heading mt-1">
              {stats.avgPercentage}%
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Award size={22} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-500">Skor Sempurna (100%)</p>
            <h4 className="text-xl sm:text-2xl font-bold text-stone-800 font-heading mt-1">
              {stats.perfectScores}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
            <Trophy size={22} />
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden">
        {/* Top Control Bar: Tabs & Action Buttons */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'questions'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <HelpCircle size={14} /> Bank Soal ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scores')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'scores'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Trophy size={14} /> Papan Skor Tamu ({scores.length})
            </button>
          </div>

          {/* Action buttons (Icon + Text per Pilar 5) */}
          <div className="flex items-center gap-2 flex-wrap">
            {activeTab === 'questions' ? (
              <>
                {questions.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ type: 'reset_defaults', name: 'Muat 5 Soal Default Trivia' })}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles size={14} /> Muat 5 Soal Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="px-3.5 py-2 bg-sage hover:bg-sage-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Plus size={14} /> Tambah Pertanyaan
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Download size={14} /> Unduh Rekap CSV
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Bank Soal Trivia */}
        {activeTab === 'questions' && (
          <div>
            {/* In-memory Search Bar (Pilar 5) */}
            <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Cari pertanyaan, opsi jawaban, atau ulasan..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-sage font-medium"
                />
                {questionSearch && (
                  <button
                    type="button"
                    onClick={() => setQuestionSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                    title="Reset Pencarian"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <span className="text-xs text-stone-500 font-medium">
                Menampilkan {filteredQuestions.length} dari {questions.length} soal
              </span>
            </div>

            {/* Questions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 min-w-[260px]">Pertanyaan & Ulasan</th>
                    <th className="py-3 px-4 min-w-[240px]">Pilihan Jawaban (A / B / C / D)</th>
                    <th className="py-3 px-4 w-28 text-center">Urutan</th>
                    <th className="py-3 px-4 w-24 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-stone-400">
                        <HelpCircle size={32} className="mx-auto mb-2 text-stone-300" />
                        <p className="font-semibold text-stone-600">Belum ada pertanyaan kuis.</p>
                        <p className="text-[11px] mt-1">Klik tombol "Tambah Pertanyaan" atau "Muat 5 Soal Default".</p>
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-stone-50/60 transition-colors">
                        {/* Auto-numbering # column (1-indexed, preserves during search per Pilar 5) */}
                        <td className="py-3 px-4 text-center font-mono text-stone-400 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-800 leading-snug">
                            {item.question}
                          </p>
                          {item.explanation && (
                            <p className="text-[11px] text-stone-500 mt-1 flex items-start gap-1">
                              <Sparkles size={11} className="text-amber-500 shrink-0 mt-0.5" />
                              <span className="italic">{item.explanation}</span>
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {item.options.map((opt, oIdx) => {
                              const isCorrect = oIdx === item.correctAnswerIndex;
                              const letters = ['A', 'B', 'C', 'D'];
                              return (
                                <div 
                                  key={oIdx}
                                  className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1.5 ${
                                    isCorrect 
                                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60' 
                                      : 'text-stone-600'
                                  }`}
                                >
                                  <span className="font-mono text-[10px] text-stone-400">{letters[oIdx]}.</span>
                                  <span>{opt}</span>
                                  {isCorrect && <CheckCircle2 size={11} className="text-emerald-600 shrink-0 ml-auto" />}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-medium text-stone-600">
                          {item.order || idx + 1}
                        </td>
                        {/* Table Action Buttons: Icon-only per Pilar 5.7 */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                              title="Ubah Soal"
                              aria-label="Ubah Soal"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ type: 'question', id: item.id, name: item.question })}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Soal"
                              aria-label="Hapus Soal"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Papan Skor & Leaderboard Tamu */}
        {activeTab === 'scores' && (
          <div>
            {/* In-memory Search Bar (Pilar 5) */}
            <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Search size={15} />
                </div>
                <input
                  type="text"
                  value={scoreSearch}
                  onChange={(e) => setScoreSearch(e.target.value)}
                  placeholder="Cari nama tamu atau gelar predikat..."
                  className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-sage font-medium"
                />
                {scoreSearch && (
                  <button
                    type="button"
                    onClick={() => setScoreSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                    title="Reset Pencarian"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <span className="text-xs text-stone-500 font-medium">
                Menampilkan {filteredScores.length} dari {scores.length} pemain
              </span>
            </div>

            {/* Scores Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4 min-w-[180px]">Nama Tamu</th>
                    <th className="py-3 px-4 w-28 text-center">Skor</th>
                    <th className="py-3 px-4 w-28 text-center">Persentase</th>
                    <th className="py-3 px-4 min-w-[200px]">Gelar Predikat</th>
                    <th className="py-3 px-4 w-36 text-center">Waktu Bermain</th>
                    <th className="py-3 px-4 w-20 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {filteredScores.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        <Trophy size={32} className="mx-auto mb-2 text-stone-300" />
                        <p className="font-semibold text-stone-600">Belum ada skor tamu yang tercatat.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredScores.map((item, idx) => {
                      let medal = <span className="font-mono text-stone-400">#{idx + 1}</span>;
                      if (idx === 0) medal = <span className="text-base">🥇</span>;
                      if (idx === 1) medal = <span className="text-base">🥈</span>;
                      if (idx === 2) medal = <span className="text-base">🥉</span>;

                      let dateStr = '-';
                      if (item.createdAt) {
                        if ('toDate' in item.createdAt && typeof item.createdAt.toDate === 'function') {
                          dateStr = item.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                        } else if (item.createdAt instanceof Date) {
                          dateStr = item.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                        }
                      }

                      return (
                        <tr key={item.id || idx} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 px-4 text-center font-semibold">
                            {medal}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-stone-800">
                              {item.guestName}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-stone-700">
                            {item.score} / {item.totalQuestions}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                              item.percentage === 100 
                                ? 'bg-purple-100 text-purple-800' 
                                : item.percentage >= 80 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-stone-100 text-stone-700'
                            }`}>
                              {item.percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-stone-700">
                              {item.title}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-stone-500 text-[11px]">
                            {dateStr}
                          </td>
                          {/* Action Icon-only per Pilar 5.7 */}
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ type: 'score', id: item.id, name: `skor ${item.guestName}` })}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Skor"
                              aria-label="Hapus Skor"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* SweetAlert-style Add / Edit Modal (Pilar 5) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/60">
              <h3 className="font-heading font-bold text-base text-stone-800 flex items-center gap-2">
                <HelpCircle size={18} className="text-sage" />
                {editingQuestionId ? 'Ubah Pertanyaan Trivia' : 'Tambah Pertanyaan Trivia'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Question Text with Icon Group & Placeholder (Pilar 5.5) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Teks Pertanyaan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none text-stone-400">
                    <HelpCircle size={16} />
                  </div>
                  <textarea
                    required
                    value={formQuestion}
                    onChange={(e) => setFormQuestion(e.target.value)}
                    placeholder="Contoh: Di mana Cecep & Ipeh pertama kali bertemu?"
                    rows={2}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-sage focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* 4 Options & Correct Answer Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  4 Pilihan Jawaban & Kunci Benar <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2.5">
                  {(['A', 'B', 'C', 'D'] as const).map((letter, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormCorrectIdx(idx)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all cursor-pointer ${
                          formCorrectIdx === idx
                            ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title={formCorrectIdx === idx ? 'Kunci Jawaban Benar' : 'Jadikan Jawaban Benar'}
                      >
                        {formCorrectIdx === idx ? <Check size={14} /> : letter}
                      </button>
                      <input
                        type="text"
                        required
                        value={formOptions[idx]}
                        onChange={(e) => {
                          const newOpts = [...formOptions] as [string, string, string, string];
                          newOpts[idx] = e.target.value;
                          setFormOptions(newOpts);
                        }}
                        placeholder={`Jawaban ${letter}...`}
                        className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-sage focus:bg-white"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Klik tombol huruf di sisi kiri untuk menandai pilihan mana yang merupakan kunci jawaban yang benar (berwarna hijau).
                </p>
              </div>

              {/* Explanation Textarea with Icon Group */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Ulasan / Fakta Menarik (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none text-stone-400">
                    <Sparkles size={16} />
                  </div>
                  <textarea
                    value={formExplanation}
                    onChange={(e) => setFormExplanation(e.target.value)}
                    placeholder="Contoh: Pertemuan pertama mereka terjadi di acara kebudayaan Setu Babakan tahun 2021!"
                    rows={2}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-sage focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Order input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Nomor Urutan Soal
                </label>
                <div className="relative max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <ListOrdered size={16} />
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-sage focus:bg-white"
                  />
                </div>
              </div>

              {/* Form Buttons (Icon + Text per Pilar 5.7) */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <X size={15} /> Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Check size={15} /> {editingQuestionId ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SweetAlert-style Delete Confirmation Modal (Pilar 5.2) */}
      {deleteTarget && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle size={28} />
            </div>

            <h3 className="font-heading font-bold text-base text-stone-800 mb-1">
              Konfirmasi Penghapusan
            </h3>

            <p className="text-xs text-stone-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus {deleteTarget.name ? `"${deleteTarget.name}"` : 'item ini'}? Tindakan ini tidak dapat dibatalkan.
            </p>

            {/* Modal Buttons: Icon + Text per Pilar 5.2 & 5.7 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X size={15} /> Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Trash2 size={15} /> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
