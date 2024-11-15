import { Button, Input, Space, Table } from 'antd';
import { Popconfirm, Tag } from 'antd';
import { useCallback, useState } from 'react';
import './User.css';
import { DeleteApi } from '../../../../services/DeleteApi';
import AddUser from '../add/AddUser';
import EditUser from '../edit/EditUser';
import { useUserPagination } from '../../../../hooks/kepegawaian/user/useUserPagination';
import { SearchOutlined } from '@ant-design/icons';

const User = () => {
  const [dataId, setDataId] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const [keyword, setKeyword] = useState('');

  const { data, isLoading, isFetching, refetch } = useUserPagination(
    dataTable,
    keyword
  );

  const onCreate = useCallback(() => {
    setShowAddUser(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditUser(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddUser(false);
    setShowEditUser(false);
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
      title: 'email',
      dataIndex: 'email',
      align: 'left',
    },
    {
      title: 'Nama',
      dataIndex: 'name',
      align: 'left',
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: 'Role',
      dataIndex: 'role',
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
                setShowEditUser(true);
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
                  url: '/api/v1/users/',
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
    ?.sort((a, b) => a.Pegawai?.nama.localeCompare(b.Pegawai?.nama))
    .filter((x) => x.pegawaiId !== null)
    .slice(0, dataTable.per_page)
    .map((x, i) => {
      return {
        ...x,
        key: x.id,
        index: i + 1,
        name: x?.Pegawai?.nama,
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
        <h1>Daftar Akun Pegawai</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddUser(true)}>
            Tambah Akun
          </Button>
        </Space>
      </div>
      <Input
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={handleChange}
        placeholder="Cari Akun"
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
      <AddUser onCreate={onCreate} onCancel={onCancel} show={showAddUser} />
      <EditUser
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditUser}
      />
    </>
  );
};

export default User;
