import RequireLogin from "./component/auth/RequireLogin";
import LayoutDasboard from "./layouts/dashboard-academic/LayoutDasboard";
import Dashboard from "./page/academic/dashboard/master/Dashboard";

export const DataRoutesAcademic = [
  {
    path: "dashboard/academic/home",
    element: (
      <RequireLogin>
        <LayoutDasboard content={<Dashboard />} />
      </RequireLogin>
    ),
  },
];
