import React, { useState, useEffect } from 'react';
import { X, Printer, FileText, Check, Sparkles, User, Hash, GraduationCap, Users, BookOpen, Target, Calendar, Eye, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  languageName: string;
  languageExtension: string;
  terminalOutput: string;
}

interface StudentProfile {
  name: string;
  rollNo: string;
  className: string;
  batch: string;
  subject: string;
  collegeName: string;
}

const STORAGE_KEY = 'smitronix_lab_report_profile';

export const LabReportModal: React.FC<LabReportModalProps> = ({
  isOpen,
  onClose,
  code,
  languageName,
  languageExtension,
  terminalOutput,
}) => {
  // Student & Academic Details Form State
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('');
  const [batch, setBatch] = useState('');
  const [subject, setSubject] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [experimentNo, setExperimentNo] = useState('01');
  const [aim, setAim] = useState('');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [includeOutput, setIncludeOutput] = useState(true);
  const [includeLineNumbers, setIncludeLineNumbers] = useState(true);
  const [includeSignatureBox, setIncludeSignatureBox] = useState(true);

  // Active view tab: 'form' | 'preview'
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [isPrinting, setIsPrinting] = useState(false);

  // Load saved student profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StudentProfile = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.rollNo) setRollNo(parsed.rollNo);
        if (parsed.className) setClassName(parsed.className);
        if (parsed.batch) setBatch(parsed.batch);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.collegeName) setCollegeName(parsed.collegeName);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Try auto-detecting Aim from comments in source code if empty
  useEffect(() => {
    if (!aim && code) {
      const aimMatch =
        code.match(/(?:(?:\/\/|#|\/\*)\s*(?:Aim|Problem Statement|Objective|Title)\s*:\s*)([^\r\n*]+)/i) ||
        code.match(/(?:(?:\/\/|#)\s*(?:Write a program to|Program to|Implement)\s*)([^\r\n]+)/i);

      if (aimMatch && aimMatch[1]) {
        setAim(aimMatch[1].trim());
      } else {
        setAim(`Write and execute a ${languageName} program to implement the problem statement.`);
      }
    }
  }, [code, languageName, isOpen]);

  // Save profile to localStorage
  const saveProfile = () => {
    try {
      const profile: StudentProfile = {
        name,
        rollNo,
        className,
        batch,
        subject,
        collegeName,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore
    }
  };

  if (!isOpen) return null;

  // Escape HTML helper
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Formatted date for display
  const getFormattedDate = () => {
    if (!date) return '';
    try {
      const d = new Date(date + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return date;
    }
  };

  // Generate clean, printable A4 HTML
  const generatePrintHtml = () => {
    const codeLines = code.split('\n');
    const cleanOutput = terminalOutput.trim() || '[No terminal output recorded - Program was not executed or produced no output]';

    const codeHtml = codeLines
      .map((line, idx) => {
        const lineNum = idx + 1;
        const escaped = escapeHtml(line);
        if (includeLineNumbers) {
          return `<tr><td class="line-num">${lineNum}</td><td class="line-code">${escaped || ' '}</td></tr>`;
        }
        return `<tr><td class="line-code" style="padding-left:12px;">${escaped || ' '}</td></tr>`;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Experiment_${experimentNo || '01'}_${rollNo || 'Report'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 14mm 16mm 14mm;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print {
        display: none !important;
      }
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 12.5px;
      line-height: 1.5;
    }
    .report-sheet {
      width: 100%;
      max-width: 100%;
    }

    /* Top Academic Header Box */
    .header-box {
      border: 1.5px solid #1e293b;
      border-radius: 6px;
      margin-bottom: 16px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .inst-bar {
      background: #0f172a;
      color: #f8fafc;
      padding: 8px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
    }
    .inst-title {
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .expt-badge {
      background: #f97316;
      color: #ffffff;
      padding: 3px 9px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .grid-table {
      width: 100%;
      border-collapse: collapse;
      background: #f8fafc;
    }
    .grid-table td {
      padding: 6px 12px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      width: 33.33%;
      vertical-align: top;
    }
    .grid-table tr td:last-child {
      border-right: none;
    }
    .grid-label {
      display: block;
      font-size: 9.5px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin-bottom: 2px;
    }
    .grid-val {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
    }
    .aim-row {
      padding: 10px 14px;
      background: #ffffff;
      border-top: 1px solid #cbd5e1;
    }
    .aim-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      margin-right: 6px;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }
    .aim-content {
      font-size: 12.5px;
      font-weight: 500;
      color: #1e293b;
      display: inline;
    }

    /* Section Headings */
    .section-head {
      margin: 14px 0 6px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 4px;
      page-break-after: avoid;
    }
    .section-title {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
    }
    .section-meta {
      font-size: 10.5px;
      color: #64748b;
      font-family: monospace;
    }

    /* Code Block Container */
    .code-container {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #f8fafc;
      overflow: hidden;
      margin-bottom: 14px;
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 11px;
      line-height: 1.55;
    }
    .code-table {
      width: 100%;
      border-collapse: collapse;
    }
    .line-num {
      width: 38px;
      text-align: right;
      padding: 1px 8px;
      color: #94a3b8;
      background: #f1f5f9;
      border-right: 1px solid #e2e8f0;
      user-select: none;
      vertical-align: top;
      font-size: 10px;
    }
    .line-code {
      padding: 1px 10px;
      white-space: pre-wrap;
      word-break: break-all;
      color: #0f172a;
    }

    /* Output Console Block */
    .output-container {
      border: 1px solid #1e293b;
      border-radius: 6px;
      background: #0a0f1d;
      color: #f1f5f9;
      padding: 10px 14px;
      margin-bottom: 16px;
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 11px;
      line-height: 1.5;
      white-space: pre-wrap;
      word-break: break-all;
      page-break-inside: avoid;
    }
    .output-bar {
      color: #38bdf8;
      font-weight: 700;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 10.5px;
    }

    /* Faculty Assessment & Signature Block */
    .footer-assessment {
      margin-top: 24px;
      border-top: 1.5px dashed #94a3b8;
      padding-top: 12px;
      page-break-inside: avoid;
    }
    .assessment-table {
      width: 100%;
      border-collapse: collapse;
    }
    .assessment-table td {
      vertical-align: bottom;
      padding: 8px;
    }
    .sign-box {
      text-align: center;
      width: 33.33%;
    }
    .sign-line {
      border-top: 1px solid #475569;
      padding-top: 4px;
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 36px;
    }
    .watermark {
      text-align: center;
      margin-top: 12px;
      font-size: 9px;
      color: #94a3b8;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="report-sheet">
    <!-- Academic Header Box -->
    <div class="header-box">
      <div class="inst-bar">
        <span class="inst-title">${escapeHtml(collegeName || 'DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING')}</span>
        <span class="expt-badge">EXPT NO. ${escapeHtml(experimentNo || '01')}</span>
      </div>

      <table class="grid-table">
        <tr>
          <td>
            <span class="grid-label">Student Name</span>
            <span class="grid-val">${escapeHtml(name || '—')}</span>
          </td>
          <td>
            <span class="grid-label">Roll Number</span>
            <span class="grid-val">${escapeHtml(rollNo || '—')}</span>
          </td>
          <td>
            <span class="grid-label">Date of Conduction</span>
            <span class="grid-val">${escapeHtml(getFormattedDate() || '—')}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span class="grid-label">Class / Year</span>
            <span class="grid-val">${escapeHtml(className || '—')}</span>
          </td>
          <td>
            <span class="grid-label">Batch</span>
            <span class="grid-val">${escapeHtml(batch || '—')}</span>
          </td>
          <td>
            <span class="grid-label">Subject</span>
            <span class="grid-val">${escapeHtml(subject || '—')}</span>
          </td>
        </tr>
      </table>

      <div class="aim-row">
        <span class="aim-tag">AIM</span>
        <div class="aim-content">${escapeHtml(aim || 'To write, compile and execute the program.')}</div>
      </div>
    </div>

    <!-- Section: Source Code -->
    <div class="section-head">
      <span class="section-title">I. Source Code</span>
      <span class="section-meta">${escapeHtml(languageName)} (${codeLines.length} lines)</span>
    </div>
    <div class="code-container">
      <table class="code-table">
        <tbody>
          ${codeHtml}
        </tbody>
      </table>
    </div>

    <!-- Section: Terminal Output -->
    ${
      includeOutput
        ? `
    <div class="section-head">
      <span class="section-title">II. Output & Execution Result</span>
      <span class="section-meta">Terminal Session</span>
    </div>
    <div class="output-container">
      <div class="output-bar">smitronix@cloud:~$ run Main.${escapeHtml(languageExtension)}</div>
${escapeHtml(cleanOutput)}
    </div>
    `
        : ''
    }

    <!-- Section: Evaluation / Signature Block -->
    ${
      includeSignatureBox
        ? `
    <div class="footer-assessment">
      <table class="assessment-table">
        <tr>
          <td class="sign-box">
            <div class="sign-line">Date of Submission</div>
          </td>
          <td class="sign-box">
            <div class="sign-line">Marks / Grade (Out of 10)</div>
          </td>
          <td class="sign-box">
            <div class="sign-line">Teacher's Signature & Stamp</div>
          </td>
        </tr>
      </table>
    </div>
    `
        : ''
    }

    <div class="watermark">
      Generated via SmitroniX Online IDE & Lab Report Engine • ${new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>`;
  };

  // Perform Print / PDF generation
  const handlePrint = () => {
    sounds.playWarp();
    setIsPrinting(true);
    saveProfile();

    const htmlContent = generatePrintHtml();

    // Use a hidden iframe for seamless multi-page print-to-PDF
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) {
      setIsPrinting(false);
      return;
    }

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.error('Print error:', err);
      } finally {
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {
            // Ignore
          }
          setIsPrinting(false);
        }, 1200);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[94vh] bg-[#0B111E] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="h-14 border-b border-white/10 bg-[#0E1626] px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/15 border border-[#FF8A00]/30 flex items-center justify-center text-[#FF8A00]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Print Code & Lab Report PDF</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {languageName}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Academic practical submission with student header, code & output
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Details Form vs Print Preview) */}
        <div className="border-b border-white/10 bg-[#070B14] px-4 sm:px-6 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`py-2.5 px-3 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Student & Expt Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-2.5 px-3 text-xs font-mono font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-[#FF8A00] text-[#FF8A00]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>2. Live Paper Preview</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs">
          {activeTab === 'form' ? (
            <div className="space-y-4">
              {/* College / Institution (Optional) */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 font-semibold mb-1">
                  College / Department Name
                </label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g. Department of Computer Science & Engineering"
                  className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                />
              </div>

              {/* 2-Column Grid: Name, Roll No, Class, Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#FF8A00]" />
                    <span>Student Name *</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Asmit Jogdand"
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                  />
                </div>

                {/* Roll No */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#FF8A00]" />
                    <span>Roll No. *</span>
                  </label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 42 / 21CO045"
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                  />
                </div>

                {/* Class */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-[#FF8A00]" />
                    <span>Class / Year *</span>
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. TE Computer / BE IT"
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                  />
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#FF8A00]" />
                    <span>Batch *</span>
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. B1 / A"
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Subject & Experiment No */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {/* Subject */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-[#FF8A00]" />
                    <span>Subject / Course *</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Object Oriented Programming (Java)"
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                  />
                </div>

                {/* Experiment No */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#FF8A00]" />
                    <span>Expt No. *</span>
                  </label>
                  <input
                    type="text"
                    value={experimentNo}
                    onChange={(e) => setExperimentNo(e.target.value)}
                    placeholder="e.g. 01"
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-2 text-white font-mono text-xs outline-none transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Aim in Header */}
              <div>
                <label className="block text-[11px] font-mono text-slate-300 font-semibold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF8A00]" />
                    <span>Aim / Problem Statement *</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Printed in report header</span>
                </label>
                <textarea
                  value={aim}
                  onChange={(e) => setAim(e.target.value)}
                  rows={2}
                  placeholder="e.g. Write a Java program to implement multi-level inheritance calculating circle area and sphere volume."
                  className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl p-2.5 text-white font-mono text-xs outline-none transition-colors resize-none placeholder:text-slate-600"
                />
              </div>

              {/* Date & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1 border-t border-white/10">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Date of Experiment</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#05080E] border border-white/15 focus:border-[#FF8A00] rounded-xl px-3 py-1.5 text-white font-mono text-xs outline-none transition-colors"
                  />
                </div>

                {/* Print Checkbox options */}
                <div className="space-y-1.5 pt-2 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 text-[11px] font-mono">
                    <input
                      type="checkbox"
                      checked={includeOutput}
                      onChange={(e) => setIncludeOutput(e.target.checked)}
                      className="rounded bg-black border-white/20 text-[#FF8A00] focus:ring-0"
                    />
                    <span>Include Terminal Execution Output</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 text-[11px] font-mono">
                    <input
                      type="checkbox"
                      checked={includeSignatureBox}
                      onChange={(e) => setIncludeSignatureBox(e.target.checked)}
                      className="rounded bg-black border-white/20 text-[#FF8A00] focus:ring-0"
                    />
                    <span>Include Teacher Signature & Grade Box</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            /* Live Paper Preview */
            <div className="bg-white text-slate-900 rounded-xl p-4 sm:p-5 shadow-inner font-sans text-xs space-y-3 max-h-[60vh] overflow-y-auto border border-slate-300">
              {/* Header Box Preview */}
              <div className="border border-slate-800 rounded overflow-hidden">
                <div className="bg-slate-900 text-white px-3 py-1.5 text-xs font-bold flex justify-between items-center">
                  <span>{collegeName || 'DEPARTMENT OF COMPUTER SCIENCE'}</span>
                  <span className="bg-orange-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                    EXPT NO. {experimentNo || '01'}
                  </span>
                </div>
                <div className="grid grid-cols-3 bg-slate-50 text-[10.5px] border-b border-slate-200">
                  <div className="p-2 border-r border-slate-200">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Name</div>
                    <div className="font-bold text-slate-900">{name || '[Your Name]'}</div>
                  </div>
                  <div className="p-2 border-r border-slate-200">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Roll No</div>
                    <div className="font-bold text-slate-900">{rollNo || '[Roll No]'}</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Date</div>
                    <div className="font-bold text-slate-900">{getFormattedDate() || 'Today'}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-slate-50 text-[10.5px] border-b border-slate-200">
                  <div className="p-2 border-r border-slate-200">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Class</div>
                    <div className="font-bold text-slate-900">{className || '[Class]'}</div>
                  </div>
                  <div className="p-2 border-r border-slate-200">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Batch</div>
                    <div className="font-bold text-slate-900">{batch || '[Batch]'}</div>
                  </div>
                  <div className="p-2">
                    <div className="text-[9px] uppercase text-slate-500 font-bold">Subject</div>
                    <div className="font-bold text-slate-900">{subject || '[Subject]'}</div>
                  </div>
                </div>
                <div className="p-2.5 bg-white text-xs">
                  <span className="font-extrabold text-[10px] bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded mr-1.5">
                    AIM
                  </span>
                  <span className="text-slate-800 font-medium">
                    {aim || 'Write and execute program.'}
                  </span>
                </div>
              </div>

              {/* Code preview snippet */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wide text-slate-900 mb-1 border-b border-slate-300 pb-0.5 flex justify-between">
                  <span>Source Code ({languageName})</span>
                  <span className="font-mono text-slate-500 text-[10px]">{code.split('\n').length} lines</span>
                </div>
                <div className="border border-slate-300 rounded bg-slate-50 p-2 font-mono text-[10px] max-h-36 overflow-hidden text-slate-800 leading-relaxed">
                  <pre className="whitespace-pre-wrap">{code.slice(0, 450) + (code.length > 450 ? '\n... (full code will print across pages)' : '')}</pre>
                </div>
              </div>

              {/* Output preview snippet */}
              {includeOutput && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-900 mb-1 border-b border-slate-300 pb-0.5">
                    Terminal Output
                  </div>
                  <div className="border border-slate-800 rounded bg-slate-950 text-slate-200 p-2.5 font-mono text-[10.5px] max-h-24 overflow-hidden leading-relaxed">
                    <div className="text-cyan-400 text-[9.5px] mb-1 font-bold">smitronix@cloud:~$ run Main.{languageExtension}</div>
                    <pre className="whitespace-pre-wrap">{terminalOutput.trim() || '[No execution output recorded yet. Run code in compiler to capture output]'}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="h-16 border-t border-white/10 bg-[#0E1626] px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            {activeTab === 'form' ? 'All fields are remembered for your next experiment' : 'Uses standard A4 portrait pagination'}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={isPrinting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#E57A00] hover:from-[#E57A00] hover:to-[#CC6D00] text-white font-bold font-mono text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-60"
            >
              {isPrinting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Preparing...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
