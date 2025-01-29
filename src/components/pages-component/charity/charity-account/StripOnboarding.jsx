'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const StripeOnboarding = () => {
  const { data: session } = useSession() || {};
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleOnboard = async () => {
  setLoading(true);
  setError('');

  // Debugging: Log the session token
  console.log('Session token:', session?.token);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/charity/stripe/onboard`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    setOnboardingUrl(response.data.onboardingUrl);
  } catch (err) {
    setError('Failed to create Stripe account. Please try again.');
    console.error('Error onboarding charity:', err);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="stripe-onboarding-container">
      <button
        className="stripe-onboard-btn"
        onClick={handleOnboard}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Start Stripe Onboarding'}
      </button>

      {error && <p className="error-message">{error}</p>}

      {onboardingUrl && (
        <div className="onboarding-link">
          <a
            href={onboardingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="stripe-link"
          >
            Complete your Stripe setup
          </a>
        </div>
      )}
    </div>
  );
};

export default StripeOnboarding;
