import { Button, Input, Space, Table } from 'antd';
import { Popconfirm, Tag } from 'antd';
import { useCallback, useState } from 'react';
import { DeleteApi } from '../../../../services/DeleteApi';
import { useNavigate } from 'react-router-dom';
import AddSiswa from '../add/AddSiswa';
import EditSiswa from '../edit/EditSiswa';
import { SearchOutlined } from '@ant-design/icons';
import { useSiswaPagination } from "../../../../hooks/siswa/useSiswaPagination";

export const Siswa = () => {
  const [dataId, setDataId] = useState('');
  const [showAddSiswa, setShowAddSiswa] = useState(false);
  const [showEditSiswa, setShowEditSiswa] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const [keyword, setKeyword] = useState('');

  const { data, isLoading, isFetching, refetch } = useSiswaPagination(
    dataTable,
    keyword
  );

  const navigate = useNavigate();

  const onCreate = useCallback(() => {
    setShowAddSiswa(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditSiswa(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddSiswa(false);
    setShowEditSiswa(false);
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
      title: 'Nama',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: 'Jenis Kelamin',
      dataIndex: 'gender',
      align: 'left',
    },
    {
      title: 'NISN',
      dataIndex: 'nisn',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: 'Kelas',
      dataIndex: 'className',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: 'Agama',
      dataIndex: 'religion',
      align: 'left',
    },
    {
      title: 'Kota Lahir',
      dataIndex: 'city_of_birth',
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
                setShowEditSiswa(true);
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
                  url: '/api/v1/employees/',
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
        className: x.class?.name || '-',
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
        <h1>Daftar Siswa</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddSiswa(true)}>
            Tambah Siswa
          </Button>
        </Space>
      </div>
      <Input
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={handleChange}
        placeholder="Cari Siswa"
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
      <AddSiswa
        onCreate={onCreate}
        onCancel={onCancel}
        show={showAddSiswa}
      />
      <EditSiswa
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditSiswa}
      />
    </>
  );
};
