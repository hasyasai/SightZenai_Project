import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import AIAssistant from "./components/AIAssistant";
import RCAInsights from "./pages/RCAInsights";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex w-full h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar setPage={setPage} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 bg-black">
          {page === "dashboard" && <Dashboard />}
          {page === "ai" && <AIAssistant />}
        </div>

      </div>
    </div>
  );
}
