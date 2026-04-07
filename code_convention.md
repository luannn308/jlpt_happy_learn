# Code Convention - Dự án JLPT Happy Learn

Tài liệu này quy định các tiêu chuẩn lập trình và quy tắc thiết kế dành cho dự án học tiếng Nhật **JLPT Happy Learn**.

## 1. Thành phần Giao diện (UI Components)

- **Quy tắc Vàng**: **BẮT BUỘC** sử dụng **Shadcn UI** cho tất cả các thành phần giao diện mới hoặc khi refactor mã nguồn cũ.
- Trình tự ưu tiên khi tạo UI:
    1. Kiểm tra xem component đã có trong `src/components/ui` chưa.
    2. Nếu chưa, sử dụng lệnh `shadcn@latest add [component]` để thêm từ thư viện.
    3. Hỗ trợ bổ sung: Kết hợp **Tailwind CSS** để tùy biến Layout.
- **NGHIÊM CẤM** sử dụng inline styles (`style={{...}}`) cho các thuộc tính layout trừ trường hợp bất khả kháng liên quan đến animation động phức tạp.

## 2. Màu sắc và Phong cách (Theming)

- **Màu sắc chủ đạo**: Crimson (`#b85c5c`) và Rice White (`#faf9f6`).
- Khi sử dụng Shadcn UI, luôn ưu tiên sử dụng các class Tailwind tích hợp (ví dụ: `text-primary`, `bg-background`).
- **Font chữ**: 
    - `Be Vietnam Pro` cho tiếng Việt/Nội dung chính.
    - `Noto Sans JP` cho các chữ Kanji và nội dung tiếng Nhật.

## 3. Kiến trúc mã nguồn

- **Sử dụng Next.js App Router**: Tất cả các trang mới phải đặt trong `src/app`.
- **Component**:
    - `src/components/common`: Các component dùng chung cho toàn bộ ứng dụng (Header, Footer).
    - `src/components/kanji`: Các component chuyên biệt cho tính năng học Kanji.
    - `src/components/ui`: Các thư viện cơ sở từ Shadcn.
- **Sử dụng `cn()` helper**: Luôn sử dụng hàm `cn` từ `@/lib/utils` để kết hợp các class Tailwind một cách thông minh.

## 4. Kiểm soát trạng thái (State Management)

- Ưu tiên sử dụng `useState` và `localStorage` cho việc học tập cá nhân nhanh chóng.
- Tính năng Persistence: Trạng thái học tập phải được tự động lưu vào trình duyệt.
