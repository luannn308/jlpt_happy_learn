# 🌸 JLPT Happy Learn - Ứng dụng học Kanji & Từ vựng Tiếng Nhật

![Banner](https://images.unsplash.com/photo-1528164344705-4754268799af?auto=format&fit=crop&q=80&w=1200&h=400)

**JLPT Happy Learn** là một nền tảng web hiện đại, được thiết kế để giúp người học tiếng Nhật chinh phục Kanji và từ vựng từ cấp độ N5 đến N1 một cách hiệu quả, trực quan và đầy cảm hứng.

---

## ✨ Tính năng nổi bật

- 🏮 **Học Kanji thông minh**: Hệ thống bài học được phân loại theo cấp độ JLPT, đi kèm bộ thủ, âm Hán Việt, Onyomi và Kunyomi.
- 📚 **Kho từ vựng khổng lồ**: Danh sách từ vựng phong phú, có ví dụ minh họa và âm thanh bản ngữ.
- ⚡ **Flashcards & Spaced Repetition**: Áp dụng phương pháp lặp lại ngắt quãng (SRS) giúp ghi nhớ lâu dài.
- 🏆 **Hệ thống bài kiểm tra (Quick Quizzes)**: Đánh giá trình độ tức thì sau mỗi bài học.
- 📊 **Theo dõi tiến độ**: Biểu đồ trực quan giúp bạn biết mình đã hoàn thành bao nhiêu % lộ trình.
- 🌓 **Giao diện cao cấp**: Hỗ trợ Dark Mode, thiết kế tối giản (Minimalism) giúp tập trung tối đa vào việc học.

---

## 🚀 Công nghệ sử dụng

Dự án được xây dựng với các công nghệ mạnh mẽ và hiện đại nhất:

- **Core**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) & [Framer Motion](https://www.framer.com/motion/) (cho hiệu ứng mượt mà)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Authentication**: NextAuth.js
- **State Management**: Zustand

---

## 🛠️ Cài đặt và Chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/luannn308/jlpt_happy_learn.git
```

### 2. Cài đặt dependency
```bash
npm install
```

### 3. Thiết lập biến môi trường
Tạo file `.env.local` và thêm các thông tin sau:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
```

### 4. Chạy chế độ Development
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

---

## 🎨 Thiết kế & Trải nghiệm người dùng (UX/UI)

Chúng tôi ưu tiên trải nghiệm **"Học mà không áp lực"**:
- **Tone màu chủ đạo**: 
  - 🔴 **Traditional Japanese Crimson (#b85c5c)**: Màu đỏ thẫm truyền thống, tạo sự tập trung và sang trọng.
  - 🍚 **Warm Rice White (#faf9f6)**: Màu trắng gạo ấm giúp bảo vệ mắt khi học lâu.
  - 🟢 **Success Green (#10b981)**: Màu xanh lục cho các trạng thái hoàn thành.
- **Typography**: 
  - [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro) cho giao diện tiếng Việt.
  - [Noto Sans JP](https://fonts.google.com/specimen/Noto+Sans+JP) cho hiển thị Kanji chuẩn xác.
- **Hiệu ứng**: Micro-animations và transitions mượt mà (Framer Motion).

---

## 📬 Liên hệ & Đóng góp

Nếu bạn có bất kỳ ý tưởng hoặc phản hồi nào, hãy mở một [Issue](https://github.com/luannn308/jlpt_happy_learn/issues) hoặc tạo một [Pull Request](https://github.com/luannn308/jlpt_happy_learn/pulls).

---
*Chúc bạn học tiếng Nhật vui vẻ và đạt kết quả cao trong kỳ thi JLPT sắp tới!* 🇯🇵🔥
