'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import PermissionCheckboxes from '@/components/common/PermissionCheckboxes';
import {
  ADMIN_PERMISSION_KEYS,
  ADMIN_PERMISSION_LABELS,
  ADMIN_PERMISSION_PRESETS,
  ADMIN_ROLE_LABELS,
} from '@/constants/adminPanels';

interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions?: string[];
}

const SUB_ROLES = [
  { value: 'OPS_ADMIN', label: ADMIN_ROLE_LABELS.OPS_ADMIN },
  { value: 'CONTENT_ADMIN', label: ADMIN_ROLE_LABELS.CONTENT_ADMIN },
  { value: 'FINANCE_ADMIN', label: ADMIN_ROLE_LABELS.FINANCE_ADMIN },
];

const AdminTeamPanel: React.FC = () => {
  const { data: session } = useSession() || {};
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'OPS_ADMIN',
    permissions: ['operations'] as string[],
  });

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = session?.token;

  const fetchTeam = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${api}/admin/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(res.data.team || []);
    } catch {
      ToastService.error('Failed to load admin team.');
    }
  }, [api, token]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const applyRolePreset = (role: string) => {
    const preset = ADMIN_PERMISSION_PRESETS.find(p => p.id === role);
    setForm(f => ({
      ...f,
      role,
      permissions: preset ? [...preset.permissions] : f.permissions,
    }));
  };

  const createMember = async () => {
    if (!form.email.trim() || !form.password) {
      ToastService.error('Email and password are required.');
      return;
    }
    if (!form.permissions.length) {
      ToastService.error('Select at least one permission.');
      return;
    }
    try {
      await axios.post(`${api}/admin/team`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      ToastService.success('Team member created.');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'OPS_ADMIN',
        permissions: ['operations'],
      });
      setFormOpen(false);
      fetchTeam();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Failed to create team member.';
      ToastService.error(msg);
    }
  };

  const updateMember = async (adminId: string, permissions: string[]) => {
    try {
      await axios.patch(
        `${api}/admin/team/${adminId}/role`,
        { permissions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastService.success('Access updated.');
      fetchTeam();
    } catch {
      ToastService.error('Failed to update access.');
    }
  };

  return (
    <div className="admin-team-panel mt-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="body-bold-large text-mono-100">Admin team</h3>
          <p className="body-caption text-mono-70 mt-2 max-w-xl">
            Create managers with custom check/uncheck access. They sign in at{' '}
            <a href="/admin/login" className="underline text-primary-color-100">
              /admin/login
            </a>
            .
          </p>
        </div>
        <Button variant="primary" onClick={() => setFormOpen(!formOpen)}>
          {formOpen ? 'Close' : 'Add team member'}
        </Button>
      </div>

      {formOpen && (
        <div className="mb-8 rounded-xl border bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="First name"
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            />
            <input
              className="border rounded-lg px-3 py-2"
              placeholder="Last name"
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            />
            <input
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <input
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder="Temporary password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
            <select
              className="border rounded-lg px-3 py-2 md:col-span-2"
              value={form.role}
              onChange={e => applyRolePreset(e.target.value)}
            >
              {SUB_ROLES.map(r => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="body-bold-small mb-2">Access permissions</p>
            <PermissionCheckboxes
              allKeys={[...ADMIN_PERMISSION_KEYS]}
              labels={ADMIN_PERMISSION_LABELS}
              selected={form.permissions}
              onChange={permissions => setForm(f => ({ ...f, permissions }))}
              presets={ADMIN_PERMISSION_PRESETS}
            />
          </div>
          <Button variant="primary" onClick={createMember}>
            Create account
          </Button>
        </div>
      )}

      <ul className="space-y-4">
        {team.map(member => (
          <li
            key={member._id}
            className="rounded-lg border bg-white px-4 py-4"
          >
            <div className="flex flex-wrap justify-between gap-3 mb-3">
              <div>
                <p className="body-bold-small">
                  {member.firstName} {member.lastName}
                </p>
                <p className="caption text-mono-70">{member.email}</p>
              </div>
              {member.role === 'ADMIN' ? (
                <span className="caption bg-[#FCF2FF] text-primary-color-100 px-3 py-1 rounded-full h-fit">
                  Super Admin
                </span>
              ) : (
                <span className="caption text-mono-70">
                  {ADMIN_ROLE_LABELS[member.role] || member.role}
                </span>
              )}
            </div>
            {member.role !== 'ADMIN' && member.permissions && (
              <PermissionCheckboxes
                allKeys={[...ADMIN_PERMISSION_KEYS]}
                labels={ADMIN_PERMISSION_LABELS}
                selected={member.permissions}
                onChange={perms => updateMember(member._id, perms)}
                presets={ADMIN_PERMISSION_PRESETS}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTeamPanel;
