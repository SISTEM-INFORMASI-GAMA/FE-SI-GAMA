import {
  Form,
  Input,
  message,
  Modal,
} from "antd";
import axios from "axios";
import { useState } from "react";
import propTypes from "prop-types";
import Cookies from "js-cookie";



const ResetPasswordUser = ({ id, show, onResetPassword, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { VITE_BASE_URL } = import.meta.env;

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await axios.patch(
        VITE_BASE_URL + `/api/v1/users/${id}`, values,
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
          },
        }
      );
      message.success("reset password berhasil");
      form.resetFields();
      onResetPassword();
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
            name="password"
            label="Password"
            rules={[{ required: true, message: "Harap diisi" }]}
          >
            <Input.Password />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

ResetPasswordUser.propTypes = {
  id: propTypes.string.isRequired,
  show: propTypes.bool.isRequired,
  onResetPassword: propTypes.func.isRequired,
  onCancel: propTypes.func.isRequired,
};


export default ResetPasswordUser;
