"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useGlobalContext } from "@/context/globalContext";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

function ContentProvider({ children }: Props) {
  const { isSidebarOpen } = useGlobalContext();

  const pathname = usePathname();

  // Hide sidebar on these paths
  const hideSidebarPaths = ["/profile/update", "/help", "/privacy", "/terms"];

  const marginClass = hideSidebarPaths.includes(pathname)
    ? "ml-0"
    : isSidebarOpen
    ? "ml-[15rem]"
    : "ml-[5.2rem]";

  return (
    <div className="relative">
      {!hideSidebarPaths.includes(pathname) && <Sidebar />}
      <div className={`mt-[8vh] ${marginClass}`}>{children}</div>
    </div>
  );
}

export default ContentProvider;
