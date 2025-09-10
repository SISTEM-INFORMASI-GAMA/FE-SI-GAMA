import { Form, Input, DatePicker, message, Modal } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import propTypes from 'prop-types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const DATE_FMT = 'YYYY-MM-DD';

const AddTerm = ({ show, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [start, end] = values.range || [];
      const payload = {
        name: values.name,
        yearLabel: values.yearLabel,
        startDate: start.format(DATE_FMT),
        endDate: end.format(DATE_FMT),
      };

      // FE guard sederhana (urut tanggal)
      if (dayjs(payload.startDate).isAfter(dayjs(payload.endDate))) {
        message.error('Tanggal mulai tidak boleh setelah tanggal selesai.');
        return;
      }

      setLoading(true);
      await axios.post(`${VITE_BASE_URL}/api/v1/terms`, payload);

      message.success('Term berhasil ditambahkan');
      form.resetFields();
      onCreate();
    } catch (error) {
      message.error(error?.response?.data?.message || error.message || 'Gagal menyimpan');
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
      title="Tambah Term"
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
            name="name"
            label="Nama Term"
            rules={[{ required: true, message: 'Harap diisi' }, { max: 40 }]}
          >
            <Input placeholder="contoh: Ganjil" />
          </Form.Item>

          <Form.Item
            name="yearLabel"
            label="Tahun Ajar"
            rules={[{ required: true, message: 'Harap diisi' }, { max: 20 }]}
          >
            <Input placeholder="contoh: 2025/2026" />
          </Form.Item>

          <Form.Item
            name="range"
            label="Rentang Tanggal"
            rules={[{ required: true, message: 'Harap dipilih' }]}
          >
            <RangePicker format={DATE_FMT} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

AddTerm.propTypes = {
  show: propTypes.bool.isRequired,
  onCreate: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default AddTerm;
