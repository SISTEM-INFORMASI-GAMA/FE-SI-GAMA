import { Button, Space, Table, Input } from "antd";
import { Popconfirm, Tag } from "antd";
import { useCallback, useState } from "react";
import "./Regulasi.css";
import { DeleteApi } from "../../../services/DeleteApi";
import EditRegulasi from "../edit/EditRegulasi";
import { SearchOutlined } from '@ant-design/icons';
import { useRegulasiPagination } from "../../../hooks/regulasi/useRegulasiPagination";
import AddRegulasi from "../add/AddRegulasi";


const Regulasi = () => {
  const [dataId, setDataId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [showEditArticle, setShowEditArticle] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });

  const { data, isLoading, isFetching, refetch } = useRegulasiPagination(
    dataTable,
    keyword
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

  const handleChange = (param) => {
    setKeyword(param.target.value);
  };



  const columns = [
    {
      title: "No",
      dataIndex: "index",
      align: "left",
      width: window.innerWidth > 800 ? 70 : 50,
    },
    { title: "Judul", dataIndex: "title", align: "left" },
    { title: "Kategori", dataIndex: "kategori", align: "left" },
    { title: "Content", dataIndex: "content", align: "left" },
    {
      title: "File", dataIndex: "file", align: "left",
      render: (fileUrl) => {
        return (
          <a href={
            fileUrl
          } target="_blank" rel="noreferrer"
            style={{ color: "blue" }}
          >
            Download file
          </a>
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
        <h1>Daftar Regulasi</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddArticle(true)}>
            Tambah Regulasi
          </Button>
        </Space>
      </div>
      <div className='search-wrapper filter-wrapper'>
        <Input
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={handleChange}
          placeholder='Cari Regulasi Berdasarkan Nama'
        />
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
      <AddRegulasi
        onCreate={onCreate}
        onCancel={onCancel}
        show={showAddArticle}
      />
      <EditRegulasi
        id={dataId}
        onUpdate={onUpdate}
        onCancel={onCancel}
        show={showEditArticle}
      />
    </>
  );
};

export default Regulasi;
