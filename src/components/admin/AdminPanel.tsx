import React, { useState, useEffect } from 'react';
import { 
  Settings, Link as LinkIcon, Users, MessageSquare, Save, Plus, Trash2, 
  Copy, Check, X, Lock, Music, Heart, Calendar, Image as ImageIcon, CreditCard, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { WeddingConfig, LoveStoryItem } from '../../types';

export function AdminPanel() {
  const { weddingConfig, updateWeddingConfig } = useWeddingConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'generator' | 'rsvps' | 'wishes'>('generator');

  // Form state for config
  const [formData, setFormData] = useState<WeddingConfig>(weddingConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Link generator state
  const [guestName, setGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Firestore live data state
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [wishes, setWishes] = useState<any[]>([]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isAdminParam = searchParams.has('admin') || window.location.pathname.endsWith('/admin');
    if (isAdminParam) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (weddingConfig) {
      setFormData(weddingConfig);
    }
  }, [weddingConfig]);

  // Sync RSVPs from Firestore
  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRsvps(docs);
    });
    return () => unsubscribe();
  }, [isOpen]);

  // Sync Wishes from Firestore
  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWishes(docs);
    });
    return () => unsubscribe();
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim().toLowerCase();
    if (cleanInput === 'password' || cleanInput === 'admin123' || cleanInput === 'admin') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWeddingConfig(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save config:', err);
      alert('Gagal menyimpan perubahan ke Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (confirm('Hapus ucapan ini?')) {
      await deleteDoc(doc(db, 'wishes', id));
    }
  };

  const handleDeleteRsvp = async (id: string) => {
    if (confirm('Hapus data RSVP ini?')) {
      await deleteDoc(doc(db, 'rsvps', id));
    }
  };

  // Generated URL & WA Message
  const currentUrl = window.location.origin + window.location.pathname;
  const generatedLink = guestName ? `${currentUrl}?to=${encodeURIComponent(guestName)}` : currentUrl;
  const waMessage = `Assalamu'alaikum Wr. Wb.

Kepada Yth. Bapak/Ibu/Saudara/i ${guestName || 'Tamu Undangan'},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${formData.groom.nickname} & ${formData.bride.nickname}*

Berikut link undangan digital kami untuk informasi lebih lengkap:
${generatedLink}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih,
Wassalamu'alaikum Wr. Wb.`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyWaMessage = async () => {
    await navigator.clipboard.writeText(waMessage);
    setCopiedWaText(true);
    setTimeout(() => setCopiedWaText(false), 2000);
  };

  const shareToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
  };

  // Calculations for RSVPs
  const totalAttending = rsvps
    .filter(r => r.attendance === 'hadir')
    .reduce((acc, r) => acc + (Number(r.guestCount) || 1), 0);
  const totalNotAttending = rsvps.filter(r => r.attendance !== 'hadir').length;

  return (
    <>
      {/* Admin Panel Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 relative"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-warm-white">
                <div className="flex items-center gap-2.5">
                  <div className="bg-sage/10 text-sage-dark p-2 rounded-xl">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg text-text-dark font-medium">Admin Panel & Kelola Database</h2>
                    <p className="text-[11px] text-gray-500">Ubah data undangan, buat link nama tamu & pantau ucapan/RSVP real-time</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              {!isAuthenticated ? (
                <div className="p-8 flex flex-col items-center justify-center my-auto text-center">
                  <div className="w-14 h-14 bg-sage/10 text-sage-dark rounded-full flex items-center justify-center mb-4">
                    <Lock size={26} />
                  </div>
                  <h3 className="font-heading text-xl text-text-dark mb-2">Masukan Passcode Admin</h3>
                  <p className="text-xs text-gray-500 mb-6 max-w-xs">
                    Masukan passcode untuk mengakses pengaturan website dan database undangan. <br />
                    <span className="font-semibold text-sage-dark">Passcode bawaan: password</span>
                  </p>
                  <form onSubmit={handleLogin} className="w-full max-w-xs flex flex-col gap-3">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Passcode..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-center focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                    {passwordError && (
                      <span className="text-xs text-red-500 font-medium">Passcode salah, coba 'password'</span>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-sage-dark text-white py-3 rounded-xl text-sm font-medium hover:bg-sage transition-colors cursor-pointer"
                    >
                      Masuk
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col flex-1 overflow-hidden">
                  {/* Tabs Bar */}
                  <div className="flex border-b border-gray-100 px-4 bg-gray-50/50 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setActiveTab('generator')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'generator'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <LinkIcon size={15} />
                      Link Tamu Undangan
                    </button>
                    <button
                      onClick={() => setActiveTab('config')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'config'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Settings size={15} />
                      Edit Data Website
                    </button>
                    <button
                      onClick={() => setActiveTab('rsvps')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'rsvps'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Users size={15} />
                      RSVP ({rsvps.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('wishes')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'wishes'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <MessageSquare size={15} />
                      Ucapan ({wishes.length})
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {/* TAB 1: LINK GENERATOR */}
                    {activeTab === 'generator' && (
                      <div className="flex flex-col gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-text-dark mb-1">Nama Tamu Undangan</label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Contoh: Bapak Budi & Keluarga"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-text-dark mb-1">Generated Link Undangan</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={generatedLink}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 overflow-hidden text-ellipsis"
                            />
                            <button
                              onClick={copyLink}
                              className="bg-sage text-white px-4 py-2.5 rounded-xl hover:bg-sage-dark transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0 cursor-pointer"
                            >
                              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                              {copiedLink ? 'Tersalin' : 'Salin URL'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-text-dark">Template Pesan WhatsApp</label>
                            <div className="flex gap-2">
                              <button
                                onClick={copyWaMessage}
                                className="text-xs text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                {copiedWaText ? <Check size={13} /> : <Copy size={13} />}
                                {copiedWaText ? 'Teks Tersalin' : 'Salin Teks WA'}
                              </button>
                            </div>
                          </div>
                          <textarea
                            readOnly
                            rows={7}
                            value={waMessage}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700 font-mono resize-none"
                          />
                        </div>

                        <button
                          onClick={shareToWhatsapp}
                          className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                        >
                          <Share2 size={16} />
                          Kirim / Bagikan via WhatsApp
                        </button>
                      </div>
                    )}

                    {/* TAB 2: EDIT WEBSITE CONFIG */}
                    {activeTab === 'config' && (
                      <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">
                        {/* Groom Info */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                          <h3 className="font-heading text-sm font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <Heart size={16} className="text-betawi-red" /> Mempelai Pria (Groom)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Panggilan</label>
                              <input
                                type="text"
                                value={formData.groom.nickname}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, nickname: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Lengkap</label>
                              <input
                                type="text"
                                value={formData.groom.fullName}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, fullName: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-gray-600 mb-1">Nama Orang Tua</label>
                              <input
                                type="text"
                                value={formData.groom.parents}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, parents: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Instagram</label>
                              <input
                                type="text"
                                value={formData.groom.instagram}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, instagram: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">URL Foto</label>
                              <input
                                type="text"
                                value={formData.groom.image}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, image: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Bride Info */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                          <h3 className="font-heading text-sm font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <Heart size={16} className="text-pink-500" /> Mempelai Wanita (Bride)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Panggilan</label>
                              <input
                                type="text"
                                value={formData.bride.nickname}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, nickname: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Lengkap</label>
                              <input
                                type="text"
                                value={formData.bride.fullName}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, fullName: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-gray-600 mb-1">Nama Orang Tua</label>
                              <input
                                type="text"
                                value={formData.bride.parents}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, parents: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Instagram</label>
                              <input
                                type="text"
                                value={formData.bride.instagram}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, instagram: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">URL Foto</label>
                              <input
                                type="text"
                                value={formData.bride.image}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, image: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Date & Events */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                          <h3 className="font-heading text-sm font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <Calendar size={16} className="text-sage-dark" /> Tanggal & Acara
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                            <div>
                              <label className="block text-gray-600 mb-1">Format Tanggal (Tampil)</label>
                              <input
                                type="text"
                                value={formData.dateStr}
                                onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Tanggal Countdown ISO</label>
                              <input
                                type="text"
                                value={formData.dateISO}
                                onChange={(e) => setFormData({ ...formData, dateISO: e.target.value })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                          </div>

                          {/* Akad */}
                          <div className="p-3 bg-white border rounded-xl mb-3">
                            <h4 className="font-semibold text-xs text-sage-dark mb-2">Akad Nikah</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder="Hari, Tanggal"
                                value={formData.events.akad.date}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, date: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Jam"
                                value={formData.events.akad.time}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, time: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Nama Tempat"
                                value={formData.events.akad.venue}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, venue: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Alamat"
                                value={formData.events.akad.address}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, address: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                            </div>
                          </div>

                          {/* Resepsi */}
                          <div className="p-3 bg-white border rounded-xl">
                            <h4 className="font-semibold text-xs text-sage-dark mb-2">Resepsi</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder="Hari, Tanggal"
                                value={formData.events.resepsi.date}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, date: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Jam"
                                value={formData.events.resepsi.time}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, time: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Nama Tempat"
                                value={formData.events.resepsi.venue}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, venue: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Alamat / Google Maps URL"
                                value={formData.events.resepsi.mapUrl}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, mapUrl: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Music & Bank */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <h3 className="font-heading font-semibold text-text-dark mb-2 flex items-center gap-1.5">
                              <Music size={15} className="text-sage-dark" /> Lagu Latar (YouTube URL)
                            </h3>
                            <input
                              type="text"
                              value={formData.musicUrl}
                              onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })}
                              className="w-full border rounded-lg p-2 bg-white"
                            />
                          </div>

                          <div>
                            <h3 className="font-heading font-semibold text-text-dark mb-2 flex items-center gap-1.5">
                              <CreditCard size={15} className="text-gold" /> Bank Gift
                            </h3>
                            <div className="flex flex-col gap-1.5">
                              <input
                                type="text"
                                placeholder="Nama Bank"
                                value={formData.bank.name}
                                onChange={(e) => setFormData({ ...formData, bank: { ...formData.bank, name: e.target.value } })}
                                className="w-full border rounded-lg p-1.5 bg-white"
                              />
                              <input
                                type="text"
                                placeholder="No Rekening"
                                value={formData.bank.account}
                                onChange={(e) => setFormData({ ...formData, bank: { ...formData.bank, account: e.target.value } })}
                                className="w-full border rounded-lg p-1.5 bg-white"
                              />
                              <input
                                type="text"
                                placeholder="Atas Nama"
                                value={formData.bank.holder}
                                onChange={(e) => setFormData({ ...formData, bank: { ...formData.bank, holder: e.target.value } })}
                                className="w-full border rounded-lg p-1.5 bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Gallery URLs */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 text-xs">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                              <ImageIcon size={15} className="text-sage-dark" /> Galeri Foto ({formData.gallery.length})
                            </h3>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ''] })}
                              className="text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={14} /> Tambah Foto
                            </button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {formData.gallery.map((url, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={url}
                                  onChange={(e) => {
                                    const newArr = [...formData.gallery];
                                    newArr[idx] = e.target.value;
                                    setFormData({ ...formData, gallery: newArr });
                                  }}
                                  placeholder="https://..."
                                  className="w-full border rounded-lg p-1.5 bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== idx) })}
                                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="sticky bottom-0 bg-white p-3 border-t flex items-center justify-between gap-4">
                          {saveSuccess && (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              <Check size={14} /> Berhasil disimpan ke Firestore!
                            </span>
                          )}
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="ml-auto bg-sage-dark text-white px-6 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-sage transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                          >
                            <Save size={16} />
                            {isSaving ? 'Menyimpan...' : 'Simpan ke Firestore'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* TAB 3: RSVP DATA */}
                    {activeTab === 'rsvps' && (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                            <span className="block text-2xl font-bold text-emerald-700">{totalAttending}</span>
                            <span className="text-[10px] text-emerald-800 uppercase font-medium">Total Tamu Hadir</span>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                            <span className="block text-2xl font-bold text-red-700">{totalNotAttending}</span>
                            <span className="text-[10px] text-red-800 uppercase font-medium">Tidak Hadir</span>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 col-span-2 sm:col-span-1">
                            <span className="block text-2xl font-bold text-blue-700">{rsvps.length}</span>
                            <span className="text-[10px] text-blue-800 uppercase font-medium">Total Respon</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          {rsvps.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-8">Belum ada respon RSVP masuk.</p>
                          ) : (
                            rsvps.map((rsvp) => (
                              <div key={rsvp.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-start justify-between gap-3 text-xs">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-text-dark text-sm">{rsvp.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                      rsvp.attendance === 'hadir' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {rsvp.attendance === 'hadir' ? `Hadir (${rsvp.guestCount} org)` : 'Tidak Hadir'}
                                    </span>
                                  </div>
                                  {rsvp.notes && (
                                    <p className="text-gray-600 text-xs italic">"{rsvp.notes}"</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeleteRsvp(rsvp.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: WISHES DATA */}
                    {activeTab === 'wishes' && (
                      <div className="flex flex-col gap-3">
                        {wishes.length === 0 ? (
                          <p className="text-xs text-gray-500 text-center py-8">Belum ada ucapan masuk.</p>
                        ) : (
                          wishes.map((w) => (
                            <div key={w.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-start justify-between gap-3 text-xs">
                              <div className="flex-1">
                                <span className="font-semibold text-sage-dark block mb-1">{w.name}</span>
                                <p className="text-gray-700 italic">"{w.text}"</p>
                              </div>
                              <button
                                onClick={() => handleDeleteWish(w.id)}
                                className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                title="Hapus ucapan"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
