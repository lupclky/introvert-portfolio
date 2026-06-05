const VIETNAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

function getExpectedAuthHash() {
  return PropertiesService.getScriptProperties().getProperty("EXPECTED_AUTH_HASH") || "";
}

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

  const expectedAuthHash = getExpectedAuthHash();
  if (expectedAuthHash && data.auth !== expectedAuthHash) {
    return json({ success: false, error: "Unauthorized" });
  }

  if (type === "journal") {
    const createdAt = data.createdAt || nowIso();
    getSheet("Journals").appendRow([
      data.date || createdAt,
      data.title || "",
      data.mood || "",
      data.tags || "",
      data.content || "",
      createdAt,
      data.displayDate || formatVietnamDateTime(createdAt)
    ]);
    return json({ success: true });
  }

  if (type === "mood") {
    getSheet("Moods").appendRow([data.date || formatVietnamDateTime(nowIso()), data.emoji, data.note]);
    return json({ success: true });
  }

  if (type === "pineapple") {
    let mediaUrl = data.mediaUrl || "";

    // Xử lý upload ảnh nếu có imageBlob gửi lên
    if (data.imageBlob) {
      try {
        let base64Data = data.imageBlob;
        if (base64Data.indexOf(",") > -1) {
          base64Data = base64Data.split(",")[1];
        }
        const decoded = Utilities.base64Decode(base64Data);
        const mimeType = data.mimeType || "image/png";
        const filename = data.imageName || ("pineapple_" + new Date().getTime() + ".png");
        const blob = Utilities.newBlob(decoded, mimeType, filename);
        
        // Tạo file trên Drive
        const file = DriveApp.createFile(blob);
        // Đặt quyền xem công khai
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        mediaUrl = file.getUrl();
      } catch (err) {
        return json({ success: false, error: "Failed to upload image to Drive: " + err.toString() });
      }
    }

    const createdAt = data.createdAt || nowIso();
    getSheet("Pineapple").appendRow([
      data.category || "video",
      data.title || "",
      data.content || "",
      mediaUrl,
      data.date || createdAt,
      createdAt,
      data.displayDate || formatVietnamDateTime(createdAt)
    ]);
    return json({ success: true, mediaUrl: mediaUrl });
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

  if (type === "youtube_feed") {
    try {
      const channelId = "UCwX57vE21d4j2lq2_z5Nf7Q";
      const feedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId;
      const response = UrlFetchApp.fetch(feedUrl);
      const xml = response.getContentText();
      
      const document = XmlService.parse(xml);
      const root = document.getRootElement();
      const atom = XmlService.getNamespace("http://www.w3.org/2005/Atom");
      const media = XmlService.getNamespace("http://search.yahoo.com/mrss/");
      const yt = XmlService.getNamespace("http://www.youtube.com/xml/schemas/2015");
      
      const entries = root.getChildren("entry", atom);
      const videos = [];
      
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const videoId = entry.getChildText("videoId", yt);
        const title = entry.getChildText("title", atom);
        const published = entry.getChildText("published", atom);
        const group = entry.getChild("group", media);
        let description = "";
        if (group) {
          description = group.getChildText("description", media) || "";
        }
        
        videos.push({
          category: (title.toLowerCase().includes("#shorts") || description.toLowerCase().includes("#shorts")) ? "short" : "video",
          title: title,
          content: description.slice(0, 200) + (description.length > 200 ? "..." : ""),
          mediaUrl: "https://www.youtube.com/watch?v=" + videoId,
          date: published,
          createdAt: published,
          displayDate: formatVietnamDateTime(published)
        });
      }
      return json(videos);
    } catch (err) {
      return json({ error: err.toString() });
    }
  }

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

  if (type === "journals") {
    const rows = getSheet("Journals").getDataRange().getValues();
    return json(rows
      .filter(row => row[0] && row[4])
      .map(row => ({
        date: row[0],
        title: row[1],
        mood: row[2],
        tags: row[3],
        content: row[4],
        createdAt: row[5],
        displayDate: row[6] || formatVietnamDateTime(row[5] || row[0])
      })));
  }

  if (type === "pineapple") {
    const rows = getSheet("Pineapple").getDataRange().getValues();
    if (rows.length <= 1 && (rows.length === 0 || !rows[0][0])) {
      return json([]);
    }
    const startIndex = (rows[0][0] === "category" || rows[0][0] === "Category") ? 1 : 0;
    const items = [];
    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i];
      if (!row[0]) continue;
      items.push({
        category: row[0],
        title: row[1] || "",
        content: row[2] || "",
        mediaUrl: row[3] || "",
        date: row[4] || "",
        createdAt: row[5] || "",
        displayDate: row[6] || (row[5] ? formatVietnamDateTime(row[5]) : "")
      });
    }
    return json(items);
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
