import RequireLogin from "./component/auth/RequireLogin";
import LayoutDasboard from "./layouts/dashboard-hr/LayoutDasboard";
import Dashboard from "./page/kepegawaian/dashboard/master/Dashboard";
import DetailPegawai from "./page/kepegawaian/pegawai/detail/DetailPegawai";
import { Pegawai } from "./page/kepegawaian/pegawai/master/Pegawai";
import { Presensi } from "./page/kepegawaian/presensi/master/Presensi";
import User from "./page/kepegawaian/user/master/User";

export const DataRoutesHr = [
  {
    path: "dashboard/hr/home",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Dashboard />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/hr/akun",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<User />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/hr/pegawai",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Pegawai />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/hr/pegawai/:pegawai_id",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DetailPegawai />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/hr/presensi",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Presensi />} />
      </RequireLogin>
    ),
  },
];
