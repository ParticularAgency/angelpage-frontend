'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Public admin self-registration is disabled.
 * Create admins via seed / bootstrap or Super Admin → Team panel.
 */
const AdminRegisterDisabled = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-xl font-semibold">Admin registration closed</h1>
      <p className="text-mono-80 max-w-md">
        New admin accounts can only be created by an existing Super Admin from
        the Team panel, or via a secure bootstrap seed.
      </p>
      <Link href="/admin/login" className="text-[#611192] underline">
        Go to admin login
      </Link>
    </div>
  );
};

export default AdminRegisterDisabled;
