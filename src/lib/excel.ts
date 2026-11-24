import ExcelJS from 'exceljs';

function parseCsvText(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? '';
    });
    return row;
  });
}

export async function parseSpreadsheetFile(
  file: File,
): Promise<Record<string, string>[]> {
  if (file.name.toLowerCase().endsWith('.csv')) {
    return parseCsvText(await file.text());
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const rows: Record<string, string>[] = [];
  let headers: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    const rawValues = Array.isArray(row.values) ? row.values : [];
    const values = rawValues.slice(1).map((v) => String(v ?? '').trim());
    if (rowNumber === 1) {
      headers = values;
      return;
    }

    const obj: Record<string, string> = {};
    values.forEach((val, idx) => {
      const key = headers[idx] || `col${idx + 1}`;
      obj[key] = val;
    });

    if (Object.values(obj).some((v) => v !== '')) {
      rows.push(obj);
    }
  });

  return rows;
}

export async function downloadBulkListingTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Listings');
  sheet.columns = [
    { header: 'name', key: 'name', width: 24 },
    { header: 'price', key: 'price', width: 10 },
    { header: 'category', key: 'category', width: 14 },
    { header: 'subcategory', key: 'subcategory', width: 14 },
    { header: 'condition', key: 'condition', width: 12 },
    { header: 'brand', key: 'brand', width: 14 },
    { header: 'quantity', key: 'quantity', width: 10 },
    { header: 'charityId', key: 'charityId', width: 28 },
    { header: 'additionalInfo', key: 'additionalInfo', width: 24 },
  ];
  sheet.addRow({
    name: 'Blue wool jumper',
    price: 25,
    category: 'women',
    subcategory: 'knitwear',
    condition: 'Good',
    brand: 'Unbranded',
    quantity: 1,
    charityId: '',
    additionalInfo: 'Size M',
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'angelpage-bulk-listing-template.xlsx';
  link.click();
  URL.revokeObjectURL(url);
}
