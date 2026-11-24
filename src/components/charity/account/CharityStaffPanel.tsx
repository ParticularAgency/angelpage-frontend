'use client';

import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import PermissionCheckboxes from '@/components/common/PermissionCheckboxes';
import {
  CHARITY_PERMISSION_KEYS,
  CHARITY_PERMISSION_LABELS,
  CHARITY_PERMISSION_PRESETS,
} from '@/constants/charityPanels';

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  staffRole: string;
  permissions?: string[];
  active: boolean;
}

const CharityStaffPanel = () => {
  const { data: session } = useSession() || {};
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    staffRole: 'STAFF',
    permissions: ['listings', 'sold', 'messages', 'notifications', 'community'] as string[],
  });

  const api = process.env.NEXT_PUBLIC_API_URL;
  const token = session?.token;

  const fetchStaff = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${api}/charity/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaff(res.data.staff || []);
    } catch {
      ToastService.error('Failed to load team.');
    }
  }, [api, token]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const applyPreset = (staffRole: string) => {
    const preset = CHARITY_PERMISSION_PRESETS.find(p => p.id === staffRole);
    setForm(f => ({
      ...f,
      staffRole,
      permissions: preset ? [...preset.permissions] : f.permissions,
    }));
  };

  const createStaff = async () => {
    if (!form.email.trim() || !form.password) {
      ToastService.error('Email and password required.');
      return;
    }
    if (!form.permissions.length) {
      ToastService.error('Select at least one permission.');
      return;
    }
    try {
      await axios.post(`${api}/charity/staff`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      ToastService.success('Staff member added.');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        staffRole: 'STAFF',
        permissions: ['listings', 'sold', 'community'],
      });
      setFormOpen(false);
      fetchStaff();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Failed to add staff.';
      ToastService.error(msg);
    }
  };

  const updateStaff = async (
    staffId: string,
    payload: { permissions?: string[]; active?: boolean }
  ) => {
    try {
      await axios.patch(`${api}/charity/staff/${staffId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    } catch {
      ToastService.error('Failed to update staff.');
    }
  };

  return (
    <div className="charity-staff-panel max-w-3xl">
      <p className="body-small text-mono-70 mb-6">
        Add maintenance staff with custom access. Staff use the same{' '}
        <strong>Charity/Brand</strong> login — no separate login page.
      </p>

      <Button variant="primary" onClick={() => setFormOpen(!formOpen)}>
        {formOpen ? 'Close' : 'Add staff member'}
      </Button>

      {formOpen && (
        <div className="mt-6 rounded-xl border bg-white p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.staffRole}
            onChange={e => applyPreset(e.target.value)}
          >
            <option value="STAFF">Staff preset</option>
            <option value="MANAGER">Manager preset</option>
          </select>
          <div>
            <p className="body-bold-small mb-2">Access permissions</p>
            <PermissionCheckboxes
              allKeys={[...CHARITY_PERMISSION_KEYS]}
              labels={CHARITY_PERMISSION_LABELS}
              selected={form.permissions}
              onChange={permissions => setForm(f => ({ ...f, permissions }))}
              presets={CHARITY_PERMISSION_PRESETS}
            />
          </div>
          <Button variant="primary" onClick={createStaff}>
            Create staff login
          </Button>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {staff.map(member => (
          <li
            key={member._id}
            className="rounded-lg border bg-white px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="body-bold-small">
                  {member.firstName} {member.lastName}
                </p>
                <p className="caption text-mono-70">
                  {member.email}
                  {!member.active ? ' · deactivated' : ''}
                </p>
              </div>
              <Button
                variant="secondary"
                className="text-primary-color-100!"
                onClick={() =>
                  updateStaff(member._id, { active: !member.active })
                }
              >
                {member.active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
            {member.permissions && (
              <PermissionCheckboxes
                allKeys={[...CHARITY_PERMISSION_KEYS]}
                labels={CHARITY_PERMISSION_LABELS}
                selected={member.permissions}
                onChange={permissions =>
                  updateStaff(member._id, { permissions })
                }
                presets={CHARITY_PERMISSION_PRESETS}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharityStaffPanel;
