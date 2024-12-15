import RequireLogin from './component/auth/RequireLogin';
import LayoutDasboard from './layouts/dashboard-hr/LayoutDasboard';
import Dashboard from './page/kepegawaian/dashboard/master/Dashboard';
import DetailIzin from './page/kepegawaian/izin/detail/DetailIzin';
import { Izin } from './page/kepegawaian/izin/master/Izin';
import DetailPegawai from './page/kepegawaian/pegawai/detail/DetailPegawai';
import ProfilePegawai from './page/kepegawaian/pegawai/detail/ProfilePegawai';
import { Pegawai } from './page/kepegawaian/pegawai/master/Pegawai';
import AddPresensiBatch from './page/kepegawaian/presensi/add/AddPresensiBatch';
import { Presensi } from './page/kepegawaian/presensi/master/Presensi';
import { RekapPresensi } from './page/kepegawaian/rekapPresensi/master/RekapPresensi';
import User from './page/kepegawaian/user/master/User';

export const DataRoutesHr = [
  {
    path: 'dashboard/hr/home',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Dashboard />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/akun',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<User />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/pegawai',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Pegawai />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/pegawai/:pegawai_id',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DetailPegawai />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/presensi',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Presensi />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/presensi/add',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<AddPresensiBatch />} />
      </RequireLogin>
    ),
  },

  {
    path: 'dashboard/hr/recap-presensi',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<RekapPresensi />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/izin',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Izin />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/izin/:izin_id',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DetailIzin />} />
      </RequireLogin>
    ),
  },
  {
    path: 'dashboard/hr/profile',
    element: (
      <RequireLogin>
        <LayoutDasboard content={<ProfilePegawai />} />
      </RequireLogin>
    ),
  },
];
