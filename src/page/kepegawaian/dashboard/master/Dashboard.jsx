import { Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography/Typography';
import dayjs from 'dayjs';
import { usePresensiDB } from '../../../../hooks/kepegawaian/presensi/usePresensiDB';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const currentDate = dayjs().format('DD MMMM YYYY');
  const { data } = usePresensiDB();
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));

  return (
    <div>
      <Typography.Title level={4}>
        Selamat Datang di Dashboard
        {user.role === 'admin' ? ' Admin' : ' Pegawai'} SMA Gajah Mada
      </Typography.Title>
      <Typography.Title level={4}>Data Tanggal {currentDate}</Typography.Title>
      <Space direction="horizontal">
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Total Pegawai" value={data?.data?.pegawai} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Hadir" value={data?.data?.hadir} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Izin" value={data?.data?.izin} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Sakit" value={data?.data?.sakit} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Alpa" value={data?.data?.alpa} />
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default Dashboard;
