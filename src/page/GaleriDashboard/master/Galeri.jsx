import { Button, Space, Table } from "antd";
import { Popconfirm, Tag } from "antd";
import { useCallback, useState } from "react";
import "./Galeri.css";
import { DeleteApi } from "../../../services/DeleteApi";
import AddGaleri from "../add/AddGaleri";
import EditArticle from "../edit/EditGaleri";
import { useGaleriPagination } from "../../../hooks/galeri/useGaleriPagination";

const Article = () => {
  const [dataId, setDataId] = useState("");
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [showEditArticle, setShowEditArticle] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });

  const { data, isLoading, isFetching, refetch } = useGaleriPagination(
    dataTable,
    ''
  );

  const onCreate = useCallback(() => {
    setShowAddArticle(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEditArticle(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAddArticle(false);
    setShowEditArticle(false);
  };


  const columns = [
    {
      title: "No",
      dataIndex: "index",
      align: "left",
      width: window.innerWidth > 800 ? 70 : 50,
    },
    { title: "Judul", dataIndex: "nama", align: "left" },
    {
      title: "Tanggal", dataIndex: "tanggal", align: "left",
      render: (tanggal) => {
        // format date tanggal bulan tahun
        const date = new Date(tanggal);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      title: "Gambar", dataIndex: "gambarGaleri", align: "left",
      render: (gambarGaleri) => {
        return (
          <img
            src={gambarGaleri}
            alt="gambarGaleri"
            style={{ width: "100px", height: "100px" }}
          />
        );
      }
    },
    {
      title: "Aksi",
      dataIndex: "id",
      align: "center",
      width: window.innerWidth > 800 ? 200 : 150,
      render: (id) => {
        return (
          <>
            <Tag
              color="orange"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDataId(id);
                setShowEditArticle(true);
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
                  url: "/api/v1/galeris/",
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
      key: x._id,
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
        <h1>Daftar Kegiatan</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddArticle(true)}>
            Tambah Kegiatan
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
      <AddGaleri
        onCreate={onCreate}
        onCancel={onCancel}
        show={showAddArticle}
      />
      <EditArticle
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditArticle}
      />
    </>
  );
};

export default Article;
