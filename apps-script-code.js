const EXPECTED_AUTH_HASH = "a05d61d639d1d7c316a88cc8d2b928ac80c66aea3fcbccb7ef19e632cd4f212f";
const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function nowIso() {
  return new Date().toISOString();
}

function formatVietnamDateTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return String(value || "");
  return Utilities.formatDate(date, VIETNAM_TIME_ZONE, "dd/MM/yyyy HH:mm 'GMT+7'");
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const type = data.type || "article";

  if (type === "message") {
    getSheet("Messages").appendRow([
      data.date || nowIso(),
      data.message || "",
      data.createdAt || nowIso(),
      data.source || "passcode",
      data.displayDate || formatVietnamDateTime(data.createdAt || data.date)
    ]);
    return json({ success: true });
  }

  if (EXPECTED_AUTH_HASH && data.auth !== EXPECTED_AUTH_HASH) {
    return json({ success: false, error: "Unauthorized" });
  }

  if (type === "mood") {
    getSheet("Moods").appendRow([data.date || formatVietnamDateTime(nowIso()), data.emoji, data.note]);
    return json({ success: true });
  }

  const createdAt = data.date || nowIso();
  getSheet("Articles").appendRow([
    createdAt,
    data.title,
    data.preview,
    data.content,
    data.displayDate || formatVietnamDateTime(createdAt)
  ]);
  return json({ success: true });
}

function doGet(e) {
  const type = e.parameter.type || "articles";

  if (type === "messages") {
    const rows = getSheet("Messages").getDataRange().getValues();
    return json(rows.map(row => ({
      date: row[0],
      message: row[1],
      createdAt: row[2],
      source: row[3],
      displayDate: row[4] || formatVietnamDateTime(row[2] || row[0])
    })));
  }

  if (type === "moods") {
    const rows = getSheet("Moods").getDataRange().getValues();
    return json(rows
      .filter(row => row[0] && row[1] && row[2])
      .map(row => ({
        date: row[0],
        emoji: row[1],
        note: row[2]
      })));
  }

  const rows = getSheet("Articles").getDataRange().getValues();
  return json(rows
    .filter(row => row[0] && row[1] && row[2] && row[3])
    .map(row => ({
      date: row[0],
      title: row[1],
      preview: row[2],
      content: row[3],
      displayDate: row[4] || formatVietnamDateTime(row[0])
    })));
}
