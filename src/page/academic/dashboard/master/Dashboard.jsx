import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import { UserOutlined, TeamOutlined, HomeOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';

const { Title } = Typography;

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalSiswa: 0, totalGuru: 0, totalKelas: 0 });
  const { VITE_BASE_URL } = import.meta.env;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = cookies.get('token');
        const res = await axios.get(`${VITE_BASE_URL}/api/v1/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data statistik");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: '100px' }} />;

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Dashboard Akademik</Title>
      <p>Selamat datang kembali di Panel Admin SMA Gajah Mada.</p>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} hoverable style={{ borderLeft: '5px solid #1890ff' }}>
            <Statistic
              title="Total Siswa"
              value={stats.totalSiswa}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix="Orang"
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} hoverable style={{ borderLeft: '5px solid #52c41a' }}>
            <Statistic
              title="Total Guru & Pegawai"
              value={stats.totalGuru}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              suffix="Orang"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Card bordered={false} hoverable style={{ borderLeft: '5px solid #faad14' }}>
            <Statistic
              title="Total Kelas"
              value={stats.totalKelas}
              prefix={<HomeOutlined style={{ color: '#faad14' }} />}
              suffix="Ruangan"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;