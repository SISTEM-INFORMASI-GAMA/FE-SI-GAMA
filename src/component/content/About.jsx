import './About.css';

function About() {
  return (
    <div>
      <section
        id='about'
        className='about section-padding '
        data-aos='zoom-in'
        data-aos-duration='1000'
      >
        <div className='container'>
          <div className='row about-container'>
            <div className='about-text mt-5'>
              <h2 className="about-header">Apa Itu SPBE ?</h2>
              <hr className="about-line-header" />
              <p className="about-text">
                Sistem Pemerintahan Berbasis Elektronik yang disingkat SPBE adalah penyelenggaraan pemerintahan yang memanfaatkan teknologi informasi dan komunikasi untuk memberikan layanan kepada pengguna SPBE secara terintegrasi.
              </p>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}

export default About;
