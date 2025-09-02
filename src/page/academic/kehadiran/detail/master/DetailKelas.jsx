import { Button, Input, Space, Table } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useKelasDetail } from "../../../../../hooks/akademik/kelas/useKelasDetail";
import AddStudentToClassBatch from "../create/AddStudentToClassBatch";
import EditStudentToClass from "../edit/EditStudentToClass";


const DetailKelas = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [dataTable, setDataTable] = useState({
    current: 1,
    per_page: 10,
    total: 0,
  });

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const { id: class_id } = useParams();

  // fetch class detail
  const { data, isLoading, isFetching, refetch } = useKelasDetail(
    class_id,
    dataTable,
    keyword,
    true
  );

  const onCreate = () => {
    setShowAdd(false);
    refetch();
  };

  const onUpdate = () => {
    setShowEdit(false);
    setSelectedIds([]);
    refetch();
  };

  const onCancel = () => {
    setShowAdd(false);
    setShowEdit(false);
  };

  const handleChange = (param) => {
    setKeyword(param.target.value);
  };

  const onSelectChange = (key) => {
    // Extract the 'id' property from the selected rows
    setSelectedIds(key);
  };

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "No",
      dataIndex: "index",
      align: "left",
      width: window.innerWidth > 800 ? 20 : 40,
      fixed: "left",
    },
    {
      title: "Nama",
      dataIndex: "name",
      align: "left",
      width: 150,
      fixed: "left",
    },
    { title: "NIS", dataIndex: "nis", align: "left", width: 200 },
    { title: "NISN", dataIndex: "nisn", align: "left", width: 200 },
  ];

  const dataSource = data?.data.students
    .rows
    .map((data, index) => {
      return {
        ...data,
        key: data.id,
        index: index + 1,
      };
    });

  const pagination = {
    current: dataTable.current,
    pageSize: dataTable.per_page,
    total: data?.data.students.pagination.length,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
    onChange: (curr, size) => {
      setDataTable((prev) => {
        return {
          ...prev,
          current: curr,
          per_page: size,
        };
      });
    },
  };

  return (
    <>
      <div className="table-header">
        <h1>Daftar Siswa Kelas ({data?.data.name})</h1>
        <Space>
          <Button
            disabled={selectedIds.length === 0}
            onClick={() => setShowEdit(true)}
          >
            Pindah Kelas
          </Button>
          <Button
            type="primary"
            onClick={() => setShowAdd(true)}
          >
            Tambah Siswa
          </Button>
        </Space>
      </div>
      <div className="search-wrapper filter-wrapper">
        <Input
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={handleChange}
          placeholder=" cari nama siswa"
        />
      </div>
      <Table
        size="small"
        tableLayout="auto"
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={rowSelection}
        scroll={
          window.innerHeight < 760
            ? {
              y: "50vh",
              // x: 800,
              x: "max-content",
            }
            : {
              y: "55vh",
              // x: 800,
              x: "max-content",
            }
        }
      />
      <AddStudentToClassBatch
        show={showAdd}
        onCreate={onCreate}
        onCancel={onCancel}
      />
      
      <EditStudentToClass
        show={showEdit}
        onUpdate={onUpdate}
        onCancel={onCancel}
        className={data?.data.name}
        selectedIds={rowSelection.selectedRowKeys}
      />
    </>
  );
};

export default DetailKelas;
