import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiUrl, getData } from "../../../utils/utils";

export default function Analytics({user}) {
  const [stats, setStats] = useState({
    active_students: 0,
    completed_courses: 0,
    average_progress: 0,
  });

  useEffect(() => {
    async function getAnalytics() {
      const data = await getData(apiUrl.teacherAnalytics + user.id);
      if (!data?.error) {
        setStats(data);
      }
    }
    getAnalytics();
  }, []);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">📊 Štatistiky</h1>
      
      {/* Картки статистики */}
      <div className="stats-grid">
        <StatCard title="Aktívni študenti" value={stats.active_students} subtitle="Unikátni používatelia" />
        <StatCard title="Dokončené kurzy" value={stats.completed_courses} subtitle="Počet kurzov" />
        <StatCard title="Priemerný pokrok" value={`${stats.average_progress}%`} subtitle="Priemerné skóre" />
      </div>
      
      {/* Графік (залишаємо поки тестові дані, бо їх немає в БД) */}
      <div className="chart-container">
        <h2 className="chart-title">📈 Dynamika aktivity študentov</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[{ name: "Týždeň 1", students: stats.active_students }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Компонент картки статистики
function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">{value}</p>
      <p className="stat-subtitle">{subtitle}</p>
    </div>
  );
}
