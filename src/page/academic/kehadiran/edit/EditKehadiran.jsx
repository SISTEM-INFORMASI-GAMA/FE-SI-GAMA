import { Form, Input, message, Modal, Radio } from "antd";
import { useEffect, useState } from "react";
import propTypes from "prop-types";
import { statusPresensi } from "../constant";
import axios from "axios";

const EditKehadiran = ({ data, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  // ⬇️ ini yang bikin form auto-terisi saat modal dibuka / record berganti
  useEffect(() => {
    if (show && data) {
      form.setFieldsValue({
        status: data.status,
        note: data.note
      });
    }
  }, [show, data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {};
      if (values.status) payload.status = values.status;
      if ((values.note ?? "") !== (data?.note ?? "")) payload.note = values.note;

      if (Object.keys(payload).length === 0) {
        message.info("Tidak ada perubahan.");
        return;
      }

      setLoading(true);
      await axios.patch(`${VITE_BASE_URL}/api/v1/kehadiran/${data.id}`, payload);

      message.success("Status Absensi berhasil diubah");
      form.resetFields();
      onUpdate();
    } catch (error) {
      message.error(error?.response?.data?.message || "Fields Error");
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
      title="Edit Presensi"
      destroyOnClose // optional: biar form dirender ulang tiap buka
    >
      <Form key={data?.id} form={form} layout="vertical">
        <Form.Item
          name="status"
          label="Status Absensi"
          rules={[{ required: true, message: "Harap diisi" }]}
        >
          <Radio.Group options={statusPresensi} />
        </Form.Item>
        <Form.Item
          name="note"
          label="Deskripsi"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

EditKehadiran.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  data: propTypes.object.isRequired,
};

export default EditKehadiran;
