import { Form, Input, message, Modal, Radio } from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
import { jenisKelamin } from "../../user/constant";

const AddPegawai = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axios.post(VITE_BASE_URL + `/api/v1/employees`, values);
      message.success("Pegawai Berhasil Dimasukkan");
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
            name="nama"
            label="Nama"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nip"
            label="NIP"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tgl_lahir"
            label="Tanggal Lahir"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="jabatan"
            label="Jabatan"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="alamat"
            label="Alamat"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nomor_telepon"
            label="Nomor Telepon"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="jenis_kelamin"
            label="Jenis Kelamin"
            rules={[{ required: true }]}
          >
            <Radio.Group options={jenisKelamin} />
          </Form.Item>
          <Form.Item
            name="foto"
            label="Foto Pegawai"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddPegawai.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddPegawai;
