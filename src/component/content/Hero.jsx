import { Container, Row, Col } from 'react-bootstrap';
import './Hero.css';

const Hero = () => {
  return (
    <div className='homepage'>
      <header className='homepage-header d-flex align-items-center'>
        <Container>
          <Row className='header-box'>
            <Col
              lg='12'
              data-aos='fade-right'
              data-aos-duration='2000'
            >
              <h1 className='hero-text'>
                sistem pemerintahan berbasis elektronik
                kota bandar lampung
              </h1>
            </Col>
          </Row>
          {/* input search box */}
          <div className='hero-search-box'>
            <Col
              lg='12'
              data-aos='fade-right'
              data-aos-duration='2000'
            >
              <div>
                <input
                  type='text'
                  placeholder="Cari Seputar SPBE"
                />
                <span className='input-icon-search'>
                  <i className='fas fa-search'></i>
                </span>
              </div>
            </Col>
          </div>
        </Container>
      </header>
    </div>
  );
};

export default Hero;
