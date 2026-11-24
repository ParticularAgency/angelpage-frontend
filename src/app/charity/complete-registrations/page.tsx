'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Button, Input } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { getAccountPathForRole } from '@/utils/navigationPaths';
import StripOnboarding from '@/components/pages-component/charity/charity-account/StripOnboarding';

/**
 * Post-register charity onboarding: finish profile details + Stripe Connect.
 */
const CharityRegistrationPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [charityName, setCharityName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
      return;
    }
    if (status !== 'authenticated' || !session?.token) return;

    const role = session.user?.role;
    if (role !== 'CHARITY' && role !== 'CHARITY_STAFF') {
      router.replace(getAccountPathForRole(role, session.user?.id));
      return;
    }

    const loadProfile = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/charity/profile`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        const charity = data?.user || data?.charity || data;
        setCharityName(charity?.charityName || '');
        setDescription(charity?.description || '');
        setWebsiteLink(charity?.websiteLink || '');
        setPhoneNumber(charity?.phoneNumber || '');
      } catch (err) {
        console.error(err);
        ToastService.error('Could not load charity profile.');
      } finally {
        setLoaded(true);
      }
    };

    loadProfile();
  }, [status, session, router]);

  const accountPath = getAccountPathForRole(
    session?.user?.role,
    session?.user?.id,
    session?.user?.charityId
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.token) return;
    setIsSaving(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/profile`,
        {
          charityName: charityName.trim(),
          description: description.trim(),
          websiteLink: websiteLink.trim(),
          phoneNumber: phoneNumber.trim(),
        },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      ToastService.success('Charity profile saved.');
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Failed to save profile.';
      ToastService.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || !loaded) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center text-mono-80">
        Loading your charity setup…
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 sm:p-8 my-10 border border-[#611192]/15 rounded-2xl bg-white">
      <h2 className="text-2xl font-semibold mb-2 text-[#611192]">
        Complete your charity registration
      </h2>
      <p className="text-sm text-mono-80 mb-6">
        Add a few public details, then connect Stripe so you can receive payouts
        from sales.
      </p>

      <form onSubmit={handleSave} className="space-y-4 mb-8">
        <div>
          <label htmlFor="charityName" className="block text-sm mb-1">
            Charity name
          </label>
          <Input
            id="charityName"
            value={charityName}
            onChange={e => setCharityName(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm mb-1">
            Short description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="websiteLink" className="block text-sm mb-1">
            Website
          </label>
          <Input
            id="websiteLink"
            type="text"
            value={websiteLink}
            onChange={e => setWebsiteLink(e.target.value)}
            className="w-full"
            placeholder="https://"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm mb-1">
            Phone
          </label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save profile'}
        </Button>
      </form>

      <div className="border-t pt-6 mb-6">
        <h3 className="font-semibold mb-3">Connect Stripe for payouts</h3>
        <StripOnboarding />
      </div>

      <Link
        href={`${accountPath}?tab=account`}
        className="text-sm text-[#611192] underline"
      >
        Continue to charity account dashboard
      </Link>
    </div>
  );
};

export default CharityRegistrationPage;
