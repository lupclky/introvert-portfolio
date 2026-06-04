# Apps Script hiện tại

Hãy copy toàn bộ nội dung trong `apps-script-code.js` sang Google Apps Script rồi Deploy phiên bản mới.

Các sheet đang được dùng:

- `Articles`: bài viết và future letter.
- `Moods`: mood/note từ sanctuary.
- `Messages`: lời nhắn gửi tới introvert.
- `Journals`: trang nhật ký riêng `journal.html`.

Endpoint mới cho trang nhật ký:

- `POST { type: "journal", auth, date, title, mood, tags, content, createdAt, displayDate }`
- `GET ?type=journals`

Các trường `title`, `mood`, `tags`, `content` của journal được mã hóa ở frontend bằng passcode trước khi gửi lên Sheet.
