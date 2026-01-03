import { DatePicker, Form, Input, InputNumber, Modal, Select, message } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useEffect } from 'react'; // 1. Import useEffect

const TYPES = [
  { label: 'Tugas', value: 'task' },
  { label: 'Kuis', value: 'quiz' },
  { label: 'UTS', value: 'uts' },
  { label: 'UAS', value: 'uas' },
];

const EditAssessment = ({ open, onClose, onSubmit, data }) => {
  const [form] = Form.useForm();

  // 2. Gunakan useEffect untuk memantau perubahan data
  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        title: data.title,
        type: data.type,
        weight: data.weight,
        dueDate: data.dueDate ? dayjs(data.dueDate) : null,
      });
    }
    
    // Reset fields saat modal ditutup agar tidak meninggalkan data lama
    if (!open) {
      form.resetFields();
    }
  }, [data, open, form]);

  const handleOk = async () => {
    try {
      const v = await form.validateFields();
      await onSubmit({
        title: v.title,
        type: v.type,
        weight: v.weight ?? 0,
        dueDate: v.dueDate ? v.dueDate.format('YYYY-MM-DD') : null,
      });
      // form.resetFields() sudah dihandle oleh useEffect saat onClose
      onClose(true);
    } catch (e) {
      if (e?.errorFields) return;
      message.error(e?.response?.data?.message || e.message);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Assessment"
      okText="Simpan"
      cancelText="Batal"
      onOk={handleOk}
      onCancel={() => onClose(false)} // Pastikan mengirim boolean false
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        // initialValues di sini boleh dihapus karena sudah dihandle setFieldsValue
      >
        <Form.Item name="title" label="Judul" rules={[{ required: true, message: 'Harap diisi' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="type" label="Tipe" rules={[{ required: true, message: 'Pilih tipe' }]}>
          <Select options={TYPES} />
        </Form.Item>

        <Form.Item name="weight" label="Bobot (%)">
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="dueDate" label="Jatuh Tempo">
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

EditAssessment.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default EditAssessment;