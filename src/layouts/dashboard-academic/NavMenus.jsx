import { Menu } from "antd";
import propTypes from "prop-types";

const NavMenus = ({
   items,
   items2,
   theme,
   handleClickMenu,
   defaultMenu,
   defaultOpen,
}) => {
   return (
      <>
         <Menu
            style={{ fontSize: "1.05em" }}
            className="fixed-menu"
            theme={theme}
            mode="inline"
            defaultSelectedKeys={
               defaultMenu
            }
            defaultOpenKeys={window.innerWidth > 1000 ? defaultOpen : ""}
            items={items}
            onClick={handleClickMenu}
         />
         <Menu
            style={{ fontSize: "1.05em" }}
            theme={theme}
            mode="inline"
            items={items2}
            onClick={handleClickMenu}
         />
      </>
   );
};

NavMenus.propTypes = {
   items: propTypes.array.isRequired,
   items2: propTypes.array.isRequired,
   theme: propTypes.string.isRequired,
   handleClickMenu: propTypes.func.isRequired,
   defaultMenu: propTypes.string.isRequired,
   defaultOpen: propTypes.array.isRequired,
};

export default NavMenus;
