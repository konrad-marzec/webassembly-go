import { RadarChartOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Layout, Menu, PageHeader } from "antd";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import styled from "styled-components";

import GameOfLife from "./game-of-life";
import Mandelbrot from "./mandelbrot";

const Logo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
`;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const Header = styled(Layout.Header)`
  background: #fff;
  padding: 0;
`;

const Content = styled(Layout.Content)`
  background: #fff;
  margin: 24px 16px;
  padding: 24;

  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <StyledLayout>
      <Layout.Sider collapsed>
        <Logo />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["mandelbrot"]}>
          <Menu.Item key="mandelbrot" icon={<RadarChartOutlined />}>
            <Link to="mandelbrot">Mandelbrot</Link>
          </Menu.Item>
          <Menu.Item key="game-of-life" icon={<QrcodeOutlined />}>
            <Link to="game-of-life">Game of Life</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout>
        <Header>
          <Routes>
            <Route
              path="mandelbrot"
              element={<PageHeader title="Mandelbrot" />}
            />
            <Route
              path="game-of-life"
              element={<PageHeader title="Game of Life" />}
            />
          </Routes>
        </Header>
        <Content>
          <Routes>
            <Route path="mandelbrot" element={<Mandelbrot />} />
            <Route path="game-of-life" element={<GameOfLife />} />
            <Route
              path="*"
              element={<Navigate to="/mandelbrot" replace={true} />}
            />
          </Routes>
        </Content>
      </Layout>
    </StyledLayout>
  );
}

export default App;
