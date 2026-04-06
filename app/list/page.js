"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ListPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "transactions"));

      let arr = [];
      snapshot.forEach(doc => arr.push(doc.data()));
      setList(arr);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>📋 입출고 기록</h2>

      {list.map((item, i) => (
        <div key={i} style={{
          background: "#fff",
          padding: 12,
          marginBottom: 8,
          borderRadius: 10
        }}>
          <div>
            [{item.type === "in" ? "입고" : "출고"}]
          </div>
          <div>{item.category} / {item.name}</div>
          <div>
            {item.length} × {item.width} × {item.height}
          </div>
          <div>수량: {item.qty}</div>
        </div>
      ))}
    </div>
  );
}
