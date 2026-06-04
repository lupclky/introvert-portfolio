# Hướng Dẫn Sử Dụng & Deploy Website Introvert Portfolio

Trang web giới thiệu bản thân phong cách tối giản, trầm lắng, được thiết kế riêng theo triết lý "introvert". Sử dụng mã nguồn HTML/CSS/JS thuần, tối ưu hóa tốc độ tải trang, giao diện tương thích tốt trên di động và các thiết bị màn hình lớn.

---

## 🎨 Thông Số Thiết Kế
*   **Font chữ:** `EB Garamond` (Tiêu đề cổ điển, trầm ấm) & `Lora` (Thân bài mềm mại, dễ đọc)
*   **Tone màu (Giấy sách cũ):**
    *   Nền chính: `#FAF8F5` (Trắng ngà ấm)
    *   Chữ chính: `#2C2A27` (Đen nâu mực cổ)
    *   Chữ phụ: `#7A756D` (Xám ấm)
    *   Accent: `#8B7355` (Nâu đồng nhạt)

---

## 🔒 Hướng Dẫn Quản Lý & Bảo Mật Bài Viết Tuyệt Đối (Không Lộ Mã Nguồn)
Để đảm bảo nội dung không bị lộ khi người dùng xem mã nguồn trang web (**View Source**), các bài viết của bạn sẽ được **mã hóa đầu-cuối bằng thuật toán AES-256-GCM**. Mật khẩu **không được lưu trong code**, người dùng bắt buộc gõ đúng mật mã mới giải mã dữ liệu bài viết thành công.

Bạn có thể lựa chọn 1 trong 2 phương án quản lý bài viết dưới đây tùy thuộc vào sự tiện lợi bạn mong muốn:

---

### PHƯƠNG ÁN A: Viết bài trực tiếp từ trang web và lưu vào Google Sheets (Tự Động & Tiện Lợi)
Phương án này cho phép bạn mở trang [write.html](file:///d:/Fortfolio/write.html) ngay trên website để viết và đăng bài. Dữ liệu sẽ tự động mã hóa trong trình duyệt và đẩy lên lưu trữ tại Google Sheets thông qua một API trung gian miễn phí của Google (Google Apps Script).

#### Bước 1: Chuẩn bị Google Sheet
1.  Truy cập [Google Sheets](https://sheets.google.com) và tạo một bảng tính trống mới.
2.  Không cần định dạng gì cả, công cụ sẽ tự viết vào các hàng của trang tính.

#### Bước 2: Thiết lập Google Apps Script làm API Backend
1.  Tại trang Google Sheets vừa tạo, chọn **Mở rộng (Extensions)** -> **Apps Script**.
2.  Xóa toàn bộ mã mặc định và dán đoạn mã sau vào:
    ```javascript
    // Lưu mã hash trong Script Properties với key EXPECTED_AUTH_HASH.
    // Không hardcode mật mã hoặc hash trực tiếp vào file public.
    const EXPECTED_AUTH_HASH = PropertiesService.getScriptProperties().getProperty("EXPECTED_AUTH_HASH") || "";

    function doPost(e) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data = JSON.parse(e.postData.contents);
      
      // Xác thực mã hash
      if (EXPECTED_AUTH_HASH && data.auth !== EXPECTED_AUTH_HASH) {
        return ContentService.createTextOutput(JSON.stringify({success: false, error: "Unauthorized"}))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      sheet.appendRow([data.date, data.title, data.preview, data.content]);
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    function doGet(e) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const rows = sheet.getDataRange().getValues();
      const articles = [];
      
      for (let i = 0; i < rows.length; i++) {
        articles.push({
          date: rows[i][0],
          title: rows[i][1],
          preview: rows[i][2],
          content: rows[i][3]
        });
      }
      return ContentService.createTextOutput(JSON.stringify(articles))
        .setMimeType(ContentService.MimeType.JSON);
    }
    ```
3.  Bấm vào biểu tượng Lưu (Save).
4.  Nhấp vào nút **Triển khai (Deploy)** ở góc trên bên phải -> Chọn **Triển khai mới (New deployment)**.
5.  Tại cấu hình:
    *   **Loại triển khai (Type):** Nhấp chọn bánh răng -> **Ứng dụng web (Web app)**.
    *   **Mô tả:** Nhập mô tả bất kỳ.
    *   **Thực thi dưới danh nghĩa (Execute as):** Chọn **Tôi (Me / email của bạn)**.
    *   **Ai có quyền truy cập (Who has access):** Chọn **Mọi người (Anyone)** (Bắt buộc để website của bạn có thể gọi API này).
6.  Nhấp **Triển khai (Deploy)**. Nếu Google yêu cầu cấp quyền truy cập, hãy làm theo các bước xác thực tài khoản của bạn.
7.  Copy đường dẫn **URL Ứng dụng web (Web app URL)** được tạo ra (có đuôi `/exec`).

#### Bước 3: Cấu hình URL vào Website
1.  Mở file [script.js](file:///d:/Fortfolio/script.js) và dán URL vào biến `GOOGLE_APPS_SCRIPT_URL`:
    ```javascript
    const GOOGLE_APPS_SCRIPT_URL = "DÁN_URL_WEB_APP_CỦA_BẠN_VÀO_ĐÂY";
    ```
2.  Mở file [write.html](file:///d:/Fortfolio/write.html) và dán URL đó vào biến tương ứng ở dòng 127:
    ```javascript
    const GOOGLE_APPS_SCRIPT_URL = "DÁN_URL_WEB_APP_CỦA_BẠN_VÀO_ĐÂY";
    ```
3.  Lưu cả hai file.

*Cách hoạt động:* Giờ đây bạn chỉ cần mở file [write.html](file:///d:/Fortfolio/write.html) trên trình duyệt, nhập mật mã của bạn, nhập nội dung bài viết và nhấn **Đăng bài viết**. Bài viết sẽ tự động mã hóa và lưu trữ trực tiếp vào Google Sheet của bạn! Khi truy cập trang chủ, website sẽ gọi API để giải mã bài viết lên màn hình cực kỳ mượt mà.

---

### PHƯƠNG ÁN B: Quản lý bài viết ngoại tuyến (Không cần Google Sheets)
Nếu bạn không muốn thiết lập Google Sheets và muốn quản lý bài viết cục bộ bằng file tĩnh:

1.  Mở công cụ quản lý ngoại tuyến [encrypt.html](file:///d:/Fortfolio/encrypt.html) trên trình duyệt của bạn.
2.  Nhập mật khẩu riêng của bạn, soạn thảo các bài viết, nhấn **Thêm vào danh sách**.
3.  Nhấp **Xuất bản file writings.enc** để tải file đã mã hóa về máy.
4.  Chép đè file `writings.enc` vừa tải về vào thư mục dự án (ngang cấp với `index.html`).
5.  Hãy chắc chắn rằng trong [script.js](file:///d:/Fortfolio/script.js) biến `GOOGLE_APPS_SCRIPT_URL` đang để trống `""`. Website sẽ tự động tải file `writings.enc` nội bộ để giải mã.

---

## ⚙️ Cấu Hình Khóa Mật Khẩu (Bật/Tắt)
Mở file [script.js](file:///d:/Fortfolio/script.js) để chỉnh sửa cấu hình:
-   **Bật khóa mật mã**: Đặt `const USE_PASSWORD_LOCK = true;`. Người xem bắt buộc nhập mật khẩu mới được đọc bài.
-   **Mở khóa tự do**: Đặt `const USE_PASSWORD_LOCK = false;`.

---

## 🤫 Cách Truy Cập Trang Soạn Thảo (write.html) Từ Trang Chủ
Vì đây là website phong cách hướng nội và tối giản, trang web sẽ không có bất kỳ nút "Đăng bài" hay "Admin" nào lộ ra ngoài. Bạn có thể vào trang soạn thảo theo 3 cách ẩn sau:

1.  **Đường dẫn trực tiếp (URL)**:
    *   Khi chạy local: Gõ thêm `/write` hoặc `/write.html` vào thanh địa chỉ (ví dụ: `http://localhost:3000/write`).
    *   Khi đã deploy: Thêm `/write` vào sau tên miền của bạn (ví dụ: `https://tenmien.com/write`).
2.  **Mật mã bàn phím (Easter Egg)**:
    *   Tại bất cứ vị trí nào trên trang chủ, bạn chỉ cần gõ liên tiếp cụm từ **`write`** (gõ thường bằng tiếng Anh, không dấu) từ bàn phím. Hệ thống sẽ tự động nhận diện và chuyển hướng bạn đến trang viết bài.
3.  **Liên kết ẩn ở chân trang (Footer)**:
    *   Ở cuối website, phần bản quyền chứa ký tự **`©`**. Ký tự này thực chất là một liên kết ẩn dẫn đến trang viết bài. Nó đã được thiết kế không có gạch chân và con trỏ chuột không đổi màu để trông hoàn toàn giống như một ký tự văn bản thông thường đối với người dùng bình thường.

---


## 🛠️ Chạy Thử Trên Máy Local
Để xem trước giao diện trên máy tính cá nhân của bạn:

1.  Mở thư mục `d:\Fortfolio` trong VS Code hoặc trình soạn thảo của bạn.
2.  Chạy một máy chủ ảo nội bộ (Local Dev Server):
    *   **Cách 1:** Sử dụng extension **Live Server** trong VS Code (Click chuột phải vào `index.html` -> Chọn `Open with Live Server`).
    *   **Cách 2:** Dùng Node.js bằng cách chạy lệnh sau tại terminal:
        ```bash
        npm install
        npm start
        ```
    *   Mở trình duyệt truy cập `http://localhost:3000` hoặc địa chỉ hiển thị trên terminal.

---

## 🚀 Hướng Dẫn Deploy Lên Các Hệ Thống

### Cách 1: Deploy lên Vercel (Khuyên dùng - Nhanh, bảo mật, miễn phí)

Vercel là nền tảng tối ưu nhất dành cho các trang web tĩnh. Nó hỗ trợ tự động deploy mỗi khi bạn đẩy code mới lên GitHub.

#### Bước 1: Đẩy mã nguồn lên GitHub của bạn
1.  Truy cập [github.com](https://github.com) và tạo một repository mới tên là `introvert-portfolio` (chọn chế độ Public hoặc Private tùy ý).
2.  Mở terminal tại thư mục dự án và chạy các lệnh:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/<TÊN_USER_GITHUB>/introvert-portfolio.git
    git push -u origin main
    ```

#### Bước 2: Kết nối & Deploy trên Vercel
1.  Đăng nhập vào [vercel.com](https://vercel.com) (chọn đăng nhập bằng tài khoản GitHub).
2.  Nhấp vào nút **Add New** -> Chọn **Project**.
3.  Tìm kiếm repository `introvert-portfolio` trong danh sách và nhấn **Import**.
4.  Tại phần cài đặt cấu hình:
    *   **Framework Preset:** Chọn `Other` (vì dự án là HTML tĩnh).
    *   **Root Directory:** Để mặc định `./`.
    *   Các mục Build and Development Settings: Giữ mặc định (không cần điền gì vì dự án không cần build).
5.  Nhấp vào **Deploy**.
6.  Chờ khoảng 15-30 giây, bạn sẽ nhận được một địa chỉ URL miễn phí có đuôi `.vercel.app` để truy cập trang web.

---

### Cách 2: Deploy lên GitHub Pages (Miễn phí, cực kỳ đơn giản)

Nếu bạn không muốn tạo tài khoản Vercel và muốn quản lý tất cả trực tiếp trên GitHub:

1.  Mở file `package.json` và thêm dòng sau vào (ở cấp cao nhất):
    ```json
    "homepage": "https://<TÊN_USER_GITHUB>.github.io/introvert-portfolio"
    ```
2.  Truy cập repository dự án của bạn trên GitHub.
3.  Vào phần **Settings** (Cài đặt) -> Chọn mục **Pages** ở thanh menu bên trái.
4.  Tại mục **Build and deployment**:
    *   **Source:** Chọn `Deploy from a branch`.
    *   **Branch:** Chọn nhánh `main` và thư mục `/ (root)`.
5.  Bấm **Save**.
6.  Chờ 1-2 phút, trang web của bạn sẽ xuất hiện tại địa chỉ: `https://<TÊN_USER_GITHUB>.github.io/introvert-portfolio/`.

---

### Cách 3: Deploy lên Netlify (Miễn phí, kéo thả trực quan)

Nếu bạn không muốn sử dụng Git hay dòng lệnh:

1.  Truy cập [netlify.com](https://www.netlify.com/) và đăng nhập.
2.  Vào trang Dashboard -> Chọn tab **Sites**.
3.  Kéo toàn bộ thư mục `d:\Fortfolio` từ máy tính của bạn thả vào vùng **"Drag and drop your site folder here"** trên trang web Netlify.
4.  Netlify sẽ tự động tải thư mục lên và xuất bản trang web của bạn trong vòng vài giây với một tên miền ngẫu nhiên dạng `.netlify.app`.
5.  Bạn có thể đổi tên miền ngẫu nhiên này hoặc cấu hình tên miền riêng trong mục **Domain Settings**.
