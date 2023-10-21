"use client";
import React, { ReactNode } from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar";

interface LayoutProps {
  children: ReactNode;
  isUserLoggedIn: boolean;
  isPremiumUser: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  isUserLoggedIn,
  isPremiumUser,
}) => {
  return (
    <div className="  flex overflow-y-scroll bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar /> {/* You can adjust isOpen as needed. */}
      <div className=" flex-1">
        <TopBar isUserLoggedIn={isUserLoggedIn} isPremiumUser={isPremiumUser} />
        <main
          className="h-full place-items-center
        "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
