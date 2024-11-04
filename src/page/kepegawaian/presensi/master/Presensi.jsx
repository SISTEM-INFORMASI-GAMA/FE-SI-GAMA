import { Button, DatePicker, Input, Space, Table, Tooltip } from 'antd';
import { Tag } from 'antd';
import { useCallback, useState } from 'react';
import { usePresensiPagination } from '../../../../hooks/kepegawaian/presensi/usePresensiPagination';
import moment from 'moment';
import EditPresensi from '../edit/EditPresensi';
import dayjs from "dayjs";
const format = 'YYYY-MM-DD';
import { SearchOutlined } from '@ant-design/icons';
import './Presensi.css';
import { useNavigate } from "react-router-dom";

const firstDate = new Date();
const lastDate = new Date();

export const Presensi = () => {
  const [dataId, setDataId] = useState('');
  const [showEditPresensi, setShowEditPresensi] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState({
    from: moment().format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
  });
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const { data, isLoading, isFetching, refetch } = usePresensiPagination(
    dataTable,
    keyword,
    date
  );
  const navigate = useNavigate();

  const onUpdate = useCallback(() => {
    setShowEditPresensi(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowEditPresensi(false);
    setDataId('');
  };

  const statusRender = (status) => {
    const statusColors = {
      Hadir: 'green',
      Izin: 'purple',
      Sakit: 'orange',
      Alpa: 'red',
    };

    const color = statusColors[status] || 'orange';
    return <Tag color={color}>{status}</Tag>;
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      align: 'left',
      width: window.innerWidth > 800 ? 70 : 50,
    },
    {
      title: 'Nama',
      dataIndex: 'namaPegawai',
      align: 'left',
      width: window.innerWidth > 800 ? 400 : 150,
    },
    {
      title: 'Tanggal',
      dataIndex: 'tgl_absensi',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
      width: window.innerWidth > 800 ? 150 : 150,
      render: (status) => statusRender(status),
    },
    // {
    //   title: 'Lampiran',
    //   dataIndex: 'lampiran',
    //   align: 'left',
    // },
    {
      title: 'Aksi',
      dataIndex: 'id',
      align: 'center',
      width: window.innerWidth > 800 ? 300 : 200,
      render: (id) => {
        return (
          <>
            <Tag
              color="orange"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setDataId(id);
                setShowEditPresensi(true);
              }}
            >
              Ubah
            </Tag>
          </>
        );
      },
    },
  ];

  const dataSource = data?.data
    ?.sort((a, b) => new Date(b.tgl_absensi) - new Date(a.tgl_absensi))
    .slice(0, dataTable.per_page)
    .map((x, i) => {
      return {
        ...x,
        key: x._id,
        index: i + 1,
        tgl_absensi: moment(x.tgl_absensi).format(format),
        namaPegawai: x?.Pegawai?.nama,
      };
    });

  const pagination = {
    current: dataTable.current_page,
    pageSize: dataTable.per_page,
    total: data?.data?.total,
    showSizeChanger: true,
    pageSizeOptions: [15, 20, 50, 100],
    onChange: (curr, size) => {
      setDataTable((prev) => {
        return {
          ...prev,
          current_page: curr,
          per_page: size,
        };
      });
    },
  };

  return (
    <>
      <div className="table-header">
        <h1>Presensi Harian Pegawai</h1>
        <Space>
          <Button type="primary" onClick={() => {
            navigate('/dashboard/hr/presensi/add');
          }}>
            Tambah Presensi Harian
          </Button>
        </Space>
      </div>
      <div
        className="presensi-filter"
      >
        <Input
          allowClear
          value={keyword}
          placeholder="cari nama..."
          prefix={<SearchOutlined />}
          onChange={({ target: { value } }) => setKeyword(value)}
          className="item-search"
        />
        <Tooltip Tooltip title="tanggal awal">
          <DatePicker
            value={dayjs(date.from)}
            onChange={(value) => {
              setDate((curr) => ({
                ...curr,
                from:
                  value !== null
                    ? value.format("YYYY-MM-DD")
                    : moment(firstDate).format("YYYY-MM-DD"),
              }));
            }}
            placeholder="Awal"
          />
        </Tooltip>
        <Tooltip Tooltip title="tanggal akhir">
          <DatePicker
            value={dayjs(date.to)}
            onChange={(value) =>
              setDate((curr) => ({
                ...curr,
                to:
                  value !== null
                    ? value.format("YYYY-MM-DD")
                    : moment(lastDate).format("YYYY-MM-DD"),
              }))
            }
            placeholder="Akhir"
          />
        </Tooltip>
      </div>
      <Table
        size="small"
        tableLayout="auto"
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{
          y: '50vh',
          x: 800,
        }}
      />
      <EditPresensi
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditPresensi}
      />
    </>
  );
};
