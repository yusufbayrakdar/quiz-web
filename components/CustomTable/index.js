import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import { useRouter } from "next/router";

export default function BykTable({
  columns,
  loading,
  defaultPageSize,
  baseEndpoint,
  totalDocuments,
  dataSource,
  hideOnSinglePage,
  ...props
}) {
  const router = useRouter();
  const query = router.query;

  const search = query["search"];
  const pageQuery = parseInt(query["page"]) || 1;
  const limitQuery = parseInt(query["limit"]) || defaultPageSize;
  const isActiveFilter = query["isActive"];

  const [pagination, setPagination] = useState({
    page: pageQuery,
    pageSize: limitQuery,
  });

  useEffect(() => {
    setPagination({ page: pageQuery, pageSize: limitQuery });
  }, [pageQuery, limitQuery]);

  function getUrl(current, pageSize) {
    return `${baseEndpoint}?page=${current}&limit=${pageSize}${
      isActiveFilter ? "&isActive=" + isActiveFilter : ""
    }${search ? "&search=" + search : ""}`;
  }
  return (
    <Card>
      <Table
        columns={columns}
        size={"small"}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          hideOnSinglePage,
          position: ["bottomCenter", "bottomRight"],
          total: totalDocuments,
          defaultCurrent: pagination.page,
          current: pagination.page,
          showQuickJumper: true,
          pageSize: pagination.pageSize,
          onShowSizeChange: (current, pageSize) => {
            setPagination({ pageSize });
            router.push(getUrl(current, pageSize));
          },

          showTotal: (total) => (
            <div style={{ color: "gray" }}>{`Total: ${total}`}</div>
          ),
          onChange: (current, pageSize) => {
            setPagination({ page: current, pageSize });
            router.push(getUrl(current, pageSize));
          },
          showSizeChanger: true,
        }}
        rowKey="_id"
        {...props}
      />
    </Card>
  );
}
