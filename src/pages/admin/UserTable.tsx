'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Checkbox } from '@/components/elements';

interface User {
  id: string;
  fullName: string;
  email: string;
  signedUp: string;
  userId?: string; // Allow undefined
  profileImage: string;
  type: 'USER' | 'CHARITY';
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  duration: string;
  profileImage: string;
  userId?: string;
  charityId?: string;
  role: 'USER' | 'CHARITY';
}

const UsersTable: React.FC = () => {
  const { data: session } = useSession() || {};
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.token) return;

      try {
        const response = await axios.get<{ users: UserResponse[] }>(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/overview`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }
        );

        const formattedUsers = response.data.users.map(user => ({
          id: user.id,
          fullName: user.name,
          email: user.email,
          signedUp: user.duration,
          profileImage: user.profileImage,
          userId: user.userId || user.charityId || 'N/A', // Provide fallback
          type: user.role,
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [session?.token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSessionFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSessionFilter(e.target.value);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.type === statusFilter);
    }

    // Filter by session duration
    if (sessionFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (sessionFilter === 'last7days') {
          return (
            user.signedUp?.toLowerCase().includes('day') ||
            user.signedUp?.toLowerCase().includes('week')
          );
        }
        if (sessionFilter === '1month') {
          return user.signedUp?.toLowerCase().includes('month');
        }
        return true;
      });
    }

    // Search across multiple fields
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.fullName?.toLowerCase().includes(lowerSearchTerm) || // Check for existence before calling toLowerCase
          user.email?.toLowerCase().includes(lowerSearchTerm) ||
          user.id?.toLowerCase().includes(lowerSearchTerm) ||
          user.signedUp?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return filtered;
  }, [users, statusFilter, sessionFilter, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const startCount = (currentPage - 1) * usersPerPage + 1;
  const endCount = Math.min(currentPage * usersPerPage, filteredUsers.length);

  const handleDeleteUsers = async () => {
    if (!session?.token) return; // Ensure token exists

    try {
      await Promise.all(
        selectedUsers.map(userId =>
          axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`, // Token for authorization
              },
            }
          )
        )
      );
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };
  return (
    <div className="grid grid-cols-12 gap-0 mt-10">
      <div className="users-info-table-overview col-span-full">
        <div className="user-info-table-wrapper">
          <div className="user-info-table-top-head flex gap-4 items-center justify-between px-[30px] py-5">
            <h3 className="title body-bold-large max-w-[320px] w-full font-secondary text-mono-100">
              Users
            </h3>
            <div className="right-content-list w-full flex items-center justify-between gap-3">
              <div className="table-item-selection-status flex items-center gap-5">
                <p className="forms-bold font-secondary font-medium leading-[150%] text-[#677788]">
                  {selectedUsers.length} Selected
                </p>
                <button
                  type="button"
                  className="px-[17px] h-[24px] flex items-center justify-center rounded-[24px] text-[#D10C3B] table-item-delet-btn forms-bold font-secondary font-medium leading-[150%]"
                  onClick={handleDeleteUsers}
                >
                  Delete
                </button>
              </div>
              <div className="table-item-user-status-filter flex items-center gap-5">
                <p className="forms-bold font-secondary font-medium leading-[150%] text-[#677788]">
                  Status:
                </p>
                <select
                  id="sort-select"
                  className="filter-dropdown !border-0 select bg-transparent focus:outline-0 w-full max-w-[160px] pr-8 !pl-2"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option className="bg-[#FCF2FF] caption" value="all">
                    All
                  </option>
                  <option className="bg-[#FCF2FF] caption" value="USER">
                    User
                  </option>
                  <option className="bg-[#FCF2FF] caption" value="CHARITY">
                    Charity
                  </option>
                </select>
              </div>
              <div className="table-item-user-session-filter flex items-center gap-5">
                <p className="forms-bold whitespace-nowrap font-secondary font-medium leading-[150%] text-[#677788]">
                  Signed Up:
                </p>
                <select
                  id="sort-select"
                  className="filter-dropdown select !border-0 bg-transparent focus:outline-0 w-full max-w-[160px] pr-8 !pl-2"
                  value={sessionFilter}
                  onChange={handleSessionFilterChange}
                >
                  <option className="bg-[#FCF2FF] caption" value="all">
                    Most Recent
                  </option>
                  <option className="bg-[#FCF2FF] caption" value="last7days">
                    Last 7 Days
                  </option>
                  <option className="bg-[#FCF2FF] caption" value="1month">
                    1 Month Ago
                  </option>
                </select>
              </div>
              <div className="table-item-user-search max-w-[200px]">
                <form action="" className="search-form relative">
                  <input
                    id="searchTableItem"
                    type="search"
                    className="search-input-filed h-10 w-full placeholder:text-[#CDD3DA] !rounded-[24px] outline-none text-body-form font-normal pr-2 pl-8 py-[11.5px] text-[#CDD3DA] leading-[150%] font-secondary"
                    placeholder="Search user, charity..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  <Image
                    src="/images/Search-primary.svg"
                    className="absolute top-0 left-3 bottom-0 my-auto"
                    alt="search icon"
                    width={13}
                    height={13}
                  />
                </form>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
            <table className="min-w-full user-info-table text-sm text-left text-gray-500">
              <thead className="bg-[#F1F1F7] border-b text-gray-600 font-semibold">
                <tr>
                  <th className="px-4 py-3 caption-bold text-[#677788] font-secondary font-medium">
                    <Checkbox
                      checked={selectedUsers.length === currentUsers.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 caption-bold text-mono-100 font-secondary font-medium">
                    Full Name
                  </th>
                  <th className="px-4 py-3 caption-bold text-mono-100 font-secondary font-medium">
                    Email
                  </th>
                  <th className="px-4 py-3 caption-bold text-mono-100 font-secondary font-medium">
                    Signed Up
                  </th>
                  <th className="px-4 py-3 caption-bold text-mono-100 font-secondary font-medium">
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-100">
                    <td className="pl-4 py-4 caption-bold text-[#677788] font-secondary font-medium">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() =>
                          setSelectedUsers(prev =>
                            prev.includes(user.id)
                              ? prev.filter(id => id !== user.id)
                              : [...prev, user.id]
                          )
                        }
                      />
                    </td>
                    <td className="pr-4 py-4 caption-bold text-mono-100 font-secondary font-medium">
                      <div className="flex items-center gap-6">
                        <Image
                          src={
                            user.profileImage ||
                            '/images/icons/elisp-profile-default-img.svg'
                          }
                          alt="user profile image"
                          width={180}
                          height={180}
                          className="w-8 h-8 rounded-full"
                        />
                        {user.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-4 caption-bold text-[#677788] font-secondary font-medium">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 caption-bold text-[#677788] font-secondary font-medium">
                      {user.signedUp}
                    </td>
                    <td className="px-4 py-4 caption-bold text-[#677788] font-secondary font-medium">
                      {user.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-5 flex items-center table-user-info-list-bottom mt-6 justify-between bg-gray-50">
              <span className="caption-bold">
                Showing {startCount}–{endCount} of {filteredUsers.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1 bg-white border caption-bold rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 ${
                      currentPage === index + 1
                        ? 'bg-mono-100 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1 bg-white border caption-bold rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
