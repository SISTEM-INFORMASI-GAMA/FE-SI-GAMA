import { DatePicker, Form, Input, InputNumber, Modal, Select, message } from 'antd';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

const TYPES = [
  { label: 'Tugas', value: 'task' },
  { label: 'Kuis', value: 'quiz' },
  { label: 'UTS', value: 'uts' },
  { label: 'UAS', value: 'uas' },
  { label: 'Project', value: 'project' },
  { label: 'Praktik', value: 'practical' },
];

const EditAssessment = ({ open, onClose, onSubmit, data }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const v = await form.validateFields();
      await onSubmit({
        title: v.title,
        type: v.type,
        weight: v.weight ?? 0,
        dueDate: v.dueDate ? v.dueDate.format('YYYY-MM-DD') : null,
      });
      form.resetFields();
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
      onCancel={() => onClose(false)}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title: data?.title,
          type: data?.type,
          weight: data?.weight,
          dueDate: data?.dueDate ? dayjs(data.dueDate) : null,
        }}
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
