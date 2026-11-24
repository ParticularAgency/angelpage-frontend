'use client';

import React from 'react';
import { Calendar, Check, Download, MapPin, QrCode, ShieldCheck } from 'lucide-react';

type EventAttendanceTicketProps = {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketId: string;
};

export default function EventAttendanceTicket({
  eventTitle,
  eventDate,
  eventLocation,
  ticketId,
}: EventAttendanceTicketProps) {
  const handleDownloadTicket = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 600, 300);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 280);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(430, 10);
    ctx.lineTo(430, 290);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('ANGELPAGE VERIFIED ATTENDANCE PORTAL', 35, 45);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Georgia, serif';
    const displayTitle =
      eventTitle.length > 30 ? `${eventTitle.substring(0, 28)}...` : eventTitle;
    ctx.fillText(displayTitle, 35, 85);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Date: ${eventDate}`, 35, 125);
    ctx.fillText(`Location: ${eventLocation}`, 35, 150);
    ctx.fillText(`Ticket ID: ${ticketId}`, 35, 175);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('✓ SECURE ENTRY PERMIT // DECENTRALIZED TRUST', 35, 220);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `Angelpage_Ticket_${eventTitle.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl">
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-900/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-emerald-950/10 blur-2xl" />

      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Verified Ticket Generated
          </span>
        </div>
        <span className="font-mono text-[9px] font-bold uppercase text-slate-500">{ticketId}</span>
      </div>

      <div className="grid grid-cols-12 items-center gap-6 md:grid-cols-1">
        <div className="col-span-8 space-y-4 md:col-span-full">
          <div>
            <span className="mb-1 block font-mono text-[9px] font-bold uppercase tracking-widest text-blue-400">
              DECEN_CHARITY BROADCAST PERMIT
            </span>
            <h4 className="font-serif text-base font-bold leading-snug tracking-tight text-white">
              {eventTitle}
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-3.5 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-500" aria-hidden />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500" aria-hidden />
              <span className="truncate">{eventLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3.5 py-2.5 text-[11px] font-light leading-snug text-emerald-300">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            <span>
              Permit is cryptographically locked to your browser credentials. Present QR on field
              arrive.
            </span>
          </div>
        </div>

        <div className="col-span-4 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 p-3.5 md:col-span-full">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-xl bg-white p-2.5 shadow-md">
            <QrCode className="h-10 w-10 text-slate-900" aria-hidden />
            <div className="absolute inset-0 m-auto flex h-6 w-6 items-center justify-center rounded-sm border border-slate-800 bg-slate-950 shadow-lg">
              <QrCode className="h-3.5 w-3.5 text-blue-400" aria-hidden />
            </div>
          </div>
          <span className="mt-3 font-mono text-[8px] font-bold uppercase tracking-widest text-slate-500">
            TX_ENTRY_GATEWAY
          </span>
        </div>
      </div>

      <div className="mt-5 flex justify-end border-t border-slate-900 pt-4">
        <button
          type="button"
          onClick={handleDownloadTicket}
          className="flex items-center gap-1.5 rounded-xl bg-blue-900 px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-blue-950"
        >
          <Download className="h-3.5 w-3.5 text-blue-400" aria-hidden />
          Download Attendance Ticket (.PNG)
        </button>
      </div>
    </div>
  );
}
