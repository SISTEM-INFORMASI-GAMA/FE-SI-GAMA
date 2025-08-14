import propTypes from "prop-types";
import {
  DashboardOutlined,
  LogoutOutlined,
  MenuOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Drawer } from "antd";
// import { default as LOGO, default as LogoFG } from "assets/img/logoFG.png";

import React, { useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import NavMenus from "./NavMenus";
import "./LayoutDashboard.css";
import Logout from "../../component/dashboard/Logout";
import BreadCrumb from "../../component/dashboard/BreadCrumb";
import "./LayoutDashboard.css";
import Cookies from "js-cookie";

const { Sider, Content, Header } = Layout;

function LayoutDasboard(props) {
  const [collapsed, setCollapsed] = useState(
    window.innerWidth > 1200 ? false : true
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const user = Cookies.get("user") && JSON.parse(Cookies.get("user"));
  const email = user?.email;

  const handleClickItemUser = (e) => {
    if (e.key === "profile") navigate("/profile");
    else handleLogout();
  };

  const itemsUser = [{ key: "logout", label: <span>Logout</span> }];

  const items = [
    { key: "mnuDashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "mnuSiswa", icon: <ReadOutlined />, label: "Siswa" },
    { key: "mnuKelas", icon: <TeamOutlined />, label: "Kelas" }
  ];

  const items2 = [
    { key: "logout", icon: <LogoutOutlined />, label: <Logout>Logout</Logout> },
  ];

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("token");
    navigate("/");
  };

  const handleClickMenu = (param) => {
    if (param.key === "") {
      return;
    } else {
      if (param.key === "logout") {
        // handleLogout();
        console.log("logout");
        return;
      } else if (param.key === "home") navigate("/");
      else if (param.key === "mnuDashboard") navigate("/dashboard/academic/home");
      else navigate("/dashboard/academic/" + param.key.toLowerCase().split("mnu")[1]);
    }
  };
  return (
    <Layout>
      <Drawer
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={250}
      >
        <div className="mobile-menu-wrapper">
          <NavMenus
            items={items}
            theme="light"
            items2={items2}
            handleClickMenu={handleClickMenu}
            defaultMenu={"mnuDashboard"}
            defaultOpen={["mnuDashboard"]}
          />
        </div>
      </Drawer>
      <div className="menu-mobile">
        <div onClick={() => navigate("/home")}>
          {/* <img src={LogoFG} alt="logo fg" style={{ width: 22 }} /> */}
          <h1 style={{ fontSize: "1.4em" }}>SMA GAJAH MADA</h1>
        </div>
        <MenuOutlined
          style={{ fontSize: "1.3em" }}
          onClick={() => setOpen(true)}
        />
      </div>
      <Sider width={250} trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          {/* <img src={LOGO} alt="fg" /> */}
          <span>SMA GAJAH MADA</span>
        </div>

        <div className="sider-menu-wrapper">
          <NavMenus
            items={items}
            theme="dark"
            items2={items2}
            handleClickMenu={handleClickMenu}
            defaultMenu={"mnuDashboard"}
            defaultOpen={["mnuDashboard"]}
          />
        </div>
      </Sider>

      <Layout className="site-layout">
        <Header>
          {React.createElement(HiOutlineMenuAlt2, {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed),
          })}
          <div className="header-container">
            <Dropdown
              menu={{
                items: itemsUser,
                style: { width: "50%" },
                onClick: handleClickItemUser,
              }}
              placement="bottomLeft"
              arrow
              trigger={["click"]}
            >
              <div className="user-profile">
                <UserOutlined />
                <span>{email}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <BreadCrumb />
        <Content className="site-layout-background">{props.content}</Content>
      </Layout>
    </Layout>
  );
}

LayoutDasboard.propTypes = {
  content: propTypes.element.isRequired,
};

export default LayoutDasboard;
