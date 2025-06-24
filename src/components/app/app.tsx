import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import { useEffect } from 'react';

function IngredientsDetails() {
  return null;
}

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state && location.state.background;

  const handleCloseModal = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (!location.state?.background) {
    }
  }, [location]);
  const isAuthenticated = true;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={isAuthenticated ? <Navigate to='/profile' /> : <Login />}
        />
        <Route
          path='/register'
          element={isAuthenticated ? <Navigate to='/profile' /> : <Register />}
        />
        <Route
          path='/forgot-password'
          element={
            isAuthenticated ? <Navigate to='/profile' /> : <ForgotPassword />
          }
        />
        <Route
          path='/reset-password'
          element={
            isAuthenticated ? <Navigate to='/profile' /> : <ResetPassword />
          }
        />
        <Route
          path='/profile'
          element={!isAuthenticated ? <Navigate to='/login' /> : <Profile />}
        />
        <Route
          path='/profile/orders'
          element={
            !isAuthenticated ? <Navigate to='/login' /> : <ProfileOrders />
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Order Details' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ingredient Details' onClose={handleCloseModal}>
                <IngredientsDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Order Details' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
