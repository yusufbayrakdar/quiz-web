import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Input, Card, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

import CreateButton from "../Buttons/CreateButton";
import Divider from "../Divider";
import { updateQueryString } from "../../utils";

const { Search } = Input;

const TableHeaderBar = ({
  baseEndpoint,
  showCreate,
  searchPlaceholder = "Ara...",
  showPhoneFilter = false,
  showConfirmedFilter = false,
  showOwnerFilter = false,
}) => {
  const router = useRouter();
  const query = router.query;
  const searchDefaultValue = query["search"];

  let isActiveDefault = query["isActive"];
  if (isActiveDefault === "true") {
    isActiveDefault = "Active";
  } else if (isActiveDefault === "false") {
    isActiveDefault = "InActive";
  } else {
    isActiveDefault = "All";
  }

  const isOwnerQuery = query["isOwner"];
  const hasPhoneQuery = query["hasPhone"];
  const confirmedQuery = query["confirmed"];
  let isOwnerDefault =
    isOwnerQuery === "true" ? 1 : isOwnerQuery === "false" ? 2 : 0;
  let hasPhoneDefault =
    hasPhoneQuery === "true" ? 1 : hasPhoneQuery === "false" ? 2 : 0;
  const [isOwner, setIsOwner] = useState(isOwnerDefault);
  const [hasPhone, setHasPhone] = useState(hasPhoneDefault);
  let confirmedDefault =
    confirmedQuery === "true" ? 1 : confirmedQuery === "false" ? 2 : 0;
  const [confirmed, setConfirmed] = useState(confirmedDefault);

  const setOwner = () => {
    const newState = (isOwner + 1) % 3;
    const status = { 1: "true", 2: "false" };
    setIsOwner(newState);
    router.push(updateQueryString("isOwner", status[newState]));
  };
  const setPhone = () => {
    const newState = (hasPhone + 1) % 3;
    const status = { 1: "true", 2: "false" };
    setHasPhone(newState);
    router.push(updateQueryString("hasPhone", status[newState]));
  };
  const setNewConfirmed = () => {
    const newState = (confirmed + 1) % 3;
    const status = { 1: "true", 2: "false" };
    setConfirmed(newState);
    router.push(updateQueryString("confirmed", status[newState]));
  };
  const onSearch = (value) => {
    if (value.trim())
      router.push(`${baseEndpoint}?search=${encodeURIComponent(value.trim())}`);
    else {
      router.push(baseEndpoint);
    }
  };

  const onCreate = () => {
    router.push(`${baseEndpoint}/create`);
  };

  return (
    <Card
      size={"small"}
      style={{
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 6,
        borderStyle: "solid",
        borderWidth: 1,
      }}
    >
      <Row>
        <Col flex="auto">
          <Search
            defaultValue={searchDefaultValue}
            allowClear
            placeholder={searchPlaceholder}
            onSearch={onSearch}
          />
        </Col>

        <Row className="flex items-center">
          {(showConfirmedFilter || showPhoneFilter || showOwnerFilter) && (
            <Divider type={"vertical"}></Divider>
          )}
          {showOwnerFilter && (
            <Button onClick={setOwner} className="center">
              <FontAwesomeIcon icon={faUser} width={20} />

              {isOwner !== 0 && (
                <div style={{ marginLeft: 2 }}>
                  {isOwner === 1 ? "(+)" : "(-)"}
                </div>
              )}
            </Button>
          )}
          {showPhoneFilter && (
            <Button onClick={setPhone} className="center">
              <FontAwesomeIcon icon={faPhone} width={20} />

              {hasPhone !== 0 && (
                <div style={{ marginLeft: 2 }}>
                  {hasPhone === 1 ? "(+)" : "(-)"}
                </div>
              )}
            </Button>
          )}
          {showConfirmedFilter && (
            <Button onClick={setNewConfirmed} className="center">
              <FontAwesomeIcon icon={faCheck} width={20} />

              {confirmed !== 0 && (
                <div style={{ marginLeft: 2 }}>
                  {confirmed === 1 ? "(+)" : "(-)"}
                </div>
              )}
            </Button>
          )}
        </Row>

        {showCreate && (
          <Col>
            <Divider type={"vertical"}></Divider>
            <CreateButton onClick={onCreate} />
          </Col>
        )}
      </Row>
    </Card>
  );
};
export default TableHeaderBar;
