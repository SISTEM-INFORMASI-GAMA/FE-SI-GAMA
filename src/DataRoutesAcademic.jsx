import RequireLogin from "./component/auth/RequireLogin";
import LayoutDasboard from "./layouts/dashboard-academic/LayoutDasboard";
import Dashboard from "./page/academic/dashboard/master/Dashboard";
import DetailSiswa from "./page/academic/siswa/detail/DetailSiswa";
import { Siswa } from "./page/academic/siswa/master/Siswa";

export const DataRoutesAcademic = [
  {
    path: "dashboard/academic/home",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Dashboard />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/siswa",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Siswa />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/siswa/:id",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DetailSiswa />} />
      </RequireLogin>
    ),
  },
];
