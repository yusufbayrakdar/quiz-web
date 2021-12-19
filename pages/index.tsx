import { Button, Col, Row } from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import { RootState } from "../redux/configureStore";

const Styled = styled.div`
  .bg-image {
    @media screen and (max-width: 800px) {
      filter: blur(4px);
      transition: filter 0.5s ease-in-out;
    }
    transition: filter 0.5s ease-in-out;
    display: flex;
    align-items: center;
    height: 100vh;
  }
  .login-button {
    width: 60px;
    height: 68px;
    background-color: rgba(255, 255, 255, 0);
    position: absolute;
    right: 217px;
    top: 49%;
    cursor: pointer;
    z-index: 15;
  }
`;

const Home: NextPage = () => {
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const router = useRouter();
  if (loggedIn) router.push("/dashboard");
  const rate = 0.68;

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
        <title>BilsemAI</title>
        <meta name="description" content="Zekanı sonsuzluğa aç" />
        <link rel="icon" href="/varlik.png" />
      </Head>

      <main>
        <div className="h-screen w-screen bg-blue-600 relative">
          <Styled>
            <div className="absolute right-0 bg-image">
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
                <Row className="text-5xl">BilsemAI</Row>
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
                    className="text-white bg-blue-600 pl-16 pr-14 font-bold text-lg rounded-lg mb-4 flex items-center"
                    onClick={() => router.push("/signup")}
                  >
                    <Row>
                      Başla
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        width={8}
                        className="ml-2"
                      />
                    </Row>
                  </Button>
                </Row>
                <Row>Giriş yapmak için beynin içindeki AI ye basınız</Row>
              </Col>
            </Col>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
