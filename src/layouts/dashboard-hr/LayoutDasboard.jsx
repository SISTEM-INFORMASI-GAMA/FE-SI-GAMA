import propTypes from 'prop-types';
import {
  CarryOutOutlined,
  DashboardOutlined,
  FileOutlined,
  LogoutOutlined,
  MenuOutlined,
  ProjectOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Dropdown, Layout, Drawer } from 'antd';
import { default as LOGO } from '../../assets/image/logo.png';

import React, { useState } from 'react';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import NavMenus from './NavMenus';
import './LayoutDashboard.css';
import Logout from '../../component/dashboard/Logout';
import BreadCrumb from '../../component/dashboard/BreadCrumb';
import './LayoutDashboard.css';
import Cookies from 'js-cookie';

const { Sider, Content, Header } = Layout;

function LayoutDasboard(props) {
  const [collapsed, setCollapsed] = useState(
    window.innerWidth > 1200 ? false : true
  );
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));

  const email = user?.email;

  const handleClickItemUser = (e) => {
    if (e.key === 'profile') navigate('/profile');
    else handleLogout();
  };

  const itemsUser = [
    {
      key: 'mnuDashboard',
      icon: <DashboardOutlined />,
      label: <span>Dashboard</span>,
    },
    {
      key: `mnuProfile`,
      icon: <UserOutlined />,
      label: <span>Profil</span>,
    },
    {
      key: 'mnuIzin',
      icon: <CarryOutOutlined />,
      label: <span>Pengajuan Izin</span>,
    },
  ];

  const itemsAdmin = [
    { key: 'mnuDashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'mnuAkun', icon: <UserOutlined />, label: 'Akun' },
    { key: 'mnuPegawai', icon: <TeamOutlined />, label: 'Pegawai' },
    {
      key: 'mnuPresensi',
      icon: <FileOutlined />,
      label: 'Data Presensi Harian Pegawai',
    },
    {
      key: 'mnuRecap-Presensi',
      icon: <ProjectOutlined />,
      label: 'Rekap Presensi Pegawai',
    },
    {
      key: 'mnuIzin',
      icon: <CarryOutOutlined />,
      label: 'Pengajuan Izin Pegawai',
    },
  ];

  const items2 = [
    { key: 'logout', icon: <LogoutOutlined />, label: <Logout>Logout</Logout> },
  ];

  const handleLogout = () => {
    Cookies.remove('user');
    Cookies.remove('token');
    navigate('/');
  };

  const handleClickMenu = (param) => {
    if (param.key === '') {
      return;
    } else {
      if (param.key === 'logout') {
        // handleLogout();
        return;
      } else if (param.key === 'home') navigate('/');
      else if (param.key === 'mnuDashboard') navigate('/dashboard/hr/home');
      else navigate('/dashboard/hr/' + param.key.toLowerCase().split('mnu')[1]);
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
        {user?.role === 'admin' && (
          <div className="mobile-menu-wrapper">
            <NavMenus
              items={itemsAdmin}
              theme="light"
              items2={items2}
              handleClickMenu={handleClickMenu}
              defaultMenu={'mnuDashboard'}
              defaultOpen={['mnuDashboard']}
            />
          </div>
        )}
        {user?.role === 'user' && (
          <div className="mobile-menu-wrapper">
            <NavMenus
              items={itemsUser}
              theme="light"
              items2={items2}
              handleClickMenu={handleClickMenu}
              defaultMenu={'mnuDashboard'}
              defaultOpen={['mnuDashboard']}
            />
          </div>
        )}
      </Drawer>
      <div className="menu-mobile">
        <div onClick={() => navigate('/dashboard/hr/home')}>
          <img src={LOGO} alt="logo fg" style={{ width: 22 }} />
          <h1 style={{ fontSize: '1.4em' }}>SMA Gajah Mada</h1>
        </div>
        <MenuOutlined
          style={{ fontSize: '1.3em' }}
          onClick={() => setOpen(true)}
        />
      </div>
      <Sider width={300} trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src={LOGO} alt="sma-gama-logo" />
          <span>SMA Gajah Mada</span>
        </div>
        {user?.role === 'admin' && (
          <div className="sider-menu-wrapper">
            <NavMenus
              items={itemsAdmin}
              theme="dark"
              items2={items2}
              handleClickMenu={handleClickMenu}
              defaultMenu={'mnuDashboard'}
              defaultOpen={['mnuDashboard']}
            />
          </div>
        )}
        {user?.role === 'user' && (
          <div className="sider-menu-wrapper">
            <NavMenus
              items={itemsUser}
              theme="dark"
              items2={items2}
              handleClickMenu={handleClickMenu}
              defaultMenu={'mnuDashboard'}
              defaultOpen={['mnuDashboard']}
            />
          </div>
        )}
      </Sider>

      <Layout className="site-layout">
        <Header>
          {React.createElement(HiOutlineMenuAlt2, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
          <div className="header-container">
            <Dropdown
              menu={{
                items: items2,
                style: { width: '50%' },
                onClick: handleClickItemUser,
              }}
              placement="bottomLeft"
              arrow
              trigger={['click']}
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
