import { Button, Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { usePresensiDB } from '../../../../hooks/kepegawaian/presensi/usePresensiDB';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [size, setSize] = useState('large');
  const currentDate = dayjs().format('DD MMMM YYYY');
  const { data } = usePresensiDB();
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  const navigate = useNavigate();

  const statsData = [
    { title: 'Total Pegawai', value: data?.data?.pegawai },
    { title: 'Pegawai Hadir', value: data?.data?.hadir },
    { title: 'Pegawai Izin', value: data?.data?.izin },
    { title: 'Pegawai Sakit', value: data?.data?.sakit },
    { title: 'Pegawai Alpa', value: data?.data?.alpa },
  ];

  return (
    <div>
      {user.role === 'admin' && (
        <div>
          <div className="header-container">
            <div className="header-wrapper">
              <h1 className="header-title">
                Selamat Datang di Dashboard Admin SMA Gajah Mada
              </h1>
              <h1 className="header-title">Data Tanggal {currentDate}</h1>
            </div>
          </div>
          {/* <Divider orientation="left" plain="true">
            Selamat Datang di Dashboard Admin SMA Gajah Mada
          </Divider>
          <Divider orientation="left" plain="true">
            Data Tanggal {currentDate}
          </Divider> */}
          <Space direction="horizontal" wrap>
            {statsData.map((stat, index) => (
              <Card key={index}>
                <Space direction="horizontal">
                  <TeamOutlined />
                  <Statistic title={stat.title} value={stat.value} />
                </Space>
              </Card>
            ))}
          </Space>
        </div>
      )}
      {user.role === 'user' && (
        <div>
          <div className="header-container">
            <div className="header-wrapper">
              <h1 className="header-title">
                Selamat Datang di Dashboard Pegawai SMA Gajah Mada
              </h1>
            </div>
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <Button
              type="primary"
              onClick={() => {
                navigate('/dashboard/hr/profile');
              }}
              size={size}
            >
              Profil
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate('/dashboard/hr/izin');
              }}
              size={size}
            >
              Pengajuan Izin
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate('/dashboard/hr/presensi/add');
              }}
              size={size}
            >
              Presensi Harian
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
