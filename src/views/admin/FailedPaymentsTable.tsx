'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface FailedOrder {
  _id: string;
  status: string;
  paymentStatus: string;
  grandTotal: number;
  createdAt: string;
  isGuestOrder?: boolean;
  buyer?: { email?: string; firstName?: string; lastName?: string; name?: string };
}

const FailedPaymentsTable: React.FC = () => {
  const { data: session } = useSession() || {};
  const [orders, setOrders] = useState<FailedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session?.token) return;
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/order/admin/failed-payments`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        );
        setOrders(res.data.orders || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.token]);

  if (loading) {
    return (
      <p className="body-small text-mono-70 mt-8">Loading failed transactions…</p>
    );
  }

  return (
    <div className="mt-10">
      <h3 className="body-bold-large mb-4 text-mono-100">Failed transactions</h3>
      {orders.length === 0 ? (
        <p className="body-small text-mono-70">No failed payments recorded.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F1F1F7]">
              <tr>
                <th className="px-4 py-2 text-left">Order</th>
                <th className="px-4 py-2 text-left">Buyer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Payment</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-t">
                  <td className="px-4 py-2">{order._id.slice(-8)}</td>
                  <td className="px-4 py-2">
                    {order.buyer?.email ||
                      order.buyer?.name ||
                      `${order.buyer?.firstName || ''} ${order.buyer?.lastName || ''}`.trim() ||
                      '—'}
                  </td>
                  <td className="px-4 py-2">{order.status}</td>
                  <td className="px-4 py-2 text-[#D10C3B]">{order.paymentStatus}</td>
                  <td className="px-4 py-2 text-right">
                    £{order.grandTotal?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FailedPaymentsTable;
