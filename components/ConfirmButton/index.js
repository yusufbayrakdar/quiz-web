import React, { useState } from "react";
import { Button, Popconfirm, Row } from "antd";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";

export default function ConfirmButton({
  _id,
  children,
  refreshActions,
  confirm,
}) {
  const { dispatchAction, $ } = useRedux();

  const [open, setOpen] = useState(false);

  const makePremium = () => {
    dispatchAction(confirm ? $.CANCEL_INSTRUCTOR : $.CONFIRM_INSTRUCTOR, {
      _id,
      refreshActions,
    });
    setOpen(false);
  };

  return (
    <Popconfirm
      title={
        confirm
          ? "Iptal etmek istediğinize emin misiniz?"
          : "Onaylamak istediğinize emin misiniz?"
      }
      open={open}
      onConfirm={makePremium}
      onCancel={() => setOpen(false)}
      okText="Evet"
      cancelText="Hayır"
      placement="left"
    >
      <StyledButton
        color={confirm ? "red" : "#52c41a"}
        onClick={() => setOpen(true)}
      >
        <Row>{children || "Onayla"}</Row>
      </StyledButton>
    </Popconfirm>
  );
}

export const StyledButton = styled(Button)`
  color: ${({ color }) => color};
  &:hover {
    color: ${({ color }) => color};
    border-color: ${({ color }) => color};
  }
`;
