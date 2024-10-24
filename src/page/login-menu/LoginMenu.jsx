import { useNavigate } from 'react-router-dom';
import { BookOutlined, TeamOutlined } from '@ant-design/icons';
import './LoginMenu.css';

const LoginMenu = () => {
   const navigate = useNavigate();

   const handleNavigation = (path) => {
      navigate(path);
   };

   return (
      <div className="login-menu-container">
         <div className="login-menu-box">
            <h1>Silahkan pilih menu login</h1>
            <div className="login-options">
               <div className="login-option" onClick={() => handleNavigation('/login/hr')}>
                  <TeamOutlined className="login-menu-icon" />
                  <span>Login Human Resource</span>
               </div>
               <div className="login-option" onClick={() => handleNavigation('/login/academic')}>
                  <BookOutlined className="login-menu-icon" />
                  <span>Login Academic</span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LoginMenu;