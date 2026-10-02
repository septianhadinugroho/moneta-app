'use client';

interface UserCardProps {
  user: any;
  isGoogleUser: boolean;
}

export default function UserCard({ user, isGoogleUser }: UserCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
      <div className="flex items-center space-x-3.5">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
          />
        ) : (
          <div className="w-11 h-11 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center font-extrabold text-base shadow-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
        )}
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {user?.name}
            </h1>
            {isGoogleUser && (
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                Google
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}