import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { Layout } from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";
import "animate.css";

import { store } from "../redux/configureStore";
import Container from "../components/Container";
import CustomHeader from "../components/CustomHeader";
import CustomSider from "../components/CustomSider";

import "../styles/globals.css";

const { Content } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen overflow-hidden">
        <Provider store={store}>
          <Container>
            <div className="flex flex-col h-full ">
              <CustomHeader />
              <Layout className="flex flex-col h-full">
                <CustomSider />
                <Content className="flex-1 flex justify-center relative overflow-scroll">
                  <Component {...pageProps} />
                </Content>
              </Layout>
            </div>
          </Container>
        </Provider>
      </div>
    </DndProvider>
  );
}
export default MyApp;
