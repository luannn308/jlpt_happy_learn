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
}

export const kanjiData: KanjiData[] = [
  {
    id: 0,
    kanji: "混",
    han: "HỖN",
    components: "Bộ <strong>水</strong> (Thủy - nước) + <strong>昆</strong> (Côn - bọ/côn trùng).",
    story: "Nước hòa lẫn với côn trùng tạo thành một mớ <strong>hỗn</strong> tạp.",
    on: "コン (kon)",
    kun: "ま・じる, ま・ざる, ま・ぜる",
    vocab: [
      { word: "混雑", reading: "こんざつ", meaning: "Hỗn tạp, tắc nghẽn" },
      { word: "混乱", reading: "こんらん", meaning: "Hỗn loạn" },
      { word: "混ぜる", reading: "まぜる", meaning: "Trộn, trộn lẫn" },
      { word: "混じる", reading: "まじる", meaning: "Bị lẫn vào" },
    ],
  },
  {
    id: 1,
    kanji: "警",
    han: "CẢNH",
    components: "Bộ <strong>敬</strong> (Kính - tôn trọng) + <strong>言</strong> (Ngôn - lời nói).",
    story: "Dùng lời nói kính trọng để <strong>cảnh</strong> báo cấp trên về nguy hiểm.",
    on: "ケイ (kei)",
    kun: "Không có",
    vocab: [
      { word: "警察", reading: "けいさつ", meaning: "Cảnh sát" },
      { word: "警告", reading: "けいこく", meaning: "Cảnh báo" },
      { word: "警備", reading: "けいび", meaning: "Cảnh bị, bảo vệ" },
    ],
  },
  {
    id: 2,
    kanji: "額",
    han: "NGẠCH",
    components: "Bộ <strong>客</strong> (Khách) + <strong>頁</strong> (Hiệt - đầu).",
    story: "Vị khách có cái đầu với cái trán (<strong>ngạch</strong>) rất cao.",
    on: "ガク (gaku)",
    kun: "ひたい (hitai)",
    vocab: [
      { word: "金額", reading: "きんがく", meaning: "Kim ngạch, số tiền" },
      { word: "額", reading: "ひたい", meaning: "Cái trán" },
      { word: "額縁", reading: "がくぶち", meaning: "Khung tranh" },
    ],
  },
  {
    id: 3,
    kanji: "価",
    han: "GIÁ",
    components: "Bộ <strong>人</strong> (Nhân - người) + Chữ Á (thứ hai).",
    story: "Con người đánh <strong>giá</strong> mọi vật dựa trên giá trị của chúng.",
    on: "カ (ka)",
    kun: "あたい (atai)",
    vocab: [
      { word: "価格", reading: "かかく", meaning: "Giá cả" },
      { word: "価値", reading: "かち", meaning: "Giá trị" },
      { word: "物価", reading: "ぶっか", meaning: "Vật giá" },
    ],
  },
  {
    id: 4,
    kanji: "営",
    han: "DOANH",
    components: "Bộ <strong>宮</strong> (Cung - tòa nhà) nhưng lược bớt + Lửa (ánh đèn).",
    story: "Tòa nhà thắp đèn sáng rực để <strong>doanh</strong> nghiệp hoạt động suốt đêm.",
    on: "エイ (ei)",
    kun: "いとな・む",
    vocab: [
      { word: "営業", reading: "えいぎょう", meaning: "Kinh doanh" },
      { word: "運営", reading: "うんえい", meaning: "Vận hành, quản lý" },
      { word: "営む", reading: "いとなむ", meaning: "Kinh doanh, điều hành" },
    ],
  },
  {
    id: 5,
    kanji: "潔",
    han: "KHIẾT",
    components: "Bộ <strong>水</strong> (Nước) + Chữ Khiết (sạch sẽ).",
    story: "Dùng nước tẩy rửa mọi thứ để trở nên tinh <strong>khiết</strong> và sạch sẽ.",
    on: "ケツ (ketsu)",
    kun: "いさぎよ・い",
    vocab: [
      { word: "清潔", reading: "せいけつ", meaning: "Thanh khiết, sạch sẽ" },
      { word: "簡潔", reading: "かんけつ", meaning: "Giản khiết, ngắn gọn" },
      { word: "潔い", reading: "いさぎよい", meaning: "Thẳng thắn, hiên ngang" },
    ],
  },
  {
    id: 6,
    kanji: "授",
    han: "THỤ",
    components: "Bộ <strong>扌</strong> (Thủ - tay) + <strong>受</strong> (Thụ - nhận).",
    story: "Dùng tay truyền <strong>thụ</strong> kiến thức cho người sẵn sàng tiếp nhận.",
    on: "ジュ (ju)",
    kun: "さず・ける",
    vocab: [
      { word: "授業", reading: "じゅぎょう", meaning: "Tiết học, giờ học" },
      { word: "教授", reading: "きょうじゅ", meaning: "Giáo sư" },
      { word: "授ける", reading: "さずける", meaning: "Ban tặng, truyền thụ" },
    ],
  },
  {
    id: 7,
    kanji: "史",
    han: "SỬ",
    components: "Miệng + Bàn tay cầm bút ghi chép.",
    story: "Ghi chép lại lời nói của con người qua các đời thành lịch <strong>sử</strong>.",
    on: "シ (shi)",
    kun: "Không có",
    vocab: [
      { word: "歴史", reading: "れきし", meaning: "Lịch sử" },
      { word: "世界史", reading: "せかいし", meaning: "Lịch sử thế giới" },
      { word: "日本史", reading: "にほんし", meaning: "Lịch sử Nhật Bản" },
    ],
  },
  {
    id: 8,
    kanji: "桜",
    han: "ANH",
    components: "Bộ <strong>木</strong> (Mộc - cây) + <strong>女</strong> (Nữ) + <strong>ツ</strong> (Mũ/Hoa).",
    story: "Cây có hoa đẹp như người thiếu nữ đội mũ hoa chính là cây hoa <strong>anh</strong> đào.",
    on: "オウ (ou)",
    kun: "さくら (sakura)",
    vocab: [
      { word: "桜", reading: "さくら", meaning: "Hoa anh đào" },
      { word: "桜前線", reading: "さくらぜんせん", meaning: "Biểu đồ hoa anh đào nở" },
      { word: "桜色", reading: "さくらいろ", meaning: "Màu hồng đào" },
    ],
  },
  {
    id: 9,
    kanji: "舎",
    han: "XÁ",
    components: "<strong>人</strong> (Nhân - người) + <strong>土</strong> (Thổ - đất) + <strong>口</strong> (Khẩu - miệng).",
    story: "Nơi con người tụ tập nói chuyện trên mảnh đất có mái che là quán <strong>xá</strong>.",
    on: "シャ (sha)",
    kun: "Không có",
    vocab: [
      { word: "田舎", reading: "いなか", meaning: "Nông thôn, quê" },
      { word: "宿舎", reading: "しゅくしゃ", meaning: "Ký túc xá, chỗ trọ" },
      { word: "校舎", reading: "こうしゃ", meaning: "Tòa nhà trường học" },
    ],
  },
];
