import { NextResponse } from 'next/server';

/**
 * Proxy API để cập nhật dữ liệu lên Google Sheets
 * Tránh lỗi CORS và bảo mật thông tin URL của Apps Script
 */
export async function POST(request: Request) {
    const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

    if (!GOOGLE_SHEETS_API_URL) {
        return NextResponse.json(
            { error: "Chưa cấu hình NEXT_PUBLIC_GOOGLE_SHEETS_URL trong biến môi trường" },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();

        // Kiểm tra dữ liệu tối thiểu
        if (body.id === undefined || !body.type) {
            return NextResponse.json(
                { error: "Thiếu thông tin id hoặc type" },
                { status: 400 }
            );
        }

        // Gửi toàn bộ body đến Google Apps Script (bao gồm id, type, isLearned, component, story...)
        const response = await fetch(GOOGLE_SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Sheets Error Response:", errorText);
            throw new Error(`Google Sheets API responded with status: ${response.status}`);
        }

        const text = await response.text();
        try {
            const result = JSON.parse(text);
            return NextResponse.json(result);
        } catch (e) {
            console.error("Phản hồi không phải JSON:", text);
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Phản hồi từ Google Sheets không hợp lệ (Không phải JSON)", 
                    details: text.substring(0, 500) // Lấy 500 ký tự đầu để xem đó là gì (thường là HTML lỗi)
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật Google Sheets:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: "Không thể cập nhật dữ liệu", 
                details: error instanceof Error ? error.message : String(error) 
            },
            { status: 500 }
        );
    }
}
