import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import Spinner from "./components/Spinner.jsx";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Upload = lazy(() => import("./pages/Upload.jsx"));
const Campaign = lazy(() => import("./pages/Campaign.jsx"));
const Monitoring = lazy(() => import("./pages/Monitoring.jsx"));
const Template = lazy(() => import("./pages/Template.jsx"));
const Queues = lazy(() => import("./pages/Queues.jsx"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#08080c]"><Spinner /></div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/console" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="upload" element={<Upload />} />
            <Route path="campaign" element={<Campaign />} />
            <Route path="monitoring" element={<Monitoring />} />
            <Route path="template" element={<Template />} />
            <Route path="queues" element={<Queues />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
