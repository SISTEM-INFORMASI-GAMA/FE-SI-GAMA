import { Form, Input, message, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";

const AddSubject = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axios.post(`${VITE_BASE_URL}/api/v1/subjects`, values);

      message.success("Subject berhasil ditambahkan");
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error?.response?.data?.message || error.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={show}
      title="Tambah Subject"
      okText="Simpan"
      cancelText="Batal"
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{ loading }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" className="full-form">
        <div className="first-form">
          <Form.Item
            name="code"
            label="Kode"
            rules={[
              { required: true, message: "Harap diisi" },
              { max: 20, message: "Maks. 20 karakter" },
            ]}
          >
            <Input placeholder="contoh: MTK-10" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Nama Mapel"
            rules={[
              { required: true, message: "Harap diisi" },
              { max: 120, message: "Maks. 120 karakter" },
            ]}
          >
            <Input placeholder="contoh: Matematika" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddSubject.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddSubject;
