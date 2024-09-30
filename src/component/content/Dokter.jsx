import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DokterCard from '../dokter/DokterCard';

function Dokter() {
  const URL = import.meta.env.VITE_BASE_URL;

  const [dokters, setDokters] = useState([]);

  async function fetchDokters() {
    try {
      const response = await axios.get(`${URL}/api/v1/dokter?page=1&limit=4`);
      setDokters(response.data.data);
    } catch (error) {
      console.error('Error fetching dokters:', error.message);
    } finally {
      console.log('Request complete, whether successful or not.');
    }
  }

  console.log(dokters);
  useEffect(() => {
    fetchDokters();
  }, []); // Empty dependency array ensures useEffect runs once after initial render

  return (
    <div>
      <section id='dokter' className='dokter section-padding'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='section-header text-center pb-5'>
                <h2>Temui Dokter Kami</h2>
                <p>Dokter kesehatan dengan dokter profesional</p>
              </div>
            </div>
          </div>
          <div className='row list-dokter'>
            {dokters.map((dokter) => (
              <DokterCard dokter={dokter} key={dokter.id} />
            ))}
          </div>
          <div className='text-center mt-5'>
            <Link to='/dokter'>
              <button className='btn btn-outline-primary text-center'>
                Lihat Lebih Banyak
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dokter;
