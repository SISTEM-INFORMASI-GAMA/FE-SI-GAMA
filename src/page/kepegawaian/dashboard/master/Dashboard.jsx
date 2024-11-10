import { Card, Space, Statistic } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { usePegawaiPagination } from '../../../../hooks/kepegawaian/pegawai/usePegawaiPagination';
import { useState } from 'react';
import Typography from 'antd/es/typography/Typography';
import dayjs from 'dayjs';

const Dashboard = () => {
  const currentDate = dayjs();
  const formatDate = currentDate.format('DD MMMM YYYY');
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 1000,
    total: 0,
  });
  const { data, isLoading, isFetching, refetch } = usePegawaiPagination(
    dataTable,
    ''
  );
  return (
    <div>
      <Typography.Title level={4}>Data Tanggal {formatDate}</Typography.Title>
      <Space direction="horizontal">
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Total Pegawai" value={data?.results} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Hadir" value={data?.results} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Izin" value={data?.results} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Sakit" value={data?.results} />
          </Space>
        </Card>
        <Card>
          <Space direction="horizontal">
            <TeamOutlined />
            <Statistic title="Pegawai Alpa" value={data?.results} />
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default Dashboard;
