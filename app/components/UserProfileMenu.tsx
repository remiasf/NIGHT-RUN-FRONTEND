'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LogOut, Settings, User, UserCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import { auth } from '../../lib/firebase';

export default function UserProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setInitial(user.email[0].toUpperCase());
      } else if (user?.displayName) {
        setInitial(user.displayName[0].toUpperCase());
      } else {
        setInitial(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      Cookies.remove('firebase_token');
      router.refresh();
    } catch (error) {
      console.error('Log out error:', error);
    } finally {
      setOpen(false);
    }
  };

  const itemClassName =
    'flex w-full items-center gap-3.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-300 transition duration-150 hover:bg-red-950/50 hover:text-red-300';

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="User menu"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-red-900/60 bg-zinc-900 text-sm font-bold uppercase text-red-400 shadow-[0_0_12px_rgba(220,38,38,0.25)] transition duration-200 hover:border-red-600 hover:bg-zinc-800 hover:text-red-300 hover:shadow-[0_0_16px_rgba(220,38,38,0.4)]"
      >
        {initial ?? <User className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 p-1 shadow-xl shadow-black/50 backdrop-blur-xl"
        >
          <Link
            role="menuitem"
            href="/profile"
            onClick={() => setOpen(false)}
            className={itemClassName}
          >
            <UserCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Profile
          </Link>
          <Link
            role="menuitem"
            href="/settings"
            onClick={() => setOpen(false)}
            className={itemClassName}
          >
            <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
            Settings
          </Link>
          <div className="my-1 border-t border-zinc-800" />
          <button
            type="button"
            role="menuitem"
            onClick={handleLogOut}
            className={itemClassName}
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
