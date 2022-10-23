import { useEffect, useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import useRedux from "../../hooks/useRedux";
import CustomTable from "../../components/CustomTable";
import ConfirmButton from "../../components/ConfirmButton";
import TableHeaderBar from "../../components/TableHeaderBar";
import { BASE_ENDPOINT, ROLES } from "../../utils";

const defaultPageSize = 10;

function Instructors() {
  const router = useRouter();
  const query = router.query;
  const { dispatchAction, $ } = useRedux();

  const users = useSelector((state) => state.user.users);
  const usersLoading = useSelector((state) => state.user.usersLoading);
  const totalUsers = useSelector((state) => state.user.totalUsers);

  const search = query["search"];
  const confirmed = query["confirmed"];
  const page = query["page"] || 1;
  const limit = query["limit"] || defaultPageSize;
  const hasPhone = query["hasPhone"];

  const getUsersAction = useMemo(
    () => ({
      type: $.GET_USERS,
      payload: {
        page,
        limit,
        search,
        confirmed,
        hasPhone,
        role: ROLES.INSTRUCTOR,
      },
    }),
    [$, page, limit, search, confirmed, hasPhone]
  );

  useEffect(() => {
    dispatchAction(getUsersAction);
  }, [dispatchAction, getUsersAction]);

  const columns = [
    {
      title: "Eğitmen",
      dataIndex: "fullName",
      render: (fullName, { _id }) => (
        <Link href={`${BASE_ENDPOINT.instructor}/${_id}?page=1`}>
          <a className="text-blue-500 hover:text-blue-700">{fullName}</a>
        </Link>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      render: (phone) => `(${phone?.slice(0, 3)}) ${phone?.slice(4)}`,
    },
    {
      title: "Onay Durumu",
      dataIndex: "confirmed",
      render: (confirmed) => (
        <FontAwesomeIcon
          style={{
            marginLeft: 5,
            color: confirmed ? "#52c41a" : "gray",
          }}
          icon={confirmed ? faCheckCircle : faTimesCircle}
          width={20}
        />
      ),
    },
    {
      title: "",
      dataIndex: "confirmed",
      render: (confirmed, { _id }) => (
        <ConfirmButton
          _id={_id}
          refreshActions={[getUsersAction]}
          confirm={confirmed}
        >
          {confirmed ? "Iptal Et" : "Onayla"}
        </ConfirmButton>
      ),
    },
  ];

  return (
    <div style={{ width: "83%" }}>
      <Head>
        <title>Eğitmenler | BilsemAI</title>
        <meta name="description" content="Eğitmenler" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <TableHeaderBar
        baseEndpoint={BASE_ENDPOINT.instructor}
        showConfirmedFilter={true}
      />
      <CustomTable
        dataSource={users}
        loading={usersLoading}
        totalDocuments={totalUsers}
        defaultPageSize={defaultPageSize}
        baseEndpoint={BASE_ENDPOINT.instructor}
        columns={columns}
        hideOnSinglePage={false}
      />
    </div>
  );
}

export default Instructors;
