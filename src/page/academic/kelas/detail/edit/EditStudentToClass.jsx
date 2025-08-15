import { Form, Modal, Select, Skeleton, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useKelasPagination } from "../../../../../hooks/akademik/kelas/useKelasPagination";

const EditStudentToClass = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { VITE_BASE_URL } = import.meta.env;
  const { show, onUpdate, onCancel, className, selectedIds } = props;

  // fetch class list
  const { data, isLoading: skeleton, refetch } = useKelasPagination({
    current_page: 1,
    per_page: 100,
    total: 0,
  }, '', true);


  const dataClasses = data?.data
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((x) => x.name !== className);

  useEffect(() => {
    if (show) refetch();
  }, [show, refetch]);

  const onSubmit = () => {
    form
      .validateFields()
      .then(async (fieldsValue) => {
        setLoading(true);
        try {
          const { data } = await axios.post(
            VITE_BASE_URL + `/api/v1/classes/${fieldsValue.class_id}/students/batch`,
            { studentIds: selectedIds },
          );

          message.success(data.message);
          form.resetFields();
          onUpdate();
        } catch (error) {
          alert(error.message);
        }
        setLoading(false);
      })
      .catch(() => alert("Input Field Error"));
  };

  const onCancelModal = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      okText="Simpan"
      cancelText="Batal"
      onOk={onSubmit}
      open={props.show}
      onCancel={onCancelModal}
      title="Pindah Kelas"
      okButtonProps={{ loading }}
    >
      {skeleton ? <Skeleton active /> : null}

      {!skeleton ? (
        <Form form={form} layout="vertical">
          <Form.Item
            name="class_id"
            label="Nama Kelas"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {dataClasses?.map((data) => (
                <Select.Option key={data.id} value={data.id}>
                  {data.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      ) : null}
    </Modal>
  );
};

EditStudentToClass.propTypes = {
  show: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default EditStudentToClass;
