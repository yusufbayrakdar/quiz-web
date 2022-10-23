import React from "react";
import styled from "styled-components";

function PageContainer({ children, style }) {
  return <Container style={style}>{children}</Container>;
}

export const Container = styled.div`
  width: 83%;
`;

export default PageContainer;
