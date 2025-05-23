import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Divider, Skeleton } from 'antd';
import './DetailIzin.css';
import moment from 'moment';
import { useIzinDetail } from '../../../../hooks/kepegawaian/izin/useIzinDetail';
const format = 'YYYY-MM-DD';

function DetailIzin() {
  const { izin_id: id } = useParams();

  // get article detail
  const { data: dataDetail, isLoading: skeleton } = useIzinDetail(id, true);

  const data = dataDetail?.data;

  return (
    <>
      {skeleton && <Skeleton active />}
      {!skeleton && data && (
        <Fragment key={data.id}>
          <Divider orientation="left" className="responsive-divider">
            Detail Pengajuan Izin
          </Divider>
          <div className="article-details-container">
            <table className="detail-article__table">
              <tbody>
                <tr>
                  <th>Nama</th>
                  <td>: {data?.Pegawai?.nama}</td>
                </tr>
                <tr>
                  <th>NIP</th>
                  <td>: {data?.Pegawai?.nip}</td>
                </tr>
                <tr>
                  <th>Jenis Kelamin</th>
                  <td>: {data?.Pegawai?.jenis_kelamin}</td>
                </tr>
                <tr>
                  <th>Jabatan</th>
                  <td>: {data?.Pegawai?.jabatan}</td>
                </tr>
                <tr>
                  <th>Tanggal Pengajuan</th>
                  <td>: {moment(data?.updatedAt).format(format)}</td>
                </tr>
                <tr>
                  <th>Tanggal Mulai</th>
                  <td>: {moment(data?.tgl_mulai).format(format)}</td>
                </tr>
                <tr>
                  <th>Tanggal Selesai</th>
                  <td>: {moment(data?.tgl_selesai).format(format)}</td>
                </tr>
                <tr>
                  <th>Jenis Izin</th>
                  <td>: {data?.jenis}</td>
                </tr>
                <tr>
                  <th>Alasan</th>
                  <td>: {data?.alasan}</td>
                </tr>
                <tr>
                  <th>Status Pengajuan</th>
                  <td>: {data?.status}</td>
                </tr>
                <tr>
                  <th>Lampiran</th>
                  <td>
                    :{' '}
                    <a href={data?.lampiran} target="onblank">
                      Lampiran
                    </a>{' '}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </>
  );
}

export default DetailIzin;
