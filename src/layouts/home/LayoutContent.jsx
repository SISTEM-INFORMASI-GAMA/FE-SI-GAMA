import PropTypes from 'prop-types';
import './LayoutContent.css';


const LayoutContent = ({ title, children }) => {
   return (
      <div className="layout-content-container">
         <div className="container">
            <h1>{title}</h1>
            <hr />
            {
               children
            }
         </div>
      </div>
   )
}


LayoutContent.propTypes = {
   title: PropTypes.string.isRequired,
   children: PropTypes.node.isRequired,
};


export default LayoutContent