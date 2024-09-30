import { Button, Input, Space, Table } from "antd";
import { Popconfirm, Tag } from "antd";
import { useCallback, useState } from "react";
import "./Indikator.css";
import { DeleteApi } from "../../../services/DeleteApi";
import AddGaleri from "../add/AddIndikator";
import EditArticle from "../edit/EditIndikator";
import { useIndikatorPagination } from "../../../hooks/indikator/useIndikatorPagination";
import { SearchOutlined } from '@ant-design/icons';

const Indikator = () => {
  const [dataId, setDataId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [showEditArticle, setShowEditArticle] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });

  const { data, isLoading, isFetching, refetch } = useIndikatorPagination(
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
    {
      title: "Aspek", dataIndex: "aspek", align: "left",
      width: 80,
    },
    { title: "Indikator", dataIndex: "indikator", align: "left", width: 80, },
    { title: "Nama Kebijakan", dataIndex: "nama", align: "left" },
    { title: "Penanggung Jawab", dataIndex: "penanggungJawab", align: "left" },
    { title: "Penjelasan", dataIndex: "penjelasan", align: "left" },
    { title: "Data Pendukung", dataIndex: "dataPendukung", align: "left" },
    { title: "Tingkat Kematangan", dataIndex: "tingkatKematangan", align: "left" },
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
                  url: "/api/v1/indicators/",
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
        <h1>Daftar Indikator</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAddArticle(true)}>
            Tambah Indikator
          </Button>
        </Space>
      </div>
      <div className='search-wrapper filter-wrapper'>
        <Input
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={handleChange}
          placeholder='Cari Indikator Berdasarkan Nama'
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
          x: 1200,
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

export default Indikator;
