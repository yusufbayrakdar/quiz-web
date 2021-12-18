import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { Layout } from "antd";
import "antd/dist/antd.css";
import "tailwindcss/tailwind.css";

import { store } from "../redux/configureStore";
import Container from "../components/Container";
import CustomDrawer from "../components/CustomDrawer";

const { Content } = Layout;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen overflow-hidden">
      <Provider store={store}>
        <Container>
          <div className="flex flex-col h-full ">
            <Content className="flex-1 flex items-center justify-center relative">
              <Component {...pageProps} />
              <CustomDrawer />
            </Content>
          </div>
        </Container>
      </Provider>
    </div>
  );
}
export default MyApp;
