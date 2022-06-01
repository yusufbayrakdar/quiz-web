import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { BASE_ENDPOINT } from "../../../utils";

function StartButton({ _id, style }) {
  const router = useRouter();
  return (
    <Button
      type="text"
      className="center"
      style={{ borderRadius: "50%", ...style }}
      onClick={() => router.push(`${BASE_ENDPOINT.quiz}/${_id}`)}
    >
      <StyledFontAwesomeIcon icon={faPlay} width={13} />
    </Button>
  );
}

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: ${({ theme }) => theme.colors.green};
`;

export default StartButton;
