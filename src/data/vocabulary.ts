export interface VocabularyItem {
    id: number;
    word: string;
    reading: string;
    meaning: string;
    han: string;
    example: string;
    exampleMeaning: string;
    level: string;
    category?: string;
    isLearned?: boolean;
}

export const vocabularyData: VocabularyItem[] = [
    {
        id: 0,
        word: "進学",
        reading: "しんがく",
        meaning: "Học lên cao",
        han: "TIẾN HỌC",
        example: "大学に進学する。",
        exampleMeaning: "Học lên đại học.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 1,
        word: "退学",
        reading: "たいがく",
        meaning: "Thôi học, bỏ học",
        han: "THOÁI HỌC",
        example: "病気で大学を退学した。",
        exampleMeaning: "Bỏ học đại học vì bị bệnh.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 2,
        word: "就職",
        reading: "しゅうしょく",
        meaning: "Tìm việc, có việc",
        han: "TỰU CHỨC",
        example: "日本の会社に就職する。",
        exampleMeaning: "Làm việc tại công ty Nhật.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 3,
        word: "退職",
        reading: "たいしょく",
        meaning: "Nghỉ việc",
        han: "THOÁI CHỨC",
        example: "定年退職の後、田舎で暮らす。",
        exampleMeaning: "Sau khi nghỉ hưu, tôi sẽ sống ở quê.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 4,
        word: "失業",
        reading: "しつぎょう",
        meaning: "Thất nghiệp",
        han: "THẤT NGHIỆP",
        example: "会社が倒産して失業した。",
        exampleMeaning: "Công ty phá sản nên tôi bị thất nghiệp.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 5,
        word: "残業",
        reading: "ざんぎょう",
        meaning: "Lâm thêm giờ (OT)",
        han: "TÀN NGHIỆP",
        example: "仕事가 忙しくて、毎日残業している。",
        exampleMeaning: "Vì công việc bận rộn nên ngày nào tôi cũng làm thêm giờ.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 6,
        word: "生活",
        reading: "せいかつ",
        meaning: "Sinh hoạt, cuộc sống",
        han: "SINH HOẠT",
        example: "日本の生活に慣れましたか。",
        exampleMeaning: "Bạn đã quen với cuộc sống ở Nhật chưa?",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 7,
        word: "通勤",
        reading: "つうきん",
        meaning: "Đi làm",
        han: "THÔNG CẦN",
        example: "通勤に往復で2時間かかる。",
        exampleMeaning: "Đi làm cả đi lẫn về mất 2 tiếng.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 8,
        word: "学歴",
        reading: "がくれき",
        meaning: "Quá trình học tập, học vấn",
        han: "HỌC LỊCH",
        example: "就職には学歴が関係あるのだろうか。",
        exampleMeaning: "Không biết học vấn có liên quan đến việc tìm việc không nhỉ?",
        level: "N3",
        category: "Danh từ",
        isLearned: true
    },
    {
        id: 9,
        word: "給料",
        reading: "きゅうりょう",
        meaning: "Tiền lương",
        han: "CẤP LIÊU",
        example: "給料日を楽しみにしている。",
        exampleMeaning: "Tôi đang mong đợi đến ngày lấy lương.",
        level: "N3",
        category: "Danh từ",
        isLearned: true
    },
    {
        id: 10,
        word: "面接",
        reading: "めんせつ",
        meaning: "Phỏng vấn",
        han: "DIỆN TIẾP",
        example: "今日、アルバイトの面接がある。",
        exampleMeaning: "Hôm nay tôi có buổi phỏng vấn làm thêm.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 11,
        word: "休憩",
        reading: "きゅうけい",
        meaning: "Nghỉ giải lao",
        han: "HƯU KHẾ",
        example: "少し休憩しましょう。",
        exampleMeaning: "Hãy cùng nghỉ giải lao một chút nào.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 12,
        word: "観光",
        reading: "かんこう",
        meaning: "Tham quan, du lịch",
        han: "QUAN QUANG",
        example: "京都へ観光に行く。",
        exampleMeaning: "Tôi đi du lịch đến Kyoto.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 13,
        word: "帰国",
        reading: "きこく",
        meaning: "Về nước",
        han: "QUY QUỐC",
        example: "来月、ベトナムに帰国する。",
        exampleMeaning: "Tháng sau tôi sẽ về nước Việt Nam.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 14,
        word: "帰省",
        reading: "きせい",
        meaning: "Về quê",
        han: "QUY TỈNH",
        example: "お盆には帰省するつもりだ。",
        exampleMeaning: "Dịp lễ Obon tôi định về quê.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 15,
        word: "帰宅",
        reading: "きたく",
        meaning: "Về nhà",
        han: "QUY TRẠCH",
        example: "毎日遅く帰宅する。",
        exampleMeaning: "Hằng ngày tôi về nhà muộn.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 16,
        word: "参加",
        reading: "さんか",
        meaning: "Tham gia",
        han: "THAM GIA",
        example: "ボランティア活動に参加する。",
        exampleMeaning: "Tham gia vào các hoạt động tình nguyện.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 17,
        word: "出席",
        reading: "しゅっせき",
        meaning: "Có mặt",
        han: "XUẤT TỊCH",
        example: "授業に出席する。",
        exampleMeaning: "Có mặt ở buổi học.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 18,
        word: "欠席",
        reading: "けっせき",
        meaning: "Vắng mặt",
        han: "KHIẾM TỊCH",
        example: "会議を欠席する。",
        exampleMeaning: "Vắng mặt ở cuộc họp.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 19,
        word: "遅刻",
        reading: "ちこく",
        meaning: "Đến muộn",
        han: "TRÌ KHẮC",
        example: "電車が遅れて、授業に遅刻した。",
        exampleMeaning: "Tàu điện trễ nên tôi đã đến lớp muộn.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3",
        isLearned: true
    },
    {
        id: 20,
        word: "化粧",
        reading: "けしょう",
        meaning: "Trang điểm",
        han: "HÓA TRANG",
        example: "化粧を落とす。",
        exampleMeaning: "Tẩy trang.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 21,
        word: "計算",
        reading: "けいさん",
        meaning: "Tính toán",
        han: "KẾ TOÁN",
        example: "計算が苦手だ。",
        exampleMeaning: "Tính toán kém.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 22,
        word: "計画",
        reading: "けいかく",
        meaning: "Kế hoạch",
        han: "KẾ HOẠCH",
        example: "旅行の計画を立てる。",
        exampleMeaning: "Lập kế hoạch du lịch.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 23,
        word: "成功",
        reading: "せいこう",
        meaning: "Thành công",
        han: "THÀNH CÔNG",
        example: "実験に成功する。",
        exampleMeaning: "Thí nghiệm thành công.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 24,
        word: "失敗",
        reading: "しっぱい",
        meaning: "Thất bại",
        han: "THẤT BẠI",
        example: "失敗は成功の母。",
        exampleMeaning: "Thất bại là mẹ thành công.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 25,
        word: "準備",
        reading: "じゅんび",
        meaning: "Chuẩn bị",
        han: "CHUẨN BỊ",
        example: "心の準備。",
        exampleMeaning: "Chuẩn bị tâm lý.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 26,
        word: "整理",
        reading: "せいり",
        meaning: "Sắp xếp, chỉnh sửa",
        han: "CHỈNH LÝ",
        example: "荷物を整理する。",
        exampleMeaning: "Sắp xếp hành lý.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 27,
        word: "注文",
        reading: "ちゅうもん",
        meaning: "Đặt hàng, gọi món",
        han: "CHÚ VĂN",
        example: "料理を注文する。",
        exampleMeaning: "Gọi món ăn.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 28,
        word: "貯金",
        reading: "ちょきん",
        meaning: "Tiết kiệm tiền",
        han: "TRỮ KIM",
        example: "貯金箱。",
        exampleMeaning: "Heo đất tiết kiệm.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 29,
        word: "徹夜",
        reading: "てつや",
        meaning: "Thức trắng đêm",
        han: "TRIỆT DẠ",
        example: "試験勉強で徹夜する。",
        exampleMeaning: "Thức đêm học thi.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 30,
        word: "引っ越し",
        reading: "ひっこし",
        meaning: "Chuyển nhà",
        han: "DẪN VIỆT",
        example: "隣の家に引っ越す。",
        exampleMeaning: "Chuyển sang nhà bên cạnh.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 31,
        word: "身長",
        reading: "しんちょう",
        meaning: "Chiều cao",
        han: "THÂN TRƯỜNG",
        example: "身長が伸びる。",
        exampleMeaning: "Chiều cao tăng lên.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 32,
        word: "体重",
        reading: "たいじゅう",
        meaning: "Cân nặng",
        han: "THỂ TRỌNG",
        example: "体重を測る。",
        exampleMeaning: "Đo cân nặng.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 33,
        word: "けが",
        reading: "けが",
        meaning: "Vết thương",
        han: "(Vết thương)",
        example: "足にけがをする。",
        exampleMeaning: "Bị thương ở chân.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 34,
        word: "会",
        reading: "かい",
        meaning: "Tiệc, buổi họp",
        han: "HỘI",
        example: "送別会。",
        exampleMeaning: "Tiệc chia tay.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 35,
        word: "趣味",
        reading: "しゅみ",
        meaning: "Sở thích",
        han: "THÚ VỊ",
        example: "趣味は読書です。",
        exampleMeaning: "Sở thích là đọc sách.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 36,
        word: "興味",
        reading: "きょうみ",
        meaning: "Hứng thú",
        han: "HƯNG VỊ",
        example: "日本文化に興味がある。",
        exampleMeaning: "Hứng thú với văn hóa Nhật.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 37,
        word: "思い出",
        reading: "おもいで",
        meaning: "Kỷ niệm",
        han: "(Kỷ niệm)",
        example: "楽しい思い出。",
        exampleMeaning: "Kỷ niệm vui.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 38,
        word: "冗談",
        reading: "じょうだん",
        meaning: "Nói đùa",
        han: "NHŨNG ĐÀM",
        example: "冗談を言う。",
        exampleMeaning: "Nói đùa.",
        level: "N3",
        category: "Danh từ"
    },
    {
        id: 39,
        word: "目的",
        reading: "もくてき",
        meaning: "Mục đích",
        han: "MỤC ĐÍCH",
        example: "来日の目的。",
        exampleMeaning: "Mục đích đến Nhật.",
        level: "N3",
        category: "Danh từ"
    }
];
