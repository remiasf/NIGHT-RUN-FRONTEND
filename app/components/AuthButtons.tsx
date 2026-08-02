'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import axiosInstance from '../../lib/axios';
import { Button } from '@/components/ui/button';
import Cookies from 'js-cookie';

export default function AuthButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);

        const token = await result.user.getIdToken();

        const response = await axiosInstance.post(
        '/users/sync', 
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Cookies.set('firebase_token', token, { expires: 7, sameSite: 'lax' });
      router.refresh();

    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      
      <Button 
        onClick={handleGoogleAuth} 
        disabled={isLoading}
        className="bg-red-700 hover:bg-red-600 text-white transition-colors"
      >
        {isLoading ? 'Loading...' : 'Sign in with Google'}
      </Button>
    </div>
  );
}