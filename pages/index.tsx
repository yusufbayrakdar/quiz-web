import { Button, Col, Row } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useRedux from "../hooks/useRedux";
import styled from "styled-components";

const Styled = styled.div`
  .bg-image {
    @media screen and (max-width: 800px) {
      filter: blur(4px);
      transition: filter 0.5s ease-in-out;
    }
    transition: filter 0.5s ease-in-out;
  }
  .login-button {
    width: 60px;
    height: 66px;
    background-color: rgba(255, 255, 255, 0);
    position: absolute;
    right: 217px;
    top: 348px;
    cursor: pointer;
    z-index: 15;
  }
`;

const Home: NextPage = () => {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const confirmUserId = router.query?.confirm;
  const rate = 0.68;

  useEffect(() => {
    if (confirmUserId) {
      dispatchAction($.EMAIL_CONFIRM, confirmUserId);
    }
  }, [confirmUserId]);

  const renderInfo = (key: string, value: string) => {
    return (
      <div className="text-white mr-10">
        <div className="mb-10">{key}</div>
        <div className="font-semibold text-4xl">{value}</div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Bilsem Ai</title>
        <meta name="description" content="Zekanı sonsuzluğa aç" />
        <link rel="icon" href="/varlik.png" />
      </Head>

      <main>
        <div className="h-screen w-screen bg-blue-600 relative">
          <Styled>
            <div className="absolute right-0 flex items-center h-screen lg:blur-md bg-image">
              <Image
                src={"/varlik.png"}
                width={729 * rate}
                height={1045 * rate}
              />
            </div>
            <div
              className="login-button"
              onClick={() => router.push("/signin")}
            />
          </Styled>
          <div className="z-10">
            <Col className=" text-white text-center h-screen flex flex-col justify-around">
              <Col
                style={{
                  marginLeft: "15%",
                  paddingTop: 50,
                }}
              >
                <Row className="text-5xl">Bilsem Ai</Row>
                <Row className="text-xs ml-5">"Zekanı sonsuzluğua aç"</Row>
              </Col>
              <Col>
                <Row style={{ marginLeft: "15%" }}>
                  {renderInfo("Soru", "100")}
                  {renderInfo("Deneme", "5")}
                </Row>
                <Row style={{ marginLeft: "15%" }} className="text-xs">
                  *18.12.2021 tarihindeki veriler
                </Row>
              </Col>
              <Col style={{ marginLeft: "15%", bottom: 10 }}>
                <Row>
                  <Button
                    className="text-white bg-blue-600 font-bold pl-16 pr-16"
                    onClick={() => router.push("/signup")}
                  >
                    Kaydol
                  </Button>
                </Row>
                <Row>Giriş yapmak için beynin içindeki Ai ye basınız</Row>
              </Col>
            </Col>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
