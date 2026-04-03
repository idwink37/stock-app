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
    spec: "",
    qty: "",
    type: "입고",
  });

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1pFZynlAmIeT_He-0Eg43Anp_QLEMdAkj/export?format=csv";

  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(text => {
        const rows = text.trim().split("\n").slice(1);
        const parsed = rows.map(row => {
          const [category, name, shape, length, width, height] = row.split(",");
          return {
            category: category?.trim(),
            name: name?.trim(),
            shape: shape?.trim(),
            length: length?.trim(),
            width: width?.trim(),
            height: height?.trim()
          };
        });
        setData(parsed);
      });
  }, []);

  const categories = [...new Set(data.map(d => d.category))];

  const names = [...new Set(
    data.filter(d => d.category === form.category)
        .map(d => d.name)
  )];

  const shapes = [...new Set(
    data.filter(d => d.category === form.category && d.name === form.name)
        .map(d => d.shape)
  )];

  const specs = data
    .filter(d =>
      d.category === form.category &&
      d.name === form.name &&
      d.shape === form.shape
    )
    .map(d => `${d.length} x ${d.width} x ${d.height || "-"}`);

  const addItem = () => {
    const name = form.mode === "직접입력" ? form.name_manual : form.name;
    if (!name || !form.qty || !form.spec) return;

    const newItem = {
      name,
      spec: form.spec,
      qty: form.qty,
      type: form.type
    };

    setItems([...items, newItem]);
  };

  const getStock = () => {
    const map = {};
    items.forEach(item => {
      const key = `${item.name}-${item.spec}`;
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

        <select value={form.mode}
          onChange={(e) => setForm({...form, mode: e.target.value})}>
          <option>선택입력</option>
          <option>직접입력</option>
        </select>

        <select value={form.category}
          onChange={(e) => setForm({...form, category: e.target.value})}>
          <option value="">카테고리</option>
          {categories.map((c, i) => <option key={i}>{c}</option>)}
        </select>

        {form.mode === "선택입력" ? (
          <select value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}>
            <option value="">품명</option>
            {names.map((n, i) => <option key={i}>{n}</option>)}
          </select>
        ) : (
          <input placeholder="품명 직접입력"
            value={form.name_manual}
            onChange={(e) => setForm({...form, name_manual: e.target.value})} />
        )}

        <select value={form.shape}
          onChange={(e) => setForm({...form, shape: e.target.value})}>
          <option value="">형상</option>
          {shapes.map((s, i) => <option key={i}>{s}</option>)}
        </select>

        <select value={form.spec}
          onChange={(e) => setForm({...form, spec: e.target.value})}>
          <option value="">규격 선택</option>
          {specs.map((s, i) => <option key={i}>{s}</option>)}
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
