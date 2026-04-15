import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// ĐIỀN GOOGLE APPS SCRIPT WEB APP URL CỦA BẠN VÀO ĐÂY SAU KHI DEPLOY
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwSEWhdoDPD5cyuHUyFXzXqhRe4XIDYSJfrFbeqE47YykuKa0i2UR-C59Kj-w2BdvJwmg/exec";

const server = new Server(
  {
    name: "jlpt-sheets-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tool to be exposed to AI
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_kanji_to_sheet",
        description: "Thêm danh sách Kanji mới vào Google Sheets thông qua Apps Script",
        inputSchema: {
          type: "object",
          properties: {
            kanjiList: {
              type: "array",
              description: "Danh sách các object chứa dữ liệu Kanji",
              items: {
                type: "object",
                properties: {
                  kanji: { type: "string", description: "Kanji chữ Hán (Ví dụ: 針)" },
                  han: { type: "string", description: "Từ Hán Việt, viết hoa chữ cái đầu hoặc in hoa, ví dụ: CHÂM" },
                  on: { type: "string", description: "Onyomi bằng Katakana, ví dụ: シン. Để '- 'nếu không có." },
                  kun: { type: "string", description: "Kunyomi bằng Hiragana. Để '-' nếu không có." },
                  component: { type: "string", description: "Tên các bộ thủ. VÍ DỤ CHUẨN: Bộ 金 (Kim - kim loại) + 十 (Thập)." },
                  story: { type: "string", description: "Câu chuyện dễ nhớ. Ví dụ: Vật bằng kim loại nhọn như số 10 là cây châm (kim)." },
                  meaning: { type: "string", description: "Nghĩa tiếng Việt ngắn gọn. Ví dụ: Cái kim, phương hướng" },
                  vocab: {
                    type: "array",
                    description: "Danh sách 2-3 từ ghép chứa Kanji này",
                    items: {
                      type: "object",
                      properties: {
                        word: { type: "string", description: "Từ vựng (Kanji)" },
                        reading: { type: "string", description: "Cách đọc (Hiragana)" },
                        meaning: { type: "string", description: "Nghĩa tiếng Việt" }
                      },
                      required: ["word", "reading", "meaning"]
                    }
                  },
                },
                required: ["kanji"],
              },
            },
          },
          required: ["kanjiList"],
        },
      },
      {
        name: "add_vocab_to_sheet",
        description: "Thêm danh sách từ vựng mới vào Google Sheets thông qua Apps Script",
        inputSchema: {
          type: "object",
          properties: {
            vocabList: {
              type: "array",
              description: "Danh sách các object chứa dữ liệu Từ vựng",
              items: {
                type: "object",
                properties: {
                  word: { type: "string", description: "Từ vựng tiếng Nhật (Ví dụ: 先生)" },
                  reading: { type: "string", description: "Cách đọc Hiragana/Katakana (Ví dụ: せんせい)" },
                  meaning: { type: "string", description: "Nghĩa tiếng Việt (Ví dụ: Giáo viên)" },
                  example: { type: "string", description: "Câu ví dụ tiếng Nhật chứa từ vựng" },
                  exampleMeaning: { type: "string", description: "Nghĩa câu ví dụ tiếng Việt" },
                },
                required: ["word", "reading", "meaning"],
              },
            },
          },
          required: ["vocabList"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "add_kanji_to_sheet") {
    const kanjiList = request.params.arguments?.kanjiList;

    if (!Array.isArray(kanjiList)) {
      throw new Error("Dữ liệu kanjiList phải là một mảng");
    }

    if (WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
       return {
         content: [{ type: "text", text: "LỖI: Bạn chưa cập nhật WEB_APP_URL trong index.js của mcp-sheets-server!" }],
         isError: true,
       }
    }

    try {
      // Ép kiểu Data trước khi gửi sang Apps Script để JSON chuỗi vocab như User muốn
      const processedKanjiList = kanjiList.map(k => ({
        ...k,
        vocab: k.vocab ? JSON.stringify(k.vocab) : "[]" 
      }));

      // POST dữ liệu lên Web App
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify({ type: "kanji", data: processedKanjiList }),
      });

      const responseText = await response.text();

      return {
        content: [
          {
            type: "text",
            text: `Thao tác thành công. Phản hồi từ Google Sheets: ${responseText}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Lỗi khi gọi Google Apps Script: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }

  if (request.params.name === "add_vocab_to_sheet") {
    const vocabList = request.params.arguments?.vocabList;

    if (!Array.isArray(vocabList)) {
      throw new Error("Dữ liệu vocabList phải là một mảng");
    }

    if (WEB_APP_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
       return {
         content: [{ type: "text", text: "LỖI: Bạn chưa cập nhật WEB_APP_URL trong index.js của mcp-sheets-server!" }],
         isError: true,
       }
    }

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", 
        },
        body: JSON.stringify({ type: "vocab", data: vocabList }),
      });

      const responseText = await response.text();

      return {
        content: [
          {
            type: "text",
            text: `Thao tác thành công. Phản hồi từ Google Sheets: ${responseText}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Lỗi khi gọi Google Apps Script: ${(error as Error).message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error("Không tìm thấy tool phù hợp");
});

// Run server using stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("JLPT Google Sheets MCP server is running on stdio");
}

run().catch(console.error);
