import RequireLogin from "./component/auth/RequireLogin";
import LayoutDasboard from "./layouts/dashboard-academic/LayoutDasboard";
import Assessments from "./page/academic/assessment/master/Assessments";
import ClassSubjects from "./page/academic/class-subject/master/ClassSubjects";
import Dashboard from "./page/academic/dashboard/master/Dashboard";
import AssessmentsGuru from "./page/academic/guru/AssessmentsGuru";
import DashboardGuru from "./page/academic/guru/DashboardGuru";
import ScoresGuru from "./page/academic/guru/ScoresGuru";
import AddKehadiran from "./page/academic/kehadiran/add/AddKehadiran";
import { Kehadiran } from "./page/academic/kehadiran/master/Kehadiran";
import DetailKelas from "./page/academic/kelas/detail/master/DetailKelas";
import { Kelas } from "./page/academic/kelas/master/Kelas";
import Profile from "./page/academic/profile/Profile";
import Scores from "./page/academic/score/Scores";
import AssessmentsSiswa from "./page/academic/siswa/AssessmentsSiswa";
import DashboardSiswa from "./page/academic/siswa/DashboardSiswa";
import DetailSiswa from "./page/academic/siswa/detail/DetailSiswa";
import GradesSiswa from "./page/academic/siswa/GradesSiswa";
import { Siswa } from "./page/academic/siswa/master/Siswa";
import ReportSiswa from "./page/academic/siswa/ReportSiswa";
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
    path: "dashboard/academic/kelas/:id/subjects",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<ClassSubjects />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/kelas/:id/subjects/:subjectId/assessments",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Assessments />} />
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
  {
    path: "dashboard/academic/kelas/:id/subjects/:subjectId/assessments/:assessmentId/scores",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Scores />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/guru",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DashboardGuru />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/guru/class-subjects/:id/assessments",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<AssessmentsGuru />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/guru/assessments/:id/scores",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<ScoresGuru />} />
      </RequireLogin>
    ),
  },
   // ======== PORTAL SISWA ========
  {
    path: "dashboard/academic/studentdashboard",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<DashboardSiswa />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/studentgrades",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<GradesSiswa />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/student/assessments",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<AssessmentsSiswa />} />
      </RequireLogin>
    ),
  },
  {
    path: "dashboard/academic/studentreport",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<ReportSiswa />} />
      </RequireLogin>
    ),
  },
   {
    path: "dashboard/academic/profile",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Profile />} />
      </RequireLogin>
    ),
  },
];
