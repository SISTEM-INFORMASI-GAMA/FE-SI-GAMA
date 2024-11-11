import { Form, message, Modal, Radio, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { statusPresensi } from '../constant';
import { usePresensiDetail } from '../../../../hooks/kepegawaian/presensi/usePresensiDetail';

const EditPresensi = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, isLoading, refetch } = usePresensiDetail(id, false);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        status: data?.data?.status,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updatedData = {
        status: values.status || data?.data?.status,
      };

      if (Object.keys(updatedData).length === 0) {
        message.error('Nothing has changed');
        return;
      }

      await axios.patch(
        VITE_BASE_URL + `/api/v1/attendence/${id}`,
        updatedData
      );

      message.success('Status Absensi berhasil diubah');
      form.resetFields();
      onUpdate();
    } catch (error) {
      message.error(error.response?.data?.message || 'Fields Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelModal = () => {
    form.resetFields();
    setNewData({});
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
      title="Edit Presensi Pegawai"
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <Form.Item
                name="status"
                label="Status Absensi"
                rules={[{ required: true, message: 'Harap diisi' }]}
                onChange={({ target: { value } }) =>
                  (newData['status'] = value)
                }
              >
                <Radio.Group options={statusPresensi} />
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditPresensi.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditPresensi;
