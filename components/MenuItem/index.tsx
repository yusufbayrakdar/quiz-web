import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function MenuItem({
  link,
  title,
  children,
  onClick = () => {},
  active,
}: {
  link?: string;
  title?: string;
  children?: any;
  onClick?: () => any;
  active?: boolean;
}) {
  const router = useRouter();

  const Content = (
    <div
      key={link}
      style={{ backgroundColor: "rgba(0,0,0,0)" }}
      className="menu-item text-gray-200 pl-3 pr-3 flex items-center justify-center"
      onClick={onClick}
    >
      <style jsx>{`
        .menu-item {
          user-select: none;
          cursor: pointer;
          position: relative;
        }
        .active-menu,
        .menu-item:hover .menu-bar {
          position: absolute;
          width: 50%;
          height: 4px;
          bottom: 0;
          background-color: white;
          color: white;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
        .active-menu-text {
          color: white;
        }
        .menu-item:hover .menu-text {
          color: #fff;
        }
      `}</style>
      <div
        className={`menu-text ${
          router.pathname === link || active ? "active-menu-text" : ""
        }`}
      >
        {title || children}
      </div>
      <div
        className={`${typeof active !== "boolean" ? "menu-bar" : ""} ${
          router.pathname === link ? "active-menu" : ""
        }`}
      />
    </div>
  );

  if (children) {
    return Content;
  }

  return <Link href={link || "/"}>{Content}</Link>;
}

export default MenuItem;
