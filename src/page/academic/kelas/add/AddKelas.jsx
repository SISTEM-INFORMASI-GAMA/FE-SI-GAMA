import { Form, Input, message, Modal, Select } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import propTypes from 'prop-types';
import { usePegawaiList } from "../../../../hooks/akademik/wali-kelas/usePegawaiList";

const AddKelas = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const {
    data: dataEmployee,
    isFetching,
  } = usePegawaiList();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await axios.post(VITE_BASE_URL + `/api/v1/classes`, values);
      message.success('Data Kelas Berhasil Dimasukkan');
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
      title="Tambah Kelas"
    >
      <Form form={form} layout="vertical" className="full-form">
        <div className="first-form">
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="grade"
            label="Tingkat"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pegawaiId"
            label="Wali Kelas"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={isFetching}
            >
              {dataEmployee?.data?.map((employee) => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.nama}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddKelas.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddKelas;
