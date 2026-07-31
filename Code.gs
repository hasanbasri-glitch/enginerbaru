/**
 * AREA HASAN — Sync Bridge (Google Apps Script Web App)
 * ------------------------------------------------------
 * Fungsi: membaca 3 Google Sheets (Sales, KPI, IKT) lewat 3 link BERBEDA
 * dan mengembalikan datanya sebagai JSON ke web dashboard.
 *
 * Karena Apps Script berjalan di server Google (bukan di browser),
 * ini otomatis menghindari masalah CORS yang muncul kalau fetch CSV
 * dilakukan langsung dari JavaScript browser.
 *
 * CARA DEPLOY:
 * 1. Buka https://script.google.com/create (atau Extensions > Apps Script
 *    dari salah satu spreadsheet Anda).
 * 2. Hapus isi default, tempel seluruh isi file ini.
 * 3. Klik Deploy > New deployment.
 * 4. Pilih tipe: "Web app".
 * 5. Execute as: "Me". Who has access: "Anyone".
 * 6. Klik Deploy, izinkan akses (Authorize), lalu copy "Web app URL".
 * 7. Tempel URL itu ke kolom "Link Web App Apps Script" di dashboard.
 *
 * PENTING: akun Google yang deploy script ini HARUS punya akses baca
 * ke ketiga spreadsheet (baik sebagai pemilik, atau sheet di-share ke
 * akun tsb / "Anyone with the link").
 */

function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const result = { ok: true, data: {}, syncedAt: new Date().toISOString() };

  try {
    if (p.salesUrl) result.data.sales = readSheetAsObjects(p.salesUrl);
    if (p.kpiUrl)   result.data.kpi   = readSheetAsObjects(p.kpiUrl);
    if (p.iktUrl)   result.data.ikt   = readSheetAsObjects(p.iktUrl);
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }

  return jsonOutput(result);
}

/**
 * Membuka sheet dari URL (mendukung ?gid=... untuk memilih tab tertentu),
 * lalu mengubah baris data menjadi array of object {header: value}.
 */
function readSheetAsObjects(sheetUrl) {
  const ss = SpreadsheetApp.openByUrl(sheetUrl);
  const gidMatch = sheetUrl.match(/gid=([0-9]+)/);
  let sheet;
  if (gidMatch) {
    const gid = Number(gidMatch[1]);
    sheet = ss.getSheets().filter(function (s) { return s.getSheetId() === gid; })[0] || ss.getSheets()[0];
  } else {
    sheet = ss.getSheets()[0];
  }

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(function (h) { return String(h).trim(); });
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = {};
    let hasValue = false;
    headers.forEach(function (h, idx) {
      const v = values[i][idx];
      row[h] = v;
      if (v !== "" && v !== null && v !== undefined) hasValue = true;
    });
    if (hasValue) rows.push(row);
  }
  return rows;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
