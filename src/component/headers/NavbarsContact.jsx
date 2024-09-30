import { HiMail, HiPhone } from "react-icons/hi"
import './NavbarsContact.css'
import { Container } from "react-bootstrap"

const NavbarsContact = () => {
   return (
      <div className="navbars-contact-background">
         <Container>
            <div className="navbars-contact">
               <div className="navbars-contact-box">
                  <div className="navbars-contact-item">
                     <HiMail className="navbars-contact-icon" />
                     <p className="navbars-contact-text">diskominfo@bandarlampungkota.go.Id</p>
                  </div>
                  <div className="navbars-contact-item">
                     <HiPhone className="navbars-contact-icon" />
                     <p className="navbars-contact-text">(0721) - 481301</p>
                  </div>
               </div>
               <p className="navbars-contact-text-large">
                  PEMERINTAHAN KOTA BANDAR LAMPUNG
               </p>
            </div>
         </Container>
      </div>

   )
}

export default NavbarsContact