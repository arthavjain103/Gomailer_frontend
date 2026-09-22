import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";

export default function DashboardLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout__content">
        <Suspense
          fallback={
            <div className="page-loading">
              <Spinner size={32} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
