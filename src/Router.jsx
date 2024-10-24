import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./page/register/Register";
import { DataRoutes } from "./DataRoutes";
import LoginHR from "./page/kepegawaian/login/Login";
import LoginAcamemic from "./page/academic/login/Login";

const Router = () => {
  let arr = [];

  DataRoutes.map((data) => {
    if (Array.isArray(data)) arr.push(...data);
  });

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login/hr" />} />
      <Route path="/academic/register" element={<Register />} />
      <Route path="/login/academic" element={<LoginAcamemic />} />
      <Route path="/login/hr" element={<LoginHR />} />
      {arr.map((x) => {
        return <Route key={x.path} path={x.path} element={x.element} />;
      })}
    </Routes>
  );
};

export default Router;
