import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { Divider, Skeleton } from "antd";
import "./DetailSiswa.css";
import { useSiswaDetail } from "../../../../hooks/siswa/useSiswaDetail";

function DetailSiswa() {
  const { id } = useParams();

  // get article detail
  const { data: dataDetail, isLoading: skeleton } = useSiswaDetail(id, true);
  const data = dataDetail?.data;

  return (
    <>
      {skeleton && <Skeleton active />}
      {!skeleton && data && (
        <Fragment key={data.id}>
          <Divider orientation="left">Data Siswa</Divider>
          <table className="detail-article__table">
            <tbody>
              <tr>
                <td>Nama</td>
                <td>{data.name}</td>
              </tr>
              <tr>
                <td>NIS</td>
                <td>{data.nis}</td>
              </tr>
              <tr>
                <td>NIK</td>
                <td>{data.nik}</td>
              </tr>
              <tr>
                <td>NISN</td>
                <td>{data.nisn}</td>
              </tr>
              <tr>
                <td>Jenis Kelamin</td>
                <td>{data.gender}</td>
              </tr>
              <tr>
                <td>Agama</td>
                <td>{data.religion}</td>
              </tr>
              <tr>
                <td>Tempat Lahir</td>
                <td>{data.city_of_birth}</td>
              </tr>
              <tr>
                <td>Tanggal Lahir</td>
                <td>{data.tgl_lahir ? data.tgl_lahir : '-'}</td>
              </tr>
            </tbody>
          </table>
        </Fragment>
      )}
    </>
  );
}

export default DetailSiswa;
