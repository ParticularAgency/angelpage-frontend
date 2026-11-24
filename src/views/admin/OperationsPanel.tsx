'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

interface OrderRow {
  _id: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  escrowStatus?: string;
  disputeStatus?: string;
  disputeNotes?: string;
  escrowReleaseAt?: string;
  createdAt: string;
  guestEmail?: string;
  guestName?: string;
  buyerId?: { firstName?: string; lastName?: string; email?: string };
}

const OperationsPanel: React.FC = () => {
  const { data: session } = useSession() || {};
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [escrowReady, setEscrowReady] = useState<OrderRow[]>([]);
  const [disputes, setDisputes] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const fetchAll = useCallback(async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${session.token}` };
      const [ordersRes, escrowRes, disputesRes] = await Promise.all([
        axios.get(`${api}/admin/operations/orders`, { headers, params: { limit: 30 } }),
        axios.get(`${api}/admin/operations/escrow`, { headers }),
        axios.get(`${api}/admin/operations/disputes`, { headers }),
      ]);
      setOrders(ordersRes.data.orders || []);
      setEscrowReady(escrowRes.data.ready || []);
      setDisputes(disputesRes.data.disputes || []);
    } catch {
      ToastService.error('Failed to load operations data.');
    } finally {
      setLoading(false);
    }
  }, [api, session?.token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const releaseEscrow = async (orderId: string) => {
    try {
      await axios.post(
        `${api}/admin/operations/escrow/${orderId}/release`,
        {},
        { headers: { Authorization: `Bearer ${session?.token}` } }
      );
      ToastService.success('Escrow released.');
      fetchAll();
    } catch {
      ToastService.error('Failed to release escrow.');
    }
  };

  const resolveDispute = async (orderId: string, releaseEscrowAfter = false) => {
    const resolution = window.prompt('Resolution notes for this dispute:');
    if (resolution === null) return;
    try {
      await axios.post(
        `${api}/admin/operations/disputes/${orderId}/resolve`,
        { resolution, releaseEscrow: releaseEscrowAfter },
        { headers: { Authorization: `Bearer ${session?.token}` } }
      );
      ToastService.success('Dispute resolved.');
      fetchAll();
    } catch {
      ToastService.error('Failed to resolve dispute.');
    }
  };

  const downloadExport = async () => {
    if (!session?.token) return;
    const res = await fetch(`${api}/admin/operations/export/orders`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const buyerLabel = (o: OrderRow) =>
    o.guestEmail ||
    o.buyerId?.email ||
    `${o.buyerId?.firstName || ''} ${o.buyerId?.lastName || ''}`.trim() ||
    '—';

  if (loading) {
    return <p className="body-small text-mono-70 mt-6">Loading operations…</p>;
  }

  return (
    <div className="operations-panel mt-6 space-y-10">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={downloadExport}>
          Export orders (CSV)
        </Button>
      </div>
      <section>
        <h3 className="body-bold-large mb-4">Escrow ready for release</h3>
        {escrowReady.length === 0 ? (
          <p className="body-small text-mono-70">No orders ready for escrow release.</p>
        ) : (
          <div className="space-y-3">
            {escrowReady.map(order => (
              <div
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4"
              >
                <div>
                  <p className="body-small font-medium">#{order._id.slice(-8)}</p>
                  <p className="caption text-mono-70">{buyerLabel(order)}</p>
                  <p className="caption text-mono-70">
                    £{order.grandTotal?.toFixed(2)} · {order.escrowStatus}
                  </p>
                </div>
                <Button variant="primary" onClick={() => releaseEscrow(order._id)}>
                  Release escrow
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="body-bold-large mb-4">Open disputes</h3>
        {disputes.length === 0 ? (
          <p className="body-small text-mono-70">No active disputes.</p>
        ) : (
          <div className="space-y-3">
            {disputes.map(order => (
              <div
                key={order._id}
                className="rounded-xl border bg-white p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <p className="body-small font-medium">#{order._id.slice(-8)}</p>
                  <p className="caption text-mono-70">{buyerLabel(order)} · {order.status}</p>
                  {order.disputeNotes && (
                    <p className="caption text-mono-80 mt-1">{order.disputeNotes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => resolveDispute(order._id, false)}>
                    Resolve
                  </Button>
                  <Button variant="primary" onClick={() => resolveDispute(order._id, true)}>
                    Resolve & release escrow
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="body-bold-large mb-4">Recent orders</h3>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F1F1F7]">
              <tr>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Buyer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Payment</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">{order._id.slice(-8)}</td>
                  <td className="px-4 py-2">{buyerLabel(order)}</td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2">{order.paymentStatus}</td>
                  <td className="px-4 py-2 text-right">
                    £{order.grandTotal?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default OperationsPanel;
