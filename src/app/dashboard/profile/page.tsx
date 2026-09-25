'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ConfirmModal from '@/components/ConfirmModal';
import { Eye, EyeOff, ShieldCheck, Trash2, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Visibility Toggles
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  // Profile Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // State Email OTP Modal
  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [emailOtpCode, setEmailOtpCode] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');

    if (!token) {
      router.push('/');
      return;
    }

    if (localUser) {
      const parsed = JSON.parse(localUser);
      setUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
    }

    setLoading(false);
  }, [router]);

  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const EyeIcon = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden p-1 rounded-md z-10"
    >
      {show ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </button>
  );

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setProfileMsg('');

    try {
      const res = await api.put('/auth/profile', { name, email });

      if (res.data.requiresEmailVerification) {
        setPendingEmail(res.data.pendingEmail);
        setShowEmailOtpModal(true);
        setProfileMsg('Silakan masukkan kode OTP yang dikirim ke email baru kamu.');
      } else {
        setProfileMsg(res.data.message);
        const updatedUser = { ...user, name };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err: any) {
      setProfileMsg(err.response?.data?.message || 'Pembaruan profil gagal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyNewEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await api.put('/auth/verify-new-email', {
        newEmail: pendingEmail,
        otpCode: emailOtpCode,
      });

      setShowEmailOtpModal(false);
      setProfileMsg(res.data.message);
      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      setEmailOtpCode('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Verifikasi email gagal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setPasswordMsg('');

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setPasswordMsg(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordMsg(err.response?.data?.message || 'Gagal mengubah kata sandi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setActionLoading(true);
    try {
      await api.delete('/auth/account');
      localStorage.clear();
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus akun');
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const isGoogleUser = Boolean(user?.avatar || user?.googleId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 sm:pb-8">
      {/* HEADER UTAMA SHARED */}
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
        {/* User Top Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-11 h-11 rounded-full border border-slate-200 object-cover" />
            ) : (
              <div className="w-11 h-11 bg-slate-900 text-white rounded-full flex items-center justify-center font-extrabold text-base">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-extrabold text-slate-900">{user?.name}</h1>
                {isGoogleUser && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold rounded-full border border-emerald-200/60">
                    Google
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Update Profile */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-slate-700" />
            Pengaturan Profil
          </h2>
          
          {profileMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium leading-relaxed">
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
              <input
                type="email"
                required
                disabled={isGoogleUser}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 border rounded-xl text-xs transition ${
                  isGoogleUser
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                    : 'bg-slate-50 text-slate-900 border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white'
                }`}
              />
              {isGoogleUser && (
                <p className="text-[10px] text-slate-400 mt-1">
                  Email dikelola oleh Google Sign-In dan tidak dapat diubah di sini.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center shadow-xs"
            >
              {actionLoading && <Spinner />}
              Simpan Profil
            </button>
          </form>
        </div>

        {/* Change Password / Google Auth Info */}
        {!isGoogleUser ? (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-700" />
              Ubah Kata Sandi
            </h2>
            {passwordMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium leading-relaxed">
                {passwordMsg}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    type={showCurrPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showCurrPass} toggle={() => setShowCurrPass(!showCurrPass)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showNewPass} toggle={() => setShowNewPass(!showNewPass)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showConfirmNewPass ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showConfirmNewPass} toggle={() => setShowConfirmNewPass(!showConfirmNewPass)} />
                </div>
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center shadow-xs"
              >
                {actionLoading && <Spinner />}
                Perbarui Kata Sandi
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">Keamanan</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Akun kamu diautentikasi via Google Sign-In.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-lg border border-slate-200/60">
              OAuth Active
            </span>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">Hapus Akun</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Hapus akun dan data finansial secara permanen.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition border border-rose-200/80 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      </main>

      {/* REUSABLE CONFIRMATION MODAL UNTUK HAPUS AKUN */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Apakah kamu yakin?"
        description="Tindakan ini tidak dapat dibatalkan. Seluruh data pribadi, dompet, dan transaksi kamu akan dihapus permanen."
        confirmLabel="Ya, Hapus Akun"
        variant="danger"
        loading={actionLoading}
      />

      {/* MODAL VERIFIKASI EMAIL BARU */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 shadow-xl">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">Verifikasi Email Baru</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Masukkan 6 digit kode OTP yang dikirim ke <span className="font-bold text-slate-800">{pendingEmail}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyNewEmail} className="space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={emailOtpCode}
                onChange={(e) => setEmailOtpCode(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl tracking-[0.4em] font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                placeholder="000000"
              />
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowEmailOtpModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50"
                >
                  {actionLoading ? 'Memverifikasi...' : 'Konfirmasi Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION FOR MOBILE */}
      <BottomNav />
    </div>
  );
}