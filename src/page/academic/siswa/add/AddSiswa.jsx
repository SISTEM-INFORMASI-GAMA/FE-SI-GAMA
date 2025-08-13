import { DatePicker, Form, Input, message, Modal, Radio } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import propTypes from 'prop-types';
import { jenisKelamin } from '../constant';
const format = 'YYYY-MM-DD';

const AddSiswa = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await axios.post(VITE_BASE_URL + `/api/v1/students`, values);
      message.success('Data Pegawai Berhasil Dimasukkan');
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
      title="Tambah Siswa"
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
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <Input placeholder="Masukan Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Harap diisi' }]}
          >
            <Input.Password placeholder="Masukan Password" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Jenis Kelamin"
          >
            <Radio.Group options={jenisKelamin} />
          </Form.Item>
          <Form.Item
            name="agama"
            label="Agama"
          >
            <Input />
          </Form.Item>
          <Form.Item name="nis" label="NIS">
            <Input />
          </Form.Item>
          <Form.Item name="nisn" label="NISN">
            <Input />
          </Form.Item>
          <Form.Item name="nik" label="NIK">
            <Input />
          </Form.Item>
          <Form.Item
            name="tgl_lahir"
            label="Tanggal Lahir"
          >
            <DatePicker format={format} />
          </Form.Item>         
          <Form.Item
            name="city_of_birth"
            label="Kota Lahir"
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddSiswa.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddSiswa;
