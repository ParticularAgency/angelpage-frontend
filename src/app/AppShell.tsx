'use client';

import { Footer, Header } from '@/components';
import AuthProvider from '@utils/AuthProvider';
import MobileFloatingSellCta from '@/components/homepage/MobileFloatingSellCta';
import AdminBrowseBar from '@/components/admin/AdminBrowseBar';
import MarketPreferenceDialog from '@/components/market/MarketPreferenceDialog';
import { useSyncApiAuth } from '@/hooks/useSyncApiAuth';
import { usePathname } from 'next/navigation';

function AppShellContent({ children }: { children: React.ReactNode }) {
  useSyncApiAuth();
  const pathname = usePathname();
  const isReelsPage = pathname === '/reels';

  if (isReelsPage) {
    return <>{children}</>;
  }

  return (
    <div className="angelpage-main-wrapper">
      <AdminBrowseBar />
      <Header />
      <main>{children}</main>
      <MobileFloatingSellCta />
      <Footer />
      <MarketPreferenceDialog />
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShellContent>{children}</AppShellContent>
    </AuthProvider>
  );
}
