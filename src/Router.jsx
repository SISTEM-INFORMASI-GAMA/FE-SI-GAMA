import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./page/register/Register";
import Login from "./page/login/Login";
import { DataRoutes } from "./DataRoutes";

const Router = () => {
  let arr = [];

  DataRoutes.map((data) => {
    if (Array.isArray(data)) arr.push(...data);
  });

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {arr.map((x) => {
        return <Route key={x.path} path={x.path} element={x.element} />;
      })}
    </Routes>
  );
};

export default Router;
