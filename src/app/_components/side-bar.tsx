"use client";
import {
  MdAccountBalance,
  MdHome,
  MdInfo,
  MdPriceChange,
} from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import SidebarLink from "./sidebar-link";

const Sidebar: React.FC = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 450 });

  return (
    <aside className="h-screen w-1/6 overflow-y-scroll bg-gray-600 text-center  md:w-1/6 xl:w-2/12">
      <div className="flex flex-col place-content-center gap-y-5">
        <div className="text-center">
          <img
            className="mx-auto block h-auto p-1 md:w-48  md:p-4 xl:w-64"
            src="/chut-carre.png"
            alt="Chut application logo"
          />
        </div>

        <ul className={`space-y-2 xl:mt-4`}>
          <li className="grow ">
            <SidebarLink href="/">
              {isSmallScreen ? (
                <div className="flex place-content-center">
                  <MdHome className=" text-2xl" />
                </div>
              ) : (
                "Home"
              )}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink href="/about">
              {isSmallScreen ? (
                <div className="flex place-content-center">
                  <MdInfo className="text-2xl" />
                </div>
              ) : (
                "About"
              )}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink href="/pricing">
              {isSmallScreen ? (
                <div className="flex place-content-center">
                  <MdPriceChange className="text-2xl" />
                </div>
              ) : (
                "Pricing"
              )}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink href="/account">
              {isSmallScreen ? (
                <div className="flex place-content-center">
                  <MdAccountBalance className="text-2xl" />
                </div>
              ) : (
                "Account"
              )}
            </SidebarLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
