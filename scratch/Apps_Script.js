// ĐIỀN ID FILE GOOGLE SHEET CỦA BẠN VÀO ĐÂY
var SHEET_ID = "1pzbc833lR6udyDSNIfdGWCRBV3s7xHSGCJvjimIRkno";

function doPost(e) {
    try {
        var parsed = JSON.parse(e.postData.contents);
        var dataType = "kanji"; 
        var data = parsed;
        
        if (parsed.type && parsed.data) {
            dataType = parsed.type;
            data = parsed.data;
        }

        if (!Array.isArray(data)) {
            data = [data];
        }

        // Mở đúng file Sheet bằng ID
        var spreadsheet = SpreadsheetApp.openById(SHEET_ID);
        // Chọn tên Tab, nếu truyền 'vocab' thì dùng tab 'Vocab', không thì dùng 'Kanji'. Fallback về Tab đầu tiên
        var sheetName = dataType === "vocab" ? "Vocab" : "Kanji";
        var sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.getSheets()[0];

        var currentLastRow = sheet.getLastRow();
        var lastId = 0;
        if (currentLastRow > 1) {
            var maxIdRange = sheet.getRange(2, 1, currentLastRow - 1, 1).getValues();
            for (var r = 0; r < maxIdRange.length; r++) {
                var val = parseInt(maxIdRange[r][0], 10);
                if (!isNaN(val) && val > lastId) {
                    lastId = val;
                }
            }
        }

        for (var i = 0; i < data.length; i++) {
            var item = data[i]; // Lấy phần tử hiện tại
            lastId++; // Tăng ID tiếp theo lên 1

            var row;
            if (dataType === "vocab") {
                // Cấu trúc map cho Vocab:
                // 1.id, 2.word, 3.reading, 4.meaning, 5.type, 6.example, 7.exampleMeaning, 8.isLearned
                row = [
                    item.id || lastId,
                    item.word || "",
                    item.reading || "",
                    item.meaning || "",
                    item.example || "",
                    item.exampleMeaning || "",
                    item.isLearned !== undefined ? item.isLearned : false,
                ];
            } else {
                // Cấu trúc map cho Kanji (Mặc định):
                // 1.id, 2.kanji, 3.han, 4.on, 5.component, 6.story, 7.kun, 8.meaning, 9.vocab, 10.isLearned
                row = [
                    item.id || lastId,
                    item.kanji || "",
                    item.han || "",
                    item.on || "",
                    item.component || "",
                    item.story || "",
                    item.kun || "",
                    item.meaning || "",
                    item.vocab || "",
                    item.isLearned !== undefined ? item.isLearned : false,
                ];
            }
            sheet.appendRow(row);
        }

        return ContentService.createTextOutput(
            JSON.stringify({ status: "success", message: "Đã map " + data.length + " bản ghi!" }),
        ).setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService.createTextOutput(
            JSON.stringify({ status: "error", message: error.toString() }),
        ).setMimeType(ContentService.MimeType.JSON);
    }
}
function doGet(e) {
    return ContentService.createTextOutput("MCP API is running");
}

