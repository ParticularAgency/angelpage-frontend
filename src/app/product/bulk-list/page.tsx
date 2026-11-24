'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import ProtectedRoute from '@/utils/ProtectedRoute';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import { CHARITY_SHARE_PERCENT } from '@/constants/brand';
import {
  downloadBulkListingTemplate,
  parseSpreadsheetFile,
} from '@/lib/excel';

const REQUIRED_COLUMNS = ['name', 'price', 'category'];

const BulkListPage = () => {
  const { data: session } = useSession() || {};
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [uploading, setUploading] = useState(false);

  const parseFile = async (file: File) => {
    const rows = await parseSpreadsheetFile(file);
    setPreview(rows.slice(0, 5));
    return rows;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      await parseFile(file);
    } catch {
      ToastService.error('Could not read file. Use CSV or Excel.');
      setPreview([]);
    }
  };

  const handleUpload = async () => {
    const input = document.getElementById('bulk-file-input') as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !session?.token) {
      ToastService.error('Choose a file and sign in to upload.');
      return;
    }

    setUploading(true);
    try {
      const rows = await parseFile(file);
      const products = rows
        .filter(row => row.name && row.price && row.category)
        .map(row => ({
          name: String(row.name).trim(),
          price: parseFloat(String(row.price).replace(/[^\d.]/g, '')),
          category: String(row.category).trim(),
          subcategory: row.subcategory ? String(row.subcategory).trim() : '',
          condition: row.condition ? String(row.condition).trim() : '',
          brand: row.brand ? String(row.brand).trim() : '',
          quantity: row.quantity ? parseInt(String(row.quantity), 10) : 1,
          charity: row.charityId ? String(row.charityId).trim() : undefined,
          additionalInfo: row.additionalInfo ? String(row.additionalInfo).trim() : '',
        }));

      if (!products.length) {
        ToastService.error(`No valid rows. Required columns: ${REQUIRED_COLUMNS.join(', ')}`);
        return;
      }

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/bulk`,
        { products, status: 'PENDING_REVIEW' },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );

      ToastService.success(res.data.message || 'Bulk upload complete');
      if (res.data.failedCount > 0) {
        console.warn('Bulk upload failures:', res.data.failed);
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Bulk upload failed';
      ToastService.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    downloadBulkListingTemplate().catch(() => {
      ToastService.error('Could not download template.');
    });
  };

  return (
    <ProtectedRoute allowedRoles={['USER', 'CHARITY']}>
      <div className="custom-container py-12 max-w-2xl">
        <Link href="/product/post-product" className="body-small text-primary-color-100 underline">
          ← Single listing
        </Link>
        <h1 className="h4 mt-4 mb-2">Bulk list items</h1>
        <p className="body-small text-mono-70 mb-6">
          Upload a spreadsheet to list many products at once (max 50 per file).
          Each row becomes a listing pending admin review. Charity receives{' '}
          {CHARITY_SHARE_PERCENT}% of each sale.
        </p>

        <div className="rounded-xl border border-mono-40 bg-mono-0 p-6 space-y-4">
          <Button variant="secondary" type="button" onClick={downloadTemplate}>
            Download template
          </Button>

          <div>
            <label htmlFor="bulk-file-input" className="forms block mb-2">
              CSV or Excel file
            </label>
            <input
              id="bulk-file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm"
            />
            {fileName && (
              <p className="caption text-mono-70 mt-1">Selected: {fileName}</p>
            )}
          </div>

          {preview.length > 0 && (
            <div>
              <p className="body-small font-medium mb-2">Preview (first rows)</p>
              <pre className="text-xs bg-[#F1F1F7] p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(preview, null, 2)}
              </pre>
            </div>
          )}

          <p className="caption text-mono-70">
            Required columns: {REQUIRED_COLUMNS.join(', ')}. Optional: subcategory,
            condition, brand, quantity, charityId, additionalInfo.
          </p>

          <Button
            variant="primary"
            type="button"
            disabled={uploading || !fileName}
            onClick={handleUpload}
          >
            {uploading ? 'Uploading…' : 'Submit for review'}
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BulkListPage;
