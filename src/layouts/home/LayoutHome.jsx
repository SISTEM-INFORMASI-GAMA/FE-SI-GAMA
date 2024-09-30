import Footer from "../../component/headers/Footer"
import Navbars from "../../component/headers/Navbars"
import propTypes from 'prop-types'
import NavbarsContact from "../../component/headers/NavbarsContact"

function LayoutHome(props) {
   return (
      <>
         <NavbarsContact />
         <Navbars />
         {props.content}
         <Footer />
      </>
   )
}

LayoutHome.propTypes = {
   content: propTypes.element.isRequired
}



export default LayoutHome