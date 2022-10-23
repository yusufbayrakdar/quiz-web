import { Button, Tooltip } from "antd";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AddStudentButton({ onClick, style, loading }) {
  return (
    <Tooltip title="Öğrencilerime ekle" placement="right">
      <Button
        danger
        type="text"
        className="center"
        style={{ borderRadius: "50%", ...style }}
        onClick={onClick}
        loading={loading}
      >
        <FontAwesomeIcon
          icon={faUserPlus}
          width={16}
          style={{ position: "absolute" }}
        />
      </Button>
    </Tooltip>
  );
}

export default AddStudentButton;
