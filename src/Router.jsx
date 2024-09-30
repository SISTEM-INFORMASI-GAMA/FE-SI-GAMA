import { Navigate, Route, Routes } from 'react-router-dom';
import Homepages from './page/home/Homepages';
import Register from './page/register/Register';
import Login from './page/login/Login';
import LayoutDasboard from './layouts/dashboard-hr/LayoutDasboard';
import Galeri from './page/GaleriDashboard/master/Galeri';
import LayoutHome from './layouts/home/LayoutHome';
import Profile from './page/Profile/Profile';
import User from './page/user/master/User';
import DashboardHome from './page/dashboardHome/DashboardHome';
import RequireLogin from './component/auth/RequireLogin';
import GaleriPage from "./page/Galeri/GaleriPage";
import LayoutContent from "./layouts/home/LayoutContent";
import IndikatorPage from "./page/indikator/indikatorPage";
import RegulasiPage from "./page/regulasi/RegulasiPage";
import Indikator from "./page/IndikatorDashboardTest/master/Indikator";
import Regulasi from "./page/RegulasiDashboard/master/Regulasi";

const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/profile' element={<LayoutHome content={<Profile />} />} />
      <Route path='/kegiatan' element={<LayoutHome content={<LayoutContent title="Galeri"><GaleriPage /></LayoutContent>} />} />
      <Route path='/indikator' element={<LayoutHome content={<LayoutContent title="Indikator"><IndikatorPage /></LayoutContent>} />} />
      <Route path='/regulasi' element={<LayoutHome content={<LayoutContent title="Regulasi"><RegulasiPage /></LayoutContent>} />} />
      <Route
        path='/dashboard/hr'
        element={
          <RequireLogin>
            <LayoutDasboard content={<DashboardHome />} />
          </RequireLogin>}
      />
      <Route
        path='/dashboard/galeri'
        element={
          <RequireLogin>
            <LayoutDasboard content={<Galeri />} />
          </RequireLogin>
        }
      />
      <Route
        path='/dashboard/indikator'
        element={
          <RequireLogin>
            <LayoutDasboard content={<Indikator />} />
          </RequireLogin>
        }
      />
      <Route
        path='/dashboard/regulasi'
        element={
          <RequireLogin>
            <LayoutDasboard content={<Regulasi />} />
          </RequireLogin>
        }
      />
      <Route
        path='/dashboard/user'
        element={
          <RequireLogin>
            <LayoutDasboard content={<User />} />
          </RequireLogin>
        }
      />
    </Routes>
  );
};

export default Router;
