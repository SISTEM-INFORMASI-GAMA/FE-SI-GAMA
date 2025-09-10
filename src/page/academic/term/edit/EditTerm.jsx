import { Form, Input, DatePicker, message, Modal, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import propTypes from 'prop-types';
import dayjs from 'dayjs';
import { useTermDetail } from '../../../../hooks/akademik/term/useTermDetail';

const { RangePicker } = DatePicker;
const DATE_FMT = 'YYYY-MM-DD';

const EditTerm = ({ id, show, onUpdate, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const { data, isLoading, refetch } = useTermDetail(id, false);

  useEffect(() => {
    if (show && id) refetch();
  }, [show, id, refetch]);

  const row = data?.data ?? null;

  useEffect(() => {
    if (row) {
      form.setFieldsValue({
        name: row.name,
        yearLabel: row.yearLabel,
        range: [dayjs(row.startDate), dayjs(row.endDate)],
      });
    }
  }, [row, form]);

  const initialValues = useMemo(() => {
    if (!row) return {};
    return {
      name: row.name,
      yearLabel: row.yearLabel,
      startDate: row.startDate,
      endDate: row.endDate,
    };
  }, [row]);

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

      // cek perubahan sederhana
      const changed =
        payload.name !== initialValues.name ||
        payload.yearLabel !== initialValues.yearLabel ||
        payload.startDate !== initialValues.startDate ||
        payload.endDate !== initialValues.endDate;

      if (!changed) {
        message.info('Tidak ada perubahan.');
        return;
      }

      if (dayjs(payload.startDate).isAfter(dayjs(payload.endDate))) {
        message.error('Tanggal mulai tidak boleh setelah tanggal selesai.');
        return;
      }

      setLoading(true);
      await axios.patch(`${VITE_BASE_URL}/api/v1/terms/${id}`, payload);

      message.success('Term berhasil diubah');
      form.resetFields();
      onCancel();
      onUpdate();
    } catch (error) {
      message.error(error?.response?.data?.message || 'Fields Error');
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
      title="Edit Term"
      okText="Simpan"
      cancelText="Batal"
      onOk={handleSubmit}
      onCancel={handleCancel}
      okButtonProps={{ loading }}
      destroyOnClose
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
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
      )}
    </Modal>
  );
};

EditTerm.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditTerm;
