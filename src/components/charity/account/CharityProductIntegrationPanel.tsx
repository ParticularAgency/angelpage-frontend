'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { CHARITY_SHARE_PERCENT } from '@/constants/brand';

type IntegrationState = {
  productSource: string;
  storeUrl: string;
  shopifyDomain: string;
  autoSync: boolean;
  hasApiKey: boolean;
  hasApiSecret: boolean;
  lastSyncAt: string | null;
  lastSyncStatus: string;
  lastSyncError: string;
  lastImportedCount: number;
  lastUpdatedCount: number;
  totalSyncedProducts: number;
};

type Detection = {
  platform: string;
  storeUrl: string;
  message: string;
  canUsePublicApi: boolean;
  canScrape: boolean;
  requiredFields: string[];
};

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manual listing only',
  shopify: 'Shopify',
  woocommerce: 'WooCommerce',
  wordpress: 'WordPress',
  scrape: 'Website scrape',
  api_key: 'API key',
};

const CharityProductIntegrationPanel = () => {
  const { data: session } = useSession() || {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [integration, setIntegration] = useState<IntegrationState | null>(null);
  const [storeUrl, setStoreUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [productSource, setProductSource] = useState('manual');
  const [detection, setDetection] = useState<Detection | null>(null);

  const authHeaders = session?.token
    ? { Authorization: `Bearer ${session.token}` }
    : undefined;

  const loadIntegration = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/integration`,
        { headers: authHeaders }
      );
      const data = res.data.integration as IntegrationState;
      setIntegration(data);
      setStoreUrl(data.storeUrl || '');
      setProductSource(data.productSource || 'manual');
    } catch {
      ToastService.error('Could not load product sync settings.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    loadIntegration();
  }, [loadIntegration]);

  const handleDetect = async () => {
    if (!storeUrl.trim()) {
      ToastService.error('Enter your charity shop or website URL first.');
      return;
    }
    setDetecting(true);
    setDetection(null);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/integration/detect`,
        { storeUrl: storeUrl.trim() },
        { headers: authHeaders }
      );
      const d = res.data.detection as Detection;
      setDetection(d);
      setStoreUrl(d.storeUrl);
      setProductSource(d.platform === 'unknown' ? 'scrape' : d.platform);
      ToastService.success(d.message);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : 'Could not detect store platform.';
      ToastService.error(msg);
    } finally {
      setDetecting(false);
    }
  };

  const saveSettings = async (syncNow = false) => {
    if (!session?.token) return;
    setSaving(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/integration`,
        {
          productSource,
          storeUrl: storeUrl.trim(),
          apiKey: apiKey || undefined,
          apiSecret: apiSecret || undefined,
          autoSync: true,
          syncNow,
        },
        { headers: authHeaders }
      );
      setIntegration(res.data.integration);
      setApiKey('');
      setApiSecret('');
      if (res.data.syncResult) {
        ToastService.success(res.data.syncResult.message);
      } else {
        ToastService.success(res.data.message || 'Settings saved.');
      }
      await loadIntegration();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : 'Failed to save settings.';
      ToastService.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      await saveSettings(false);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/integration/test`,
        {},
        { headers: authHeaders }
      );
      ToastService.success(
        `Connection OK — found ${res.data.sampleCount ?? 0} product(s) in sample.`
      );
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : 'Connection test failed.';
      ToastService.error(msg);
    } finally {
      setTesting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await saveSettings(false);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/integration/sync`,
        {},
        { headers: authHeaders }
      );
      ToastService.success(res.data.message || 'Products synced.');
      await loadIntegration();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : 'Sync failed.';
      ToastService.error(msg);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <p className="body-small text-mono-70">Loading product sync…</p>;
  }

  const showApiKey =
    productSource === 'shopify' ||
    productSource === 'api_key' ||
    productSource === 'woocommerce' ||
    productSource === 'wordpress' ||
    detection?.requiredFields?.includes('apiKey');
  const showApiSecret =
    productSource === 'woocommerce' ||
    productSource === 'wordpress' ||
    detection?.requiredFields?.includes('apiSecret');

  return (
    <div className="charity-product-integration space-y-6 max-w-3xl">
      <div>
        <h3 className="body-bold-large text-mono-100">Product sync & API</h3>
        <p className="caption text-mono-70 mt-2">
          Connect your charity shop (Shopify, WooCommerce, or website). Products
          import automatically and appear on your Angelpage storefront. All sales
          checkout on Angelpage with a {CHARITY_SHARE_PERCENT}/10 revenue split —
          you fulfil orders when notified.
        </p>
      </div>

      <div className="rounded-xl border border-mono-40 bg-mono-0 p-6 space-y-5">
        <div>
          <label className="forms block mb-2" htmlFor="store-url">
            Charity shop / website URL
          </label>
          <div className="flex flex-wrap gap-3">
            <input
              id="store-url"
              type="url"
              className="input flex-1 min-w-[220px]"
              placeholder="https://your-charity-shop.com"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
            />
            <Button
              variant="secondary"
              type="button"
              onClick={handleDetect}
              disabled={detecting}
            >
              {detecting ? 'Detecting…' : 'Detect platform'}
            </Button>
          </div>
          {detection && (
            <p className="caption text-primary-color-100 mt-2">{detection.message}</p>
          )}
        </div>

        <div>
          <label className="forms block mb-2" htmlFor="product-source">
            Connection method
          </label>
          <select
            id="product-source"
            className="select w-full max-w-md"
            value={productSource}
            onChange={(e) => setProductSource(e.target.value)}
          >
            <option value="manual">Manual listing only</option>
            <option value="api_key">API key (Shopify / WooCommerce)</option>
            <option value="shopify">Shopify (auto / public catalog)</option>
            <option value="woocommerce">WooCommerce</option>
            <option value="scrape">Website scrape</option>
          </select>
          <p className="caption text-mono-70 mt-1">
            Current: {SOURCE_LABELS[productSource] || productSource}
          </p>
        </div>

        {showApiKey && (
          <div>
            <label className="forms block mb-2" htmlFor="api-key">
              API access token / consumer key
              {integration?.hasApiKey ? ' (saved — enter to replace)' : ''}
            </label>
            <input
              id="api-key"
              type="password"
              className="input w-full"
              placeholder="shpat_… or ck_…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        {showApiSecret && (
          <div>
            <label className="forms block mb-2" htmlFor="api-secret">
              API secret / consumer secret
              {integration?.hasApiSecret ? ' (saved — enter to replace)' : ''}
            </label>
            <input
              id="api-secret"
              type="password"
              className="input w-full"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="primary"
            type="button"
            onClick={() => saveSettings(true)}
            disabled={saving || productSource === 'manual'}
          >
            {saving ? 'Saving…' : 'Save & sync now'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleTest}
            disabled={testing || productSource === 'manual'}
          >
            {testing ? 'Testing…' : 'Test connection'}
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={handleSync}
            disabled={syncing || productSource === 'manual'}
          >
            {syncing ? 'Syncing…' : 'Sync products'}
          </Button>
        </div>
      </div>

      {integration && integration.lastSyncStatus !== 'idle' && (
        <div className="rounded-xl border border-mono-40 bg-[#FCF2FF]/40 p-5 space-y-2">
          <p className="body-small font-medium text-mono-100">Last sync</p>
          <p className="caption text-mono-70">
            Status:{' '}
            <span
              className={
                integration.lastSyncStatus === 'success'
                  ? 'text-green-700'
                  : integration.lastSyncStatus === 'failed'
                    ? 'text-error'
                    : ''
              }
            >
              {integration.lastSyncStatus}
            </span>
            {integration.lastSyncAt &&
              ` · ${new Date(integration.lastSyncAt).toLocaleString()}`}
          </p>
          {integration.lastSyncStatus === 'success' && (
            <p className="caption text-mono-70">
              {integration.lastImportedCount} new, {integration.lastUpdatedCount}{' '}
              updated · {integration.totalSyncedProducts} live on Angelpage
            </p>
          )}
          {integration.lastSyncError && (
            <p className="caption text-error">{integration.lastSyncError}</p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-dashed border-mono-40 p-5">
        <p className="body-small font-medium text-mono-100 mb-2">Manual fallback</p>
        <p className="caption text-mono-70 mb-3">
          No API or scraping? List products yourself — they use the same Angelpage
          checkout and charity notifications.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/product/post-product">
            <Button variant="secondary" type="button">
              Post a product
            </Button>
          </Link>
          <Link href="/product/bulk-list">
            <Button variant="secondary" type="button">
              Bulk upload spreadsheet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CharityProductIntegrationPanel;
