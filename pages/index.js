"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    qty: "",
    type: "입고",
  });

 const SHEET_URL = "https://docs.google.com/spreadsheets/d/1pFZynlAmIeT_He-0Eg43Anp_QLEMdAkj/export?format=csv";

  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(text => {
        const rows = text.split("\n").slice(1);
        const parsed = rows.map(row => {
          const [name, length, width, height] = row.split(",");
          return { name, length, width, height };
        });
        setData(parsed);
      });
  }, []);

  const names = [...new Set(data.map(d => d.name))];

  const filtered = data.filter(d => d.name === form.name);

  const addItem = () => {
    if (!form.name || !form.qty) return;
    setItems([...items, form]);
  };

  const getStock = () => {
    const map = {};
    items.forEach(item => {
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

        {/* 품명 드롭다운 */}
        <select value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}>
          <option value="">품명 선택</option>
          {names.map((n, i) => (
            <option key={i}>{n}</option>
          ))}
        </select>

        {/* 규격 자동 표시 */}
        <select value={form.length}
          onChange={(e) => setForm({...form, length: e.target.value})}>
          <option value="">장 선택</option>
          {filtered.map((f, i) => (
            <option key={i}>{f.length}</option>
          ))}
        </select>

        <select value={form.width}
          onChange={(e) => setForm({...form, width: e.target.value})}>
          <option value="">폭 선택</option>
          {filtered.map((f, i) => (
            <option key={i}>{f.width}</option>
          ))}
        </select>

        <select value={form.height}
          onChange={(e) => setForm({...form, height: e.target.value})}>
          <option value="">고 선택</option>
          {filtered.map((f, i) => (
            <option key={i}>{f.height}</option>
          ))}
        </select>

        <input placeholder="수량" type="number"
          value={form.qty}
          onChange={(e) => setForm({...form, qty: e.target.value})} />

        <select
          value={form.type}
          onChange={(e) => setForm({...form, type: e.target.value})}>
          <option>입고</option>
          <option>출고</option>
        </select>

        <button onClick={addItem}>추가</button>
      </div>

      <h2 style={{ marginTop: 30 }}>📊 재고</h2>
      <ul>
        {Object.entries(stock).map(([key, value]) => (
          <li key={key}>
            {key} → {value}
          </li>
        ))}
      </ul>
    </div>
  );
}
