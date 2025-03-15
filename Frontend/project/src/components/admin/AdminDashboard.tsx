import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Statistics from "./Statistics";

const AdminDashboard: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark" || saved === "light"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white transition-colors duration-300">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard Administrateur</h1>
        <Statistics />
      </main>
    </div>
  );
};

export default AdminDashboard;
