"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    mode: "선택입력",
    category: "",
    name: "",
    name_manual: "",
    shape: "",
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
          const [category, name, shape, length, width, height] = row.split(",");
          return { category, name, shape, length, width, height };
        });
        setData(parsed);
      });
  }, []);

  // 필터
  const categories = [...new Set(data.map(d => d.category))];
  const names = [...new Set(data.filter(d => d.category === form.category).map(d => d.name))];
  const shapes = [...new Set(data.filter(d => d.name === form.name).map(d => d.shape))];

  const filtered = data.filter(d =>
    d.category === form.category &&
    d.name === form.name &&
    d.shape === form.shape
  );

  const addItem = () => {
    const name = form.mode === "직접입력" ? form.name_manual : form.name;

    if (!name || !form.qty) return;

    const newItem = {
      name,
      length: form.length,
      width: form.width,
      height: form.height,
      qty: form.qty,
      type: form.type
    };

    setItems([...items, newItem]);
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

        {/* 입력 방식 */}
        <select value={form.mode}
          onChange={(e) => setForm({...form, mode: e.target.value})}>
          <option>선택입력</option>
          <option>직접입력</option>
        </select>

        {/* 카테고리 */}
        <select value={form.category}
          onChange={(e) => setForm({...form, category: e.target.value})}>
          <option value="">카테고리 선택</option>
          {categories.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>

        {/* 품명 */}
        {form.mode === "선택입력" ? (
          <select value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}>
            <option value="">품명 선택</option>
            {names.map((n, i) => (
              <option key={i}>{n}</option>
            ))}
          </select>
        ) : (
          <input placeholder="품명 직접입력"
            value={form.name_manual}
            onChange={(e) => setForm({...form, name_manual: e.target.value})} />
        )}

        {/* 형상 */}
        <select value={form.shape}
          onChange={(e) => setForm({...form, shape: e.target.value})}>
          <option value="">형상 선택</option>
          {shapes.map((s, i) => (
            <option key={i}>{s}</option>
          ))}
        </select>

        {/* 규격 */}
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

        <select value={form.type}
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
