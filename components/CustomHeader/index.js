import React from "react";
import { Row } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

import Animated from "../Animated";
import { BRAND_NAME } from "../../utils/index";
import Profile from "../Profile";

function CustomHeader() {
  const router = useRouter();

  if (["/signin", "/signup"].includes(router.pathname))
    return (
      <SignStyled className="gBold" onClick={() => router.push("/")}>
        <Animated>{BRAND_NAME}</Animated>
      </SignStyled>
    );

  if ("/" === router.pathname) return null;

  return (
    <Styled>
      <div className="brand-name center gBold">
        <Link href="/">
          <Animated>{BRAND_NAME}</Animated>
        </Link>
      </div>
      <div className="profile">{<Profile />}</div>
    </Styled>
  );
}

const Styled = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4.5px 0;

  .brand-name {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
    font-size: 24px;
    text-align: center;
    cursor: pointer;
    margin-left: 24px;
    height: 100%;
  }
  .profile {
    margin-right: 64px;
  }
`;

const SignStyled = styled.div`
  position: absolute;
  left: 64px;
  top: 24px;
  font-size: 30px;
  line-height: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;

export default CustomHeader;
