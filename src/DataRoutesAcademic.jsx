import RequireLogin from "./component/auth/RequireLogin";
import LayoutDasboard from "./layouts/dashboard-academic/LayoutDasboard";
import Dashboard from "./page/academic/dashboard/master/Dashboard";
import AddKehadiran from "./page/academic/kehadiran/add/AddKehadiran";
import { Kehadiran } from "./page/academic/kehadiran/master/Kehadiran";
import DetailKelas from "./page/academic/kelas/detail/master/DetailKelas";
import { Kelas } from "./page/academic/kelas/master/Kelas";
import DetailSiswa from "./page/academic/siswa/detail/DetailSiswa";
import { Siswa } from "./page/academic/siswa/master/Siswa";
import Subject from "./page/academic/subject/master/Subject";
import Term from "./page/academic/term/master/Term";

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
  {
    path: "dashboard/academic/kelas",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Kelas />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/kelas/:id",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DetailKelas />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/kehadiran",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Kehadiran />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/kehadiran/add",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<AddKehadiran />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/subject",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Subject />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/term",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Term />} />
      </RequireLogin>
    ),
  },
];
