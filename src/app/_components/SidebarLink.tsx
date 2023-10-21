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
    <Link href={href}>
      <p
        className={`block px-4 py-2 ${
          isLinkActive ? "bg-blue-500 text-white" : ""
        }`}
      >
        {children}
      </p>
    </Link>
  );
};

export default SidebarLink;
