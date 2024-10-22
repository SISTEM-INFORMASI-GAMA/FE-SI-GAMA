import { Button, Space, Table } from "antd";
import { Popconfirm, Tag } from "antd";
import { useCallback, useState } from "react";
import { DeleteApi } from "../../../../services/DeleteApi";
import { usePegawaiPagination } from "../../../../hooks/kepegawaian/pegawai/usePegawaiPagination";
import { useNavigate } from "react-router-dom";
import AddPegawai from "../add/AddPegawai";
import EditPegawai from "../edit/EditPegawai";

export const Pegawai = () => {
  const [dataId, setDataId] = useState("");
  const [showAddPegawai, setShowAddPegawai] = useState(false);
  const [showEditPegawai, setShowEditPegawai] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });
  const { data, isLoading, isFetching, refetch } = usePegawaiPagination(
    dataTable,
    ""
  );

  const navigate = useNavigate();

  const onCreate = useCallback(() => {
    setShowAddPegawai(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditPegawai(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddPegawai(false);
    setShowEditPegawai(false);
    setDataId("");
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      align: "left",
      width: window.innerWidth > 800 ? 70 : 50,
    },
    {
      title: "Nama",
      dataIndex: "nama",
      align: "left",
    },
    {
      title: "NIP",
      dataIndex: "nip",
      align: "left",
      width: window.innerWidth > 800 ? 200 : 150,
    },
    {
      title: "Jabatan",
      dataIndex: "jabatan",
      align: "left",
    },
    {
      title: "Aksi",
      dataIndex: "id",
      align: "center",
      width: window.innerWidth > 800 ? 300 : 200,
      render: (id) => {
        return (
          <>
            <Tag
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`${id}`);
              }}
            >
              Detail
            </Tag>
            <Tag
              color="orange"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDataId(id);
                setShowEditPegawai(true);
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
                  url: "/api/v1/users/",
                  dataId,
                  refetch,
                });
              }}
            >
              <Tag color="magenta" style={{ cursor: "pointer" }}>
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
      key: x.id,
      index: i + 1,
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
        <h1>Daftar Pegawai</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddPegawai(true)}>
            Tambah Pegawai
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
          y: "50vh",
          x: 800,
        }}
      />
      <AddPegawai
        onCreate={onCreate}
        onCancel={onCancel}
        show={showAddPegawai}
      />
      <EditPegawai
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditPegawai}
      />
      {/* <ResetPasswordUser
          id={dataId}
          onResetPassword={onResetPassword}
          onCancel={onCancel}
          show={showResetPassword}
        /> */}
    </>
  );
};
