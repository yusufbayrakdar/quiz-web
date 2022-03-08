import React from "react";
import Head from "next/head";
import { Card } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

function Dashboard() {
  const instructor = useSelector((state: any) => state.auth.instructor);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Zekanı sonsuzluğa aç" />
        <link rel="icon" href="/varlik.png" />
      </Head>
      {instructor && !instructor.confirmed && (
        <Card>
          <WarningOutlined
            className="text-yellow-500 text-4xl p-3"
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              marginBottom: 5,
            }}
          />
          Yöneticinin onayı bekleniyor
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
