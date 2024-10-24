import { Button, Space, Table } from 'antd';
import { Tag } from 'antd';
import { useCallback, useState } from 'react';
import { usePresensiPagination } from '../../../../hooks/kepegawaian/presensi/usePresensiPagination';
import moment from 'moment';
import AddPresensi from '../add/AddPresensi';
import EditPresensi from '../edit/EditPresensi';
const format = 'YYYY-MM-DD';

export const Presensi = () => {
  const [dataId, setDataId] = useState('');
  const [showAddPresensi, setShowAddPresensi] = useState(false);
  const [showEditPresensi, setShowEditPresensi] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const { data, isLoading, isFetching, refetch } = usePresensiPagination(
    dataTable,
    ''
  );

  const onCreate = useCallback(() => {
    setShowAddPresensi(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditPresensi(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddPresensi(false);
    setShowEditPresensi(false);
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
    },
    {
      title: 'Lampiran',
      dataIndex: 'lampiran',
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
          <Button type="primary" onClick={() => setShowAddPresensi(true)}>
            Tambah Presensi Harian
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
          <AddPresensi
            onCreate={onCreate}
            onCancel={onCancel}
            show={showAddPresensi}
          />
          <EditPresensi
            id={dataId}
            onUpdate={onUpdate}
            onCancel={onCancel}
            show={showEditPresensi}
          />
        </>
      }
    </>
  );
};
