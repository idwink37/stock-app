"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h2>📦 창고관리</h2>

      <Link href="/stock">재고</Link> |{" "}
      <Link href="/list">기록</Link>
    </div>
  );
}
