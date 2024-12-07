import { Fragment, useState } from 'react';
import { Button, Divider, Image, Skeleton } from 'antd';
import './DetailPegawai.css';
import { usePegawaiDetail } from '../../../../hooks/kepegawaian/pegawai/usePegawaiDetail';
import moment from 'moment';
import { useDokumenPagination } from '../../../../hooks/kepegawaian/dokumen/useDokumenPagination';
import { FilePdfOutlined } from '@ant-design/icons';
import AddDocument from './addDocument/AddDocument';
const format = 'YYYY-MM-DD';
import Cookies from 'js-cookie';

function ProfilePegawai() {
  const user = Cookies.get('user') && JSON.parse(Cookies.get('user'));
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [dataTable] = useState({
    current_page: 1,
    per_page: 1000,
    total: 0,
  });
  const {
    data: dataDokument,
    isLoading,
    isFetching,
    refetch,
  } = useDokumenPagination(dataTable, user?.pegawaiId);

  const onCancel = () => {
    setShowAddDocument(false);
  };

  const onCreate = () => {
    setShowAddDocument(false);
    refetch();
  };

  // get pegawai detail
  const { data: dataDetail, isLoading: skeleton } = usePegawaiDetail(
    user?.pegawaiId,
    true
  );
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
                  <td>: {moment(data?.tgl_lahir).format(format)}</td>
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
              <Image
                width={200}
                height={300}
                src={data?.foto}
                alt={data?.nama}
              />
            </div>
          </div>
          <Divider
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              backgroundColor: '#ccc',
              color: '#ccc',
            }}
          />
          <div className="table-header">
            <h1>Dokumen pegawai</h1>
          </div>
          {/* 
           <Popconfirm
              title="Yakin ingin menghapus ?"
              okText="Hapus"
              cancelText="Batal"
              onConfirm={() => {
                const dataId = id;
                DeleteApi({
                  url: "/api/v1/users/",
                  dataId,
                  refetch,
                });
              }}
            >
              <Tag color="magenta" style={{ cursor: "pointer" }}>
                Hapus
              </Tag>
            </Popconfirm>
          
          */}
          <div className="dokumen-container">
            {isLoading || isFetching ? (
              <Skeleton active />
            ) : (
              dataDokument?.data?.map((item) => (
                <div key={item.id} className="dokumen-item">
                  <FilePdfOutlined style={{ fontSize: '80px', color: 'red' }} />
                  <p>{item.nama_file}</p>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => window.open(item.file, '_blank')}
                  >
                    Download
                  </Button>
                </div>
              ))
            )}
          </div>
          <AddDocument
            show={showAddDocument}
            onCancel={onCancel}
            onCreate={onCreate}
            id={user?.pegawaiId}
          />
        </Fragment>
      )}
    </>
  );
}

export default ProfilePegawai;
