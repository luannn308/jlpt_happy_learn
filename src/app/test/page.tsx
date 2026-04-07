"use client"

import { Button } from "@/components/ui/button"

export default function TestPage() {
  return (
    <div className="container p-10 space-y-8 min-h-screen bg-warm">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Shadcn UI + Crimson Theme Test</h1>
        <p className="text-muted">Kiểm tra hiển thị nút bấm Shadcn với màu sắc dự án.</p>
      </div>

      <div className="flex gap-4 items-center flex-wrap p-6 border rounded-lg bg-white shadow-sm">
        <Button variant="default">Primary Button (Crimson)</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Vanilla CSS Bridge Test</h2>
        <p>Thẻ này sử dụng Tailwind classes nhưng vẫn thừa hưởng biến CSS từ Vanilla.</p>
        <div className="kanji-card p-8 rounded-xl text-center max-w-xs mx-auto">
          <span className="kanji-font text-6xl">愛</span>
          <p className="mt-4 font-bold">Vanilla Card Integration</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button size="lg" className="rounded-full px-8">
          Học Tiếp Ngay
        </Button>
      </div>
    </div>
  )
}
