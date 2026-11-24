'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { setApiAuthToken } from '@/store/api/angelpageApi';
import { setApiClientToken } from '@/lib/apiClient';

export function useSyncApiAuth() {
  const { data: session } = useSession();

  useEffect(() => {
    setApiAuthToken(session?.token);
    setApiClientToken(session?.token || null);
  }, [session?.token]);
}
