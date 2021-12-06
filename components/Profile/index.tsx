import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { CheckCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Divider, Tooltip } from "antd";
import useRedux from "../../hooks/useRedux";

function index({ closeDrawer = () => {} }) {
  const { dispatchAction, $ } = useRedux();
  const instructor = useSelector((state: RootState) => state.auth.instructor);
  const student = useSelector((state: RootState) => state.auth.student);
  if (!student && !instructor) return null;

  const { firstName, lastName, phone, confirmed } = instructor || student;
  const renderIcon = () => {
    return confirmed ? (
      <Tooltip title="Onaylı eğitmen" placement="left">
        <CheckCircleOutlined className="text-green-500 justify-self-center pt-1 mr-2" />
      </Tooltip>
    ) : (
      <Tooltip title="Yöneticinin onayı bekleniyor" placement="left">
        <WarningOutlined className="text-yellow-500 justify-self-center pt-1 mr-2" />
      </Tooltip>
    );
  };

  const logout = () => {
    dispatchAction($.LOGOUT_REQUEST);
    closeDrawer();
  };

  return (
    <div>
      <div>
        <div className="font-sans mb-4 flex" style={{ marginLeft: 22 }}>
          {typeof confirmed === "boolean" && renderIcon()}
          {`${firstName} ${lastName}`}
        </div>
        <div className="text-center">
          +90 ({phone.slice(0, 3)}) {phone.slice(4)}
        </div>
      </div>
      <Divider />
      <Button className="mt-5 w-full" onClick={logout}>
        Çıkış yap
      </Button>
    </div>
  );
}

export default index;
