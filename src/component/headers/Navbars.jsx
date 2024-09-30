import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';

import { navLinks } from '../../data/index';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';

import { UserOutlined } from '@ant-design/icons';

import './Navbars.css';

const Navbars = () => {
  const [changeColor, setChangeColor] = useState(false);
  const navigate = useNavigate();

  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  const email = user?.email;
  const role = user?.role;
  const isLogin = Cookies.get('token');

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    navigate('/ghjkl');
  };

  const handleClickItemUser = (e) => {
    if (e.key === 'profile') navigate('/profile');
    else if (e.key === 'dashboard') navigate('/dashboard');
    else if (e.key === 'chat') navigate('/chat');
    else handleLogout();
  };

  const itemsUser = [
    role === 'admin' && {
      key: 'dashboard',
      label: <span>Dashboard</span>,
    },
    { key: 'logout', label: <span>Logout</span> },
  ];

  const changeBackgroundColor = () => {
    if (window.scrollY > 10) {
      setChangeColor(true);
    } else {
      setChangeColor(false);
    }
  };

  useEffect(() => {
    changeBackgroundColor();
    window.addEventListener('scroll', changeBackgroundColor);
  });

  return (
    <div>
      <Navbar
        expand='lg'
        className={changeColor ? 'color-active' : '' + 'navbar-custom'}
        fixed='top'
      >
        <Container>
          <Navbar.Brand
            className='navbar-brand'
          >
            <img src='/assets/img/logo.png' />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='text-center'>
              {navLinks.map((link) => {
                return (
                  <div className='nav-link'
                    key={link.id}
                  >
                    <NavLink
                      to={link.path}

                      className={({ isActive, isPending }) =>
                        isPending ? 'pending' : isActive ? 'active' : ''
                      }
                      end
                    >
                      {link.text}
                    </NavLink>
                  </div>
                );
              })}
              {isLogin ? (
                <>
                  <div className='header-container'>
                    <Dropdown
                      menu={{
                        items: itemsUser,
                        style: { width: '50%' },
                        onClick: handleClickItemUser,
                      }}
                      placement='bottomLeft'
                      arrow
                      trigger={['click']}
                    >
                      <div className='user-profile'>
                        <UserOutlined />
                        <span>{email}</span>
                      </div>
                    </Dropdown>
                  </div>
                </>
              ) : (
                <>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbars;