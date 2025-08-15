import { Form, Input, Modal, Table, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useStudentNotInClass } from "../../../../../hooks/akademik/kelas/useStudentNotInClass";

const AddStudentToClassBatch = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
  });
  const [keyword, setKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const { VITE_BASE_URL } = import.meta.env;
  const { show, onCreate, onCancel } = props;
  const { id: classId } = useParams();

  // fetch data students
  const { data, isLoading, refetch } = useStudentNotInClass(
    classId,
    dataTable,
    keyword,
    true
  );

  
  useEffect(() => {
    if (show) refetch();
  }, [show, refetch]);

  const onCancelModal = () => {
    setSelectedIds([]);
    form.resetFields();
    onCancel();
  };

  const columns = [
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
    },
  ];

  const handleSearch = (event) => {
    setKeyword(event.target.value);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedIds(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedIds,
    onChange: onSelectChange,
    preserveSelectedRowKeys: true,
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedIds.length === 0)
        return alert("Harap pilih siswa yang akan ditambahkan");

      const { data } = await axios.post(
        VITE_BASE_URL + `/api/v1/classes/${classId}/students/batch`,
        { studentIds: selectedIds },
      );
      message.success(data.message);
      form.resetFields();
      onCreate();
      setSelectedIds([]);
    } catch (error) {
      let msg = error?.response?.data?.message || "Input Field Error";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const dataSource = data?.data.students
    .rows
    .slice(0, dataTable.per_page)
    .map((employee, index) => {
      return {
        ...employee,
        index: index + 1,
        key: employee.id,
      };
    });

  const pagination = {
    current: dataTable.current_page,
    pageSize: dataTable.per_page,
    total: data?.data.students.pagination.length,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
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
    <Modal
      okText="Simpan"
      cancelText="Batal"
      closable={false}
      onOk={handleSubmit}
      open={props.show}
      onCancel={onCancelModal}
      okButtonProps={{ loading }}
      title="Tambah Siswa ke Kelas"
    >
      <Form form={form} layout="vertical">
        <div className="search-wrapper filter-wrapper">
          <Form.Item style={{ width: "100%", marginBottom: 0 }}>
            <Input
              value={keyword}
              onChange={handleSearch}
              placeholder=" Cari nama siswa"
              disabled={loading}
            />
          </Form.Item>
        </div>
        <Table
          style={{ marginBottom: 20 }}
          size={window.innerWidth > 1600 ? "middle" : "small"}
          pagination={pagination}
          tableLayout="auto"
          dataSource={dataSource}
          columns={columns}
          loading={isLoading}
          rowSelection={rowSelection}
          scroll={
            window.innerHeight < 690
              ? {
                y: "40vh",
                x: 300,
              }
              : window.innerHeight < 760
                ? {
                  y: "50vh",
                  x: 300,
                }
                : {
                  y: "55vh",
                  x: 300,
                }
          }
        />
      </Form>
    </Modal>
  );
};

AddStudentToClassBatch.propTypes = {
  show: PropTypes.bool.isRequired,
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddStudentToClassBatch;
