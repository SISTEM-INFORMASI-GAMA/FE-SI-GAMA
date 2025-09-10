import { Button, Input, Space, Table, Tag, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useSubjectPagination } from "../../../../hooks/akademik/subject/useSubjectPagination";
import AddSubject from "../add/AddSubject";
import EditSubject from "../edit/EditSubject";
import { DeleteApi } from "../../../../services/DeleteApi";

const Subject = () => {
  const [dataDetail, setDataDetail] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [tableState, setTableState] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
  });

  const [keyword, setKeyword] = useState("");
  const [search] = useDebounce(keyword, 500);

  const { data, isLoading, isFetching, refetch } = useSubjectPagination(
    tableState,
    search,
    { sortBy: "name", sortDir: "ASC" }
  );

  const onCreate = useCallback(() => {
    setShowAdd(false);
    refetch();
  }, [refetch]);

  const onUpdate = useCallback(() => {
    setShowEdit(false);
    refetch();
  }, [refetch]);

  const onCancel = () => {
    setShowAdd(false);
    setShowEdit(false);
    setDataDetail("");
  };

  const handleChange = (e) => setKeyword(e.target.value);

  const columns = useMemo(
    () => [
      {
        title: "No",
        dataIndex: "index",
        align: "left",
        width: window.innerWidth > 800 ? 70 : 50,
        fixed: "left",
      },
      {
        title: "Kode",
        dataIndex: "code",
        align: "left",
        width: 140,
      },
      {
        title: "Nama Mapel",
        dataIndex: "name",
        align: "left",
      },
      {
        title: "Aksi",
        dataIndex: "id",
        align: "center",
        width: window.innerWidth > 800 ? 260 : 200,
        render: (id, records) => (
          <>
            <Tag
              color="orange"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDataDetail(records);
                setShowEdit(true);
              }}
            >
              Ubah
            </Tag>
            <Popconfirm
              title="Yakin ingin menghapus subject ini?"
              okText="Hapus"
              cancelText="Batal"
              onConfirm={() =>
                DeleteApi({
                  url: "/api/v1/subjects/",
                  dataId: id,
                  refetch,
                })
              }
            >
              <Tag color="magenta" style={{ cursor: "pointer" }}>
                Hapus
              </Tag>
            </Popconfirm>
          </>
        ),
      },
    ],
    [refetch]
  );

  const dataSource = useMemo(() => {
    const rows = Array.isArray(data?.data?.rows) ? data.data.rows : data?.data || [];
    return rows.slice(0, tableState.per_page).map((x, i) => ({
      ...x,
      key: x.id,
      index: (tableState.current_page - 1) * tableState.per_page + (i + 1),
    }));
  }, [data, tableState]);

  const totalItems = useMemo(() => {
    // BE kamu mungkin mengirim total di data.total atau data.data.total
    return data?.data?.total ?? data?.total ?? data?.meta?.total ?? data?.count ?? 0;
  }, [data]);

  const pagination = {
    current: tableState.current_page,
    pageSize: tableState.per_page,
    total: totalItems,
    showSizeChanger: true,
    pageSizeOptions: [15, 20, 50, 100],
    onChange: (curr, size) =>
      setTableState((prev) => ({ ...prev, current_page: curr, per_page: size })),
  };

  return (
    <>
      <div className="table-header">
        <h1>Daftar Mata Pelajaran</h1>
        <Space>
          <Button type="primary" onClick={() => setShowAdd(true)}>
            Tambah Subject
          </Button>
        </Space>
      </div>

      <Input
        prefix={<SearchOutlined />}
        value={keyword}
        onChange={handleChange}
        placeholder="Cari subject (kode/nama)"
        className="search-input-billings"
        style={{
          border: "1px solid #d9d9d9",
          marginBottom: 10,
          marginTop: 10,
        }}
        allowClear
      />

      <Table
        size="small"
        tableLayout="auto"
        columns={columns}
        loading={isLoading || isFetching}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ y: "50vh", x: 800 }}
        rowKey="id"
      />

      <AddSubject show={showAdd} onCreate={onCreate} onCancel={onCancel} />
      <EditSubject data={dataDetail} show={showEdit} onUpdate={onUpdate} onCancel={onCancel} />
    </>
  );
};

export default Subject;
