"use client";
import React, { ReactNode } from "react";
import TopBar from "./TopBar";
import Sidebar from "./SideBar";

interface LayoutProps {
  children: ReactNode;
  // isUserLoggedIn: boolean;
  // isPremiumUser: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,

}) => {
  return (
    <div className="fixed flex h-full w-full bg-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar /> {/* You can adjust isOpen as needed. */}
      <div className=" flex-1">
        {/* <TopBar isUserLoggedIn={isUserLoggedIn} isPremiumUser={isPremiumUser} /> */}
        <main
          className="h-full flex-1 place-items-center overflow-auto
        "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
