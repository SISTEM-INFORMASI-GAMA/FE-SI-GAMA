import { Popconfirm } from "antd";
import { Link, useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import Cookies from "js-cookie";

const Logout = ({ children }) => {
   const navigate = useNavigate();

   const handleLogout = () => {
      Cookies.remove("token");
      Cookies.remove("email");
      Cookies.remove('role');
      Cookies.remove('id');
      navigate("/");
   }


   return (
      <Popconfirm
         okText="Logout"
         cancelText="Batal"
         title="Yakin ingin keluar ?"
         onConfirm={
            handleLogout
         }
      >
         <Link className="link-logout">{children}</Link>
      </Popconfirm>
   );
};

Logout.propTypes = {
   children: propTypes.string.isRequired,
};

export default Logout;
