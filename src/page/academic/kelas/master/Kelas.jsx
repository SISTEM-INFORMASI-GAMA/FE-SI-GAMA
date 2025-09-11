import { Button, Input, Space, Table } from 'antd';
import { Popconfirm, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { DeleteApi } from '../../../../services/DeleteApi';
import { useNavigate } from 'react-router-dom';
import AddKelas from '../add/AddKelas';
import { SearchOutlined } from '@ant-design/icons';
import { useKelasPagination } from "../../../../hooks/akademik/kelas/useKelasPagination";
import EditKelas from "../edit/EditKelas";

export const Kelas = () => {
  const [dataId, setDataId] = useState('');
  const [showAddKelas, setShowAddKelas] = useState(false);
  const [showEditKelas, setShowEditKelas] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const [keyword, setKeyword] = useState('');

  const { data, isLoading, isFetching, refetch } = useKelasPagination(
    dataTable,
    keyword
  );

  const navigate = useNavigate();

  const onCreate = useCallback(() => {
    setShowAddKelas(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditKelas(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddKelas(false);
    setShowEditKelas(false);
    setDataId('');
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
      title: 'Kelas',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: "Tingkat",
      dataIndex: 'grade',
      align: 'left',
      width: 80,
    },
    {
      title: 'Wali Kelas',
      dataIndex: 'teacherName',
      align: 'left',
      width : 110,
    },
    {
      title: "Jumlah Siswa",
      dataIndex: "students_count",
      align: "center",
      width: 120,
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
              color="purple"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                navigate(`${id}/subjects`);
              }}
            >
              Mapel
            </Tag>
            <Tag
              color="orange"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setDataId(id);
                setShowEditKelas(true);
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
                  url: '/api/v1/classes/',
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

  const dataSource = data?.data
    .slice(0, dataTable.per_page)
    .map((x, i) => {
      return {
        ...x,
        key: x.id,
        index: i + 1,
        teacherName: x.pegawai ? x.pegawai.nama : ' - ',
        students_count: (
          <Tag color="blue" className="tag-round">
            {x.students.length}
          </Tag>
        ),
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
        <h1>Daftar Kelas</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddKelas(true)}>
            Tambah Kelas
          </Button>
        </Space>
      </div>
      <Input
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={handleChange}
        placeholder="Cari Kelas"
        className="search-input-billings"
        style={{
          border: '1px solid #d9d9d9',
          marginBottom: '10px',
          marginTop: '10px',
        }}
      />
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
      <AddKelas
        onCreate={onCreate}
        onCancel={onCancel}
        show={showAddKelas}
      />
      <EditKelas
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditKelas}
      />
    </>
  );
};
