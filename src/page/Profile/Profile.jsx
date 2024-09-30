import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="container">
        <h1>Profile</h1>
        <hr />
        <div className="profile-box-container">
          <div className="profile-box">
            <h2>Apa itu SPBE</h2>
            <p>
              SPBE merupakan singkatan dari Sistem Pemerintahan Berbasis Elektronik, Sistem Pemerintahan Berbasis Elektronik (SPBE) adalah penyelenggaraan pemerintahan yang memanfaatkan teknologi informasi dan komunikasi untuk memberikan layanan kepada Pengguna SPBE.
            </p>
          </div>
          <div className="profile-box">
            <h2>Visi Dan Misi SPBE</h2>
            <h4>Visi</h4>
            <p>
              Sesuai dengan Peraturan Presiden No. 95 Tahun 2018 Tentang SPBE, terwujudnya sistem pemerintahan berbasis elektronik yang terpadu dan menyeluruh untuk mencapai birokrasi dan pelayanan publik yang berkinerja tinggi menjadi acuan dalam mewujudkan pelaksanaan SPBE yang terpadu di Instansi Pusat dan Pemerintah Daerah untuk menghasilkan birokrasi pemerintah yang integratif, dinamis, transparan, dan inovatif, serta peningkatan kualitas pelayanan publik yang terpadu, efektif, responsif, dan adaptif.
            </p>
            <br />
            <h4>Misi</h4>
            <p>
              Untuk mencapai visi SPBE, misi SPBE adalah:
            </p>
            <ol>
              <li>Melakukan penataan dan penguatan organisasi dan tata kelola sistem pemerintahan berbasis elektronik yang terpadu;</li>
              <li>Mengembangkan pelayanan publik berbasis elektronik yang terpadu, menyeluruh, dan menjangkau masyarakat luas;</li>
              <li>Membangun fondasi teknologi informasi dan komunikasi yang terintegrasi, aman, dan andal; dan</li>
              <li>Membangun SDM yang kompeten dan inovatif berbasis teknologi informasi dan komunikasi.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;