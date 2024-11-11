import { Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography/Typography';
import dayjs from 'dayjs';
import { usePresensiDB } from '../../../../hooks/kepegawaian/presensi/usePresensiDB';

const Dashboard = () => {
  const currentDate = dayjs().format('DD MMMM YYYY');
  const { data } = usePresensiDB();

  return (
    <div>
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
