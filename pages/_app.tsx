import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import styled from "styled-components";

import { store } from "../redux/configureStore";
import Container from "../components/Container";
import CustomDrawer from "../components/CustomDrawer";
import CustomHeader from "../components/CustomHeader";
import CustomSider from "../components/CustomSider";

const { Content } = Layout;
const GlobalCSS = styled.span`
  @font-face {
    font-family: Gilroy-Medium;
    src: url(src/app/assets/fonts/Gilroy-Medium.ttf) format("opentype");
  }
  @font-face {
    font-family: Gilroy-Bold;
    src: url(src/app/assets/fonts/Gilroy-Bold.ttf) format("opentype");
  }

  .gBold {
    font-family: Gilroy-Bold;
  }

  .gMed {
    font-family: Gilroy-Medium;
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen overflow-hidden">
      <Provider store={store}>
        <Container>
          <GlobalCSS>
            <div className="flex flex-col h-full ">
              <CustomHeader />
              <Layout className="flex flex-col h-full">
                <CustomSider />
                <Content className="flex-1 flex justify-center relative">
                  <Component {...pageProps} />
                  <CustomDrawer />
                </Content>
              </Layout>
            </div>
          </GlobalCSS>
        </Container>
      </Provider>
    </div>
  );
}
export default MyApp;
