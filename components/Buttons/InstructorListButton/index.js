import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import styled from "styled-components";

function InstructorListButton({ style, onClick }) {
  return (
    <Button
      type="text"
      className="center"
      style={{ borderRadius: "50%", ...style }}
      onClick={onClick}
    >
      <StyledFontAwesomeIcon icon={faChalkboardTeacher} width={17} />
    </Button>
  );
}

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: ${({ theme }) => theme.colors.primary};
`;

export default InstructorListButton;
