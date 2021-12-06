import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function MenuItem({ link, title }: { link: string; title: string }) {
  const router = useRouter();

  return (
    <Link href={link}>
      <div
        key={link}
        style={{ backgroundColor: "rgba(0,0,0,0)" }}
        className="menu-item text-gray-200 pl-3 pr-3 flex items-center justify-center"
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
            router.pathname === link ? "active-menu-text" : ""
          }`}
        >
          {title}
        </div>
        <div
          className={`menu-bar ${
            router.pathname === link ? "active-menu" : ""
          }`}
        />
      </div>
    </Link>
  );
}

export default MenuItem;
