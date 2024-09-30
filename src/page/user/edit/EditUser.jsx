import { Form, Input, message, Modal, Radio, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { userRoles } from "../constant";
import { useUserDetail } from "../../../hooks/user/useUserDetail";

const EditUser = ({ id, onUpdate, onCancel, show }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const { VITE_BASE_URL } = import.meta.env;

  const { data, isLoading, refetch } = useUserDetail(id, false);


  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch]);



  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        email: data.data.email,
        name: data.data.name,
        role: data.data.role,
      });
    }
  }, [data, form]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      if (Object.keys(newData).length === 0) {
        message.error('Nothing has changed');
        return;
      }

      await axios.patch(
        VITE_BASE_URL + `/api/v1/users/${id}`,
        {
          ...newData,
        }
      );

      message.success("user berhasil diubah");
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
      okText='Simpan'
      cancelText='Batal'
      onOk={handleSubmit}
      onCancel={handleCancelModal}
      okButtonProps={{ loading }}
      title='Edit Users'
    >
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <>
          <Form form={form} layout='vertical' className='full-form'>
            <div className='first-form'>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Harap diisi" }]}
                onChange={({ target: { value } }) => (newData["email"] = value)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                label="Nama"
                rules={[{ required: true, message: "Harap diisi" }]}
                onChange={({ target: { value } }) => (newData["name"] = value)}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Role"
                onChange={({ target: { value } }) => (newData["role"] = value)}
              >
                <Radio.Group options={userRoles} />
              </Form.Item>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

EditUser.propTypes = {
  show: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
  onUpdate: propTypes.func.isRequired,
  id: propTypes.string.isRequired,
};

export default EditUser;
