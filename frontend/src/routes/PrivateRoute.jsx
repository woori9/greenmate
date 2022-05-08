import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute({ isVerified }) {
  return isVerified ? <Outlet /> : <Navigate to="/intro" />;
}

PrivateRoute.propTypes = {
  isVerified: PropTypes.bool.isRequired,
};

export default PrivateRoute;
