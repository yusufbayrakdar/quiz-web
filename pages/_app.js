import { Layout } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import styled from "styled-components";
import "antd/dist/antd.css";
import "animate.css";

import { store } from "../redux/configureStore";
import theme from "../utils/theme";
import Container from "../components/Container";
import CustomHeader from "../components/CustomHeader";
import CustomSider from "../components/CustomSider";

const { Content } = Layout;

export default function App({ Component, pageProps }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <GlobalStyle />
      <Styled>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Container>
              <div className="container">
                <CustomHeader />
                <Layout>
                  <CustomSider />
                  <Content className="content">
                    <Component {...pageProps} />
                  </Content>
                </Layout>
              </div>
            </Container>
          </ThemeProvider>
        </Provider>
      </Styled>
    </DndProvider>
  );
}

const Styled = styled.div`
  height: 100vh;
  overflow: hidden;

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    overflow-y: scroll;
  }
`;

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  @font-face {
    font-family: Gilroy-Medium;
    src: url(/fonts/Gilroy-Medium.ttf) format("opentype");
  }
  @font-face {
    font-family: Gilroy-Bold;
    src: url(/fonts/Gilroy-Bold.ttf) format("opentype");
  }

  .gBold {
    font-family: Gilroy-Bold;
  }

  .gMed {
    font-family: Gilroy-Medium;
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .end{
    display: flex;
    justify-content: flex-end;
  }
`;
