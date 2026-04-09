export interface Vocab {
    word: string;
    reading: string;
    meaning: string;
}

export interface KanjiData {
    id: number;
    kanji: string;
    han: string;
    components: string;
    story: string;
    on: string;
    kun: string;
    vocab: Vocab[];
    isLearned?: boolean;
}

export const kanjiData: KanjiData[] = [
    {
        id: 0,
        kanji: "混",
        han: "HỖN",
        components: "Bộ <strong>水</strong> (Thủy - nước) + <strong>昆</strong> (Côn - bọ/côn trùng).",
        story: "Nước hòa lẫn với côn trùng tạo thành một mớ <strong>hỗn</strong> tạp.",
        on: "コン",
        kun: "ま・じる, ま・ざる, ま・ぜる",
        vocab: [
            { word: "混雑", reading: "こんざつ", meaning: "Hỗn tạp, tắc nghẽn" },
            { word: "混乱", reading: "こんらん", meaning: "Hỗn loạn" },
            { word: "混ぜる", reading: "まぜる", meaning: "Trộn, trộn lẫn" },
            { word: "混じる", reading: "まじる", meaning: "Bị lẫn vào" },
        ],
        isLearned: false,
    },
    {
        id: 1,
        kanji: "警",
        han: "CẢNH",
        components: "Bộ <strong>敬</strong> (Kính - tôn trọng) + <strong>言</strong> (Ngôn - lời nói).",
        story: "Dùng lời nói kính trọng để <strong>cảnh</strong> báo cấp trên về nguy hiểm.",
        on: "ケイ",
        kun: "Không có",
        vocab: [
            { word: "警察", reading: "けいさつ", meaning: "Cảnh sát" },
            { word: "警告", reading: "けいこく", meaning: "Cảnh báo" },
            { word: "警備", reading: "けいび", meaning: "Cảnh bị, bảo vệ" },
        ],
        isLearned: false,
    },
    {
        id: 2,
        kanji: "額",
        han: "NGẠCH",
        components: "Bộ <strong>客</strong> (Khách) + <strong>頁</strong> (Hiệt - đầu).",
        story: "Vị khách có cái đầu với cái trán (<strong>ngạch</strong>) rất cao.",
        on: "ガク",
        kun: "ひたい",
        vocab: [
            { word: "金額", reading: "きんがく", meaning: "Kim ngạch, số tiền" },
            { word: "額", reading: "ひたい", meaning: "Cái trán" },
            { word: "額縁", reading: "がくぶち", meaning: "Khung tranh" },
        ],
        isLearned: false,
    },
    {
        id: 3,
        kanji: "価",
        han: "GIÁ",
        components: "Bộ <strong>人</strong> (Nhân - người) + Chữ Á (thứ hai).",
        story: "Con người đánh <strong>giá</strong> mọi vật dựa trên giá trị của chúng.",
        on: "カ",
        kun: "あたい",
        vocab: [
            { word: "価格", reading: "かかく", meaning: "Giá cả" },
            { word: "価値", reading: "かち", meaning: "Giá trị" },
            { word: "物価", reading: "ぶっか", meaning: "Vật giá" },
        ],
        isLearned: false,
    },
    {
        id: 4,
        kanji: "営",
        han: "DOANH",
        components: "Bộ <strong>宮</strong> (Cung - tòa nhà) nhưng lược bớt + Lửa (ánh đèn).",
        story: "Tòa nhà thắp đèn sáng rực để <strong>doanh</strong> nghiệp hoạt động suốt đêm.",
        on: "エイ",
        kun: "いとな・む",
        vocab: [
            { word: "営業", reading: "えいぎょう", meaning: "Kinh doanh" },
            { word: "運営", reading: "うんえい", meaning: "Vận hành, quản lý" },
            { word: "営む", reading: "いとなむ", meaning: "Kinh doanh, điều hành" },
        ],
        isLearned: false,
    },
    {
        id: 5,
        kanji: "潔",
        han: "KHIẾT",
        components: "Bộ <strong>水</strong> (Nước) + Chữ Khiết (sạch sẽ).",
        story: "Dùng nước tẩy rửa mọi thứ để trở nên tinh <strong>khiết</strong> và sạch sẽ.",
        on: "ケツ",
        kun: "いさぎよ・い",
        vocab: [
            { word: "清潔", reading: "せいけつ", meaning: "Thanh khiết, sạch sẽ" },
            { word: "簡潔", reading: "かんけつ", meaning: "Giản khiết, ngắn gọn" },
            { word: "潔い", reading: "いさぎよい", meaning: "Thẳng thắn, hiên ngang" },
        ],
        isLearned: false,
    },
    {
        id: 6,
        kanji: "授",
        han: "THỤ",
        components: "Bộ <strong>扌</strong> (Thủ - tay) + <strong>受</strong> (Thụ - nhận).",
        story: "Dùng tay truyền <strong>thụ</strong> kiến thức cho người sẵn sàng tiếp nhận.",
        on: "ジュ",
        kun: "さず・ける",
        vocab: [
            { word: "授業", reading: "じゅぎょう", meaning: "Tiết học, giờ học" },
            { word: "教授", reading: "きょうじゅ", meaning: "Giáo sư" },
            { word: "授ける", reading: "さずける", meaning: "Ban tặng, truyền thụ" },
        ],
        isLearned: false,
    },
    {
        id: 7,
        kanji: "史",
        han: "SỬ",
        components: "Miệng + Bàn tay cầm bút ghi chép.",
        story: "Ghi chép lại lời nói của con người qua các đời thành lịch <strong>sử</strong>.",
        on: "シ",
        kun: "Không có",
        vocab: [
            { word: "歴史", reading: "れきし", meaning: "Lịch sử" },
            { word: "世界史", reading: "せかいし", meaning: "Lịch sử thế giới" },
            { word: "日本史", reading: "にほんし", meaning: "Lịch sử Nhật Bản" },
        ],
        isLearned: false,
    },
    {
        id: 8,
        kanji: "桜",
        han: "ANH",
        components: "Bộ <strong>木</strong> (Mộc - cây) + <strong>女</strong> (Nữ) + <strong>ツ</strong> (Mũ/Hoa).",
        story: "Cây có hoa đẹp như người thiếu nữ đội mũ hoa chính là cây hoa <strong>anh</strong> đào.",
        on: "オウ",
        kun: "さくら",
        vocab: [
            { word: "桜", reading: "さくら", meaning: "Hoa anh đào" },
            { word: "桜前線", reading: "さくらぜんせん", meaning: "Biểu đồ hoa anh đào nở" },
            { word: "桜色", reading: "さくらいろ", meaning: "Màu hồng đào" },
        ],
        isLearned: false,
    },
    {
        id: 9,
        kanji: "舎",
        han: "XÁ",
        components:
            "<strong>人</strong> (Nhân - người) + <strong>土</strong> (Thổ - đất) + <strong>口</strong> (Khẩu - miệng).",
        story: "Nơi con người tụ tập nói chuyện trên mảnh đất có mái che là quán <strong>xá</strong>.",
        on: "シャ",
        kun: "Không có",
        vocab: [
            { word: "田舎", reading: "いなか", meaning: "Nông thôn, quê" },
            { word: "宿舎", reading: "しゅくしゃ", meaning: "Ký túc xá, chỗ trọ" },
            { word: "校舎", reading: "こうしゃ", meaning: "Tòa nhà trường học" },
        ],
        isLearned: false,
    },
    {
        id: 10,
        kanji: "在",
        han: "TẠI",
        components: "Bộ <strong>土</strong> (Thổ - đất) + <strong>人</strong> (Nhân - người) biến thể.",
        story: "Con người luôn tồn <strong>tại</strong> và hiện diện trên mặt đất.",
        on: "ザイ",
        kun: "あ・る",
        vocab: [
            { word: "存在", reading: "そんざい", meaning: "Tồn tại" },
            { word: "現在", reading: "げんざい", meaning: "Hiện tại" },
            { word: "在庫", reading: "ざいこ", meaning: "Tồn kho" },
        ],
    },
    {
        id: 11,
        kanji: "降",
        han: "GIÁNG, HÀNG",
        components: "Bộ <strong>阝</strong> (Phụ - gò đất) + <strong>夅</strong> (Hàng/Giáng - đi xuống).",
        story: "Đi xuống từ gò đất cao là <strong>giáng</strong> thế hoặc đầu <strong>hàng</strong>.",
        on: "コウ",
        kun: "お・りる, ふ・る, お・ろす",
        vocab: [
            { word: "降りる", reading: "おりる", meaning: "Xuống (xe, tàu)" },
            { word: "降る", reading: "ふる", meaning: "Rơi (mưa, tuyết)" },
            { word: "降参", reading: "こうさん", meaning: "Đầu hàng" },
        ],
    },
    {
        id: 12,
        kanji: "垂",
        han: "THÙY",
        components: "Hình ảnh cành cây rủ xuống mặt đất.",
        story: "Cành lá rủ <strong>thùy</strong> xuống sát mặt đất.",
        on: "スイ",
        kun: "た・れる, た・らす",
        vocab: [
            { word: "垂直", reading: "すいちょく", meaning: "Thẳng đứng" },
            { word: "垂れる", reading: "たれる", meaning: "Rủ xuống, chảy nhỏ giọt" },
        ],
    },
    {
        id: 13,
        kanji: "源",
        han: "NGUYÊN",
        components: "Bộ <strong>水</strong> (Thủy - nước) + <strong>原</strong> (Nguyên - nguồn gốc/cánh đồng).",
        story: "Nguồn nước khởi <strong>nguyên</strong> bắt đầu từ những cánh đồng cao.",
        on: "ゲン",
        kun: "みなもと",
        vocab: [
            { word: "資源", reading: "しげん", meaning: "Tài nguyên" },
            { word: "語源", reading: "ごげん", meaning: "Nguồn gốc của từ" },
            { word: "水源", reading: "すいげん", meaning: "Nguồn nước" },
        ],
    },
    {
        id: 14,
        kanji: "困",
        han: "KHỐN",
        components: "Bộ <strong>囗</strong> (Vi - bao quanh) + <strong>木</strong> (Mộc - cây).",
        story: "Cái cây bị nhốt trong khung hẹp nên rơi vào tình cảnh <strong>khốn</strong> khó.",
        on: "コン",
        kun: "こま・る",
        vocab: [
            { word: "困難", reading: "こんなん", meaning: "Khó khăn" },
            { word: "困る", reading: "こまる", meaning: "Khó khăn, bối rối" },
        ],
    },
    {
        id: 15,
        kanji: "砂",
        han: "SA",
        components: "Bộ <strong>石</strong> (Thạch - đá) + <strong>少</strong> (Thiếu - ít/nhỏ).",
        story: "Đá vỡ vụn thành những hạt nhỏ thì gọi là <strong>sa</strong> (cát).",
        on: "サ, シャ",
        kun: "すな",
        vocab: [
            { word: "砂", reading: "すな", meaning: "Cát" },
            { word: "砂糖", reading: "さとう", meaning: "Đường" },
            { word: "砂漠", reading: "さばく", meaning: "Sa mạc" },
        ],
    },
    {
        id: 16,
        kanji: "胸",
        han: "HUNG",
        components: "Bộ <strong>月</strong> (Nguyệt - thịt/cơ thể) + <strong>匈</strong> (Hung).",
        story: "Phần cơ thể ở vị trí phía trước lồng ngực là <strong>hung</strong>.",
        on: "キョウ",
        kun: "むね",
        vocab: [
            { word: "胸", reading: "むね", meaning: "Ngực" },
            { word: "胸中", reading: "きょうちゅう", meaning: "Trong lòng, nội tâm" },
        ],
    },
    {
        id: 17,
        kanji: "修",
        han: "TU",
        components: "Bộ <strong>人</strong> (Nhân - người) + <strong>彡</strong> (Sam - lông tóc/vẻ trang trí).",
        story: "Con người biết rèn luyện và trang hoàng lại bản thân chính là <strong>tu</strong> dưỡng.",
        on: "シュウ, シュ",
        kun: "おさ・める, おさ・まる",
        vocab: [
            { word: "修理", reading: "しゅうり", meaning: "Sửa chữa" },
            { word: "研修", reading: "けんしゅう", meaning: "Thực tập, huấn luyện" },
            { word: "修正", reading: "しゅうせい", meaning: "Chỉnh sửa, tu chính" },
        ],
    },
    {
        id: 18,
        kanji: "権",
        han: "QUYỀN",
        components: "Bộ <strong>木</strong> (Mộc - cây) + <strong>雚</strong> (Hoán).",
        story: "Cây gậy quyền trượng đại diện cho sức mạnh và <strong>quyền</strong> lực.",
        on: "ケン, ゴン",
        kun: "Không có",
        vocab: [
            { word: "権利", reading: "けんり", meaning: "Quyền lợi" },
            { word: "政権", reading: "せいけん", meaning: "Chính quyền" },
            { word: "権限", reading: "けんげん", meaning: "Quyền hạn" },
        ],
    },
    {
        id: 19,
        kanji: "税",
        han: "THUẾ",
        components: "Bộ <strong>禾</strong> (Hòa - lúa gạo) + <strong>兌</strong> (Đoái - trao đổi).",
        story: "Trao đổi lúa gạo cho nhà nước để hoàn thành nghĩa vụ đóng <strong>thuế</strong>.",
        on: "ゼイ",
        kun: "Không có",
        vocab: [
            { word: "税金", reading: "ぜいきん", meaning: "Tiền thuế" },
            { word: "消費税", reading: "しょうひぜい", meaning: "Thuế tiêu thụ" },
            { word: "脱税", reading: "だつぜい", meaning: "Trốn thuế" },
        ],
    },
];

