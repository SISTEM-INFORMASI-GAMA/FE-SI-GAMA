import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import propTypes from 'prop-types';

const RequireLogin = ({ children }) => {
  if (!Cookies.get('token')) {
    return <Navigate to={'/ghjkl'} />;
  }
  return <>{children}</>;
};

RequireLogin.propTypes = {
  children: propTypes.element.isRequired,
};

export default RequireLogin;
