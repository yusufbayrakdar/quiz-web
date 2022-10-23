import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Button } from "antd";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import { BASE_ENDPOINT } from "../../utils";
import TableHeaderBar from "../../components/TableHeaderBar";
import PageContainer from "../../components/PageContainer";
import CustomTable from "../../components/CustomTable";

const defaultPageSize = 10;

function Shapes() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;
  const shapes = useSelector((state) => state.shape.shapes);
  const totalShapes = useSelector((state) => state.shape.totalShapes);
  const shapesLoading = useSelector((state) => state.shape.shapesLoading);

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"] || defaultPageSize;

  useEffect(() => {
    dispatchAction($.GET_SHAPES, {
      page,
      limit,
      search,
      action: $.SET_SHAPES,
    });
  }, [$, dispatchAction, page, limit, search]);

  const columns = [
    {
      title: "Şekil",
      dataIndex: "imageUrl",
      render: (url, { _id, searchTag }) => (
        <ImageContainer>
          <StyledImage
            src={url}
            alt={searchTag + "-" + _id}
            priority
            quality={100}
            width={50}
            height={50}
            layout={"responsive"}
          />
        </ImageContainer>
      ),
    },
    {
      title: "Şekil",
      dataIndex: "imageName",
    },
    {
      title: "Arama Etiketi",
      dataIndex: "searchTag",
    },
    {
      title: "",
      dataIndex: "_id",
      render: (_id) => (
        <Button onClick={() => router.push(`${BASE_ENDPOINT.shape}/${_id}`)}>
          Düzenle
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <Head>
        <title>Admin - shapes</title>
        <meta name="description" content="shapes" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <TableHeaderBar baseEndpoint={BASE_ENDPOINT.shape} hideCreate={false} />
      <CustomTable
        dataSource={shapes}
        loading={shapesLoading}
        totalDocuments={totalShapes}
        defaultPageSize={defaultPageSize}
        baseEndpoint={BASE_ENDPOINT.shape}
        columns={columns}
        hideOnSinglePage={false}
      />
    </PageContainer>
  );
}

const ImageContainer = styled.div`
  width: 70px;
  height: 70px;
`;

const StyledImage = styled(Image)`
  object-fit: contain;
`;

export default Shapes;
