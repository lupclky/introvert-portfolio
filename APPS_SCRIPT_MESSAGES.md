# Apps Script cho loi nhan passcode

Chuc nang "gui loi nhan toi introvert" can Apps Script ho tro `type: "message"` va endpoint `?type=messages`.
Loi nhan duoc luu o sheet `Messages` va chi hien thi tren web sau khi introvert nhap dung mat ma de mo khoa trang.

```javascript
const EXPECTED_AUTH_HASH = "a05d61d639d1d7c316a88cc8d2b928ac80c66aea3fcbccb7ef19e632cd4f212f";

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function output(e, data) {
  const body = JSON.stringify(data);
  const callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + body + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(body)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const type = data.type || "article";

  if (type === "message") {
    getSheet("Messages").appendRow([
      data.date || "",
      data.message || "",
      data.createdAt || new Date().toISOString(),
      data.source || "passcode"
    ]);
    return output(e, { success: true });
  }

  if (EXPECTED_AUTH_HASH && data.auth !== EXPECTED_AUTH_HASH) {
    return output(e, { success: false, error: "Unauthorized" });
  }

  if (type === "mood") {
    getSheet("Moods").appendRow([data.date, data.emoji, data.note]);
    return output(e, { success: true });
  }

  getSheet("Articles").appendRow([data.date, data.title, data.preview, data.content]);
  return output(e, { success: true });
}

function doGet(e) {
  const type = e.parameter.type || "articles";

  if (type === "messages") {
    const rows = getSheet("Messages").getDataRange().getValues();
    return output(e, rows.map(row => ({
      date: row[0],
      message: row[1],
      createdAt: row[2],
      source: row[3]
    })));
  }

  if (type === "moods") {
    const rows = getSheet("Moods").getDataRange().getValues();
    return output(e, rows.map(row => ({
      date: row[0],
      emoji: row[1],
      note: row[2]
    })));
  }

  const rows = getSheet("Articles").getDataRange().getValues();
  return output(e, rows.map(row => ({
    date: row[0],
    title: row[1],
    preview: row[2],
    content: row[3]
  })));
}
```
