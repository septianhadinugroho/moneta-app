'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

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
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-md z-10"
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
      )}
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F3D34]"></div>
      </div>
    );
  }

  const isGoogleUser = Boolean(user?.avatar || user?.googleId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 sm:pb-8">
      {/* HEADER UTAMA SHARED */}
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* User Top Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full border border-slate-200 object-cover" />
            ) : (
              <div className="w-12 h-12 bg-[#0F3D34] text-white rounded-full flex items-center justify-center font-bold text-base">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-900">{user?.name}</h1>
                {isGoogleUser && (
                  <span className="px-2 py-0.5 bg-[#E6F7EF] text-[#0F3D34] text-[10px] font-extrabold rounded-full border border-emerald-200">
                    Google
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Update Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Pengaturan Profil</h2>
          
          {profileMsg && (
            <div className="p-3 bg-[#E6F7EF] border border-emerald-200 text-[#0F3D34] text-xs rounded-xl font-medium">
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
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:bg-white transition"
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
                    : 'bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:bg-white'
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
              className="px-4 py-2.5 bg-[#0F3D34] hover:bg-[#16A085] text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center"
            >
              {actionLoading && <Spinner />}
              Simpan Profil
            </button>
          </form>
        </div>

        {/* Change Password / Google Auth Info */}
        {!isGoogleUser ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Ubah Kata Sandi</h2>
            {passwordMsg && (
              <div className="p-3 bg-[#E6F7EF] border border-emerald-200 text-[#0F3D34] text-xs rounded-xl font-medium">
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
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:bg-white transition"
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
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:bg-white transition"
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
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085] focus:bg-white transition"
                    placeholder="••••••••"
                  />
                  <EyeIcon show={showConfirmNewPass} toggle={() => setShowConfirmNewPass(!showConfirmNewPass)} />
                </div>
              </div>
              <button
                type="submit"
                disabled={actionLoading}
                className="px-4 py-2.5 bg-[#0F3D34] hover:bg-[#16A085] text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center"
              >
                {actionLoading && <Spinner />}
                Perbarui Kata Sandi
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Keamanan</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Akun kamu diautentikasi melalui Google Sign-In (Tanpa Password).
              </p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl">
              OAuth Aktif
            </span>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Hapus Akun</h3>
            <p className="text-xs text-slate-500 mt-0.5">Hapus akun dan seluruh data finansial secara permanen.</p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition border border-rose-200"
          >
            Hapus Akun
          </button>
        </div>
      </main>

      {/* CUSTOM CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Apakah kamu yakin?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tindakan ini tidak dapat dibatalkan. Seluruh data pribadi, dompet, dan transaksi kamu akan dihapus permanen.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center disabled:opacity-50"
              >
                {actionLoading && <Spinner />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VERIFIKASI EMAIL BARU */}
      {showEmailOtpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 shadow-xl">
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Verifikasi Email Baru</h3>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan 6 digit kode OTP yang dikirim ke <span className="font-semibold text-slate-800">{pendingEmail}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyNewEmail} className="space-y-4">
              <input
                type="text"
                required
                maxLength={6}
                value={emailOtpCode}
                onChange={(e) => setEmailOtpCode(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl tracking-[0.4em] font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085]"
                placeholder="000000"
              />
              <div className="flex space-x-3 pt-2">
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
                  className="flex-1 py-2.5 bg-[#0F3D34] text-white text-xs font-bold rounded-xl hover:bg-[#16A085] transition disabled:opacity-50"
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