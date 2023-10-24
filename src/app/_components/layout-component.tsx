"use client";
import React, { ReactNode } from "react";
import Sidebar from "./side-bar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-full w-full bg-primaryColor text-white sm:flex md:fixed">
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
