const express = require('express');
const router = express.Router();
const Curriculum = require('../models/Curriculum');

// Seed with full curriculum data
const { ACADEMIC_CURRICULUM } = require('./academicDataSeed');

async function ensureCurriculumsSeeded() {
  for (const gradeKey of Object.keys(ACADEMIC_CURRICULUM)) {
    const c = ACADEMIC_CURRICULUM[gradeKey];
    await Curriculum.findOneAndUpdate({ grade: c.grade }, c, { upsert: true, new: true });
  }
}

// GET /api/curriculum
router.get('/', async (req, res) => {
  try {
    const { grade } = req.query;

    if (grade) {
      // First check local updated dataset for immediate response
      if (ACADEMIC_CURRICULUM[grade]) {
        // Sync asynchronously to MongoDB in background
        Curriculum.findOneAndUpdate({ grade }, ACADEMIC_CURRICULUM[grade], { upsert: true }).catch(() => {});
        return res.json(ACADEMIC_CURRICULUM[grade]);
      }

      const curr = await Curriculum.findOne({ grade });
      if (curr) return res.json(curr);
      return res.json(ACADEMIC_CURRICULUM['7']);
    }

    const all = await Curriculum.find().sort({ grade: 1 });
    res.json(all.length > 0 ? all : Object.values(ACADEMIC_CURRICULUM));
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    if (req.query.grade && ACADEMIC_CURRICULUM[req.query.grade]) {
      return res.json(ACADEMIC_CURRICULUM[req.query.grade]);
    }
    res.status(500).json({ error: error.message });
  }
});

// GET /api/curriculum/textbook-view - Official Gujarat State Board (GSSTB / શાળા મિત્ર) Digital E-Textbook Chapter Reader
router.get('/textbook-view', (req, res) => {
  try {
    const { grade, subject, chapter, pdf, format } = req.query;
    const gradeKey = (grade || '7').toString();
    const gradeData = ACADEMIC_CURRICULUM[gradeKey] || ACADEMIC_CURRICULUM['7'];
    
    // Find matching subject
    let subj = (gradeData.subjects || []).find(
      (s) => s.id === subject || s.id.toLowerCase() === (subject || '').toLowerCase()
    );
    if (!subj) {
      subj = (gradeData.subjects || []).find((s) =>
        s.name.toLowerCase().includes((subject || '').toLowerCase()) ||
        (s.nameGujarati && s.nameGujarati.includes(subject || ''))
      ) || (gradeData.subjects || [])[0];
    }

    // Direct PDF redirect if requested
    if (pdf === 'true' || format === 'pdf') {
      const pdfUrl = subj.officialTextbookPdf || 'https://gujarat-education.gov.in/textbook/textbook.htm';
      return res.redirect(pdfUrl);
    }

    const chapNum = parseInt(chapter) || 1;
    const chap = (subj.chapters || []).find((c) => c.chapterNumber === chapNum) || (subj.chapters || [])[0];

    const html = generateTextbookHtml(gradeKey, gradeData, subj, chap);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Error rendering textbook view:', err);
    res.status(500).send(`<h1>Error Loading Textbook</h1><p>${err.message}</p>`);
  }
});

// GET /api/curriculum/chapter-pdf - Official Chapter-Wise PDF Printable Booklet (All Standards 7 to 12)
router.get('/chapter-pdf', (req, res) => {
  try {
    const { grade, subject, chapter } = req.query;
    const gradeKey = (grade || '7').toString();
    const gradeData = ACADEMIC_CURRICULUM[gradeKey] || ACADEMIC_CURRICULUM['7'];

    let subj = (gradeData.subjects || []).find(
      (s) => s.id === subject || s.id.toLowerCase() === (subject || '').toLowerCase()
    );
    if (!subj) {
      subj = (gradeData.subjects || []).find((s) =>
        s.name.toLowerCase().includes((subject || '').toLowerCase()) ||
        (s.nameGujarati && s.nameGujarati.includes(subject || ''))
      ) || (gradeData.subjects || [])[0];
    }

    const chapNum = parseInt(chapter) || 1;
    const chap = (subj.chapters || []).find((c) => c.chapterNumber === chapNum) || (subj.chapters || [])[0];

    const html = generateChapterPdfHtml(gradeKey, gradeData, subj, chap);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Error rendering chapter pdf view:', err);
    res.status(500).send(`<h1>Error Loading Chapter PDF</h1><p>${err.message}</p>`);
  }
});

function generateTextbookHtml(gradeKey, gradeData, subj, chap) {
  const gsebPortalUrl = "https://gujarat-education.gov.in/textbook/textbook.htm";
  const officialPdfUrl = subj.officialTextbookPdf || 'https://d.esevaonline.in/pdf/std-7/std-7-june-2026-maths.pdf';
  const shalamitraUrl = subj.shalamitraUrl || 'https://shalamitra.in/book/ganit/212';

  const formulasHtml = (chap.keyFormulasGujarati || []).map((f) => `
    <li style="margin-bottom: 8px; font-size: 15px; color: #1e293b;">
      <span style="color: #2563eb; font-weight: bold; margin-right: 6px;">⚡</span>${f}
    </li>
  `).join('');

  const exercisesHtml = (chap.exerciseSolutions || []).map((ex, idx) => `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 14px;">
      <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-bottom: 6px;">
        <span style="color: #2563eb;">પ્રશ્ન ${idx + 1}:</span> ${ex.questionGujarati || ex.question}
      </div>
      <div style="color: #334155; font-size: 14.5px; line-height: 1.6; background: #ffffff; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #10b981;">
        <strong style="color: #10b981;">જવાબ:</strong> ${ex.answerGujarati || ex.answer}
      </div>
    </div>
  `).join('');

  const conceptsHtml = (chap.concepts || []).map((c) => `
    <div style="margin-bottom: 16px;">
      <h3 style="color: #1e3a8a; font-size: 17px; margin-bottom: 6px;">🔹 ${c.headingGujarati || c.heading}</h3>
      <p style="color: #334155; line-height: 1.7; font-size: 15px;">${c.explanationGujarati || c.explanation}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${chap.chapterNumber}. ${chap.titleGujarati || chap.title} - ધોરણ ${gradeKey} ${subj.nameGujarati || subj.name} (શાળા મિત્ર)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Shruti", "Gujarati Sangam MN", sans-serif;
      background: #f1f5f9;
      color: #0f172a;
      padding: 16px;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .header-banner {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 24px 20px;
      text-align: center;
    }
    .gseb-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .board-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .sub-board-title {
      font-size: 14px;
      opacity: 0.95;
    }
    .chapter-hero {
      background: #f8fafc;
      padding: 16px 20px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .chapter-number-pill {
      background: #2563eb;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 800;
    }
    .chapter-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      flex: 1;
    }
    .action-links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .btn {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      border: none;
    }
    .btn-pdf {
      background: #ef4444;
      color: #ffffff;
    }
    .btn-pdf:hover {
      background: #dc2626;
    }
    .btn-reader {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-reader:hover {
      background: #1d4ed8;
    }
    .btn-print {
      background: #e2e8f0;
      color: #334155;
    }
    .content-body {
      padding: 20px;
    }
    .section-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .section-heading {
      font-size: 17px;
      font-weight: 800;
      color: #1e3a8a;
      margin-bottom: 12px;
      border-bottom: 2px solid #dbeafe;
      padding-bottom: 6px;
    }
    .summary-text {
      font-size: 15.5px;
      color: #334155;
      line-height: 1.7;
    }
    .footer-bar {
      background: #0f172a;
      color: #94a3b8;
      text-align: center;
      padding: 16px;
      font-size: 12px;
    }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { box-shadow: none; border: none; max-width: 100%; }
      .action-links, .reader-box { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-banner">
      <div class="gseb-badge">શાળા મિત્ર • GSEB / GCERT GUJARATI MEDIUM</div>
      <div class="board-title">ગુજરાત રાજ્ય શાળા પાઠ્યપુસ્તક મંડળ, ગાંધીનગર</div>
      <div class="sub-board-title">ધોરણ ${gradeKey} : ${subj.textbookTitleGujarati || subj.nameGujarati} (અધિકૃત ડિજિટલ પુસ્તક)</div>
    </div>

    <div class="chapter-hero">
      <div class="chapter-number-pill">પ્રકરણ ${chap.chapterNumber}</div>
      <div class="chapter-title">${chap.titleGujarati || chap.title}</div>
      <div class="action-links">
        <a href="${officialPdfUrl}" target="_blank" class="btn btn-pdf">
          📥 ઓરિજિનલ PDF ડાઉનલોડ
        </a>
        <a href="${shalamitraUrl}" target="_blank" class="btn btn-reader">
          📖 શાળા મિત્ર રીડર
        </a>
        <button onclick="window.print()" class="btn btn-print">
          🖨️ Print
        </button>
      </div>
    </div>

    <div class="content-body">
      <!-- Section 0: Interactive Flipbook & Live Page Viewer -->
      <div class="section-card reader-box" style="padding: 14px; background: #f8fafc; border: 2px solid #3b82f6;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
          <div style="font-weight: 700; color: #1e3a8a; font-size: 15.5px;">
            📖 શાળા મિત્ર (Shala Mitra) / GSSTB અધિકૃત ઇ-બુક પેજ વાચક
          </div>
          <a href="${officialPdfUrl}" target="_blank" style="color: #ef4444; font-size: 13px; font-weight: 700; text-decoration: none;">
            📥 Download 60MB Full Book PDF ↗
          </a>
        </div>
        <div style="position: relative; width: 100%; height: 560px; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; background: #ffffff;">
          <iframe
            src="${shalamitraUrl}"
            style="width: 100%; height: 100%; border: none;"
            title="Official GSSTB Book Viewer"
            allow="fullscreen"
          ></iframe>
        </div>
        <div style="margin-top: 8px; font-size: 12px; color: #64748b; text-align: center;">
          💡 પાઠ્યપુસ્તકના પાના ફેરવવા માટે ઉપરના વ્યુઅરમાં સ્વાઇપ કરો અથવા ડાબી બાજુ આપેલ PDF ડાઉનલોડ બટન દબાવો.
        </div>
      </div>

      <!-- Section 1: Official Summary -->
      <div class="section-card">
        <div class="section-heading">📖 પ્રકરણ સારાંશ અને મુખ્ય સંકલ્પનાઓ</div>
        <p class="summary-text">${chap.summaryGujarati || chap.summary}</p>
      </div>

      <!-- Section 2: Concepts -->
      ${conceptsHtml ? `
      <div class="section-card">
        <div class="section-heading">💡 વિગતવાર અભ્યાસ મુદ્દાઓ</div>
        ${conceptsHtml}
      </div>` : ''}

      <!-- Section 3: Key Formulas / Rules -->
      ${formulasHtml ? `
      <div class="section-card" style="background: #eff6ff; border-color: #bfdbfe;">
        <div class="section-heading" style="color: #1d4ed8; border-color: #93c5fd;">⚡ અગત્યના નિયમો અને સૂત્રો</div>
        <ul style="list-style: none;">
          ${formulasHtml}
        </ul>
      </div>` : ''}

      <!-- Section 4: Textbook Exercises / Swadhyay -->
      ${exercisesHtml ? `
      <div class="section-card">
        <div class="section-heading">📝 પાઠ્યપુસ્તક સ્વાધ્યાય પ્રશ્નોત્તરી (મોડેલ જવાબો)</div>
        ${exercisesHtml}
      </div>` : ''}
    </div>

    <div class="footer-bar">
      MindSprint • ગુજરાત રાજ્ય શિક્ષણ બોર્ડ માન્ય અભ્યાસક્રમ • શાળા મિત્ર E-Textbook Vault
    </div>
  </div>
</body>
</html>`;
}

function generateChapterPdfHtml(gradeKey, gradeData, subj, chap) {
  const officialFullBookPdf = subj.officialTextbookPdf || 'https://gujarat-education.gov.in/textbook/textbook.htm';
  const shalamitraUrl = subj.shalamitraUrl || 'https://shalamitra.in/std/' + gradeKey;

  const formulasHtml = (chap.keyFormulasGujarati || []).map((f) => `
    <li style="margin-bottom: 8px; font-size: 15px; color: #1e293b;">
      <span style="color: #2563eb; font-weight: bold; margin-right: 6px;">⚡</span>${f}
    </li>
  `).join('');

  const exercisesHtml = (chap.exerciseSolutions || []).map((ex, idx) => `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px; page-break-inside: avoid;">
      <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-bottom: 6px;">
        <span style="color: #2563eb;">પ્રશ્ન ${idx + 1}:</span> ${ex.questionGujarati || ex.question}
      </div>
      <div style="color: #334155; font-size: 14.5px; line-height: 1.6; background: #ffffff; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #10b981;">
        <strong style="color: #10b981;">જવાબ:</strong> ${ex.answerGujarati || ex.answer}
      </div>
    </div>
  `).join('');

  const conceptsHtml = (chap.concepts || []).map((c) => `
    <div style="margin-bottom: 16px; page-break-inside: avoid;">
      <h3 style="color: #1e3a8a; font-size: 16.5px; margin-bottom: 6px;">🔹 ${c.headingGujarati || c.heading}</h3>
      <p style="color: #334155; line-height: 1.7; font-size: 15px;">${c.explanationGujarati || c.explanation}</p>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>પ્રકરણ ${chap.chapterNumber}: ${chap.titleGujarati || chap.title} - ધોરણ ${gradeKey} ${subj.nameGujarati || subj.name} (Chapter PDF)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Shruti", "Gujarati Sangam MN", sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      padding: 0 0 40px 0;
    }
    .top-floating-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .bar-info {
      font-size: 14px;
      font-weight: 600;
    }
    .bar-actions {
      display: flex;
      gap: 8px;
    }
    .bar-btn {
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .bar-btn-print { background: #2563eb; color: #ffffff; }
    .bar-btn-fullbook { background: #ef4444; color: #ffffff; }
    .bar-btn-reader { background: #334155; color: #ffffff; }

    .pdf-page-container {
      max-width: 860px;
      margin: 24px auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
      overflow: hidden;
    }
    .booklet-header {
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: #ffffff;
      padding: 24px 20px;
      text-align: center;
    }
    .emblem-pill {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .main-board-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .sub-meta {
      font-size: 14px;
      opacity: 0.95;
    }
    .chapter-hero-banner {
      background: #eff6ff;
      border-bottom: 2px solid #bfdbfe;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .chap-badge {
      background: #2563eb;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 800;
    }
    .chap-heading {
      font-size: 21px;
      font-weight: 800;
      color: #1e3a8a;
      flex: 1;
    }
    .content-area {
      padding: 24px 20px;
    }
    .part-box {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 18px;
      margin-bottom: 22px;
      background: #ffffff;
    }
    .part-title {
      font-size: 17px;
      font-weight: 800;
      color: #1e3a8a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .summary-para {
      font-size: 15.5px;
      color: #334155;
      line-height: 1.75;
    }
    .booklet-footer {
      background: #f1f5f9;
      color: #64748b;
      padding: 14px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #e2e8f0;
    }

    @page {
      size: A4;
      margin: 12mm;
    }
    @media print {
      body { background: #ffffff !important; padding: 0 !important; }
      .no-print { display: none !important; }
      .pdf-page-container {
        margin: 0 !important;
        max-width: 100% !important;
        box-shadow: none !important;
        border: none !important;
      }
      .part-box {
        page-break-inside: avoid;
        border: 1px solid #cbd5e1;
      }
    }
  </style>
</head>
<body>
  <!-- Floating Top Bar (Excluded from Print/PDF Export) -->
  <div class="top-floating-bar no-print">
    <div class="bar-info">
      📄 ધોરણ ${gradeKey} ${subj.nameGujarati} • પ્રકરણ ${chap.chapterNumber}: ${chap.titleGujarati || chap.title} (પ્રકરણ PDF)
    </div>
    <div class="bar-actions">
      <button onclick="window.print()" class="bar-btn bar-btn-print">
        🖨️ PDF ડાઉનલોડ / પ્રિન્ટ કરો
      </button>
      <a href="${officialFullBookPdf}" target="_blank" class="bar-btn bar-btn-fullbook">
        📥 આખું પુસ્તક PDF (${subj.nameGujarati})
      </a>
      <a href="${shalamitraUrl}" target="_blank" class="bar-btn bar-btn-reader">
        📖 શાળા મિત્ર રીડર
      </a>
    </div>
  </div>

  <div class="pdf-page-container">
    <div class="booklet-header">
      <div class="emblem-pill">શાળા મિત્ર • GSEB / GCERT GUJARATI MEDIUM</div>
      <div class="main-board-title">ગુજરાત રાજ્ય શાળા પાઠ્યપુસ્તક મંડળ, ગાંધીનગર</div>
      <div class="sub-meta">ધોરણ ${gradeKey} : ${subj.textbookTitleGujarati || subj.nameGujarati} • અધિકૃત પ્રકરણ પાઠ્યપુસ્તક બુકલેટ</div>
    </div>

    <div class="chapter-hero-banner">
      <div class="chap-badge">પ્રકરણ ${chap.chapterNumber}</div>
      <div class="chap-heading">${chap.titleGujarati || chap.title}</div>
      <div style="font-size: 13px; color: #475569; font-weight: 600;">
        ⏱️ અવધિ: ${chap.duration || '20m'} | 📝 કુલ પ્રશ્નો: ${chap.questionCount || 15}
      </div>
    </div>

    <div class="content-area">
      <!-- Part 1: Chapter Introduction & Overview -->
      <div class="part-box">
        <div class="part-title">📖 ૧. પ્રકરણ સારાંશ અને વિષય પ્રવેશ (Chapter Overview)</div>
        <p class="summary-para">${chap.summaryGujarati || chap.summary}</p>
      </div>

      <!-- Part 2: Core Concepts & Detailed Theory -->
      ${conceptsHtml ? `
      <div class="part-box">
        <div class="part-title">💡 ૨. મુખ્ય સંકલ્પનાઓ અને વિગતવાર અભ્યાસ મુદ્દાઓ (Core Concepts)</div>
        ${conceptsHtml}
      </div>` : ''}

      <!-- Part 3: Key Formulas / Properties -->
      ${formulasHtml ? `
      <div class="part-box" style="background: #f0fdf4; border-color: #bbf7d0;">
        <div class="part-title" style="color: #15803d; border-color: #86efac;">⚡ ૩. અગત્યના નિયમો અને ગાણિતિક સૂત્રો (Key Formulas & Rules)</div>
        <ul style="list-style: none;">
          ${formulasHtml}
        </ul>
      </div>` : ''}

      <!-- Part 4: Textbook Exercises / Swadhyay -->
      ${exercisesHtml ? `
      <div class="part-box">
        <div class="part-title">📝 ૪. પાઠ્યપુસ્તક સ્વાધ્યાય પ્રશ્નોત્તરી - મોડેલ જવાબો (Exercises & Solutions)</div>
        ${exercisesHtml}
      </div>` : ''}

      <!-- Part 5: Chapter Summary / Revision -->
      <div class="part-box" style="background: #eff6ff; border-color: #bfdbfe;">
        <div class="part-title" style="color: #1d4ed8; border-color: #93c5fd;">🎯 ૫. આપણે શું શીખ્યા? / પરીક્ષાલક્ષી રિવિઝન (Key Takeaways)</div>
        <p class="summary-para">
          આ પ્રકરણમાં શીખેલા તમામ મુખ્ય મુદ્દાઓનું પુનરાવર્તન કરો, સ્વાધ્યાયના દાખલા પોતાની જાતે ગણો અને MindSprint ક્વિઝ દ્વારા તમારા જ્ઞાનની ચકાસણી કરો.
        </p>
      </div>
    </div>

    <div class="booklet-footer">
      MindSprint Learning App • ગુજરાત રાજ્ય શિક્ષણ બોર્ડ માન્ય અભ્યાસક્રમ • શાળા મિત્ર Chapter-Wise Study Edition
    </div>
  </div>
</body>
</html>`;
}

module.exports = router;
