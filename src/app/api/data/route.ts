import { NextResponse } from 'next/server';

export async function GET() {
  const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json(
      { error: "Chưa cấu hình NEXT_PUBLIC_GOOGLE_SHEETS_URL" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_API_URL, {
      method: 'GET',
      // Khi gọi từ Server-to-Server, không có giới hạn CORS như trình duyệt
      cache: 'no-store' // Đảm bảo luôn lấy dữ liệu mới nhất
    });

    if (!response.ok) {
      throw new Error(`Google Sheets API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi tại Proxy API:", error);
    return NextResponse.json(
      { error: "Không thể tải dữ liệu từ Google Sheets", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
