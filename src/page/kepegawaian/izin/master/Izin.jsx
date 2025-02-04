import {
  Button,
  Divider,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import { useCallback, useState } from 'react';
import moment from 'moment';
import { useIzinPagination } from '../../../../hooks/kepegawaian/izin/useIzinPagination';
import { useNavigate } from 'react-router-dom';
import AddIzin from '../add/AddIzin';
import EditIzin from '../edit/EditIzin';
import axios from 'axios';
const format = 'YYYY-MM-DD';
import { SearchOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

export const Izin = () => {
  const [dataId, setDataId] = useState('');
  const [showAddIzin, setShowAddIzin] = useState(false);
  const [showEditIzin, setShowEditIzin] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));

  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isFetching, refetch } = useIzinPagination(
    dataTable,
    keyword
  );

  const onCreate = useCallback(() => {
    setShowAddIzin(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditIzin(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddIzin(false);
    setShowEditIzin(false);
    setDataId('');
  };

  const handleStatusIzin = async (id, status) => {
    try {
      await axios.patch(VITE_BASE_URL + `/api/v1/permissions/${id}/status`, {
        status: status,
      });
      message.success(
        `Pengajuan izin berhasil ${
          status === 'disetujui' ? 'disetujui' : 'ditolak'
        }`
      );
      refetch();
    } catch (error) {
      message.error(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const statusRender = (jenis) => {
    const statusColors = {
      Izin: '#3498DB',
      Sakit: '#F1C40F',
    };
    const color = statusColors[jenis] || 'orange';
    return <Tag color={color}>{jenis}</Tag>;
  };

  const handleChange = (e) => {
    setKeyword(e.target.value);
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
      width: window.innerWidth > 800 ? 250 : 150,
    },
    {
      title: 'Tanggal Pengajuan',
      dataIndex: 'createdAt',
      align: 'left',
      width: window.innerWidth > 800 ? 110 : 150,
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'tgl_mulai',
      align: 'left',
      width: window.innerWidth > 800 ? 110 : 150,
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tgl_selesai',
      align: 'left',
      width: window.innerWidth > 800 ? 110 : 150,
    },
    {
      title: 'Jenis',
      dataIndex: 'jenis',
      align: 'left',
      width: window.innerWidth > 800 ? 90 : 150,
      render: (jenis) => statusRender(jenis),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
      width: window.innerWidth > 800 ? 110 : 150,
    },
    {
      title: 'Aksi',
      dataIndex: 'id',
      align: 'center',
      width: window.innerWidth > 800 ? 300 : 200,
      render: (id, data) => {
        return (
          <>
            <Tag
              color="blue"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate(`${id}`);
              }}
            >
              Detail
            </Tag>
            {user?.role === 'user' && data.status === 'diajukan' && (
              <Tag
                color="orange"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setDataId(id);
                  setShowEditIzin(true);
                }}
              >
                Ubah
              </Tag>
            )}

            {data.status === 'diajukan' && user?.role === 'admin' && (
              <>
                <Popconfirm
                  title="Yakin ingin menyetujui ?"
                  okText="Setujui"
                  cancelText="Batal"
                  onConfirm={() => {
                    const dataId = id;
                    handleStatusIzin(dataId, 'disetujui');
                  }}
                >
                  <Tag color="green" style={{ cursor: 'pointer' }}>
                    Setujui
                  </Tag>
                </Popconfirm>
                <Popconfirm
                  title="Yakin ingin menolak ?"
                  okText="Tolak"
                  cancelText="Batal"
                  onConfirm={() => {
                    const dataId = id;
                    handleStatusIzin(dataId, 'ditolak');
                  }}
                >
                  <Tag color="red" style={{ cursor: 'pointer' }}>
                    Tolak
                  </Tag>
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  const dataSource = data?.data
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, dataTable.per_page)
    .map((x, i) => {
      return {
        ...x,
        key: x._id,
        index: i + 1,
        createdAt: moment(x.createdAt).format(format),
        tgl_mulai: moment(x.tgl_mulai).format(format),
        tgl_selesai: moment(x.tgl_selesai).format(format),
        namaPegawai: x?.Pegawai?.nama,
      };
    });

  const dataHistoryIzinUser = dataSource
    ?.filter((x) => x.pegawaiId === user.pegawaiId)
    .map((x, i) => {
      return {
        ...x,
        key: x._id,
        index: i + 1,
        createdAt: moment(x.createdAt).format(format),
        tgl_mulai: moment(x.tgl_mulai).format(format),
        tgl_selesai: moment(x.tgl_selesai).format(format),
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
    <div className="table-header">
      <h1>Pengajuan Izin Pegawai</h1>
      {user?.role === 'admin' && (
        <>
          <Input
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={handleChange}
            placeholder="Cari pegawai"
            className="search-input-billings"
            style={{
              border: '1px solid #d9d9d9',
              marginBottom: '10px',
              marginTop: '10px',
            }}
          />
          <Table
            size="small"
            tableLayout="fixed"
            columns={columns}
            loading={isLoading || isFetching}
            dataSource={dataSource}
            pagination={pagination}
            scroll={{
              y: '50vh',
              x: 800,
            }}
          />
        </>
      )}
      {user?.role === 'user' && (
        <>
          <Space>
            <Button type="primary" onClick={() => setShowAddIzin(true)}>
              Ajukan Izin Baru
            </Button>
          </Space>
          <Divider
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              backgroundColor: '#ccc',
              color: '#ccc',
            }}
          />
          <h5>Riwayat Pengajuan Izin Pegawai</h5>
          <Table
            size="small"
            tableLayout="fixed"
            columns={columns}
            loading={isLoading || isFetching}
            dataSource={dataHistoryIzinUser}
            pagination={pagination}
            scroll={{
              y: '50vh',
              x: { xs: 800, sm: 'max-content' },
            }}
            style={{
              overflowX: 'auto',
              width: '100%',
            }}
          />
        </>
      )}
      {
        <>
          <AddIzin onCreate={onCreate} onCancel={onCancel} show={showAddIzin} />
          <EditIzin
            id={dataId}
            onUpdate={onUpdate}
            onCancel={onCancel}
            show={showEditIzin}
          />
        </>
      }
    </div>
  );
};
