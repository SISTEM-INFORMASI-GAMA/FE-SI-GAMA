import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { Divider, Skeleton } from "antd";
import "./DetailPegawai.css";
import { usePegawaiDetail } from "../../../../hooks/kepegawaian/pegawai/usePegawaiDetail";

function DetailPegawai() {
  const { pegawai_id: id } = useParams();

  // get article detail
  const { data: dataDetail, isLoading: skeleton } = usePegawaiDetail(id, true);

  const data = dataDetail?.data;

  return (
    <>
      {skeleton && <Skeleton active />}
      {!skeleton && data && (
        <Fragment key={data.id}>
          <Divider orientation="left">Detail {data?.nama}</Divider>
          <div className="article-details-container">
            <table className="detail-article__table">
              <tbody>
                <tr>
                  <th>Nama</th>
                  <td>: {data?.nama}</td>
                </tr>
                <tr>
                  <th>NIP</th>
                  <td>: {data?.nip}</td>
                </tr>
                <tr>
                  <th>Jenis Kelamin</th>
                  <td>: {data?.jenis_kelamin}</td>
                </tr>
                <tr>
                  <th>Jabatan</th>
                  <td>: {data?.jabatan}</td>
                </tr>
                <tr>
                  <th>Tanggal Lahir</th>
                  <td>: {data?.tgl_lahir}</td>
                </tr>
                <tr>
                  <th>Nomor Telepon</th>
                  <td>: {data?.nomor_telepon}</td>
                </tr>
                <tr>
                  <th>Alamat</th>
                  <td>: {data?.alamat}</td>
                </tr>
              </tbody>
            </table>
            <div className="article-image-container">
              <img src={data.image} alt={data.title} />
            </div>
          </div>
        </Fragment>
      )}
    </>
  );
}

export default DetailPegawai;
