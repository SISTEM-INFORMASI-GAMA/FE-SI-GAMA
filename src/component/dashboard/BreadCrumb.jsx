import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const BreadCrumb = () => {
   const location = useLocation();

   const breadcrumbView = () => {
      const { pathname } = location;

      const pathnames = pathname.split("/").filter((item) => item);

      const handleName = (value) => {
         if (value.includes("-") && value.length > 20) {
            return value.split("-")[0];
         }

         return value.toLowerCase();
      };

      return (
         <Breadcrumb separator=">" style={{ margin: "13px 0" }}>
            {pathnames.length > 0 ? (
               <Breadcrumb.Item>
                  <Link to="/home">Home</Link>
               </Breadcrumb.Item>
            ) : null}

            {pathnames.map((name, index) => {
               const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;

               return (
                  <Breadcrumb.Item key={index} className="title-case">
                     <Link to={routeTo}>{handleName(name)}</Link>
                  </Breadcrumb.Item>
               );
            })}
         </Breadcrumb>
      );
   };

   return <>{breadcrumbView()}</>;
};

export default BreadCrumb;
