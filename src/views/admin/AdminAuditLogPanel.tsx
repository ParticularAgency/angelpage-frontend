'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface AuditEntry {
  _id: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

const AdminAuditLogPanel = () => {
  const { data: session } = useSession() || {};
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.token) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/audit-logs`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setLogs(res.data.logs || []);
    } finally {
      setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <p className="body-small text-mono-70 mt-6">Loading audit log…</p>;
  }

  return (
    <div className="audit-log-panel mt-6 space-y-4">
      <h3 className="body-bold-large">Audit log</h3>
      <p className="caption text-mono-70">
        Admin actions: payouts, escrow releases, dispute resolutions.
      </p>
      {logs.length === 0 ? (
        <p className="body-small text-mono-70">No audit entries yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-[#F1F1F7]">
              <tr>
                <th className="px-4 py-2 text-left">When</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">Entity</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-t">
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-GB')}
                  </td>
                  <td className="px-4 py-2">{log.actorRole}</td>
                  <td className="px-4 py-2 font-medium">{log.action}</td>
                  <td className="px-4 py-2">
                    {log.entityType}
                    {log.entityId ? ` #${String(log.entityId).slice(-8)}` : ''}
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

export default AdminAuditLogPanel;
