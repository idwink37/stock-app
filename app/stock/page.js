"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function StockPage() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "transactions"));

      let map = {};

      snapshot.forEach(doc => {
        const d = doc.data();

        const key = `${d.category}_${d.name}_${d.length}_${d.width}_${d.height}`;

        if (!map[key]) map[key] = 0;

        if (d.type === "in") {
          map[key] += d.qty;
        } else {
          map[key] -= d.qty;
        }
      });

      setStock(Object.entries(map));
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 재고 현황</h2>

      {stock.map(([key, qty]) => {
        const [category, name, l, w, h] = key.split("_");

        return (
          <div key={key} style={styles.card}>
            <div style={styles.name}>
              {category} / {name}
            </div>

            <div style={styles.spec}>
              {l} × {w} × {h}
            </div>

            <div style={{
              ...styles.qty,
              color: qty < 0 ? "red" : "#0070f3"
            }}>
              {qty}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    padding: 16,
    background: "#f5f5f5",
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    marginBottom: 12
  },
  card: {
    background: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  name: {
    fontSize: 16,
    fontWeight: "bold"
  },
  spec: {
    fontSize: 14,
    color: "#666",
    marginTop: 4
  },
  qty: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 6
  }
};
