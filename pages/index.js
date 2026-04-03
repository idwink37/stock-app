"use client";
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    qty: "",
    type: "입고",
  });

  const addItem = () => {
    if (!form.name || !form.qty) return;
    setItems([...items, form]);
    setForm({
      name: "",
      length: "",
      width: "",
      height: "",
      qty: "",
      type: "입고",
    });
  };

  const getStock = () => {
    const map = {};
    items.forEach((item) => {
      const key = `${item.name}-${item.length}-${item.width}-${item.height}`;
      if (!map[key]) map[key] = 0;
      map[key] += item.type === "입고" ? +item.qty : -item.qty;
    });
    return map;
  };

  const stock = getStock();

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h1>📦 창고관리</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input style={{ padding: 10 }} placeholder="품명"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})} />

        <input style={{ padding: 10 }} placeholder="장"
          value={form.length}
          onChange={(e) => setForm({...form, length: e.target.value})} />

        <input style={{ padding: 10 }} placeholder="폭"
          value={form.width}
          onChange={(e) => setForm({...form, width: e.target.value})} />

        <input style={{ padding: 10 }} placeholder="고"
          value={form.height}
          onChange={(e) => setForm({...form, height: e.target.value})} />

        <input style={{ padding: 10 }} placeholder="수량" type="number"
          value={form.qty}
          onChange={(e) => setForm({...form, qty: e.target.value})} />

        <select style={{ padding: 10 }}
          value={form.type}
          onChange={(e) => setForm({...form, type: e.target.value})}>
          <option>입고</option>
          <option>출고</option>
        </select>

        <button style={{ padding: 12, background: "#333", color: "#fff" }}
          onClick={addItem}>
          추가
        </button>
      </div>

      <h2 style={{ marginTop: 30 }}>📊 재고</h2>

      <ul>
        {Object.entries(stock).map(([key, value]) => (
          <li key={key} style={{ padding: 8 }}>
            {key} → {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
