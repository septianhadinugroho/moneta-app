'use client';

export default function ProfileSection({
  name,
  setName,
  email,
  setEmail,
  isGoogleUser,
  profileMsg,
  actionLoading,
  handleUpdateProfile,
}: any) {
  return (
    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
        <div className="w-10 h-10 rounded-xl bg-[#E6F7EF] text-[#0F3D34] flex items-center justify-center font-bold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Pengaturan Profil</h2>
          <p className="text-xs text-slate-500">Kelola informasi akun Moneta kamu.</p>
        </div>
      </div>

      {profileMsg && (
        <div className="p-3 bg-[#E6F7EF] border border-emerald-200 text-[#0F3D34] text-xs rounded-xl font-medium">
          {profileMsg}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            disabled={isGoogleUser}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3.5 py-2.5 border rounded-xl text-xs font-medium transition ${
              isGoogleUser
                ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                : 'bg-slate-50 text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#16A085]'
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
          className="w-full py-2.5 bg-[#0F3D34] hover:bg-[#16A085] text-white font-bold text-xs rounded-xl transition shadow-sm disabled:opacity-50"
        >
          {actionLoading ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>
    </div>
  );
}