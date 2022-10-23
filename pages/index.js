import React from "react";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { Button, Col, Row } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import Animated from "../components/Animated";
import { BASE_ENDPOINT, BRAND_NAME } from "../utils";
import { useRouter } from "next/router";

function Index() {
  const router = useRouter();
  const rate = 0.68;

  const renderInfo = (key, value) => {
    return (
      <div style={{ marginRight: 40 }}>
        <div style={{ marginBottom: 40 }}>{key}</div>
        <div style={{ fontSize: 36, fontWeight: 600 }}>{value}</div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>BilsemAI</title>

        <link rel="icon" href="/ideas.png" />

        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=0, shrink-to-fit=no"
        />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="author" content="Yusuf Sabri Bayrakdar" />
        <meta name="copyright" content="QuizAI" />

        <meta name="description" content="Bilsem sınavı hazırlık platformu." />
        <meta name="keywords" content="bilsem, bilsemai, zeka, çocuk, cocuk" />
      </Head>

      <main>
        <Styled>
          <Animated className="left-side">
            <Row>
              <Col>
                <div className="brand-name gExtraBold">{BRAND_NAME}</div>
                <div className="motto">&ldquo;Zekanı sonsuzluğua aç&rdquo;</div>
              </Col>
            </Row>

            <div>
              <div className="quotation-mark-start">“</div>
              <div className="quotation gBold">
                Öğrencilerinize bir şey öğretmeyin, onları düşünmelerini
                sağlayın. Çünkü onlar düşünmeye başlarsa zaten kendi çabalarıyla
                öğrenirler. Ve çaba sonucu öğrenilen bilgi, en kalıcı bilgi
                olur. Asla silinmez..!
              </div>
              <div className="quotation-mark-end">”</div>
              <div className="author">Sokrates</div>
            </div>

            <div className="info">
              <Row>
                {renderInfo("Soru", "100")}
                {renderInfo("Deneme", "5")}
              </Row>
              <div style={{ fontSize: 12, lineHeight: 0.5 }}>
                *18.12.2021 tarihindeki veriler
              </div>
            </div>

            <div>
              <Button
                className="signup-button"
                onClick={() => router.push(BASE_ENDPOINT.signup)}
              >
                Başla
                <FontAwesomeIcon
                  icon={faChevronRight}
                  width={8}
                  className="font-bold text-lg"
                  style={{ marginLeft: 8 }}
                />
                <FontAwesomeIcon
                  icon={faChevronRight}
                  width={8}
                  className="font-bold text-lg"
                  style={{ marginLeft: -7.5 }}
                />
              </Button>
              <div>Giriş yapmak için beynin içindeki AI ye basınız</div>
            </div>
          </Animated>

          <div className="polygon">
            <Animated className="bg-image">
              <Image
                src={"/varlik.png"}
                width={729 * rate}
                height={1045 * rate}
                alt="splash-screen-brain-image"
                priority
                quality={100}
              />
              <div
                className="signin-button"
                onClick={() => router.push(BASE_ENDPOINT.signin)}
              />
            </Animated>
          </div>
        </Styled>
      </main>
    </div>
  );
}

const Styled = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: space-between;

  .polygon {
    @media screen and (max-width: 1200px) {
      padding-left: 0;
      width: 100%;
      filter: blur(4px);
      clip-path: polygon(0% 0, 100% 0, 100% 100%, 0% 100%);
      background-color: transparent;
      transition: 0.5s ease-in-out;
      position: absolute;
    }
    padding-left: 14%;
    width: 58.76%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.darkPrimary};
    clip-path: polygon(28% 0, 100% 0, 100% 100%, 0% 100%);
    transition: 0.5s ease-in-out;
  }

  .bg-image {
    position: relative;
  }

  .signin-button {
    background-color: red;
    width: 62px;
    height: 68px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-15%);
    background-color: transparent;
    cursor: pointer;
  }

  .left-side {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 15%;
    padding: 50px 0px;
    max-width: 384px;
  }

  .brand-name {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
  }

  .motto {
    font-size: 12px;
    text-align: center;
  }

  .quotation {
    text-indent: 40px;
    font-weight: 700;
  }

  .quotation-mark-start {
    font-family: Secular One;
    font-size: 36px;
    line-height: 0.5;
  }

  .quotation-mark-end {
    font-family: Secular One;
    font-size: 36px;
    line-height: 0.5;
    text-align: end;
  }

  .author {
    font-weight: 700;
  }

  .signup-button {
    color: white;
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 0px 64px;
    font-weight: 800;
    font-size: 18px;
    line-height: 28px;
    border-radius: 8px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    &:hover {
      background-color: white;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export default Index;
