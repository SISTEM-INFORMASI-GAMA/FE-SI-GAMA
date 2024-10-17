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
          <div className="article-image-container">
            <img src={data.image} alt={data.title} />
          </div>
          <table className="detail-article__table">
            <tbody>
              <tr>
                <th>Judul</th>
                <td>: {data?.title}</td>
              </tr>
              <tr>
                <th>Kategori</th>
                <td>: {data?.category}</td>
              </tr>
              <tr>
                <th>Deskripsi</th>
                <td>: {data?.description}</td>
              </tr>
              <tr>
                <th>Isi</th>
                <td>: {data?.content}</td>
              </tr>
            </tbody>
          </table>
        </Fragment>
      )}
    </>
  );
}

export default DetailPegawai;
