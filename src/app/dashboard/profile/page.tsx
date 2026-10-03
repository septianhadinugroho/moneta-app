'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import UserCard from '@/components/profile/UserCard';
import ProfileForm from '@/components/profile/ProfileForm';
import PasswordForm from '@/components/profile/PasswordForm';
import DangerZone from '@/components/profile/DangerZone';
import EmailOtpModal from '@/components/profile/EmailOtpModal';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showEmailOtpModal, setShowEmailOtpModal] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');

    if (!token) {
      router.push('/');
      return;
    }

    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const isGoogleUser = Boolean(user?.avatar || user?.googleId);

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 ">
      {/* 1. KARTU IDENTITAS USER */}
      <UserCard user={user} isGoogleUser={isGoogleUser} />

      {/* 2. FORM PROFIL */}
      <ProfileForm
        user={user}
        isGoogleUser={isGoogleUser}
        onProfileUpdated={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }}
        onRequestEmailOtp={(email) => {
          setPendingEmail(email);
          setShowEmailOtpModal(true);
        }}
      />

      {/* 3. FORM KATA SANDI / INFO GOOGLE */}
      <PasswordForm isGoogleUser={isGoogleUser} />

      {/* 4. DANGER ZONE */}
      <DangerZone />

      {/* 5. MODAL VERIFIKASI EMAIL */}
      <EmailOtpModal
        isOpen={showEmailOtpModal}
        onClose={() => setShowEmailOtpModal(false)}
        pendingEmail={pendingEmail}
        onSuccess={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }}
      />
    </div>
  );
}