import { Form, Input, message, Modal, Radio, Select } from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
import { userRoles } from "../constant";
import { usePegawaiPagination } from "../../../../hooks/kepegawaian/pegawai/usePegawaiPagination";

const AddUser = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;
  const [dataTable] = useState({
    current_page: 1,
    per_page: 1000,
    total: 0,
  });

  const { data: dataPegawai, isLoading, isFetching } = usePegawaiPagination(
    dataTable,
    ""
  );

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      values.username = dataPegawai.data.find(
        (x) => x.id === values.pegawaiId
      ).nama;

      await axios.post(VITE_BASE_URL + `/api/v1/users/signup`, values);
      message.success("User Berhasil Dibuat");
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={show}
      okText="Simpan"
      cancelText="Batal"
      onOk={handleSubmit}
      onCancel={handleCancelModal}
      okButtonProps={{ loading }}
      title="Tambah User"
    >
      <Form form={form} layout="vertical" className="full-form">
        <div className="first-form">
          <Form.Item
            name="pegawaiId"
            label="Nama Pegawai"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Select
              placeholder="Pilih Pegawai"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={isFetching || isLoading}
            >
              {dataPegawai?.data?.map((x) => (
                <Select.Option
                  key={x.id}
                  value={x.id}
                  className="select-option-foundation"
                >
                  {x.nama}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input
              placeholder="Masukan Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input.Password
              placeholder="Masukan Password"
            />
          </Form.Item>
          <Form.Item name="role" label="Role"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Radio.Group options={userRoles}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddUser.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddUser;
