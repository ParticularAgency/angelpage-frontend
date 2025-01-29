'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Checkbox } from '@/components/elements';
import Pagination from '@/components/elements/Pagination';

interface User {
  id: string;
  fullName: string;
  email: string;
  signedUp: string;
  userId?: string;
  profileImage: string;
  type: 'USER' | 'CHARITY';
  totalPages?: string;
  totalRecords?: string;
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
interface UserApiResponse {
  users: UserResponse[];
  totalPages: number;
  totalRecords: number;
}
const UsersTable: React.FC = () => {
  const { data: session } = useSession() || {};
  const [users, setUsers] = useState<User[]>([]); // Store all users (combined list)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Store selected users
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalFilteredRecords, setTotalFilteredRecords] = useState(0); // Total filtered users count
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.token) return;

      try {
        const response = await axios.get<UserApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/overview`,
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
            params: {
              page: currentPage,
              limit: usersPerPage,
              searchTerm,
              statusFilter,
              sessionFilter,
            },
          }
        );

        const formattedUsers = response.data.users.map(user => ({
          id: user.id,
          fullName: user.name,
          email: user.email,
          signedUp: user.duration,
          profileImage: user.profileImage,
          userId: user.userId || user.charityId || 'N/A',
          type: user.role,
        }));

        setUsers(formattedUsers);
        setTotalPages(response.data?.totalPages);
        setTotalFilteredRecords(response.data?.totalRecords);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [session?.token, currentPage, searchTerm, statusFilter, sessionFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSessionFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSessionFilter(e.target.value);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedUsers([]); // Reset selected users on page change
  };

  // Updated handleSelectAll function
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(users.map(user => user.id)); // Select only users on the current page
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.type === statusFilter);
    }

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
 if (sessionFilter === 'all') {
   filtered = filtered.sort((a, b) => {
     // Parse 'signedUp' using moment.js
     const dateA = moment(a.signedUp, 'x'); // Parse the relative date string to moment
     const dateB = moment(b.signedUp, 'x'); // Parse the relative date string to moment

     return dateB.isBefore(dateA) ? -1 : 1; // Sort descending (most recent first)
   });
 }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.fullName?.toLowerCase().includes(lowerSearchTerm) ||
          user.email?.toLowerCase().includes(lowerSearchTerm) ||
          user.id?.toLowerCase().includes(lowerSearchTerm) ||
          user.signedUp?.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return filtered;
  }, [users, statusFilter, sessionFilter, searchTerm]);

  // Slice the filtered users for the current page
  // const currentUsers = filteredUsers.slice(
  //   (currentPage - 1) * usersPerPage,
  //   currentPage * usersPerPage
  // );

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
          <div className="user-info-table-top-head flex gap-4 sm:gap-2 items-center justify-between px-[30px] sm:px-5 py-5">
            <h3 className="title body-bold-large sm:body-bold-small max-w-[320px] sm:max-w-[60px] w-full font-secondary text-mono-100">
              Users
            </h3>
            <div className="right-content-list w-full flex items-center justify-between gap-3 sm:gap-2">
              <div className="table-item-selection-status flex items-center gap-5">
                <p className="forms-bold sm:hidden font-secondary font-medium leading-[150%] text-[#677788]">
                  {selectedUsers.length} Selected
                </p>
                <button
                  type="button"
                  className="px-[17px] sm:px-2 h-[24px] gap-2 flex items-center justify-center rounded-[24px] text-[#D10C3B] table-item-delet-btn forms-bold font-secondary font-medium leading-[150%]"
                  onClick={handleDeleteUsers}
                >
                  <span className="hidden sm:block text-[#D10C3B]">
                    {selectedUsers.length}
                  </span>{' '}
                  Delete
                </button>
              </div>
              <div className="table-item-user-status-filter sm:flex-col flex items-center gap-5 sm:gap-1">
                <p className="forms-bold sm:text-[10px] sm:hidden font-secondary font-medium leading-[150%] text-[#677788]">
                  Status:
                </p>
                <select
                  id="sort-select"
                  className="filter-dropdown text-center !border-0 select bg-transparent focus:outline-0 w-full max-w-[160px] pr-8 !pl-2"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
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
              <div className="table-item-user-session-filter sm:flex-col flex items-center gap-5 sm:gap-1">
                <p className="forms-bold sm:text-[10px] sm:hidden whitespace-nowrap font-secondary font-medium leading-[150%] text-[#677788]">
                  Signed Up:
                </p>
                <select
                  id="sort-select"
                  className="filter-dropdown text-center select !border-0 bg-transparent focus:outline-0 w-full max-w-[160px] pr-8 !pl-2"
                  value={sessionFilter}
                  onChange={handleSessionFilterChange}
                >
                  <option className="bg-[#FCF2FF] caption" value="all">
                   All
                  </option>
                  <option className="bg-[#FCF2FF] caption" value="last7days">
                    Last 7 Days
                  </option>
                  <option className="bg-[#FCF2FF] caption" value="1month">
                    1 Month Ago
                  </option>
                </select>
              </div>
              <div className="table-item-user-search sm:hidden max-w-[200px]">
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
                      checked={selectedUsers.length === users.length}
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
                {users.map(user => (
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
                Showing {startCount}–{endCount} of {totalFilteredRecords}
              </span>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
