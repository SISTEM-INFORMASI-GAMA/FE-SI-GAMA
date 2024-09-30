import './Feature.css'

const Feature = () => {
   return (
      <div>
         <section
            id='feature'
            className='feacture-section'
         >
            <div className='container'>
               <div className="feature-section-box">
                  <div className="feature-container">
                     <div className='feature-box'>
                        {/* icon boormark */}
                        <div className='feature-icon'>
                           <i className='fas fa-bookmark'></i>
                        </div>
                        <div className='feature-text'>
                           <h2 className='feature-header'>Regulasi</h2>
                           <p className='feature-description'>
                           Regulasi mengatur tata kelola dan manajemen SPBE secara nasional untuk meningkatkan keterpaduan dan efisiensi sistem pemerintahan berbasis elektronik.                           </p>
                        </div>
                        <hr className="feature-line" />
                     </div>
                     <div className='feature-box'>
                        {/* icon boormark */}
                        <div className='feature-icon'>
                           <i className='fas fa-chart-simple'></i>
                        </div>
                        <div className='feature-text'>
                           <h2 className='feature-header'>INDIKATOR SPBE</h2>
                           <p className='feature-description'>
                           Indikator SPBE adalah parameter untuk menilai keberhasilan implementasi SPBE, mengukur efektivitas, efisiensi, dan kualitasnya.                           </p>
                        </div>
                        <hr className="feature-line" />
                     </div>
                     <div className='feature-box'>
                        {/* icon boormark */}
                        <div className='feature-icon'>
                           <i className='fas fa-list-check'></i>
                        </div>
                        <div className='feature-text'>
                           <h2 className='feature-header'>HASIL SPBE</h2>
                           <p className='feature-description'>
                           Implementasi SPBE diharapkan dapat meningkatkan layanan publik, transparansi, akuntabilitas, dan mengurangi penyalahgunaan wewenang.                           </p>
                        </div>
                        <hr className="feature-line" />
                     </div>
                  </div>
               </div>
            </div>
         </section >
      </div >
   )
}

export default Feature