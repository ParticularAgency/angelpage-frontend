'use client';

import { Button } from '@/components/elements';
import Image from 'next/image';
import React, { useState } from 'react';

interface Transaction {
  id: string;
  customerName: string;
  amount: number;
  currency: string;
  date: string;
  status: 'Completed' | 'Failed' | 'Processing' | 'Upcoming';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    customerName: 'Amanda Harvey',
    amount: 54,
    currency: 'GBP',
    date: '7 Nov, 2024',
    status: 'Completed',
  },
  {
    id: '2',
    customerName: 'David Johnson',
    amount: 120,
    currency: 'GBP',
    date: '6 Nov, 2024',
    status: 'Processing',
  },
  {
    id: '3',
    customerName: 'Sophia Brown',
    amount: 75,
    currency: 'GBP',
    date: '5 Nov, 2024',
    status: 'Failed',
  },
  {
    id: '4',
    customerName: 'Michael Wilson',
    amount: 200,
    currency: 'GBP',
    date: '4 Nov, 2024',
    status: 'Upcoming',
  },
  {
    id: '5',
    customerName: 'Emma Davis',
    amount: 100,
    currency: 'GBP',
    date: '3 Nov, 2024',
    status: 'Completed',
  },
];

const CustomerAcquisition: React.FC = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  const handleProceedTransaction = (transactionId: string) => {
    // Example logic: Update the transaction status to "Processing"
    setTransactions(prev =>
      prev.map(transaction =>
        transaction.id === transactionId
          ? { ...transaction, status: 'Processing' }
          : transaction
      )
    );
  };

  return (
    <div className="latest-transaction-statistics flex flex-col justify-between w-full">
      <div className="latest-transaction-overview">
        <div className="card-header px-5 py-6 bg-[#f1f1f7] w-full">
          <h2 className="body-bold-regular text-mono-100">
            Latest Transactions
          </h2>
        </div>
        <div className="card-body-wrapper">
          <ul className="transaction-status-lists mt-6 pl-5 pr-7">
            {transactions.map(transaction => (
              <li
                key={transaction.id}
                className="transaction-status-lists-item flex justify-between items-center gap-4 py-[15px]"
              >
                <div className="flex gap-6 items-center customer-info">
                  <Image
                    src="/images/icons/elisp-profile-default-img.svg"
                    alt={`${transaction.customerName} profile`}
                    className="user-profile-image w-8 h-8 rounded-full"
                    width={220}
                    height={220}
                  />
                  <p className="customer-name caption-bold text-[#0d0113] font-medium leading-[150%]">
                    {transaction.customerName}
                  </p>
                </div>
                <span
                  className={`transaction-updates-status caption-bold text-[#677788] font-medium font-secondary px-[17px] py-[2px] forms-bold rounded-full ${
                    transaction.status === 'Completed'
                      ? 'text-[#00C700] bg-[rgba(165,255,187,.60)]'
                      : transaction.status === 'Failed'
                        ? 'text-[#FF0000] bg-[rgba(255,187,187,.60)]'
                        : transaction.status === 'Processing'
                          ? 'text-[#FFA500] bg-[rgba(255,217,127,.60)]'
                          : 'text-[#0000FF] bg-[rgba(173,216,230,.60)]'
                  }`}
                >
                  {transaction.status}
                </span>
                <div className="right-cont customer-transaction-details flex flex-col items-end gap-[4px]">
                  <p className="transaction-amount caption-bold font-secondary text-mono-100">
                    £{transaction.amount.toFixed(2)} {transaction.currency}
                  </p>
                  <p className="transaction-date caption-bold font-secondary text-[#0B0112]">
                    {transaction.date}
                  </p>
                  {transaction.status === 'Upcoming' && (
                    <Button variant='accend-link' className="text-blue-500 underline text-sm mt-1" onClick={() => handleProceedTransaction(transaction.id)} >Proceed</Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CustomerAcquisition;
