"use client";
import SidebarLink from "./SidebarLink";

const Sidebar: React.FC = () => {
  return (
    <aside className=" h-screen   w-1/12 overflow-y-scroll bg-gray-600">
      <div className="p-4">
        <div className="text-center">
          <img
            className="mx-auto block h-auto w-40 md:w-48 lg:w-64"
            src="/chut-carre.png"
            alt="Chut application logo"
          />
        </div>

        <ul className="mt-4 space-y-2">
          <li>
            <SidebarLink href="/">Home</SidebarLink>
          </li>
          <li>
            <SidebarLink href="/about">About</SidebarLink>
          </li>
          <li>
            <SidebarLink href="/pricing">Pricing</SidebarLink>
          </li>
          <li>
            <SidebarLink href="/account">Account</SidebarLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
