// ── Google Apps Script: Pie Lab Consolidated Feedback ──
//
// This script does three things:
//   1. Receives website (pielab.app) form submissions via doPost
//   2. Pulls app feedback from the Google Form response sheet every 3 days
//   3. Generates a summary report for review
//
// SETUP:
//   1. Create a new Google Sheet (this is your "Consolidated Feedback" sheet)
//   2. Extensions > Apps Script > paste this code
//   3. Set APP_FORM_SHEET_ID below (the spreadsheet ID linked to the Google Form)
//   4. Run setupTrigger() once from the editor to create the 3-day schedule
//   5. Deploy as web app (Execute as: Me, Access: Anyone)
//   6. Copy the web app URL into contact.html SCRIPT_URL

// ── CONFIG ──

// Spreadsheet ID of the Google Form responses sheet (from the app)
// Find this in the sheet URL: https://docs.google.com/spreadsheets/d/{THIS_PART}/edit
var APP_FORM_SHEET_ID = '1pO3KDL-sks_dte_X4hghUZ-J_3FWWoQrDu-XZY0JMPg';

// Sheet names in THIS spreadsheet
var WEBSITE_SHEET  = 'Website Submissions';
var APP_SHEET      = 'App Submissions';
var COMBINED_SHEET = 'All Feedback';
var REPORT_SHEET   = 'Report';

// ── CONSOLIDATED COLUMNS ──
// Unified schema across both sources

var CONSOLIDATED_HEADERS = [
  'Date',
  'Source',
  'Feedback Type',
  'Subject',
  'Message',
  'Email',
  'User Name',
  'City',
  'Phone Type',
  'OS Version',
  'App Version',
  'Device Model',
  'Screen Size',
  'Theme',
  'User Agent',
  'Time on Page'
];

// ── WEBSITE COLUMNS (received via doPost) ──

var WEBSITE_COLUMNS = [
  { header: 'Timestamp',      key: 'timestamp' },
  { header: 'Feedback Type',  key: 'feedbackType' },
  { header: 'Subject',        key: 'subject' },
  { header: 'Details',        key: 'details' },
  { header: 'Email',          key: 'email' },
  { header: 'Phone Type',     key: 'deviceType' },
  { header: 'OS Version',     key: 'osVersion' },
  { header: 'App Version',    key: 'appVersion' },
  { header: 'Device Model',   key: 'deviceModel' },
  { header: 'User Agent',     key: 'userAgent' },
  { header: 'Screen Size',    key: 'screenSize' },
  { header: 'Time on Page',   key: 'timeOnPage' }
];

// ═══════════════════════════════════════════
//  1. WEBSITE FORM HANDLER
// ═══════════════════════════════════════════

function doPost(e) {
  var sheet = getOrCreateSheet(WEBSITE_SHEET, WEBSITE_COLUMNS.map(function(c) { return c.header; }));
  var params = e.parameter;

  var row = WEBSITE_COLUMNS.map(function(col) {
    return params[col.key] || '';
  });

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════
//  2. CONSOLIDATION (runs every 3 days)
// ═══════════════════════════════════════════

function consolidateAndReport() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Pull app submissions from Google Form sheet ──
  importAppSubmissions(ss);

  // ── Build consolidated view ──
  buildConsolidatedSheet(ss);

  // ── Generate report ──
  generateReport(ss);
}

function importAppSubmissions(ss) {
  var source;
  try {
    source = SpreadsheetApp.openById(APP_FORM_SHEET_ID);
  } catch (err) {
    Logger.log('Could not open app form sheet: ' + err.message);
    return;
  }

  var sourceSheet = source.getSheets()[0]; // Form responses are on the first sheet
  var data = sourceSheet.getDataRange().getValues();
  if (data.length < 2) return; // Header only, no submissions

  var destSheet = getOrCreateSheet(APP_SHEET, [
    'Timestamp', 'Feedback Type', 'Message', 'Email',
    'Display Name', 'City', 'Theme', 'Screen Resolution'
  ]);

  // Find what we already imported (compare row count minus header)
  var existingRows = Math.max(0, destSheet.getLastRow() - 1);
  var newRows = data.slice(1 + existingRows); // Skip header + already-imported rows

  if (newRows.length === 0) return;

  // Google Form column order matches the entry IDs:
  // [Timestamp, Feedback Type, Message, Email, Display Name, City, Theme, Screen Resolution]
  destSheet.getRange(existingRows + 2, 1, newRows.length, newRows[0].length).setValues(newRows);
}

function buildConsolidatedSheet(ss) {
  var combined = getOrCreateSheet(COMBINED_SHEET, CONSOLIDATED_HEADERS);

  // Clear existing data (keep header)
  if (combined.getLastRow() > 1) {
    combined.getRange(2, 1, combined.getLastRow() - 1, CONSOLIDATED_HEADERS.length).clearContent();
  }

  var allRows = [];

  // ── Map website submissions ──
  var webSheet = ss.getSheetByName(WEBSITE_SHEET);
  if (webSheet && webSheet.getLastRow() > 1) {
    var webData = webSheet.getRange(2, 1, webSheet.getLastRow() - 1, WEBSITE_COLUMNS.length).getValues();
    webData.forEach(function(r) {
      allRows.push([
        r[0],          // Date (Timestamp)
        'Website',     // Source
        r[1],          // Feedback Type
        r[2],          // Subject
        r[3],          // Details → Message
        r[4],          // Email
        '',            // User Name (website doesn't collect)
        '',            // City (website doesn't collect)
        r[5],          // Phone Type
        r[6],          // OS Version
        r[7],          // App Version
        r[8],          // Device Model
        r[10],         // Screen Size
        '',            // Theme (website doesn't collect)
        r[9],          // User Agent
        r[11]          // Time on Page
      ]);
    });
  }

  // ── Map app submissions ──
  var appSheet = ss.getSheetByName(APP_SHEET);
  if (appSheet && appSheet.getLastRow() > 1) {
    var appData = appSheet.getRange(2, 1, appSheet.getLastRow() - 1, 8).getValues();
    appData.forEach(function(r) {
      allRows.push([
        r[0],          // Date (Timestamp)
        'App',         // Source
        r[1],          // Feedback Type
        '',            // Subject (app doesn't have this)
        r[2],          // Message
        r[3],          // Email
        r[4],          // Display Name → User Name
        r[5],          // City
        '',            // Phone Type (app doesn't collect)
        '',            // OS Version (app doesn't collect)
        '',            // App Version (app doesn't collect)
        '',            // Device Model (app doesn't collect)
        r[7],          // Screen Resolution → Screen Size
        r[6],          // Theme
        '',            // User Agent (app doesn't collect)
        ''             // Time on Page (app doesn't collect)
      ]);
    });
  }

  if (allRows.length === 0) return;

  // Sort by date descending (newest first)
  allRows.sort(function(a, b) {
    return new Date(b[0]) - new Date(a[0]);
  });

  combined.getRange(2, 1, allRows.length, CONSOLIDATED_HEADERS.length).setValues(allRows);
}

// ═══════════════════════════════════════════
//  3. REPORT GENERATION
// ═══════════════════════════════════════════

function generateReport(ss) {
  var report = getOrCreateSheet(REPORT_SHEET, []);
  report.clear();

  var combined = ss.getSheetByName(COMBINED_SHEET);
  if (!combined || combined.getLastRow() < 2) {
    report.getRange(1, 1).setValue('No feedback to report.');
    return;
  }

  var data = combined.getRange(2, 1, combined.getLastRow() - 1, CONSOLIDATED_HEADERS.length).getValues();

  // Filter to last 3 days
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 4);

  var recent = data.filter(function(r) {
    var d = new Date(r[0]);
    return d >= cutoff;
  });

  var total = recent.length;

  // Count by source
  var bySource = {};
  // Count by feedback type
  var byType = {};

  recent.forEach(function(r) {
    var source = r[1] || 'Unknown';
    var type = r[2] || 'Unknown';
    bySource[source] = (bySource[source] || 0) + 1;
    byType[type] = (byType[type] || 0) + 1;
  });

  // ── Write report ──
  var now = new Date();
  var rows = [];

  rows.push(['Pie Lab Feedback Report', '', '']);
  rows.push(['Generated', now.toISOString().split('T')[0], '']);
  rows.push(['Period', 'Last 3-4 days (since ' + cutoff.toISOString().split('T')[0] + ')', '']);
  rows.push(['Total Submissions', total, '']);
  rows.push(['', '', '']);

  rows.push(['BY SOURCE', 'Count', '% of Total']);
  Object.keys(bySource).forEach(function(key) {
    rows.push([key, bySource[key], total > 0 ? Math.round(bySource[key] / total * 100) + '%' : '0%']);
  });
  rows.push(['', '', '']);

  rows.push(['BY TYPE', 'Count', '% of Total']);
  Object.keys(byType).forEach(function(key) {
    rows.push([key, byType[key], total > 0 ? Math.round(byType[key] / total * 100) + '%' : '0%']);
  });
  rows.push(['', '', '']);

  rows.push(['RECENT SUBMISSIONS', '', '']);
  rows.push(['Date', 'Source', 'Type', 'Subject / Message', 'Email']);

  recent.forEach(function(r) {
    var summary = r[3] || r[4]; // Subject if available, otherwise Message
    if (summary && summary.length > 120) summary = summary.substring(0, 120) + '...';
    rows.push([
      r[0] ? new Date(r[0]).toISOString().split('T')[0] : '',
      r[1],
      r[2],
      summary,
      r[5]
    ]);
  });

  // Find max columns across all rows
  var maxCols = rows.reduce(function(max, r) { return Math.max(max, r.length); }, 0);

  // Pad rows to same length
  rows = rows.map(function(r) {
    while (r.length < maxCols) r.push('');
    return r;
  });

  report.getRange(1, 1, rows.length, maxCols).setValues(rows);

  // Style the report
  report.getRange(1, 1).setFontSize(16).setFontWeight('bold');
  report.getRange(2, 1, 3, 1).setFontWeight('bold');

  // Style section headers
  rows.forEach(function(r, i) {
    if (r[0] === 'BY SOURCE' || r[0] === 'BY TYPE' || r[0] === 'RECENT SUBMISSIONS') {
      report.getRange(i + 1, 1, 1, maxCols)
        .setFontWeight('bold')
        .setBackground('#f3ebe2')
        .setFontColor('#922b21');
    }
  });

  report.autoResizeColumns(1, maxCols);
}

// ═══════════════════════════════════════════
//  SETUP: Run this once from the script editor
// ═══════════════════════════════════════════

function setupTrigger() {
  // Remove existing triggers for this function
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(t) {
    if (t.getHandlerFunction() === 'consolidateAndReport') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Run consolidateAndReport every 3 days
  ScriptApp.newTrigger('consolidateAndReport')
    .timeBased()
    .everyDays(3)
    .atHour(8)
    .create();

  Logger.log('Trigger created: consolidateAndReport will run every 3 days at 8 AM.');
}

// ═══════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════

function getOrCreateSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers.length > 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#922b21')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
  }

  return sheet;
}
