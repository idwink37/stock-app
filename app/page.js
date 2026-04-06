"use client";

import { useState } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [qty, setQty] = useState("");
  const [type, setType] = useState("in");

  const saveData = async () => {
    await addDoc(collection(db, "transactions"), {
      category,
      name,
      length,
      width,
      height,
      qty: Number(qty),
      type,
      date: new Date()
    });

    alert("저장 완료");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 창고관리</h2>

      <Link href="/stock">재고</Link> | <Link href="/list">기록</Link>

      <select onChange={(e) => setCategory(e.target.value)}>
        <option>카테고리</option>
        <option>방부목재</option>
        <option>금속재료</option>
        <option>기타</option>
      </select>

      <input placeholder="품명" onChange={(e) => setName(e.target.value)} />

      <input placeholder="장" onChange={(e) => setLength(e.target.value)} />
      <input placeholder="폭" onChange={(e) => setWidth(e.target.value)} />
      <input placeholder="고" onChange={(e) => setHeight(e.target.value)} />

      <input placeholder="수량" onChange={(e) => setQty(e.target.value)} />

      <select onChange={(e) => setType(e.target.value)}>
        <option value="in">입고</option>
        <option value="out">출고</option>
      </select>

      <button onClick={saveData}>저장</button>
    </div>
  );
}
