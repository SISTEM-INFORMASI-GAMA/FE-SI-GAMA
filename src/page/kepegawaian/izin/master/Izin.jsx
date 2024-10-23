import { Button, Popconfirm, Space, Table } from 'antd';
import { Tag } from 'antd';
import { useCallback, useState } from 'react';
import moment from 'moment';
// import AddPresensi from "../add/AddPresensi";
// import EditPresensi from "../edit/EditPresensi";
import { useIzinPagination } from '../../../../hooks/kepegawaian/izin/useIzinPagination';
import { DeleteApi } from '../../../../services/DeleteApi';
import { useNavigate } from 'react-router-dom';
import AddIzin from '../add/AddIzin';
const format = 'YYYY-MM-DD';

export const Izin = () => {
  const [dataId, setDataId] = useState('');
  const [showAddIzin, setShowAddIzin] = useState(false);
  const [showEditIzin, setShowEditIzin] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });

  const navigate = useNavigate();

  const { data, isLoading, isFetching, refetch } = useIzinPagination(
    dataTable,
    ''
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

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      align: 'left',
      width: window.innerWidth > 800 ? 70 : 50,
    },
    {
      title: 'Nama',
      dataIndex: 'nama',
      align: 'left',
    },
    {
      title: 'Tanggal Pengajuan',
      dataIndex: 'updatedAt',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: 'Tanggal Mulai',
      dataIndex: 'tgl_mulai',
      align: 'left',
    },
    {
      title: 'Tanggal Selesai',
      dataIndex: 'tgl_selesai',
      align: 'left',
    },
    {
      title: 'Jenis',
      dataIndex: 'jenis',
      align: 'left',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'left',
    },
    {
      title: 'Aksi',
      dataIndex: 'id',
      align: 'center',
      width: window.innerWidth > 800 ? 300 : 200,
      render: (id) => {
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
            <Popconfirm
              title="Yakin ingin menghapus ?"
              okText="Hapus"
              cancelText="Batal"
              onConfirm={() => {
                const dataId = id;
                DeleteApi({
                  url: '/api/v1/permissions/',
                  dataId,
                  refetch,
                });
              }}
            >
              <Tag color="magenta" style={{ cursor: 'pointer' }}>
                Hapus
              </Tag>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const dataSource = data?.data?.slice(0, dataTable.per_page).map((x, i) => {
    return {
      ...x,
      key: x._id,
      index: i + 1,
      updatedAt: moment(x.updatedAt).format(format),
      tgl_mulai: moment(x.tgl_mulai).format(format),
      tgl_selesai: moment(x.tgl_selesai).format(format),
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
        <h1>Pengajuan Izin Pegawai</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddIzin(true)}>
            Ajukan Izin Baru
          </Button>
        </Space>
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
      {
        <>
          <AddIzin onCreate={onCreate} onCancel={onCancel} show={showAddIzin} />
          {/* <EditPresensi
            id={dataId}
            onUpdate={onUpdate}
            onCancel={onCancel}
            show={showEditIzin}
          /> */}
        </>
      }
    </>
  );
};
