import { RadarChartOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Layout, Menu, Spin } from "antd";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import GameOfLife from "./game-of-life";
import Mandelbrod from "./mandelbrod";
import { useInitializeGo } from "./utils/useInitializeGo";

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
`;

const StyledLayout = styled(Layout)`
  height: 100vh;
`;

const Header = styled(Layout.Header)`
  background: #fff;
  padding: 0;
`;

const Content = styled(Layout.Content)`
  background: #fff;
  margin: 24px 16px;
  padding: 24;
`;

const Centered = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100vh;
  flex: 1;
`;

function App() {
  const loaded = useInitializeGo();

  if (!loaded) {
    return (
      <Centered>
        <Spin size="large" />
      </Centered>
    );
  }

  return (
    <StyledLayout>
      <Layout.Sider collapsed>
        <Logo />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["mandelbrod"]}>
          <Menu.Item key="mandelbrod" icon={<RadarChartOutlined />}>
            <Link to="mandelbrod">Mandelbrod</Link>
          </Menu.Item>
          <Menu.Item key="game-of-life" icon={<QrcodeOutlined />}>
            <Link to="game-of-life">Game of Life</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Header></Header>
        <Content>
          <Routes>
            <Route path="mandelbrod" element={<Mandelbrod />} />
            <Route path="game-of-life" element={<GameOfLife />} />
            <Route
              path="*"
              element={<Navigate to="/mandelbrod" replace={true} />}
            />
          </Routes>
        </Content>
      </Layout>
    </StyledLayout>
  );
}

export default App;
