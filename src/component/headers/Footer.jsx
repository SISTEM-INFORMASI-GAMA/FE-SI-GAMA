import './Footer.css'

function Footer() {
  return (
    <div>
      <footer className='footer-container text-lg-start bg-light text-dark pt-1'>
        <div className='container'>
          <section>
            <div className='container text-md-start mt-5'>
              <div className='row mt-3'>
                <div className='col-12 col-sm-6 mx-auto mb-4'>
                  <div>
                    <img src='/assets/img/logo.png' alt='spbe Logo' />
                  </div>
                  <div className='logocaption'>
                    <p className='mt-2'>
                      merupakan platform yang menyediakan informasi dan mengelola data indikator SPBE di wilayah Kota Bandar Lampung.
                    </p>
                  </div>
                  <div className='row1'>
                    <div className='footer-brands'>
                      <a href='https://www.facebook.com/diskominfobandarlampung' target="_blank" rel="noopener noreferrer">
                        <i className='fa-brands fa-facebook fa-lg'></i>
                      </a>
                      <a href='https://twitter.com/kominfoblampung' target="_blank" rel="noopener noreferrer">
                        <i className='fa-brands fa-twitter fa-lg'></i>
                      </a>
                      <a href='https://instagram.com/kominfobandarlampung?igshid=MDM4ZDc5MmU=' target="_blank" rel="noopener noreferrer">
                        <i className='fa-brands fa-instagram fa-lg'></i>
                      </a>
                      <a href='https://www.youtube.com/@kominfobandarlampung' target="_blank" rel="noopener noreferrer">
                        <i className='fa-brands fa-youtube fa-lg'></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className='col-12 col-sm-6 mx-auto pt-3'>
                  <h6 className='text-uppercase fw-bold mb-4'>
                    KONTAK KAMI
                  </h6>
                  <div className="footer-contact-container">
                    <div className="footer-contact-box">
                      <div className="footer-contact-icon">
                        <i className='fa-solid fa-map-marker-alt fa-lg'></i>
                      </div>
                      <div>
                        <p className='footer-contact-header'>Alamat</p>
                        <p className="footer-contact-content">Jl. Dr.Susilo No.2 Bandar Lampung, Kota Bandar Lampung</p>
                      </div>
                    </div>
                    <div className="footer-contact-box">
                      <div className="footer-contact-icon">
                        <i className='fa-solid fa-envelope fa-lg'></i>
                      </div>
                      <div>
                        <p className='footer-contact-header'>Email</p>
                        <p className="footer-contact-content">
                          <a href="mailto:diskominfo@bandarlampungkota.go.id" className="email-link">diskominfo@bandarlampungkota.go.id</a>
                        </p>
                      </div>
                    </div>
                    <div className="footer-contact-box">
                      <div className="footer-contact-icon">
                        <i className='fa-solid fa-phone fa-lg'></i>
                      </div>
                      <div>
                        <p className='footer-contact-header'>Telepon</p>
                        <p className="footer-contact-content">(0721) - 481301</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <hr />
        <div className='text-center mt-4 container-fluid p-3 fw-light'>
          <p> &copy; Copyright 2024</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer