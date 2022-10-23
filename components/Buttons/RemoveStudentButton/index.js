import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Popconfirm, Tooltip } from "antd";

function RemoveStudentButton({ onConfirm, style, loading }) {
  return (
    <Popconfirm
      placement="bottomLeft"
      title="Silmek istediğinizden emin misiniz?"
      okText="Evet"
      cancelText="Hayır"
      onConfirm={onConfirm}
      disabled={loading}
    >
      <Tooltip title="Öğrencilerimden çıkar" placement="right">
        <Button
          danger
          type="text"
          className="center"
          style={{ borderRadius: "50%", ...style }}
        >
          <FontAwesomeIcon
            icon={faUserMinus}
            width={16}
            style={{ position: "absolute" }}
          />
        </Button>
      </Tooltip>
    </Popconfirm>
  );
}

export default RemoveStudentButton;
