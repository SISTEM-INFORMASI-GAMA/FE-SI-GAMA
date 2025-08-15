// import { Tag } from "antd";
// import { useClassDetail } from "hooks/classes-hook/useClassDetail";
import useNavigateOnChangeUnit from "components/Helper/useNavigateOnChangeUnit";
import { useClassStudent } from "hooks/classes-hook/useClassStudent";
import { usePermission } from "hooks/usePermissions";
import { useState } from "react";
import { useParams } from "react-router-dom";

const DetailClassLogic = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [dataTable, setDataTable] = useState({
    current: 1,
    per_page: 10,
    total: 0,
  });

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const { class_id } = useParams();

  // fetch class detail
  const { data, isLoading, isFetching, refetch } = useClassStudent(
    class_id,
    keyword
  );

  // fetch permission student
  const { data: dataPermission } = usePermission("mdlAcademic", "mnuStudents");

  const btnAdd = dataPermission?.find((x) => x.id === "btnAddStudent");
  const btnEdit = dataPermission?.find((x) => x.id === "btnEditStudent");

  useNavigateOnChangeUnit();

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
    .sort((a, b) => a.name.localeCompare(b.name))
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
    total: data?.data.students.length,
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

  return {
    data,
    btnAdd,
    btnEdit,
    columns,
    isLoading,
    isFetching,
    showAdd,
    showEdit,
    pagination,
    dataSource,
    rowSelection,
    keyword,
    handleChange,
    onCreate,
    onUpdate,
    onCancel,
    setShowAdd,
    setShowEdit,
    setSelectedIds,
  };
};

export default DetailClassLogic;
