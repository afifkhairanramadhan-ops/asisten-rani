/**
 * Robust cross-browser and iframe-safe document printing and PDF export helper
 */

export interface PrintDocumentParams {
  title: string;
  htmlContent: string;
  styles?: string;
}

/**
 * Generates a full standalone HTML document with complete print styling
 */
export function buildPrintableHtml(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: #ffffff;
      color: #111827;
      line-height: 1.5;
      font-size: 13px;
      padding: 24px;
    }
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    @media print {
      body {
        padding: 0 !important;
        background: transparent !important;
        color: #000000 !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-after: always;
      }
    }
    /* Action Bar for New Tab view */
    .print-toolbar {
      background: #064e3b;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .print-btn {
      background: #facc15;
      color: #713f12;
      font-weight: 700;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.15);
      transition: background 0.2s;
    }
    .print-btn:hover {
      background: #fde047;
    }
    .evident-sheet {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      padding: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
    }
    th, td {
      border: 1px solid #94a3b8;
      padding: 8px 10px;
      text-align: left;
      font-size: 12px;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
    }
    /* Signature Block Styling: Side-by-side, Never Stacked, Clean Empty Signature Space */
    table.signature-table, table.signature-table tr, table.signature-table td {
      border: none !important;
      background: transparent !important;
    }
    table.signature-table {
      width: 100% !important;
      margin-top: 36px !important;
      border-collapse: collapse !important;
      page-break-inside: avoid !important;
    }
    table.signature-table td {
      width: 50% !important;
      text-align: center !important;
      vertical-align: top !important;
      padding: 0 16px !important;
      border: none !important;
    }
    .signature-space {
      height: 85px !important;
      min-height: 85px !important;
      display: block !important;
      width: 100% !important;
    }
    /* Photo Geotag Grid & Cards Styling */
    .photo-evident-grid {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 14px !important;
      margin-top: 10px !important;
    }
    .photo-evident-card {
      flex: 1 1 calc(50% - 14px) !important;
      max-width: calc(50% - 7px) !important;
      box-sizing: border-box !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 8px !important;
      padding: 8px !important;
      background: #f8fafc !important;
      page-break-inside: avoid !important;
    }
    .photo-image-wrapper {
      position: relative !important;
      width: 100% !important;
      height: 200px !important;
      overflow: hidden !important;
      border-radius: 6px !important;
      background: #0f172a !important;
    }
    .photo-image-wrapper img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block !important;
    }
    .photo-geotag-banner {
      position: absolute !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(15, 23, 42, 0.92) !important;
      color: #ffffff !important;
      padding: 6px 8px !important;
      font-size: 9px !important;
      line-height: 1.3 !important;
      box-sizing: border-box !important;
    }
    .photo-caption-box {
      margin-top: 6px !important;
      font-size: 11px !important;
      line-height: 1.4 !important;
      color: #1e293b !important;
    }
    .break-inside-avoid {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .uppercase { text-transform: uppercase; }
    .underline { text-decoration: underline; }
    .italic { font-style: italic; }
  </style>
</head>
<body>
  <div class="print-toolbar no-print">
    <div>
      <strong style="font-size: 15px; display: block;">Dokumen Evident Resmi KUA Kecamatan Nan Sabaris</strong>
      <span style="font-size: 11px; opacity: 0.85;">SE Sekjen Kemenag No. SE 29 Tahun 2025 • Penyuluh: Rani Humaira, S.H.I.</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
      <button class="print-btn" style="background: #ffffff; color: #1e293b;" onclick="window.close()">Tutup</button>
    </div>
  </div>

  <div class="evident-sheet">
    ${bodyHtml}
  </div>

  <script>
    // Automatically trigger print if opened in standalone popup
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.warn('Auto print trigger error:', e);
        }
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * Universal print handler that works whether inside an iframe or regular window
 */
export function executePrintDocument(title: string, bodyHtml: string): boolean {
  const fullHtml = buildPrintableHtml(title, bodyHtml);

  // Strategy 1: Open dedicated print window/tab (Cleanest for PDF export)
  try {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(fullHtml);
      printWindow.document.close();
      return true;
    }
  } catch (e) {
    console.warn("Popup blocked or disallowed in sandbox, falling back to iframe print...", e);
  }

  // Strategy 2: Hidden iframe printing (Works inside sandboxes where popups are blocked)
  try {
    let iframe = document.getElementById("hidden-print-iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "hidden-print-iframe";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc && iframe.contentWindow) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (err) {
          console.warn("Iframe print error:", err);
          window.print();
        }
      }, 600);
      return true;
    }
  } catch (err) {
    console.warn("Iframe print fallback error:", err);
  }

  // Strategy 3: Direct window.print()
  try {
    window.print();
    return true;
  } catch (e) {
    console.error("Direct print failed:", e);
    return false;
  }
}

/**
 * Downloads document as a clean standalone HTML file that can be opened anywhere
 */
export function downloadPrintableHtml(title: string, bodyHtml: string, filename: string) {
  const fullHtml = buildPrintableHtml(title, bodyHtml);
  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
