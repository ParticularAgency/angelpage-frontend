'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { CHARITY_SHARE_PERCENT } from '@/constants/brand';

type Connection = {
  _id: string;
  label: string;
  apiUrl: string;
  provider: string;
  affiliateId?: string;
  itemsPath?: string;
  lastSyncStatus?: string;
  lastImportedCount?: number;
  hasApiKey?: boolean;
};

type AffiliateProduct = {
  _id: string;
  name: string;
  price: number;
  category?: string;
  additionalInfo?: string;
  affiliateUrl?: string;
  ebayAffiliateUrl?: string;
  checkoutMode?: string;
  images?: { url: string }[];
};

const DEFAULT_MAPPING = {
  title: 'title',
  price: 'price',
  image: 'image',
  description: 'description',
  url: 'url',
  id: 'id',
};

interface AffiliateDashboardProps {
  allowEbayImport?: boolean;
}

const AffiliateDashboard = ({ allowEbayImport = false }: AffiliateDashboardProps) => {
  const { data: session } = useSession() || {};
  const [connections, setConnections] = useState<Connection[]>([]);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    label: 'My affiliate API',
    apiUrl: '',
    apiKey: '',
    affiliateId: '',
    provider: 'generic',
    itemsPath: 'products',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', additionalInfo: '' });

  const headers = session?.token
    ? { Authorization: `Bearer ${session.token}` }
    : undefined;

  const load = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const [connRes, prodRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/connections`, { headers }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/affiliate/products`, { headers }),
      ]);
      setConnections(connRes.data.connections || []);
      setProducts(prodRes.data.products || []);
    } catch {
      ToastService.error('Could not load affiliate data.');
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    load();
  }, [load]);

  const createConnection = async (syncNow = false) => {
    if (!form.apiUrl.trim()) {
      ToastService.error('API URL is required.');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/connections`,
        { ...form, fieldMapping: DEFAULT_MAPPING, syncNow },
        { headers },
      );
      ToastService.success(syncNow ? 'Connection saved — import started.' : 'Connection saved.');
      setForm((f) => ({ ...f, apiKey: '' }));
      await load();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? String(err.response.data.error)
          : 'Failed to save connection.';
      ToastService.error(msg);
    }
  };

  const syncConnection = async (id: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/connections/${id}/sync`,
        {},
        { headers },
      );
      ToastService.success('Sync started — refresh in a moment.');
      setTimeout(load, 3000);
    } catch {
      ToastService.error('Sync failed.');
    }
  };

  const removeConnection = async (id: string) => {
    if (!confirm('Remove this API connection?')) return;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/affiliate/connections/${id}`,
      { headers },
    );
    await load();
  };

  const saveProductEdit = async (productId: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/products/${productId}`,
        {
          name: editForm.name,
          price: parseFloat(editForm.price),
          additionalInfo: editForm.additionalInfo,
        },
        { headers },
      );
      setEditingId(null);
      await load();
      ToastService.success('Product updated.');
    } catch {
      ToastService.error('Update failed.');
    }
  };

  const removeProduct = async (productId: string) => {
    if (!confirm('Remove this affiliate product from Angelpage?')) return;
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/affiliate/products/${productId}`,
      { headers },
    );
    await load();
  };

  const importEbayFeed = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/affiliate/ebay/import`,
        {},
        { headers },
      );
      ToastService.success(
        `Imported ${res.data.importedCount || 0} eBay affiliate products.`,
      );
      await load();
    } catch {
      ToastService.error('eBay import failed.');
    }
  };

  if (loading) return <p className="body-small text-mono-70">Loading affiliate dashboard…</p>;

  return (
    <div className="affiliate-dashboard space-y-8 max-w-4xl">
      <div>
        <h3 className="body-bold-large text-mono-100">Affiliate products</h3>
        <p className="caption text-mono-70 mt-2">
          Connect third-party affiliate APIs. Products appear on Angelpage with external
          checkout — buyers complete purchase on the partner site. Charity share:{' '}
          {CHARITY_SHARE_PERCENT}%.
        </p>
      </div>

      {allowEbayImport && (
        <div className="rounded-xl border border-mono-40 p-5">
          <p className="body-small font-medium mb-3">Admin: eBay Partner feed</p>
          <Button variant="secondary" type="button" onClick={importEbayFeed}>
            Import eBay curated feed
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-mono-40 bg-mono-0 p-6 space-y-4">
        <p className="body-small font-medium">Add API connection</p>
        <input
          className="input w-full"
          placeholder="Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
        <input
          className="input w-full"
          placeholder="Affiliate API URL"
          value={form.apiUrl}
          onChange={(e) => setForm({ ...form, apiUrl: e.target.value })}
        />
        <input
          className="input w-full"
          type="password"
          placeholder="API key (optional)"
          value={form.apiKey}
          onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
        />
        <input
          className="input w-full"
          placeholder="Affiliate / tracking ID"
          value={form.affiliateId}
          onChange={(e) => setForm({ ...form, affiliateId: e.target.value })}
        />
        <select
          className="select w-full max-w-xs"
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
        >
          <option value="generic">Generic JSON API</option>
          <option value="ebay">eBay Partner Network</option>
          <option value="amazon">Amazon (manual mapping)</option>
          <option value="custom">Custom</option>
        </select>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" type="button" onClick={() => createConnection(true)}>
            Save & sync
          </Button>
          <Button variant="secondary" type="button" onClick={() => createConnection(false)}>
            Save only
          </Button>
        </div>
      </div>

      {connections.length > 0 && (
        <div className="space-y-3">
          <p className="body-small font-medium">Connections</p>
          {connections.map((c) => (
            <div
              key={c._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-mono-40 p-4"
            >
              <div>
                <p className="body-small font-medium">{c.label}</p>
                <p className="caption text-mono-70 truncate max-w-md">{c.apiUrl}</p>
                <p className="caption text-mono-70">
                  {c.provider} · {c.lastSyncStatus || 'idle'}
                  {c.lastImportedCount ? ` · ${c.lastImportedCount} imported` : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" type="button" onClick={() => syncConnection(c._id)}>
                  Sync
                </Button>
                <Button variant="secondary" type="button" onClick={() => removeConnection(c._id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <p className="body-small font-medium">Imported products ({products.length})</p>
        {products.length === 0 ? (
          <p className="caption text-mono-70">No affiliate products yet. Add an API and sync.</p>
        ) : (
          <div className="grid gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="flex flex-wrap gap-4 rounded-lg border border-mono-40 p-4"
              >
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt=""
                    className="w-20 h-20 object-cover rounded-sm"
                  />
                )}
                <div className="flex-1 min-w-[200px]">
                  {editingId === p._id ? (
                    <div className="space-y-2">
                      <input
                        className="input w-full input-sm"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                      <input
                        className="input w-full input-sm"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                      />
                      <textarea
                        className="textarea w-full text-sm"
                        rows={2}
                        value={editForm.additionalInfo}
                        onChange={(e) =>
                          setEditForm({ ...editForm, additionalInfo: e.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => saveProductEdit(p._id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="body-small font-medium">{p.name}</p>
                      <p className="caption text-mono-70">£{p.price?.toFixed(2)}</p>
                      <p className="caption text-primary-color-100 truncate">
                        {p.affiliateUrl || p.ebayAffiliateUrl}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            setEditingId(p._id);
                            setEditForm({
                              name: p.name,
                              price: String(p.price),
                              additionalInfo: p.additionalInfo || '',
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => removeProduct(p._id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AffiliateDashboard;
