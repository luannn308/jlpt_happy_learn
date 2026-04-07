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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
    },
    {
        id: 5,
        word: "残業",
        reading: "ざんぎょう",
        meaning: "Lâm thêm giờ (OT)",
        han: "TÀN NGHIỆP",
        example: "仕事が忙しくて、毎日残業している。",
        exampleMeaning: "Vì công việc bận rộn nên ngày nào tôi cũng làm thêm giờ.",
        level: "N3",
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ"
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
        category: "Danh từ"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
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
        category: "Danh từ / Động từ nhóm 3"
    }
];
