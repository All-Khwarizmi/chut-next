"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

interface SidebarLinkProps {
  href: string;
  children: React.ReactNode;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, children }) => {
  const router = usePathname();

  const isLinkActive = href === router;

  return (
    <Link className=" place-content-center rounded-lg  text-center" href={href}>
      <div className="text-center">
        <div
          className={`block px-2 py-2 text-center md:px-4 ${
            isLinkActive ? "bg-blue-500 text-white" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </Link>
  );
};

export default SidebarLink;
