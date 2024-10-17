import { Button } from "react-bootstrap";
import "./Login.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const url = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const res = await axios.post(`${url}/api/v1/users/login`, values);
      Cookies.set("token", res.data.token);
      Cookies.set("user", JSON.stringify(res.data.data.user));
      navigate("/dashboard/hr/home");
      message.success("login berhasil");
    } catch (error) {
      const msg = error.response.data.message;
      message.error(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="login-box">
          <img src="/assets/img/logo.png" alt="spbe Logo" />
          <hr />
          <Form form={form} layout="vertical" className="full-form">
            <div className="first-form">
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Harap diisi" }]}
              >
                <Input.Password />
              </Form.Item>
            </div>
          </Form>
          <Button type="primary" className="login-button" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
