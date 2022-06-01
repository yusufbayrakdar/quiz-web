import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

function EditItemButton({ baseEndpoint, _id, style, customOnclick }) {
  const router = useRouter();
  return (
    <Button
      type="text"
      className="center"
      onClick={() => {
        if (customOnclick) return customOnclick();
        router.push(`${baseEndpoint}/form/${_id}`);
      }}
      style={{ borderRadius: "50%", ...style }}
    >
      <StyledFontAwesomeIcon icon={faEdit} width={13} />
    </Button>
  );
}

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: ${({ theme }) => theme.colors.primary};
`;

export default EditItemButton;
