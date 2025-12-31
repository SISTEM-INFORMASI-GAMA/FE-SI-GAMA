import { Button } from 'react-bootstrap';
import './Login.css';
import { Form, Input, message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form] = Form.useForm();
  const url = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const res = await axios.post(`${url}/api/v1/users/login`, values);
      Cookies.set('token', res.data.token);
      Cookies.set('user', JSON.stringify(res.data.data.user));
      navigate('/dashboard/hr/home');
      message.success('login berhasil');
    } catch (error) {
      const msg = error.response.data.message;
      message.error(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="login-box">
          <img src="/logo.png" alt="Login logo" />
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <div className="login-title-box">
                <h1 className="login-title">Login Kepegawaian</h1>
              </div>
              <Form.Item
                name="identifier"
                label="Email"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Harap diisi' }]}
              >
                <Input.Password />
              </Form.Item>
              <Button
                type="primary"
                className="login-button"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
