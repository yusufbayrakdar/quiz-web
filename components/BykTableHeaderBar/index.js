import React, { useState } from "react";
import { useRouter } from "next/router";
import { Card, Col, Divider, Row } from "antd";
import { Button, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPhone } from "@fortawesome/free-solid-svg-icons";

import BykCreateButton from "../Buttons/BykCreateButton";
import { updateQueryString } from "../../utils";

const { Search } = Input;

const BykTableHeaderBar = ({
  baseEndpoint,
  hideCreate,
  searchPlaceholder = "Ara...",
  showPhoneFilter = false,
  showConfirmedFilter = false,
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

  const hasPhoneQuery = query["hasPhone"];
  const confirmedQuery = query["confirmed"];
  let hasPhoneDefault =
    hasPhoneQuery === "true" ? 1 : hasPhoneQuery === "false" ? 2 : 0;
  const [hasPhone, setHasPhone] = useState(hasPhoneDefault);
  let confirmedDefault =
    confirmedQuery === "true" ? 1 : confirmedQuery === "false" ? 2 : 0;
  const [confirmed, setConfirmed] = useState(confirmedDefault);

  function setPhone() {
    const newState = (hasPhone + 1) % 3;
    const status = { 1: "true", 2: "false" };
    setHasPhone(newState);
    router.push(updateQueryString("hasPhone", status[newState]));
  }
  function setNewConfirmed() {
    const newState = (confirmed + 1) % 3;
    const status = { 1: "true", 2: "false" };
    setConfirmed(newState);
    router.push(updateQueryString("confirmed", status[newState]));
  }
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
          {(showConfirmedFilter || showPhoneFilter) && (
            <Divider type={"vertical"}></Divider>
          )}
          {showPhoneFilter && (
            <Button
              onClick={() => setPhone()}
              className="flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faPhone} width={20} />

              {hasPhone % 3 === 0 ? "" : hasPhone % 3 === 1 ? "(+)" : "(-)"}
            </Button>
          )}
          {showConfirmedFilter && (
            <Button
              onClick={() => setNewConfirmed()}
              className="flex justify-center items-center"
            >
              <FontAwesomeIcon icon={faCheck} width={20} />

              {confirmed % 3 === 0 ? "" : confirmed % 3 === 1 ? "(+)" : "(-)"}
            </Button>
          )}
        </Row>

        {hideCreate ? null : (
          <Col>
            <Divider type={"vertical"}></Divider>
            <BykCreateButton onClick={onCreate} />
            <Divider type={"vertical"}></Divider>
          </Col>
        )}
      </Row>
    </Card>
  );
};
export default BykTableHeaderBar;
