import React from "react";
import { Row } from "antd";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";

import { RootState } from "../../redux/configureStore";
import Profile from "../Profile";

function CustomHeader() {
  const router = useRouter();

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  if (["/signin", "/signup"].includes(router.pathname))
    return (
      <div
        className="absolute left-16 top-6 z-10 text-3xl font-bold text-white font-serif cursor-pointer gBold"
        onClick={() => router.push("/")}
      >
        BilsemIA
      </div>
    );

  if (!loggedIn) return null;

  return (
    <div className="relative bg-blue-600 h-16 flex items-center">
      <Row className="flex flex-1">
        <Link href="/">
          <p className="font-bold text-white font-sans text-2xl text-center flex justify-center items-center cursor-pointer ml-6 gBold">
            BilsemIA
          </p>
        </Link>
        <div className="flex flex-1 justify-end mr-16">
          {loggedIn && <Profile />}
        </div>
      </Row>
    </div>
  );
}

export default CustomHeader;
