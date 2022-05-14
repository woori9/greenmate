import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';

function PrivateRoute({ isLoggedIn }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/intro" />;
}

PrivateRoute.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default PrivateRoute;
