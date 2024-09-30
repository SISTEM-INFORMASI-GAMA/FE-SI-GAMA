import { useState } from "react";
import log from "../../assets/image/login.png";
// import goggleImg from "../../assets/image/google.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      };
      const response = await axios.post(`${URL}/api/v1/auth/register`, data);
      message.success(response.data.message);
      navigate("/login");
    } catch (error) {
      let msg = error?.response?.data?.message || "Register Failed";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hero">
      <section className="container-fluid min-vh-100">
        <div className="row">
          <div
            className="col-md-6 col-3 d-none d-md-block vh-100 bg-image"
            style={{ backgroundImage: `url(${log})` }}
          ></div>
          <div className="col-md-6 px-4 d-grid">
            <h2 className="login d-flex align-items-end py-2">Sign Up</h2>
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="firstname" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstname"
                  placeholder="firstname"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastname" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastname"
                  placeholder="lastname"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="col-12">
                <label htmlFor="inputEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail"
                  placeholder="masukkan email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-12">
                <label htmlFor="inputPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword"
                  placeholder="masukkan password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="gridCheck"
                    required
                    onChange={(e) => setConfirm(e.target.checked)}
                    value={confirm}
                  />
                  <label className="form-check-label" htmlFor="gridCheck">
                    I agree with <a href="">Terms & Conditions</a>
                  </label>
                </div>
              </div>
              <div className="button container-fluid">
                <div className="row">
                  <button type="submit" className="btn btn-primary col-lg-12" disabled={
                    loading || !confirm
                  }>
                    Register
                  </button>
                </div>
                {/* <span className="d-flex justify-content-center py-2">or</span>
                <div className="row">
                  <button
                    type="submit"
                    className="btn btn-close-white border-primary border-2 col-lg-12"
                  >
                    <img src={goggleImg} alt="" /> Log in with Google
                  </button>
                </div> */}
                <div className="line_border_bottom"></div>
                <div className="signup row">
                  <span className=" col-lg-12 px-lg-2 ">
                    <Link to="/login">Already have an account?</Link>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Register;
